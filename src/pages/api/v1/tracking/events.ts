import type { APIRoute } from 'astro';
import { handleOptions, headlessError, headlessOk, validateHeadlessRequest } from '../../../../lib/headless-api';
import { validateMetaEventPayload } from '../../../../lib/meta-event-contract';
import { getStoreAdsConfig } from '../../../../lib/store-ads';
import { getRuntimeEnv } from '../../../../lib/env';
import { checkRateLimit, getClientIp } from '../../../../lib/rate-limit';
import { enqueueCapiEvent, deliverCapiEvent, drainCapiOutbox } from '../../../../lib/capi-outbox';
import { toE164Digits } from '../../../../lib/meta-capi';
import {
  findMetaPurchaseOrder,
  isMetaPurchaseEligible,
  getMetaPurchaseReference,
  parseMetaPurchaseVariantIds,
  validateMetaCatalogContentIds,
  type MetaPurchaseOrder,
} from '../../../../lib/meta-commerce';

export const prerender = false;

export const OPTIONS = handleOptions;

export const POST: APIRoute = async ({ request, locals }) => {
  const validation = await validateHeadlessRequest(request, locals);
  if (!validation.allowed && validation.errorResponse) {
    return validation.errorResponse;
  }

  try {
    const rawPayload = await request.json().catch(() => null);
    const validated = validateMetaEventPayload(rawPayload, request.url);
    if (!validated.ok) {
      return headlessError(validated.error, 400, {
        code: 'INVALID_TRACKING_PAYLOAD',
      }, validation.corsHeaders);
    }

    const payload = validated.value;
    const runtime = getRuntimeEnv(locals);
    const rateLimit = await checkRateLimit(
      runtime?.SESSION as KVNamespace | undefined,
      `headless-tracking:${getClientIp(request.headers)}`,
      60,
      60_000,
    );
    if (!rateLimit.allowed) {
      return headlessError('Terlalu banyak event tracking.', 429, {
        code: 'RATE_LIMITED',
      }, validation.corsHeaders);
    }
    const adsConfig = await getStoreAdsConfig(locals);
    if (!adsConfig.metaPixelId || !adsConfig.metaCapiToken) {
      return headlessOk(
        {
          skipped: true,
          reason: 'Tracking pixel/CAPI belum dikonfigurasi untuk toko ini.',
        },
        200,
        validation.corsHeaders
      );
    }

    const database = runtime?.OMS_DB as D1Database | undefined;
    if (!database?.prepare) {
      return headlessError('Database tracking event store belum dikonfigurasi.', 503, {
        code: 'DATABASE_UNAVAILABLE',
      }, validation.corsHeaders);
    }
    let purchaseOrder: MetaPurchaseOrder | null = null;
    let purchaseOrderNumber: string | undefined;
    if (payload.eventName === 'Purchase') {
      const reference = getMetaPurchaseReference(rawPayload, payload.eventSourceUrl);
      if (!reference || !reference.statusToken) {
        return headlessError(
          'Purchase membutuhkan order_number dan status_token.',
          400,
          { code: 'PURCHASE_REFERENCE_REQUIRED' },
          validation.corsHeaders,
        );
      }
      purchaseOrder = await findMetaPurchaseOrder(database, {
        orderLocator: reference.orderLocator,
        statusToken: reference.statusToken,
      });
      if (!purchaseOrder) {
        return headlessError(
          'Order Purchase tidak ditemukan atau token tidak valid.',
          404,
          { code: 'PURCHASE_NOT_FOUND' },
          validation.corsHeaders,
        );
      }
      if (!isMetaPurchaseEligible(purchaseOrder)) {
        return headlessError(
          'Purchase menunggu pembayaran terverifikasi.',
          409,
          { code: 'PURCHASE_PAYMENT_PENDING' },
          validation.corsHeaders,
        );
      }
      purchaseOrderNumber = purchaseOrder.order_number;
    }
    const catalogContentIds = purchaseOrder
      ? parseMetaPurchaseVariantIds(purchaseOrder.variant_ids)
      : await validateMetaCatalogContentIds(database, payload.contentIds);
    if (payload.contentType === 'product' && !catalogContentIds?.length) {
      return headlessError(
        'Event commerce tidak memiliki variant ID katalog yang aktif.',
        409,
        { code: 'CATALOG_VARIANT_NOT_FOUND' },
        validation.corsHeaders,
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
        country: payload.country,
        externalId: purchaseExternalId || payload.externalId,
        fbp: payload.fbp,
        fbc: payload.fbc,
        clientIp: getClientIp(request.headers),
        userAgent: request.headers.get('user-agent') || '',
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

    const queued = await enqueueCapiEvent(database, event);
    if (!queued) {
      return headlessOk(
        {
          deduplicated: true,
          event_id: eventId,
        },
        200,
        validation.corsHeaders
      );
    }

    const delivered = await deliverCapiEvent(
      database,
      eventId,
      payload.eventName,
      adsConfig.metaPixelId,
      adsConfig.metaCapiToken
    );

    const drain = drainCapiOutbox(
      database,
      adsConfig.metaPixelId,
      adsConfig.metaCapiToken,
      1,
    ).catch((err) => console.error('headless-tracking-drain-error', err));
    if (locals.cfContext) locals.cfContext.waitUntil(drain);
    else void drain;

    return headlessOk(
      {
        event_id: eventId,
        event_name: payload.eventName,
        delivered,
        queued: !delivered,
      },
      200,
      validation.corsHeaders
    );
  } catch (error) {
    return headlessError('Gagal memproses tracking signal event.', 500, {
      code: 'TRACKING_SIGNAL_ERROR',
      details: error instanceof Error ? error.message : String(error),
    }, validation.corsHeaders);
  }
};
