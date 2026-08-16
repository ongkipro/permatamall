import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPublicStorefrontCacheKey,
  isAnonymousPublicCacheRequest,
  isCacheablePublicResponse,
  isNeverCachePath,
  PUBLIC_STOREFRONT_CACHE_TTL_SECONDS,
  shouldForceNoStore,
} from "./public-storefront-cache.ts";

function request(path: string, init?: RequestInit) {
  return new Request(`https://shop.example${path}`, init);
}

test("allows only anonymous public home and catalog reads", () => {
  assert.equal(isAnonymousPublicCacheRequest(request("/")), true);
  assert.equal(isAnonymousPublicCacheRequest(request("/produk", { method: "HEAD" })), true);
  assert.equal(isAnonymousPublicCacheRequest(request("/produk?sort=price")), true);

  assert.equal(isAnonymousPublicCacheRequest(request("/produk/aussie")), false);
  assert.equal(isAnonymousPublicCacheRequest(request("/campaign")), false);
  assert.equal(isAnonymousPublicCacheRequest(request("/api/v1/products")), false);
  assert.equal(isAnonymousPublicCacheRequest(request("/admin")), false);
  assert.equal(isAnonymousPublicCacheRequest(request("/", { method: "POST" })), false);
});

test("bypasses credentials, previews, and attribution queries", () => {
  assert.equal(
    isAnonymousPublicCacheRequest(request("/", { headers: { cookie: "session=abc" } })),
    false,
  );
  assert.equal(
    isAnonymousPublicCacheRequest(request("/produk", { headers: { authorization: "Bearer abc" } })),
    false,
  );
  assert.equal(isAnonymousPublicCacheRequest(request("/?preview=1")), false);
  assert.equal(isAnonymousPublicCacheRequest(request("/?gclid=click-1")), false);
  assert.equal(isAnonymousPublicCacheRequest(request("/?utm_campaign=sale")), false);
  assert.equal(isAnonymousPublicCacheRequest(request("/?token=secret")), false);
});

test("marks sensitive and personalized request families no-store", () => {
  for (const path of [
    "/admin",
    "/admin/products",
    "/api",
    "/api/submit-order",
    "/payment",
    "/thanks",
    "/middle-form",
    "/embed/form",
    "/produk/aussie",
  ]) {
    assert.equal(isNeverCachePath(path), true, path);
    assert.equal(shouldForceNoStore(request(path)), true, path);
  }

  assert.equal(shouldForceNoStore(request("/?fbclid=click-1")), true);
  assert.equal(
    shouldForceNoStore(request("/produk", { headers: { cookie: "cart=1" } })),
    true,
  );
  assert.equal(shouldForceNoStore(request("/produk")), false);
});

test("builds deterministic tenant, host, path, and query-aware GET keys without raw query values", async () => {
  const first = await buildPublicStorefrontCacheKey(
    request("/produk?sort=price&page=2"),
    "tenant-a",
  );
  const reordered = await buildPublicStorefrontCacheKey(
    request("/produk?page=2&sort=price"),
    "tenant-a",
  );
  const otherQuery = await buildPublicStorefrontCacheKey(
    request("/produk?page=3&sort=price"),
    "tenant-a",
  );
  const otherTenant = await buildPublicStorefrontCacheKey(
    request("/produk?sort=price&page=2"),
    "tenant-b",
  );
  const otherHost = await buildPublicStorefrontCacheKey(
    new Request("https://other.example/produk?sort=price&page=2"),
    "tenant-a",
  );

  assert.equal(first.method, "GET");
  assert.equal(first.url, reordered.url);
  assert.notEqual(first.url, otherQuery.url);
  assert.notEqual(first.url, otherTenant.url);
  assert.notEqual(first.url, otherHost.url);
  assert.equal(first.url.includes("sort=price"), false);
  assert.equal(first.url.includes("page=2"), false);
});

test("stores only successful public HTML without private or cookie headers", () => {
  assert.equal(
    isCacheablePublicResponse(new Response("ok", {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    })),
    true,
  );
  assert.equal(
    isCacheablePublicResponse(new Response("missing", {
      status: 404,
      headers: { "content-type": "text/html" },
    })),
    false,
  );
  assert.equal(
    isCacheablePublicResponse(new Response("private", {
      headers: {
        "content-type": "text/html",
        "cache-control": "private, max-age=60",
      },
    })),
    false,
  );
  assert.equal(
    isCacheablePublicResponse(new Response("cookie", {
      headers: {
        "content-type": "text/html",
        "set-cookie": "session=abc",
      },
    })),
    false,
  );
  assert.equal(
    isCacheablePublicResponse(Response.json({ ok: true })),
    false,
  );
  assert.equal(PUBLIC_STOREFRONT_CACHE_TTL_SECONDS, 60);
});
