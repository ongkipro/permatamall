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
const { PUT } = await import("../pages/api/admin/settings.ts");
extensionResolver.deregister();

type ProviderRow = {
  mengantar_api_key: string | null;
  mengantar_base_url: string | null;
  autolaris_api_key: string | null;
  autolaris_base_url: string | null;
};

function createDatabase() {
  const provider: ProviderRow = {
    mengantar_api_key: null,
    mengantar_base_url: null,
    autolaris_api_key: null,
    autolaris_base_url: null,
  };
  const settings = {
    store_id: 1,
    store_name: "Test Store",
    support_whatsapp: "628123456789",
    payment_fee_bearer: "buyer",
    cod_fee_bearer: "buyer",
    is_cod_enabled: 1,
    is_autolaris_enabled: 1,
    disabled_autolaris_channels: "",
    crm_templates: null,
    warehouse_id: null,
    warehouse_name: null,
    contact_name: null,
    contact_phone: null,
    origin_area_id: null,
    origin_label: null,
    pickup_address_id: null,
    address: null,
    city: null,
    province: null,
    embed_allowed_origins: null,
    headless_allowed_origins: null,
  };

  const database = {
    prepare(sql: string) {
      if (sql.includes("LEFT JOIN warehouses")) {
        return {
          async first() {
            return { ...settings };
          },
        };
      }
      if (sql.includes("SELECT mengantar_api_key")) {
        return {
          async first() {
            return { ...provider };
          },
        };
      }
      if (sql.includes("SET mengantar_api_key")) {
        return {
          bind(...values: unknown[]) {
            return {
              async run() {
                if (String(values[0]))
                  provider.mengantar_api_key = String(values[0]);
                provider.mengantar_base_url = String(values[1]);
                if (String(values[2]))
                  provider.autolaris_api_key = String(values[2]);
                provider.autolaris_base_url = String(values[3]);
                return { success: true, meta: { changes: 1 }, results: [] };
              },
            };
          },
        };
      }
      throw new Error(`Unexpected SQL in integration settings test: ${sql}`);
    },
  } as unknown as D1Database;

  return { database, provider };
}

async function save(
  database: D1Database,
  integrations: Record<string, string>,
) {
  return PUT({
    request: new Request("https://admin.test/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save-integrations", integrations }),
    }),
    locals: { runtimeEnv: { OMS_DB: database } },
  } as unknown as Parameters<typeof PUT>[0]);
}

test("Mengantar and AutoLaris API settings persist while blank secrets preserve stored keys", async () => {
  const state = createDatabase();
  const first = await save(state.database, {
    mengantar_api_key: "test-mengantar-key",
    mengantar_base_url: "https://mengantar.example.test/",
    autolaris_api_key: "test-autolaris-key",
    autolaris_base_url: "https://autolaris.example.test/",
  });
  const firstPayload = (await first.json()) as {
    success: boolean;
    data: {
      credentials: {
        mengantar: { source: string };
        autolaris: { source: string };
      };
    };
  };

  assert.equal(first.status, 200);
  assert.equal(firstPayload.success, true);
  assert.equal(firstPayload.data.credentials.mengantar.source, "dashboard");
  assert.equal(firstPayload.data.credentials.autolaris.source, "dashboard");
  assert.deepEqual(state.provider, {
    mengantar_api_key: "test-mengantar-key",
    mengantar_base_url: "https://mengantar.example.test",
    autolaris_api_key: "test-autolaris-key",
    autolaris_base_url: "https://autolaris.example.test",
  });

  const second = await save(state.database, {
    mengantar_api_key: "",
    mengantar_base_url: "https://new-mengantar.example.test",
    autolaris_api_key: "",
    autolaris_base_url: "https://new-autolaris.example.test",
  });

  assert.equal(second.status, 200);
  assert.equal(state.provider.mengantar_api_key, "test-mengantar-key");
  assert.equal(state.provider.autolaris_api_key, "test-autolaris-key");
  assert.equal(
    state.provider.mengantar_base_url,
    "https://new-mengantar.example.test",
  );
  assert.equal(
    state.provider.autolaris_base_url,
    "https://new-autolaris.example.test",
  );
});

test("invalid provider base URLs are rejected before persistence", async () => {
  const state = createDatabase();
  const response = await save(state.database, {
    mengantar_api_key: "test-key",
    mengantar_base_url: "javascript:alert(1)",
    autolaris_api_key: "test-key",
    autolaris_base_url: "https://autolaris.example.test",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(state.provider, {
    mengantar_api_key: null,
    mengantar_base_url: null,
    autolaris_api_key: null,
    autolaris_base_url: null,
  });
});
