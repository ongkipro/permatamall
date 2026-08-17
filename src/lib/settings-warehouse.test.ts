import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

const extensionResolver = registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      const isRelativeWithoutExtension =
        specifier.startsWith(".") && !/\.[a-z0-9]+$/i.test(specifier);
      if (!isRelativeWithoutExtension) throw error;
      return nextResolve(`${specifier}.ts`, context);
    }
  },
});

// The test-only resolver must be installed before this Astro route's
// extensionless relative imports are evaluated.
const { PUT } = await import("../pages/api/admin/settings.ts");
extensionResolver.deregister();

type WarehouseUpdate = readonly unknown[];

const currentSettings = {
  store_id: 1,
  store_name: "Permata Mall",
  support_whatsapp: "628123456789",
  payment_fee_bearer: "buyer",
  cod_fee_bearer: "buyer",
  is_cod_enabled: 1,
  is_autolaris_enabled: 1,
  disabled_autolaris_channels: "[]",
  crm_templates: null,
  embed_allowed_origins: null,
  headless_allowed_origins: null,
  warehouse_id: 1,
  warehouse_name: "Gudang Lama",
  contact_name: "PIC Lama",
  contact_phone: "628123456789",
  origin_area_id: "origin-old",
  origin_label: "Kecamatan Lama",
  pickup_address_id: "pickup-old",
  address: "Alamat lama",
  city: "Kota Lama",
  province: "Provinsi Lama",
};

function createDatabase(apiKey: string) {
  let warehouseUpdate: WarehouseUpdate | null = null;
  let pickupIdUpdate: WarehouseUpdate | null = null;

  const database = {
    prepare(sql: string) {
      if (sql.includes("SELECT mengantar_api_key")) {
        return {
          async first() {
            return {
              mengantar_api_key: apiKey || null,
              mengantar_base_url: "https://mengantar.test",
              autolaris_api_key: null,
              autolaris_base_url: null,
            };
          },
        };
      }

      if (sql.includes("LEFT JOIN warehouses")) {
        return {
          async first() {
            return currentSettings;
          },
        };
      }

      if (sql.includes("UPDATE warehouses") && sql.includes("name = ?")) {
        return {
          bind(...values: unknown[]) {
            return {
              async run() {
                warehouseUpdate = values;
                return { success: true, meta: { changes: 1 }, results: [] };
              },
            };
          },
        };
      }

      if (
        sql.includes("UPDATE warehouses") &&
        sql.includes("pickup_address_id = ?")
      ) {
        return {
          bind(...values: unknown[]) {
            return {
              async run() {
                pickupIdUpdate = values;
                return { success: true, meta: { changes: 1 }, results: [] };
              },
            };
          },
        };
      }

      throw new Error(`Unexpected SQL in warehouse settings test: ${sql}`);
    },
  } as unknown as D1Database;

  return {
    database,
    getWarehouseUpdate: () => warehouseUpdate,
    getPickupIdUpdate: () => pickupIdUpdate,
  };
}

const warehousePayload = {
  action: "save-warehouse",
  warehouse: {
    name: "Gudang Baru",
    contact_name: "PIC Baru",
    contact_phone: "628987654321",
    origin_area_id: "origin-new",
    origin_label: "Kecamatan Baru, Kota Baru",
    pickup_address_id: "pickup-manual",
    address: "Jalan Baru nomor 10",
    city: "Kota Baru",
    province: "Provinsi Baru",
  },
};

async function saveWarehouse(database: D1Database) {
  return PUT({
    request: new Request("https://admin.test/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(warehousePayload),
    }),
    locals: {
      runtimeEnv: { OMS_DB: database },
    },
  } as unknown as Parameters<typeof PUT>[0]);
}

test("warehouse fields persist when Mengantar synchronization fails", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () => {
    throw new Error("provider offline");
  };

  const state = createDatabase("test-api-key");
  const response = await saveWarehouse(state.database);
  const payload = (await response.json()) as {
    success: boolean;
    message?: string;
    data?: {
      pickup_address_id?: string;
      provider_sync?: { status?: string; message?: string };
    };
  };

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data?.pickup_address_id, "pickup-manual");
  assert.equal(payload.data?.provider_sync?.status, "pending");
  assert.match(payload.message || "", /lokal tersimpan/i);
  assert.deepEqual(state.getWarehouseUpdate(), [
    "Gudang Baru",
    "PIC Baru",
    "628987654321",
    "origin-new",
    "Kecamatan Baru, Kota Baru",
    "pickup-manual",
    "Jalan Baru nomor 10",
    "Kota Baru",
    "Provinsi Baru",
    1,
  ]);
  assert.equal(state.getPickupIdUpdate(), null);
});

test("warehouse save persists the pickup ID confirmed by Mengantar", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.endsWith("/address") && init?.method === "POST") {
      return Response.json({ success: true, data: { _id: "pickup-confirmed" } });
    }
    if (url.endsWith("/address")) {
      return Response.json({ success: true, data: [] });
    }
    throw new Error(`Unexpected Mengantar request: ${url}`);
  };

  const state = createDatabase("test-api-key");
  const response = await saveWarehouse(state.database);
  const payload = (await response.json()) as {
    success: boolean;
    data?: {
      pickup_address_id?: string;
      provider_sync?: { status?: string };
    };
  };

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data?.pickup_address_id, "pickup-confirmed");
  assert.equal(payload.data?.provider_sync?.status, "synced");
  assert.deepEqual(state.getPickupIdUpdate(), ["pickup-confirmed", 1]);
});

test("warehouse save keeps a manual pickup ID when Mengantar is not configured", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () => {
    assert.fail("Mengantar must not be called without an API key");
  };

  const state = createDatabase("");
  const response = await saveWarehouse(state.database);
  const payload = (await response.json()) as {
    success: boolean;
    data?: {
      pickup_address_id?: string;
      provider_sync?: { status?: string };
    };
  };

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data?.pickup_address_id, "pickup-manual");
  assert.equal(payload.data?.provider_sync?.status, "pending");
  assert.equal(state.getPickupIdUpdate(), null);
});
