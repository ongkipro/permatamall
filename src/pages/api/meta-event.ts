import type { APIRoute } from 'astro';
import { drainCapiOutbox, deliverCapiEvent, enqueueCapiEvent } from '../../lib/capi-outbox';
import { getStoreAdsConfig } from '../../lib/store-ads';
import { validateMetaEventPayload } from '../../lib/meta-event-contract';
import { getRuntimeEnv } from '../../lib/env';
import { toE164Digits } from '../../lib/meta-capi';
import { checkRateLimit, getClientIp } from '../../lib/rate-limit';
import {
  findMetaPurchaseOrder,
  getMetaPurchaseReference,
  isMetaPurchaseEligible,
  parseMetaPurchaseVariantIds,
  validateMetaCatalogContentIds,
  type MetaPurchaseOrder,
} from '../../lib/meta-commerce';

export const prerender = false;

const json = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });


export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const rawPayload = await request.json().catch(() => null);
    const validated = validateMetaEventPayload(rawPayload, request.url);
    if (validated.ok === false) return json({ success: false, error: validated.error }, 400);
    const payload = validated.value;
    const runtime = getRuntimeEnv(locals);
    const rateLimit = await checkRateLimit(
      runtime?.SESSION as KVNamespace | undefined,
      `meta-event:${getClientIp(request.headers)}`,
      30,
      60_000,
    );
    if (!rateLimit.allowed) {
      return json(
        { success: false, error: 'Terlalu banyak event tracking.', code: 'RATE_LIMITED' },
        429,
      );
    }

    const adsConfig = await getStoreAdsConfig(locals);
    if (!adsConfig.metaPixelId || !adsConfig.metaCapiToken) {
      return json(
        { success: true, skipped: true, reason: 'Meta CAPI is not configured for this store.' },
        202,
      );
    }
    const database = runtime?.OMS_DB as D1Database | undefined;
    if (!database?.prepare) {
      return json({ success: false, error: 'Event store belum tersedia.' }, 503);
    }

    let purchaseOrder: MetaPurchaseOrder | null = null;
    let purchaseOrderNumber: string | undefined;
    if (payload.eventName === 'Purchase') {
      const reference = getMetaPurchaseReference(rawPayload, payload.eventSourceUrl);
      if (!reference || !reference.statusToken) {
        return json(
          { success: false, error: 'Purchase membutuhkan order_number dan status_token.' },
          400,
        );
      }
      purchaseOrder = await findMetaPurchaseOrder(database, {
        orderLocator: reference.orderLocator,
        statusToken: reference.statusToken,
      });
      if (!purchaseOrder) {
        return json({ success: false, error: 'Order Purchase tidak ditemukan atau token tidak valid.' }, 404);
      }
      if (!isMetaPurchaseEligible(purchaseOrder)) {
        return json(
          { success: false, error: 'Purchase menunggu pembayaran terverifikasi.' },
          409,
        );
      }
      purchaseOrderNumber = purchaseOrder.order_number;
    }
    const catalogContentIds = purchaseOrder
      ? parseMetaPurchaseVariantIds(purchaseOrder.variant_ids)
      : await validateMetaCatalogContentIds(database, payload.contentIds);
    if (payload.contentType === 'product' && !catalogContentIds?.length) {
      return json(
        { success: false, error: 'Event commerce tidak memiliki variant ID katalog yang aktif.' },
        409,
      );
    }

    const eventId = purchaseOrderNumber || payload.eventId;
    const purchaseExternalId = purchaseOrder
      ? toE164Digits(purchaseOrder.customer_phone)
      : undefined;
    const event = {
      eventName: payload.eventName,
      eventId,
      eventSourceUrl: payload.eventSourceUrl,
      userData: {
        phone: purchaseOrder?.customer_phone || payload.phone,
        name: purchaseOrder?.customer_name || payload.name,
        email: purchaseOrder?.customer_email || payload.email,
        city: purchaseOrder?.city || payload.city,
        province: purchaseOrder?.province || payload.province,
        postalCode: purchaseOrder?.postal_code || payload.postalCode,
        externalId: purchaseExternalId || payload.externalId,
        fbp: payload.fbp,
        fbc: payload.fbc,
        clientIp: getClientIp(request.headers),
        userAgent: request.headers.get('user-agent') || undefined,
      },
      customData: {
        contentName: payload.contentName,
        contentIds: catalogContentIds || undefined,
        contentType: payload.contentType,
        value: purchaseOrder?.total_amount ?? payload.value,
        currency: payload.currency,
        orderNumber: purchaseOrderNumber,
      },
    };

    // Record before transmitting: a failed send becomes a retry, never a lost
    // conversion. A repeated event_id is already accounted for.
    const queued = await enqueueCapiEvent(database, event);
    if (!queued) return json({ success: true, deduplicated: true }, 200);

    const delivered = await deliverCapiEvent(
      database,
      eventId,
      payload.eventName,
      adsConfig.metaPixelId,
      adsConfig.metaCapiToken,
    );

    // Retry earlier failures on the back of live traffic, after the response.
    const drain = drainCapiOutbox(
      database,
      adsConfig.metaPixelId,
      adsConfig.metaCapiToken,
      1,
    ).catch((error) => console.error('capi-outbox-drain', error));
    if (locals.cfContext) locals.cfContext.waitUntil(drain);
    else void drain;

    // Queued-but-undelivered is still success for the caller: the event is
    // durably held and will be retried.
    return json({ success: true, delivered, queued: !delivered }, 200);
  } catch (error) {
    console.error('meta-event', error);
    return json({ success: false, error: 'Meta event trigger error' }, 500);
  }
};
