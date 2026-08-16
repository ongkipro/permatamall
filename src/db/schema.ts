import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const stores = sqliteTable("stores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  mengantarApiKey: text("mengantar_api_key"),
  autolarisApiKey: text("autolaris_api_key"),
  mengantarBaseUrl: text("mengantar_base_url"),
  autolarisBaseUrl: text("autolaris_base_url"),
  metaPixelId: text("meta_pixel_id"),
  metaCapiToken: text("meta_capi_token"),
  googleTagManagerId: text("google_tag_manager_id"),
  googleAdsConversionId: text("google_ads_conversion_id"),
  googleAdsConversionLabel: text("google_ads_conversion_label"),
  paymentFeeBearer: text("payment_fee_bearer").notNull().default("buyer"),
  codFeeBearer: text("cod_fee_bearer").notNull().default("buyer"),
  supportWhatsapp: text("support_whatsapp"),
  codDisabledProvinceCodes: text("cod_disabled_province_codes")
    .notNull()
    .default("PA,PB,PD,PT,PE,PS,MA,MU,NT,KU,SR,GO,KR,AC,BE"),
  crmTemplates: text("crm_templates"),
  embedAllowedOrigins: text("embed_allowed_origins"),
  headlessAllowedOrigins: text("headless_allowed_origins"),
  aiContentInstructions: text("ai_content_instructions"),
  createdAt: text("created_at").notNull(),
});

export const sellerBankAccounts = sqliteTable("seller_bank_accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id),
  bankCode: text("bank_code").notNull(),
  accountHolder: text("account_holder").notNull(),
  accountNumber: text("account_number").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const adminCredentials = sqliteTable("admin_credentials", {
  id: integer("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  email: text("email"),
  role: text("role").notNull().default("owner"),
  passwordHash: text("password_hash").notNull(),
  mustChangePassword: integer("must_change_password", { mode: "boolean" })
    .notNull()
    .default(true),
  updatedAt: text("updated_at").notNull(),
});

export const developerApiKeys = sqliteTable(
  "developer_api_keys",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    keyHash: text("key_hash").notNull().unique(),
    keyPreview: text("key_preview").notNull(),
    createdBy: text("created_by").notNull(),
    createdAt: text("created_at").notNull(),
    lastUsedAt: text("last_used_at"),
    revokedAt: text("revoked_at"),
    revokedBy: text("revoked_by"),
  },
  (table) => [
    index("developer_api_keys_active_created_idx").on(
      table.revokedAt,
      table.createdAt,
    ),
  ],
);

// D1 owns operational catalog identity, pricing, stock, and variants.
// Auto-generated D1 primary keys are the canonical product and variant IDs.
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(), // SEO-friendly slug for storefront
  category: text("category").default("Umum"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull(),
});

export const productImages = sqliteTable(
  "product_images",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull(),
  },
  (table) => [
    index("idx_product_images_product_order").on(
      table.productId,
      table.sortOrder,
      table.id,
    ),
  ],
);
export const storefrontContent = sqliteTable("storefront_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id),
  contentKey: text("content_key").notNull().unique(),
  contentType: text("content_type").notNull(),
  draftJson: text("draft_json"),
  publishedJson: text("published_json"),
  version: integer("version").notNull().default(0),
  generatedBy: text("generated_by"),
  updatedAt: text("updated_at").notNull(),
  publishedAt: text("published_at"),
});

export const productVariants = sqliteTable(
  "product_variants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    sku: text("sku").notNull().unique(),
    title: text("title").notNull(),
    price: integer("price").notNull(),
    comparePrice: integer("compare_price"),
    weightGrams: integer("weight_grams").notNull().default(1000),
    stock: integer("stock").default(1000),
  },
  (table) => [index("product_variants_product_id_idx").on(table.productId)],
);

export const warehouses = sqliteTable("warehouses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id),
  name: text("name").notNull(),
  originAreaId: text("origin_area_id").notNull(),
  originLabel: text("origin_label"),
  pickupAddressId: text("pickup_address_id").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
});

export const courierRules = sqliteTable("courier_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id),
  courierCode: text("courier_code").notNull(),
  isEnabled: integer("is_enabled", { mode: "boolean" }).default(true),
  isCodEnabled: integer("is_cod_enabled", { mode: "boolean" }).default(true),
  excludedProvinces: text("excluded_provinces"),
});

export const pickupSchedules = sqliteTable("pickup_schedules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  warehouseId: integer("warehouse_id")
    .notNull()
    .references(() => warehouses.id),
  scheduledAt: text("scheduled_at").notNull(),
  status: text("status").notNull().default("scheduled"),
  shipmentCount: integer("shipment_count").notNull().default(0),
  providerReference: text("provider_reference"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

export const providerDispatchLocks = sqliteTable("provider_dispatch_locks", {
  provider: text("provider").primaryKey(),
  leaseToken: text("lease_token"),
  leaseExpiresAt: text("lease_expires_at"),
  updatedAt: text("updated_at").notNull(),
});

export const orders = sqliteTable(
  "orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    orderNumber: text("order_number").notNull().unique(),
    submitToken: text("submit_token").unique(),
    publicStatusToken: text("public_status_token").unique(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id),
    warehouseId: integer("warehouse_id").references(() => warehouses.id),
    pickupScheduleId: integer("pickup_schedule_id").references(
      () => pickupSchedules.id,
    ),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email"),
    address: text("address").notNull(),
    province: text("province").notNull(),
    city: text("city").notNull(),
    district: text("district").notNull(),
    postalCode: text("postal_code"),
    totalAmount: integer("total_amount").notNull(),
    shippingCost: integer("shipping_cost").notNull().default(0),
    discountAmount: integer("discount_amount").default(0),
    codServiceFee: integer("cod_service_fee").notNull().default(0),
    codServiceFeeVat: integer("cod_service_fee_vat").notNull().default(0),
    codFeeBearer: text("cod_fee_bearer").notNull().default("buyer"),
    paymentMethod: text("payment_method").notNull().default("cod"),
    paymentStatus: text("payment_status").notNull().default("unpaid"),
    shippingStatus: text("shipping_status").notNull().default("pending"),
    confirmedAt: text("confirmed_at"),
    // Set once when a cancelled/returned order gives its reserved stock back, so a
    // second cancel cannot inflate inventory.
    stockRestoredAt: text("stock_restored_at"),
    // Google click id captured at the ad landing, kept so a COD sale confirmed
    // days later can still be uploaded as an offline conversion.
    adClickIds: text("ad_click_ids"),
    courierCode: text("courier_code"),
    courierService: text("courier_service"),
    cnoteNo: text("cnote_no"),
    destinationAreaId: text("destination_area_id"),
    providerOrderId: text("provider_order_id"),
    providerBatchId: text("provider_batch_id"),
    providerDispatchError: text("provider_dispatch_error"),
    providerDispatchClaimedAt: text("provider_dispatch_claimed_at"),
    providerDispatchedAt: text("provider_dispatched_at"),
    sellerBankAccountId: integer("seller_bank_account_id"),
    sellerBankCode: text("seller_bank_code"),
    sellerBankName: text("seller_bank_name"),
    sellerAccountHolder: text("seller_account_holder"),
    sellerAccountNumber: text("seller_account_number"),
    // Legacy column names retained to preserve existing D1 data; values are CMS-derived delivery rate and risk.
    receiverDeliveryRate: integer("receiver_rts_score"),
    receiverRiskLabel: text("rts_risk_label"),
    receiverPerformanceJson: text("receiver_performance_json"),
    receiverPerformanceCheckedAt: text("receiver_performance_checked_at"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("orders_created_at_idx").on(table.createdAt),
    index("orders_shipping_status_idx").on(table.shippingStatus),
    index("orders_customer_phone_idx").on(table.customerPhone),
  ],
);

export const paymentTransactions = sqliteTable("payment_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id)
    .unique(),
  provider: text("provider").notNull().default("autolaris"),
  providerTransactionId: text("provider_transaction_id").unique(),
  referenceId: text("reference_id").notNull().unique(),
  publicToken: text("public_token").notNull().unique(),
  channelCode: text("channel_code").notNull(),
  feeBearer: text("fee_bearer").notNull().default("buyer"),
  status: text("status").notNull().default("pending"),
  amount: integer("amount").notNull(),
  adminFee: integer("admin_fee").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  virtualAccount: text("virtual_account"),
  qrPayload: text("qr_payload"),
  paymentCode: text("payment_code"),
  providerPaymentUrl: text("provider_payment_url"),
  expiresAt: text("expires_at"),
  paidAt: text("paid_at"),
  failedReason: text("failed_reason"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const orderItems = sqliteTable(
  "order_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    variantId: integer("variant_id")
      .notNull()
      .references(() => productVariants.id),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: integer("unit_price").notNull(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_variant_id_idx").on(table.variantId),
  ],
);

/**
 * Transactional outbox for Meta CAPI. Events are recorded before transmission
 * so a network failure, a 429, or an expired token cannot silently discard a
 * conversion. `eventId` is unique, which also makes a replayed browser request
 * a no-op rather than a duplicate conversion.
 */
export const capiEventOutbox = sqliteTable(
  "capi_event_outbox",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    eventId: text("event_id").notNull().unique(),
    eventName: text("event_name").notNull(),
    payload: text("payload").notNull(),
    status: text("status").notNull().default("pending"),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(5),
    lastError: text("last_error"),
    nextRetryAt: text("next_retry_at").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("capi_event_outbox_due_idx").on(table.status, table.nextRetryAt),
  ],
);
