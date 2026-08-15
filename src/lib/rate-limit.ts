export function getClientIp(headers: Headers) {
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  return headers.get('x-real-ip') || 'unknown';
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * KV-backed fixed window.
 *
 * The previous implementation kept buckets in a module-level Map. On Workers
 * every isolate holds its own copy and isolates come and go constantly, so the
 * effective limit was multiplied by the number of live isolates and reset at
 * random — it looked like a control while enforcing close to nothing. KV is
 * shared across isolates, which is why admin login already uses it.
 *
 * KV is eventually consistent, so a burst spread across colos can still slip a
 * few requests through. That is acceptable spam damping; it is not a quota.
 */
export async function checkRateLimit(
  sessions: KVNamespace | undefined,
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  // Without KV there is nothing shared to count in; fail open rather than block
  // every order because a binding is missing.
  if (!sessions) return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };

  const windowStart = Math.floor(now / windowMs) * windowMs;
  const resetAt = windowStart + windowMs;
  const windowKey = `${key}:${windowStart}`;

  const count = Number(await sessions.get(windowKey)) || 0;
  if (count >= limit) return { allowed: false, remaining: 0, resetAt };

  await sessions.put(windowKey, String(count + 1), {
    expirationTtl: Math.max(60, Math.ceil((resetAt - now) / 1000) + 60),
  });
  return { allowed: true, remaining: Math.max(0, limit - count - 1), resetAt };
}

export function rateLimitHeaders(remaining: number, resetAt: number) {
  const retryAfterSec = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return {
    'x-ratelimit-remaining': String(remaining),
    'x-ratelimit-reset': String(Math.floor(resetAt / 1000)),
    'retry-after': String(retryAfterSec),
  };
}
