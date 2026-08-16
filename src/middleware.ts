import { defineMiddleware } from 'astro:middleware';
import {
  CLICK_ID_COOKIE,
  hasClickId,
  parseClickIdsFromUrl,
  serializeClickIds,
} from './lib/click-ids';
import {
  canAccessAdminRoute,
  getDefaultAdminRoute,
  getSessionCookie,
  verifyJwt,
  type AdminRole,
} from './lib/auth';
import { getEnvValue, getRuntimeEnv } from './lib/env';
import {
  buildEmbedFrameAncestors,
  resolveEmbedAllowedOrigins,
} from './lib/embed-security';
import {
  buildPublicStorefrontCacheKey,
  isAnonymousPublicCacheRequest,
  isCacheablePublicResponse,
  PUBLIC_STOREFRONT_CACHE_TTL_SECONDS,
  shouldForceNoStore,
} from './lib/public-storefront-cache';

const JSON_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function applySecurityHeaders(
  response: Response,
  isPrivate: boolean,
  frameAncestors?: string,
) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  if (frameAncestors) {
    response.headers.delete('X-Frame-Options');
    response.headers.set('Content-Security-Policy', frameAncestors);
  } else {
    response.headers.set('X-Frame-Options', 'DENY');
  }
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (isPrivate) response.headers.set('Cache-Control', 'no-store');
  return response;
}
type CloudflareCacheStorage = CacheStorage & { default?: Cache };

function getDefaultCache() {
  return (
    globalThis as typeof globalThis & {
      caches?: CloudflareCacheStorage;
    }
  ).caches?.default;
}

function cloneResponse(
  response: Response,
  headers: Headers,
  withoutBody = false,
) {
  return new Response(withoutBody ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function readStoredSession(
  value: string | null,
  username: string,
  role: AdminRole,
) {
  if (!value) {
    return {
      active: false,
      mustChangePassword: false,
      credentialUpdatedAt: "",
    };
  }
  try {
    const parsed = JSON.parse(value) as {
      username?: unknown;
      role?: unknown;
      must_change_password?: unknown;
      credential_updated_at?: unknown;
    };
    const active =
      parsed.username === username &&
      parsed.role === role &&
      typeof parsed.credential_updated_at === "string";
    return {
      active,
      mustChangePassword: active && parsed.must_change_password === true,
      credentialUpdatedAt: active
        ? (parsed.credential_updated_at as string)
        : "",
    };
  } catch {
    return {
      active: false,
      mustChangePassword: false,
      credentialUpdatedAt: "",
    };
  }
}
async function loadStoredEmbedAllowedOrigins(
  database: D1Database | undefined,
) {
  if (!database) return null;
  try {
    const row = await database
      .prepare(
        'SELECT embed_allowed_origins FROM stores ORDER BY id LIMIT 1',
      )
      .first<{ embed_allowed_origins: string | null }>();
    return row?.embed_allowed_origins ?? null;
  } catch {
    // A database failure must not silently restore a stale, broader allowlist.
    return "";
  }
}



export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const runtime = getRuntimeEnv(context.locals);
  const siteUrl = getEnvValue('PUBLIC_SITE_URL', runtime);
  if (siteUrl && url.hostname.startsWith('www.')) {
    try {
      const canonical = new URL(siteUrl);
      if (url.hostname.slice(4) === canonical.hostname) {
        const targetUrl = new URL(context.request.url);
        targetUrl.hostname = canonical.hostname;
        targetUrl.protocol = canonical.protocol;
        targetUrl.port = canonical.port;
        return applySecurityHeaders(
          context.redirect(targetUrl.toString(), 301),
          false,
        );
      }
    } catch {}
  }
  const isPublicCacheRequest = isAnonymousPublicCacheRequest(context.request);
  const edgeCache = isPublicCacheRequest ? getDefaultCache() : undefined;
  const publicCacheKey = edgeCache
    ? buildPublicStorefrontCacheKey(
        context.request,
        getEnvValue('PUBLIC_TENANT_SLUG', runtime) || url.hostname,
      )
    : undefined;
  if (edgeCache && publicCacheKey) {
    try {
      const cached = await edgeCache.match(publicCacheKey);
      if (cached) {
        const headers = new Headers(cached.headers);
        headers.set('Cache-Control', 'no-store');
        headers.set('Cache-Status', 'cmsads; hit');
        return applySecurityHeaders(
          cloneResponse(
            cached,
            headers,
            context.request.method === 'HEAD',
          ),
          false,
        );
      }
    } catch {
      // Cache availability must never make the public storefront unavailable.
    }
  }
  const isEmbedForm =
    url.pathname === '/embed/form' || url.pathname === '/embed/form/';
  const embedFrameAncestors = isEmbedForm
    ? buildEmbedFrameAncestors(
        resolveEmbedAllowedOrigins(
          await loadStoredEmbedAllowedOrigins(
            runtime?.OMS_DB as D1Database | undefined,
          ),
          getEnvValue('PUBLIC_EMBED_ALLOWED_ORIGINS', runtime),
        ).origins,
      )
    : undefined;
  const isLoginPage = url.pathname === '/hello';
  const isAdminPage = url.pathname.startsWith('/admin');
  const isAdminApi =
    url.pathname === '/api/admin' || url.pathname.startsWith('/api/admin/');
  const isPrivate = isAdminPage || isAdminApi;

  if (isAdminApi && UNSAFE_METHODS.has(context.request.method)) {
    const origin = context.request.headers.get('origin');
    const fetchSite = context.request.headers.get('sec-fetch-site');
    if ((origin && origin !== url.origin) || fetchSite === 'cross-site') {
      return applySecurityHeaders(new Response(JSON.stringify({ success: false, error: 'Forbidden request origin' }), {
        status: 403,
        headers: JSON_HEADERS,
      }), true);
    }
  }

  // Logout remains reachable for stale or revoked sessions so it can always
  // clear the browser cookie; the unsafe-method origin guard above still applies.
  if (url.pathname === '/api/admin/logout') {
    return applySecurityHeaders(await next(), true);
  }

  if (isPrivate) {
    const env = getRuntimeEnv(context.locals);
    const secret = getEnvValue('AUTH_SECRET', env);
    const sessions = env?.SESSION as KVNamespace | undefined;
    const database = env?.OMS_DB as D1Database | undefined;
    const token = getSessionCookie(context.request);
    const session = token ? await verifyJwt(token, secret) : null;
    let active = false;
    let mustChangePassword = false;
    if (session && sessions && database) {
      try {
        const stored = readStoredSession(
          await sessions.get(`admin-session:${session.jti}`),
          session.username,
          session.role,
        );
        if (stored.active) {
          const credential = await database.prepare(
            `SELECT updated_at, role
            FROM admin_credentials
            WHERE username = ?
            LIMIT 1`,
          ).bind(session.username).first<{
            updated_at: string;
            role: string;
          }>();
          active =
            credential?.updated_at === stored.credentialUpdatedAt &&
            credential.role === session.role;
          mustChangePassword = active && stored.mustChangePassword;
        }
      } catch {
        active = false;
      }
    }
    if (!session || !active) {
      if (isAdminApi) {
        return applySecurityHeaders(new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
          status: 401,
          headers: JSON_HEADERS,
        }), true);
      }
      return applySecurityHeaders(context.redirect('/hello'), true);
    }
    context.locals.admin = {
      username: session.username,
      role: session.role,
    };
    if (!canAccessAdminRoute(session.role, url.pathname)) {
      if (isAdminApi) {
        return applySecurityHeaders(
          new Response(
            JSON.stringify({
              success: false,
              error: "Permission denied.",
              code: "PERMISSION_DENIED",
            }),
            { status: 403, headers: JSON_HEADERS },
          ),
          true,
        );
      }
      return applySecurityHeaders(
        context.redirect(getDefaultAdminRoute(session.role)),
        true,
      );
    }
    if (url.pathname === "/admin") {
      return applySecurityHeaders(
        context.redirect(getDefaultAdminRoute(session.role)),
        true,
      );
    }
    if (mustChangePassword) {
      const mayChangePassword = url.pathname === '/admin/profile'
        || url.pathname === '/api/admin/profile'
        || url.pathname === '/api/admin/logout';
      if (!mayChangePassword) {
        if (isAdminApi) {
          return applySecurityHeaders(new Response(JSON.stringify({
            success: false,
            error: 'Ganti password default sebelum melanjutkan.',
            code: 'PASSWORD_CHANGE_REQUIRED',
          }), { status: 403, headers: JSON_HEADERS }), true);
        }
        return applySecurityHeaders(context.redirect('/admin/profile'), true);
      }
    }
  }

  const response = applySecurityHeaders(
    await next(),
    isPrivate || isLoginPage || isEmbedForm,
    embedFrameAncestors,
  );

  // Persist ad attribution click ids (Google, Meta, TikTok, UTMs) from landing/embed URL.
  if (!isPrivate) {
    const clickIds = parseClickIdsFromUrl(url);
    if (hasClickId(clickIds)) {
      const sameSiteAttr = url.protocol === 'https:' ? ' SameSite=None; Secure;' : ' SameSite=Lax;';
      response.headers.append(
        'Set-Cookie',
        `${CLICK_ID_COOKIE}=${encodeURIComponent(serializeClickIds(clickIds))};` +
          ` Path=/; Max-Age=${90 * 24 * 60 * 60};${sameSiteAttr}`,
      );
      if (clickIds._fbp) {
        response.headers.append(
          'Set-Cookie',
          `_fbp=${encodeURIComponent(clickIds._fbp)}; Path=/; Max-Age=${90 * 24 * 60 * 60};${sameSiteAttr}`,
        );
      }
      if (clickIds._fbc) {
        response.headers.append(
          'Set-Cookie',
          `_fbc=${encodeURIComponent(clickIds._fbc)}; Path=/; Max-Age=${90 * 24 * 60 * 60};${sameSiteAttr}`,
        );
      }
    }
  }
  if (shouldForceNoStore(context.request)) {
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Cache-Status', 'cmsads; fwd=request');
    return response;
  }

  if (!isPublicCacheRequest) return response;

  if (!isCacheablePublicResponse(response)) {
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Cache-Status', 'cmsads; fwd=request');
    return response;
  }

  if (!edgeCache || !publicCacheKey || context.request.method === 'HEAD') {
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Cache-Status', 'cmsads; fwd=uri-miss');
    return response;
  }

  const cachedHeaders = new Headers(response.headers);
  cachedHeaders.set(
    'Cache-Control',
    `public, max-age=${PUBLIC_STOREFRONT_CACHE_TTL_SECONDS}, s-maxage=${PUBLIC_STOREFRONT_CACHE_TTL_SECONDS}`,
  );
  cachedHeaders.delete('Cache-Status');
  const cachedResponse = cloneResponse(response.clone(), cachedHeaders);
  const cacheWrite = edgeCache.put(publicCacheKey, cachedResponse).catch(
    (error: unknown) => {
      console.error('public-storefront-cache-write', error);
    },
  );
  if (context.locals.cfContext) {
    context.locals.cfContext.waitUntil(cacheWrite);
  } else {
    await cacheWrite;
  }

  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Cache-Status', 'cmsads; fwd=uri-miss');


  return response;
});
