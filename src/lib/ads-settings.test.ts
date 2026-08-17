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

const { PUT } = await import("../pages/api/admin/ads.ts");
extensionResolver.deregister();

type AdsRow = {
  id: number;
  meta_pixel_id: string | null;
  meta_capi_token: string | null;
  google_tag_manager_id: string | null;
  google_ads_conversion_id: string | null;
  google_ads_conversion_label: string | null;
};

function createDatabase() {
  const row: AdsRow = {
    id: 1,
    meta_pixel_id: null,
    meta_capi_token: "existing-secret-token",
    google_tag_manager_id: null,
    google_ads_conversion_id: null,
    google_ads_conversion_label: null,
  };
  const updates: unknown[][] = [];

  return {
    database: {
      prepare(sql: string) {
        if (sql.includes("SELECT meta_pixel_id")) {
          return {
            async first() {
              return { ...row };
            },
          };
        }
        if (sql.includes("SET meta_pixel_id")) {
          return {
            bind(...values: unknown[]) {
              return {
                async run() {
                  updates.push(values);
                  row.meta_pixel_id =
                    values[0] == null ? null : String(values[0]);
                  if (String(values[1]))
                    row.meta_capi_token = String(values[2]);
                  return { success: true, meta: { changes: 1 }, results: [] };
                },
              };
            },
          };
        }
        if (sql.includes("SET google_tag_manager_id")) {
          return {
            bind(...values: unknown[]) {
              return {
                async run() {
                  updates.push(values);
                  row.google_tag_manager_id = String(values[0]);
                  row.google_ads_conversion_id = String(values[1]);
                  row.google_ads_conversion_label = String(values[2]);
                  return { success: true, meta: { changes: 1 }, results: [] };
                },
              };
            },
          };
        }
        throw new Error(`Unexpected SQL in ads settings test: ${sql}`);
      },
    } as unknown as D1Database,
    row,
    updates,
  };
}

async function save(database: D1Database, body: Record<string, unknown>) {
  return PUT({
    request: new Request("https://admin.test/api/admin/ads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    locals: { runtimeEnv: { OMS_DB: database } },
  } as unknown as Parameters<typeof PUT>[0]);
}

test("Meta Pixel and CAPI settings persist and a blank secret preserves the stored token", async () => {
  const state = createDatabase();
  const firstResponse = await save(state.database, {
    action: "save-meta",
    meta_pixel_id: "123456789012345",
    meta_capi_token: "new-secret-token",
    meta_test_event_code: "TEST12345",
  });
  const firstPayload = (await firstResponse.json()) as { success: boolean };

  assert.equal(firstResponse.status, 200);
  assert.equal(firstPayload.success, true);
  assert.deepEqual(state.updates[0], [
    "123456789012345",
    "new-secret-token",
    "new-secret-token",
  ]);

  const secondResponse = await save(state.database, {
    action: "save-meta",
    meta_pixel_id: "987654321098765",
    meta_capi_token: "",
    meta_test_event_code: "",
  });

  assert.equal(secondResponse.status, 200);
  assert.equal(state.row.meta_pixel_id, "987654321098765");
  assert.equal(state.row.meta_capi_token, "new-secret-token");
  assert.deepEqual(state.updates[1], ["987654321098765", "", ""]);
});

test("Google Tag Manager and Ads conversion fields persist together", async () => {
  const state = createDatabase();
  const response = await save(state.database, {
    action: "save-google",
    google_tag_manager_id: "GTM-ABC1234",
    google_ads_conversion_id: "AW-123456789",
    google_ads_conversion_label: "AbCdEfGhIjKlMnOp",
  });
  const payload = (await response.json()) as { success: boolean };

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.deepEqual(state.updates[0], [
    "GTM-ABC1234",
    "AW-123456789",
    "AbCdEfGhIjKlMnOp",
  ]);
});

test("invalid Meta and Google IDs are rejected before database mutation", async () => {
  const state = createDatabase();
  const metaResponse = await save(state.database, {
    action: "save-meta",
    meta_pixel_id: "not-a-pixel",
  });
  const googleResponse = await save(state.database, {
    action: "save-google",
    google_tag_manager_id: "GTM bad",
    google_ads_conversion_id: "123",
  });

  assert.equal(metaResponse.status, 400);
  assert.equal(googleResponse.status, 400);
  assert.deepEqual(state.updates, []);
});
