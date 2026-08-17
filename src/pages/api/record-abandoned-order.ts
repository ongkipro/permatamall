import type { APIRoute } from 'astro';
import { getRuntimeEnv } from '../../lib/env';
import { jsonError, jsonOk } from '../../lib/api';
import {
  OrderInputError,
  recordAbandonedOrder,
} from '../../lib/order-persistence';
import { normalizePhone } from '../../lib/validation';

export const POST: APIRoute = async ({ request, locals }) => {
  const database = getRuntimeEnv(locals)?.OMS_DB;
  if (!database || typeof database !== 'object') {
    return jsonError('Database order belum tersedia.', 503);
  }

  const body = (await request.json().catch(() => null)) as {
    submit_token?: string;
    customer_name?: string;
    customer_phone?: string;
    product_id?: number | string;
    variant_id?: number | string;
    address?: string;
    province?: string;
    source_form?: string;
    source_path?: string;
  } | null;

  if (!body) {
    return jsonError('Payload tidak valid.', 400);
  }

  try {
    const recorded = await recordAbandonedOrder(database as D1Database, {
      submitToken: String(body.submit_token || ''),
      customerName: String(body.customer_name || ''),
      customerPhone: normalizePhone(String(body.customer_phone || '')),
      productId: Number(body.product_id),
      variantId: Number(body.variant_id),
      address: String(body.address || ''),
      province: String(body.province || ''),
      sourceForm: String(body.source_form || ''),
      sourcePath: String(body.source_path || ''),
    });
    return jsonOk({
      success: true,
      action: recorded.action,
      order_number: recorded.orderNumber,
    });
  } catch (error) {
    console.error('record-abandoned-order error:', error);
    if (error instanceof OrderInputError) {
      return jsonError(error.message, 422);
    }
    if (
      error instanceof Error &&
      error.message === 'Store belum dikonfigurasi.'
    ) {
      return jsonError(error.message, 503);
    }
    return jsonError('Gagal mencatat order terbengkalai.', 500);
  }
};
