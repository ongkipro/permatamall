/**
 * Server-side Meta Purchase for an order that became paid after the buyer had
 * left (A-166).
 *
 * The browser Purchase fires from `/thanks`, and a buyer whose VA is confirmed
 * by an operator hours later never revisits it. This enqueues the same event
 * from the order row alone — `event_id` is the order number on both legs, and
 * the outbox's unique index on it means a Purchase already sent by `/thanks`
 * (or already queued) is a no-op here. It is deliberately best-effort: a
 * failure to enqueue must never undo a payment confirmation.
 */
import { catalogProductId } from "./catalog-feed.ts";
import { deliverCapiEvent, drainCapiOutbox, enqueueCapiEvent } from "./capi-outbox.ts";
import { getStoreAdsConfig } from "./store-ads.ts";
import { toE164Digits } from "./meta-capi.ts";
import { parseMetaOrderContext } from "./meta-order-context.ts";
import { parseClickIds } from "./click-ids.ts";
import { matchableCustomerEmail } from "./autolaris-payment.ts";
import { isVoidOrder } from "./order-lifecycle.ts";

type PaidOrderRow = {
  order_number: string;
  payment_method: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  province: string;
  city: string;
  postal_code: string | null;
  payment_status: string;
  shipping_status: string;
  stock_restored_at: string | null;
  ad_click_ids: string | null;
  meta_request_context: string | null;
  product_value: number;
};

type OrderProductRow = { product_id: number; title: string };

export type PaidOrderPurchaseResult =
  | { status: "queued"; delivered: boolean }
  | { status: "deduplicated" }
  | { status: "skipped"; reason: string };

const PAID_STATUSES = new Set(["paid", "settled", "success"]);

/**
 * Whether an operator's payment edit is the moment a manual transfer becomes a
 * Purchase. The buyer paid into the seller's own account, often after a
 * WhatsApp chat, so `/thanks` never saw it paid and only the operator can.
 * COD stays out on purpose: its Purchase is the persisted order, sent from
 * `/thanks`, and courier remittance must not report it a second time.
 */
export function manualTransferBecamePaid(
  paymentMethod: string,
  previousStatus: string,
  nextStatus: string,
): boolean {
  return (
    paymentMethod === "manual_transfer" &&
    PAID_STATUSES.has(nextStatus) &&
    !PAID_STATUSES.has(previousStatus)
  );
}

export async function enqueuePurchaseForPaidOrder(
  database: D1Database,
  locals: App.Locals,
  orderId: number,
  options: {
    /**
     * Unix seconds the conversion happened. Omitted, the event is stamped now,
     * which is right for a confirmation; the COD sweep passes the order's own
     * creation time, because that is when the buyer purchased.
     */
    eventTime?: number;
  } = {},
): Promise<PaidOrderPurchaseResult> {
  const ads = await getStoreAdsConfig(locals);
  if (!ads.metaPixelId || !ads.metaCapiToken) {
    return { status: "skipped", reason: "meta-not-configured" };
  }
  const order = await database
    .prepare(
      `SELECT o.order_number, o.payment_method, o.customer_name, o.customer_phone, o.customer_email,
              o.province, o.city, o.postal_code, o.payment_status,
              o.shipping_status, o.stock_restored_at,
              o.ad_click_ids, o.meta_request_context,
              (SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0)
                 FROM order_items oi WHERE oi.order_id = o.id) AS product_value
         FROM orders o
        WHERE o.id = ?
        LIMIT 1`,
    )
    .bind(orderId)
    .first<PaidOrderRow>();
  if (!order) return { status: "skipped", reason: "order-not-found" };
  if (order.shipping_status === "abandoned") return { status: "skipped", reason: "order-not-placed" };
  // COD is purchased at submit (TRACKING_SPECS §13); every other method only
  // once paid.
  if (order.payment_method !== "cod" && !PAID_STATUSES.has(String(order.payment_status).toLowerCase())) {
    return { status: "skipped", reason: "order-not-paid" };
  }
  // Read after the caller's own mutation, so a cancel or return in the same
  // edit counts. A paid-then-voided order is money to refund, not a conversion.
  if (isVoidOrder(order)) return { status: "skipped", reason: "order-void" };
  const products = await database
    .prepare(
      `SELECT DISTINCT p.id AS product_id, p.title
         FROM order_items oi
         INNER JOIN product_variants pv ON pv.id = oi.variant_id
         INNER JOIN products p ON p.id = pv.product_id
        WHERE oi.order_id = ?`,
    )
    .bind(orderId)
    .all<OrderProductRow>();
  const rows = products.results ?? [];
  const contentIds: string[] = [];
  for (const row of rows) {
    try {
      contentIds.push(catalogProductId(row.product_id));
    } catch {
      // A product whose id cannot form a catalogue id simply carries no content_id.
    }
  }

  const siteUrl = locals.tenant?.siteUrl || "https://example.com";
  // This Purchase is sent from a cron or an admin confirmation, long after the
  // buyer's browser is gone. Without the identity captured at checkout the
  // event reaches Meta with a phone and a name and nothing else, and event
  // match quality is what decides whether the conversion is attributed at all.
  const requestContext = parseMetaOrderContext(order.meta_request_context);
  const legacyClickIds = parseClickIds(order.ad_click_ids);
  const queued = await enqueueCapiEvent(database, {
    eventName: "Purchase",
    eventId: order.order_number,
    eventSourceUrl: new URL("/thanks", siteUrl).toString(),
    eventTime: options.eventTime,
    userData: {
      phone: order.customer_phone,
      name: order.customer_name,
      // See `/api/meta-event`: a minted provider address is not a match key.
      email: matchableCustomerEmail(order.customer_email, siteUrl),
      city: order.city,
      province: order.province,
      postalCode: order.postal_code || undefined,
      // Meta treats a missing country as a missing match key, not as a default.
      country: "id",
      externalId: requestContext.externalId || toE164Digits(order.customer_phone),
      // The order's own copy wins; `ad_click_ids` is the pre-0052 fallback for
      // orders placed before the context column existed.
      fbp: requestContext.fbp || legacyClickIds._fbp,
      fbc: requestContext.fbc || legacyClickIds._fbc,
      clientIp: requestContext.clientIp,
      userAgent: requestContext.userAgent,
    },
    customData: {
      contentName: rows[0]?.title,
      contentIds: contentIds.length ? contentIds : undefined,
      value: Number(order.product_value ?? 0),
      currency: "IDR",
      orderNumber: order.order_number,
    },
  });
  if (!queued) return { status: "deduplicated" };

  const delivered = await deliverCapiEvent(
    database,
    "Purchase",
    order.order_number,
    ads.metaPixelId,
    ads.metaCapiToken,
  );
  const drain = drainCapiOutbox(database, ads.metaPixelId, ads.metaCapiToken).catch((error) =>
    console.error("capi-outbox-drain", error),
  );
  if (locals.cfContext) locals.cfContext.waitUntil(drain);
  else void drain;
  return { status: "queued", delivered };
}

/**
 * The COD Purchase, sent by the server the moment checkout persists the order
 * (TRACKING_SPECS §13: COD is purchased at submit).
 *
 * It used to leave only from `/thanks`, after an order-status round trip and
 * the hashing — so a buyer whose in-app browser closed, or whom the store's
 * WhatsApp auto-redirect took away first, never became a conversion. Sent
 * here, after the response, it owes nothing to the buyer's browser. `/thanks`
 * still fires its browser Pixel on the same `event_id` (Meta deduplicates)
 * and its server leg becomes an outbox no-op. Never throws: the order is
 * already saved and must not fail on account of an ad signal.
 */
export function scheduleCodPurchase(
  database: D1Database,
  locals: App.Locals,
  orderId: number,
  paymentMethod: string,
): void {
  if (paymentMethod !== "cod") return;
  const task = enqueuePurchaseForPaidOrder(database, locals, orderId).catch((error) =>
    console.error("cod-purchase-at-submit-failed", { orderId, error }),
  );
  if (locals.cfContext) locals.cfContext.waitUntil(task);
  else void task;
}

/**
 * A COD order younger than this is left to the submit-time send and `/thanks`: the buyer's own page
 * normally enqueues its Purchase within seconds (agritani.shop, 2026-11-10:
 * mean 111 s, max 18 min). Older, it is presumed missed.
 */
export const COD_PURCHASE_SWEEP_MIN_AGE_MS = 30 * 60_000;
/**
 * Meta deduplicates a browser and a server event sharing `event_id` only
 * inside 48 hours, and rejects `event_time` older than seven days. Staying
 * inside 48 h keeps a late browser leg deduplicated.
 */
export const COD_PURCHASE_SWEEP_MAX_AGE_MS = 48 * 60 * 60_000;
export const COD_PURCHASE_SWEEP_LIMIT = 50;

/**
 * The server-side safety net for COD Purchase (audit 2026-11-10, F-1).
 *
 * A COD Purchase is sent from `/thanks`, so a buyer whose tab closes or whose
 * in-app browser dies between submit and that page leaves a real order Meta
 * never hears of: five of 732 on agritani.shop in 30 days, four from the
 * Facebook in-app browser. The hourly cron enqueues those from the order row,
 * keyed on the order number like both legs, so a `/thanks` that does run later
 * is a no-op in the outbox and a browser Pixel event is deduplicated by Meta.
 */
export async function sweepMissedCodPurchases(
  database: D1Database,
  locals: App.Locals,
  now = new Date(),
): Promise<number> {
  const ads = await getStoreAdsConfig(locals);
  if (!ads.metaPixelId || !ads.metaCapiToken) return 0;
  const missed = await database
    .prepare(
      `SELECT o.id, o.created_at
         FROM orders o
        WHERE o.created_at >= ? AND o.created_at <= ?
          AND o.payment_method = 'cod'
          AND o.shipping_status NOT IN ('abandoned', 'cancelled', 'returned', 'failed')
          AND o.payment_status NOT IN ('failed', 'refunded', 'cancelled')
          AND o.stock_restored_at IS NULL
          AND NOT EXISTS (
            SELECT 1 FROM capi_event_outbox c
             WHERE c.event_name = 'Purchase' AND c.event_id = o.order_number
          )
        ORDER BY o.id
        LIMIT ?`,
    )
    .bind(
      new Date(now.getTime() - COD_PURCHASE_SWEEP_MAX_AGE_MS).toISOString(),
      new Date(now.getTime() - COD_PURCHASE_SWEEP_MIN_AGE_MS).toISOString(),
      COD_PURCHASE_SWEEP_LIMIT,
    )
    .all<{ id: number; created_at: string }>();
  let queued = 0;
  for (const row of missed.results ?? []) {
    const placedAt = Date.parse(row.created_at);
    try {
      const result = await enqueuePurchaseForPaidOrder(database, locals, row.id, {
        eventTime: Number.isFinite(placedAt) ? Math.floor(placedAt / 1000) : undefined,
      });
      if (result.status === "queued") queued += 1;
    } catch (error) {
      console.error("cod-purchase-sweep-failed", { orderId: row.id, error });
    }
  }
  return queued;
}
