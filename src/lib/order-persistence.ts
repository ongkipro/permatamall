import {
  calculateCodCustomerTotal,
  calculateCodFeeBreakdown,
  normalizePaymentFeeBearer,
  type PaymentFeeBearer,
} from "./payment-fee-policy.ts";
import { paymentBrandLabel } from "./payment-brand.ts";
import { isValidWa62, normalizePhone } from "./validation.ts";

export type PersistOrderInput = {
  submitToken: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postalCode?: string;
  variantKey: string;
  quantity: number;
  shippingCost: number;
  paymentMethod: "cod" | "bank_transfer" | "qris" | "manual_transfer";
  sellerBankAccountId?: number;
  warehouseId?: number;
  destinationAreaId?: string;
  courierCode?: string;
  courierService?: string;
  adClickIds?: string;
  sourceForm?: string;
  sourcePath?: string;
};

export type PersistedOrder = {
  id: number;
  orderNumber: string;
  publicStatusToken: string;
  totalAmount: number;
  unitPrice: number;
  codServiceFee: number;
  codServiceFeeVat: number;
  codFeeBearer: PaymentFeeBearer;
  sellerBankAccountId?: number;
  sellerBankCode?: string;
  sellerBankName?: string;
  sellerAccountHolder?: string;
  sellerAccountNumber?: string;
};

export class DuplicateSubmissionError extends Error {}
export class OrderInputError extends Error {}

export type RecordAbandonedOrderInput = {
  submitToken: string;
  customerName: string;
  customerPhone: string;
  address?: string;
  province?: string;
  productId: number;
  variantId: number;
  sourceForm: string;
  sourcePath: string;
};

export type RecordedAbandonedOrder = {
  id: number;
  orderNumber: string;
  customerPhone: string;
  action: "created" | "updated" | "skipped";
};

const normalizeSourceContext = (sourceForm?: string, sourcePath?: string) => {
  const normalizedForm = String(sourceForm || "").trim().slice(0, 80);
  const normalizedPath = String(sourcePath || "").trim().slice(0, 240);
  return {
    sourceForm: normalizedForm || null,
    sourcePath: normalizedPath.startsWith("/") ? normalizedPath : null,
  };
};

export async function recordAbandonedOrder(
  database: D1Database,
  input: RecordAbandonedOrderInput,
): Promise<RecordedAbandonedOrder> {
  const submitToken = input.submitToken.trim();
  const customerName = input.customerName.trim();
  const customerPhone = normalizePhone(input.customerPhone);
  if (submitToken.length < 16 || submitToken.length > 120) {
    throw new OrderInputError("Token lead tidak valid.");
  }
  if (customerName.length < 3) {
    throw new OrderInputError("Nama pelanggan minimal 3 karakter.");
  }
  if (!isValidWa62(customerPhone)) {
    throw new OrderInputError("Nomor WhatsApp tidak valid.");
  }
  if (
    !Number.isInteger(input.productId) ||
    input.productId < 1 ||
    !Number.isInteger(input.variantId) ||
    input.variantId < 1
  ) {
    throw new OrderInputError("Produk atau varian tidak valid.");
  }

  const variant = await database
    .prepare(
      `SELECT pv.id, pv.price
       FROM product_variants pv
       INNER JOIN products p ON p.id = pv.product_id
       WHERE p.id = ?
         AND pv.id = ?
         AND p.is_active = 1
       LIMIT 1`,
    )
    .bind(input.productId, input.variantId)
    .first<{ id: number; price: number }>();
  if (!variant) {
    throw new OrderInputError("Produk atau varian tidak ditemukan.");
  }

  const address = input.address?.trim() || "";
  const province = input.province?.trim() || "";
  const unitPrice = Math.max(0, Math.round(Number(variant.price) || 0));
  const createdAt = new Date().toISOString();
  const source = normalizeSourceContext(input.sourceForm, input.sourcePath);
  const existing = await database
    .prepare(
      `SELECT id, order_number, shipping_status
       FROM orders
       WHERE submit_token = ?
       LIMIT 1`,
    )
    .bind(submitToken)
    .first<{
      id: number;
      order_number: string;
      shipping_status: string;
    }>();

  if (existing && existing.shipping_status !== "abandoned") {
    return {
      id: existing.id,
      orderNumber: existing.order_number,
      customerPhone,
      action: "skipped",
    };
  }

  if (existing) {
    await database.batch([
      database
        .prepare(
          `UPDATE orders
           SET customer_name = ?,
               customer_phone = ?,
               address = COALESCE(NULLIF(?, ''), address),
               province = COALESCE(NULLIF(?, ''), province),
               total_amount = ?,
               source_form = ?,
               source_path = ?,
               created_at = ?
           WHERE id = ? AND submit_token = ? AND shipping_status = 'abandoned'`,
        )
        .bind(
          customerName,
          customerPhone,
          address,
          province,
          unitPrice,
          source.sourceForm,
          source.sourcePath,
          createdAt,
          existing.id,
          submitToken,
        ),
      database
        .prepare("DELETE FROM order_items WHERE order_id = ?")
        .bind(existing.id),
      database
        .prepare(
          `INSERT INTO order_items (order_id, variant_id, quantity, unit_price)
           VALUES (?, ?, 1, ?)`,
        )
        .bind(existing.id, variant.id, unitPrice),
    ]);
    return {
      id: existing.id,
      orderNumber: existing.order_number,
      customerPhone,
      action: "updated",
    };
  }

  const store = await database
    .prepare("SELECT id FROM stores ORDER BY id LIMIT 1")
    .first<{ id: number }>();
  if (!store) throw new Error("Store belum dikonfigurasi.");

  const maxRow = await database
    .prepare("SELECT MAX(id) as max_id FROM orders")
    .first<{ max_id: number | null }>();
  const nextId = (maxRow?.max_id || 0) + 1;
  const orderNumber = `ABN-${10000 + nextId}`;
  const results = await database.batch([
    database
      .prepare(
        `INSERT INTO orders (
          order_number, submit_token, store_id, customer_name, customer_phone,
          address, province, city, district,
          payment_method, payment_status, shipping_status,
          total_amount, shipping_cost, discount_amount, cod_service_fee,
          cod_service_fee_vat, cod_fee_bearer, source_form, source_path, created_at
        )
        SELECT
          ?, ?, ?, ?, ?,
          ?, ?, '', '',
          'cod', 'unpaid', 'abandoned',
          ?, 0, 0, 0,
          0, 'buyer', ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1
          FROM orders
          WHERE submit_token = ?
        )`,
      )
      .bind(
        orderNumber,
        submitToken,
        store.id,
        customerName,
        customerPhone,
        address,
        province || "ID-JK",
        unitPrice,
        source.sourceForm,
        source.sourcePath,
        createdAt,
        submitToken,
      ),
    database
      .prepare(
        `INSERT INTO order_items (order_id, variant_id, quantity, unit_price)
         SELECT o.id, ?, 1, ?
         FROM orders o
         WHERE o.order_number = ?
           AND o.submit_token = ?
           AND o.shipping_status = 'abandoned'`,
      )
      .bind(variant.id, unitPrice, orderNumber, submitToken),
    database
      .prepare(
        `SELECT id, order_number, shipping_status
         FROM orders
         WHERE submit_token = ?
         LIMIT 1`,
      )
      .bind(submitToken),
  ]);
  const row = results.at(-1)?.results?.[0] as
    | { id?: number; order_number?: string; shipping_status?: string }
    | undefined;
  if (!row?.id || !row.order_number) {
    throw new Error("Order terbengkalai gagal disimpan.");
  }
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerPhone,
    action: row.shipping_status === "abandoned" ? "created" : "skipped",
  };
}

async function generateNextInvoiceNumber(database: D1Database): Promise<string> {
  const row = await database
    .prepare("SELECT MAX(id) as max_id FROM orders")
    .first<{ max_id: number | null }>();
  const nextId = (row?.max_id || 0) + 1;
  return `INV-${10000 + nextId}`;
}

export async function persistOrder(
  database: D1Database,
  input: PersistOrderInput,
): Promise<PersistedOrder> {
  const variant = await database
    .prepare(
      `
      SELECT pv.id, pv.price, pv.stock
      FROM product_variants pv
      INNER JOIN products p ON p.id = pv.product_id
      WHERE (CAST(pv.id AS TEXT) = ? OR pv.sku = ?)
        AND p.is_active = 1
      LIMIT 1
    `,
    )
    .bind(input.variantKey, input.variantKey)
    .first<{ id: number; price: number; stock: number | null }>();
  if (!variant) throw new OrderInputError("Varian produk tidak ditemukan.");
  if (variant.stock !== null && variant.stock < input.quantity)
    throw new OrderInputError("Stok produk tidak mencukupi.");

  const store = await database
    .prepare("SELECT id, cod_fee_bearer FROM stores ORDER BY id LIMIT 1")
    .first<{ id: number; cod_fee_bearer: string | null }>();
  if (!store) throw new Error("Store belum dikonfigurasi.");
  const sellerBankAccount =
    input.paymentMethod === "manual_transfer"
      ? await database
          .prepare(
            `SELECT id, bank_code, account_holder, account_number
             FROM seller_bank_accounts
             WHERE id = ? AND store_id = ? AND is_active = 1
             LIMIT 1`,
          )
          .bind(input.sellerBankAccountId || 0, store.id)
          .first<{
            id: number;
            bank_code: string;
            account_holder: string;
            account_number: string;
          }>()
      : null;
  if (input.paymentMethod === "manual_transfer" && !sellerBankAccount) {
    throw new OrderInputError("Rekening transfer tidak tersedia.");
  }

  const abandonedOrder = await database
    .prepare(
      `SELECT id, order_number, public_status_token
       FROM orders
       WHERE submit_token = ?
         AND customer_phone = ?
         AND shipping_status = 'abandoned'
       LIMIT 1`,
    )
    .bind(input.submitToken, input.customerPhone)
    .first<{
      id: number;
      order_number: string;
      public_status_token: string | null;
    }>();
  const orderNumber = abandonedOrder
    ? `INV-${10000 + abandonedOrder.id}`
    : (await generateNextInvoiceNumber(database));
  const publicStatusToken =
    abandonedOrder?.public_status_token || crypto.randomUUID();
  const unitPrice = Number(variant.price);
  const orderAmount = unitPrice * input.quantity + input.shippingCost;
  const codFeeBearer = normalizePaymentFeeBearer(store.cod_fee_bearer);
  const codFee =
    input.paymentMethod === "cod"
      ? calculateCodFeeBreakdown(orderAmount)
      : calculateCodFeeBreakdown(0);
  const totalAmount =
    input.paymentMethod === "cod"
      ? calculateCodCustomerTotal(orderAmount, codFeeBearer)
      : orderAmount;
  const createdAt = new Date().toISOString();
  const paymentStatus =
    input.paymentMethod === "cod" ? "unpaid" : "pending";
  const source = normalizeSourceContext(input.sourceForm, input.sourcePath);

  try {
    const orderStatement = abandonedOrder
      ? database
          .prepare(
            `UPDATE orders
             SET order_number = ?,
                 submit_token = ?,
                 public_status_token = ?,
                 customer_name = ?,
                 customer_phone = ?,
                 customer_email = ?,
                 address = ?,
                 province = ?,
                 city = ?,
                 district = ?,
                 postal_code = ?,
                 total_amount = ?,
                 shipping_cost = ?,
                 discount_amount = 0,
                 cod_service_fee = ?,
                 cod_service_fee_vat = ?,
                 cod_fee_bearer = ?,
                 payment_method = ?,
                 payment_status = ?,
                 shipping_status = 'pending',
                 destination_area_id = ?,
                 courier_code = ?,
                 courier_service = ?,
                 ad_click_ids = COALESCE(?, ad_click_ids),
                 source_form = COALESCE(?, source_form),
                 source_path = COALESCE(?, source_path),
                 seller_bank_account_id = ?,
                 seller_bank_code = ?,
                 seller_bank_name = ?,
                 seller_account_holder = ?,
                 seller_account_number = ?
             WHERE id = ?
               AND submit_token = ?
               AND customer_phone = ?
               AND shipping_status = 'abandoned'`,
          )
          .bind(
            orderNumber,
            input.submitToken,
            publicStatusToken,
            input.customerName,
            input.customerPhone,
            input.customerEmail || null,
            input.address,
            input.province,
            input.city,
            input.district,
            input.postalCode || null,
            totalAmount,
            input.shippingCost,
            codFee.serviceFee,
            codFee.vat,
            codFeeBearer,
            input.paymentMethod,
            paymentStatus,
            input.destinationAreaId || null,
            input.courierCode || null,
            input.courierService || null,
            input.adClickIds || null,
            source.sourceForm,
            source.sourcePath,
            sellerBankAccount?.id || null,
            sellerBankAccount?.bank_code || null,
            sellerBankAccount
              ? paymentBrandLabel(sellerBankAccount.bank_code)
              : null,
            sellerBankAccount?.account_holder || null,
            sellerBankAccount?.account_number || null,
            abandonedOrder.id,
            input.submitToken,
            input.customerPhone,
          )
      : database
          .prepare(
            `INSERT INTO orders (
              order_number, submit_token, public_status_token, store_id, warehouse_id,
              customer_name, customer_phone, customer_email, address, province, city, district, postal_code,
              total_amount, shipping_cost, cod_service_fee, cod_service_fee_vat,
              cod_fee_bearer, payment_method, payment_status, shipping_status,
              destination_area_id, courier_code, courier_service, ad_click_ids,
              source_form, source_path,
              seller_bank_account_id, seller_bank_code, seller_bank_name,
              seller_account_holder, seller_account_number, created_at
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending',
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )`,
          )
          .bind(
            orderNumber,
            input.submitToken,
            publicStatusToken,
            store.id,
            input.warehouseId || null,
            input.customerName,
            input.customerPhone,
            input.customerEmail || null,
            input.address,
            input.province,
            input.city,
            input.district,
            input.postalCode || null,
            totalAmount,
            input.shippingCost,
            codFee.serviceFee,
            codFee.vat,
            codFeeBearer,
            input.paymentMethod,
            paymentStatus,
            input.destinationAreaId || null,
            input.courierCode || null,
            input.courierService || null,
            input.adClickIds || null,
            source.sourceForm,
            source.sourcePath,
            sellerBankAccount?.id || null,
            sellerBankAccount?.bank_code || null,
            sellerBankAccount
              ? paymentBrandLabel(sellerBankAccount.bank_code)
              : null,
            sellerBankAccount?.account_holder || null,
            sellerBankAccount?.account_number || null,
            createdAt,
          );

    const identityPredicate = abandonedOrder
      ? "id = ? AND submit_token = ?"
      : "order_number = ? AND submit_token = ?";
    const identityBindings: [number | string, string] = [
      abandonedOrder?.id || orderNumber,
      input.submitToken,
    ];
    const statements = [orderStatement];
    if (abandonedOrder) {
      statements.push(
        database
          .prepare(
            `DELETE FROM order_items
             WHERE order_id IN (
               SELECT id FROM orders WHERE ${identityPredicate}
             )`,
          )
          .bind(...identityBindings),
      );
    }
    statements.push(
      database
        .prepare(
          `INSERT INTO order_items (order_id, variant_id, quantity, unit_price)
           SELECT id, ?, ?, ?
           FROM orders
           WHERE ${identityPredicate}`,
        )
        .bind(
          variant.id,
          input.quantity,
          unitPrice,
          ...identityBindings,
        ),
      database
        .prepare(
          `UPDATE product_variants
           SET stock = stock - ?
           WHERE id = ?
             AND stock IS NOT NULL
             AND EXISTS (
               SELECT 1 FROM orders WHERE ${identityPredicate}
             )`,
        )
        .bind(
          input.quantity,
          variant.id,
          ...identityBindings,
        ),
      database
        .prepare(
          `SELECT id FROM orders
           WHERE ${identityPredicate}
           LIMIT 1`,
        )
        .bind(...identityBindings),
    );
    const results = await database.batch(statements);
    const row = results.at(-1)?.results?.[0] as { id?: number } | undefined;
    if (!row?.id) throw new Error("Order gagal disimpan.");
    return {
      id: row.id,
      orderNumber,
      publicStatusToken,
      totalAmount,
      unitPrice,
      codServiceFee: codFee.serviceFee,
      codServiceFeeVat: codFee.vat,
      codFeeBearer,
      sellerBankAccountId: sellerBankAccount?.id,
      sellerBankCode: sellerBankAccount?.bank_code,
      sellerBankName: sellerBankAccount
        ? paymentBrandLabel(sellerBankAccount.bank_code)
        : undefined,
      sellerAccountHolder: sellerBankAccount?.account_holder,
      sellerAccountNumber: sellerBankAccount?.account_number,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      message.includes("orders.submit_token") ||
      message.includes("orders_submit_token_unique")
    ) {
      throw new DuplicateSubmissionError(
        "Permintaan duplikat terdeteksi. Pesanan sudah diproses.",
      );
    }
    if (message.includes("INSUFFICIENT_STOCK")) {
      throw new OrderInputError("Stok produk tidak mencukupi.");
    }
    throw error;
  }
}
