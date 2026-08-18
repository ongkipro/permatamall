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

const { GET } = await import("../pages/api/locations.ts");
extensionResolver.deregister();

function createDatabase(apiKey = "") {
  return {
    prepare() {
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
    },
  } as unknown as D1Database;
}

async function searchLocations(path: string, database = createDatabase()) {
  return GET({
    url: new URL(`https://admin.test${path}`),
    locals: { runtimeEnv: { OMS_DB: database } },
  } as unknown as Parameters<typeof GET>[0]);
}

test("provider-required origin search fails instead of returning unselectable catalog rows", async () => {
  const response = await searchLocations(
    "/api/locations?search=sukodono&require_provider=1",
  );
  const payload = (await response.json()) as {
    success: boolean;
    error?: string;
    code?: string;
  };

  assert.equal(response.status, 409);
  assert.equal(payload.success, false);
  assert.equal(payload.code, "MENGANTAR_NOT_CONFIGURED");
  assert.match(payload.error || "", /API Mengantar belum dikonfigurasi/i);
});

test("ordinary location discovery keeps catalog fallback without provider credentials", async () => {
  const response = await searchLocations("/api/locations?search=sukodono");
  const payload = (await response.json()) as {
    success: boolean;
    items?: Array<{ id?: string; location_id?: string }>;
  };

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.ok((payload.items?.length || 0) > 0);
  assert.ok(payload.items?.every((item) => !item.id && !item.location_id));
});

test("provider-required origin search returns selectable Mengantar area IDs", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () =>
    Response.json({
      success: true,
      data: [
        {
          _id: "origin-sukodono",
          DISTRICT_NAME: "Sukodono",
          SUBDISTRICT_NAME: "Anggaswangi",
          CITY_NAME: "Sidoarjo",
          PROVINCE_NAME: "Jawa Timur",
          ZIP_CODE: "61258",
        },
      ],
    });

  const response = await searchLocations(
    "/api/locations?search=sukodono&require_provider=1",
    createDatabase("test-api-key"),
  );
  const payload = (await response.json()) as {
    success: boolean;
    items?: Array<{ id?: string; location_id?: string }>;
  };

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.deepEqual(payload.items?.map((item) => item.id), ["origin-sukodono"]);
});
