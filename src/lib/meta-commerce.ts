export type MetaPurchaseOrder = {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  province: string;
  city: string;
  postal_code: string | null;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  variant_ids: string | null;
};

type PurchaseReference = {
  orderLocator: string;
  statusToken?: string;
};

function trimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getMetaPurchaseReference(
  rawPayload: unknown,
  eventSourceUrl: string,
): PurchaseReference | null {
  if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) {
    return null;
  }
  const payload = rawPayload as Record<string, unknown>;
  const customData =
    payload.custom_data &&
    typeof payload.custom_data === "object" &&
    !Array.isArray(payload.custom_data)
      ? (payload.custom_data as Record<string, unknown>)
      : {};
  const sourceUrl = new URL(eventSourceUrl);
  const orderLocator =
    trimmedString(payload.order_number) ||
    trimmedString(customData.order_number) ||
    trimmedString(payload.order_id) ||
    trimmedString(payload.order_pk) ||
    trimmedString(customData.order_id) ||
    sourceUrl.searchParams.get("order_number")?.trim() ||
    sourceUrl.searchParams.get("order_id")?.trim() ||
    sourceUrl.searchParams.get("order_pk")?.trim() ||
    "";
  const statusToken =
    trimmedString(payload.status_token) ||
    trimmedString(customData.status_token) ||
    sourceUrl.searchParams.get("status_token")?.trim() ||
    "";
  return orderLocator
    ? { orderLocator, statusToken: statusToken || undefined }
    : null;
}

export async function findMetaPurchaseOrder(
  database: D1Database,
  reference: PurchaseReference & { statusToken: string },
): Promise<MetaPurchaseOrder | null> {
  return database
    .prepare(
      `SELECT
         o.order_number, o.customer_name, o.customer_phone, o.customer_email,
         o.province, o.city, o.postal_code, o.total_amount,
         o.payment_method, o.payment_status,
         (
           SELECT GROUP_CONCAT(DISTINCT oi.variant_id)
           FROM order_items oi
           WHERE oi.order_id = o.id
             AND oi.variant_id IS NOT NULL
         ) AS variant_ids
       FROM orders o
       WHERE (CAST(o.id AS TEXT) = ? OR o.order_number = ?)
         AND o.public_status_token = ?
       LIMIT 1`,
    )
    .bind(reference.orderLocator, reference.orderLocator, reference.statusToken)
    .first<MetaPurchaseOrder>();
}

export function isMetaPurchaseEligible(order: MetaPurchaseOrder) {
  return (
    order.payment_method.toLowerCase() === "cod" ||
    ["paid", "settled", "success"].includes(order.payment_status.toLowerCase())
  );
}

export function parseMetaPurchaseVariantIds(value: string | null) {
  return String(value || "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => /^[1-9]\d*$/.test(id))
    .slice(0, 20);
}

export async function validateMetaCatalogContentIds(
  database: D1Database,
  contentIds: string[] | undefined,
) {
  if (!contentIds?.length) return contentIds;
  if (contentIds.some((id) => !/^[1-9]\d*$/.test(id))) return null;
  const uniqueIds = [...new Set(contentIds)];
  const placeholders = uniqueIds.map(() => "?").join(", ");
  const rows = await database
    .prepare(
      `SELECT CAST(pv.id AS TEXT) AS id
       FROM product_variants pv
       INNER JOIN products p ON p.id = pv.product_id
       WHERE p.is_active = 1
         AND CAST(pv.id AS TEXT) IN (${placeholders})`,
    )
    .bind(...uniqueIds)
    .all<{ id: string }>();
  const activeIds = new Set((rows.results || []).map((row) => String(row.id)));
  return uniqueIds.every((id) => activeIds.has(id)) ? uniqueIds : null;
}
