import { CLICK_ID_KEYS } from "./click-ids.ts";

/** Public catalog changes become visible at the edge within one minute. */
export const PUBLIC_STOREFRONT_CACHE_TTL_SECONDS = 60;

const CACHEABLE_PATHS: readonly string[] = ["/", "/produk", "/produk/"];
const PRIVATE_PATH_PREFIXES = ["/admin", "/api"] as const;
const SENSITIVE_PUBLIC_PATHS = [
  "/hello",
  "/payment",
  "/thanks",
  "/embed/form",
  "/form-full",
  "/form-hybrid",
  "/form-middle",
  "/full-form",
  "/hybrid-form",
  "/middle-form",
  "/geoipform",
] as const;
const SENSITIVE_QUERY_KEYS: readonly string[] = [
  "preview",
  "token",
  "access_token",
  "auth",
  "authorization",
  "code",
  "key",
  "secret",
  "signature",
  "session",
  ...CLICK_ID_KEYS,
];

function hasPathPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function hasCredentials(request: Request) {
  return (
    request.headers.has("authorization") ||
    request.headers.has("cookie") ||
    request.headers.has("cf-access-jwt-assertion")
  );
}

function hasSensitiveQuery(url: URL) {
  return [...url.searchParams.keys()].some((key) =>
    SENSITIVE_QUERY_KEYS.includes(key.toLowerCase()),
  );
}

function isCacheablePath(pathname: string) {
  const normalized = pathname.toLowerCase();
  if (CACHEABLE_PATHS.includes(normalized)) return true;
  if (/^\/produk\/[^/]+\/?$/.test(normalized)) return true;
  return /^\/[^/]+\/?$/.test(normalized) && !isNeverCachePath(normalized);
}

export function isNeverCachePath(pathname: string) {
  const normalized = pathname.toLowerCase();
  return (
    PRIVATE_PATH_PREFIXES.some((prefix) => hasPathPrefix(normalized, prefix)) ||
    SENSITIVE_PUBLIC_PATHS.some((path) => hasPathPrefix(normalized, path))
  );
}

export function isAnonymousPublicCacheRequest(request: Request) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (hasCredentials(request)) return false;

  const url = new URL(request.url);
  if (!isCacheablePath(url.pathname)) return false;

  return !hasSensitiveQuery(url);
}

export function shouldForceNoStore(request: Request) {
  const url = new URL(request.url);
  if (request.method !== "GET" && request.method !== "HEAD") return true;
  if (isNeverCachePath(url.pathname)) return true;
  if (hasSensitiveQuery(url)) return true;
  return isCacheablePath(url.pathname) && hasCredentials(request);
}


export function buildPublicStorefrontCacheKey(
  request: Request,
  tenantSlug: string,
) {
  const sourceUrl = new URL(request.url);
  const keyUrl = new URL(sourceUrl.origin);
  keyUrl.pathname = sourceUrl.pathname;
  keyUrl.searchParams.set("__cmsads_cache", "storefront-v1");
  keyUrl.searchParams.set("tenant", tenantSlug || sourceUrl.hostname);

  // No cacheable route currently varies its HTML by query. Sensitive or
  // stateful query keys bypass caching before this point; ignoring the rest
  // prevents arbitrary query noise from fragmenting the edge cache.
  return new Request(keyUrl, { method: "GET" });
}

export function isCacheablePublicResponse(response: Response) {
  if (response.status !== 200 || response.headers.has("set-cookie")) return false;

  const cacheControl = response.headers.get("cache-control")?.toLowerCase() ?? "";
  if (cacheControl.includes("no-store") || cacheControl.includes("private")) {
    return false;
  }

  if (response.headers.get("vary")?.trim() === "*") return false;

  return response.headers
    .get("content-type")
    ?.toLowerCase()
    .startsWith("text/html") ?? false;
}
