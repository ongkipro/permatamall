const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

type AttemptRow = {
  scope: string;
  attempts: number | string;
  expires_at: string;
};

export type AdminLoginRateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  scopeKeys: readonly [string, string];
};

function bytesToHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashScope(value: string) {
  return bytesToHex(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
  );
}

async function buildScopeKeys(username: string, clientIp: string) {
  const normalizedUsername = username || "invalid";
  const normalizedIp = clientIp || "unknown";
  const [ipHash, pairHash] = await Promise.all([
    hashScope(normalizedIp),
    hashScope(`${normalizedUsername}\u0000${normalizedIp}`),
  ]);
  return [`ip:${ipHash}`, `user-ip:${pairHash}`] as const;
}

export async function consumeAdminLoginAttempt(
  database: D1Database,
  username: string,
  clientIp: string,
  now = new Date(),
): Promise<AdminLoginRateLimitResult> {
  const scopeKeys = await buildScopeKeys(username, clientIp);
  const nowIso = now.toISOString();
  const expiresAtIso = new Date(
    now.getTime() + LOGIN_ATTEMPT_WINDOW_MS,
  ).toISOString();
  const results = await database.batch([
    database
      .prepare("DELETE FROM admin_login_attempts WHERE expires_at <= ?")
      .bind(nowIso),
    database
      .prepare(`
        INSERT INTO admin_login_attempts (scope, attempts, expires_at, updated_at)
        VALUES (?, 1, ?, ?), (?, 1, ?, ?)
        ON CONFLICT(scope) DO UPDATE SET
          attempts = admin_login_attempts.attempts + 1,
          updated_at = excluded.updated_at
        RETURNING scope, attempts, expires_at
      `)
      .bind(
        scopeKeys[0],
        expiresAtIso,
        nowIso,
        scopeKeys[1],
        expiresAtIso,
        nowIso,
      ),
  ]);
  const rows = (results[1]?.results ?? []) as AttemptRow[];
  if (rows.length !== scopeKeys.length) {
    throw new Error("Login rate limit did not return both counters");
  }

  const counters = rows.map((row) => ({
    attempts: Number(row.attempts),
    resetAt: Date.parse(row.expires_at),
  }));
  if (
    counters.some(
      (counter) =>
        !Number.isSafeInteger(counter.attempts) ||
        counter.attempts < 1 ||
        !Number.isFinite(counter.resetAt),
    )
  ) {
    throw new Error("Login rate limit returned invalid counters");
  }

  const blocked = counters.filter(
    (counter) => counter.attempts > LOGIN_ATTEMPT_LIMIT,
  );
  return {
    allowed: blocked.length === 0,
    remaining: Math.max(
      0,
      Math.min(
        ...counters.map(
          (counter) => LOGIN_ATTEMPT_LIMIT - counter.attempts,
        ),
      ),
    ),
    resetAt:
      blocked.length > 0
        ? Math.min(...blocked.map((counter) => counter.resetAt))
        : Math.max(...counters.map((counter) => counter.resetAt)),
    scopeKeys,
  };
}

export async function clearAdminLoginAttempts(
  database: D1Database,
  scopeKeys: readonly [string, string],
) {
  await database
    .prepare("DELETE FROM admin_login_attempts WHERE scope IN (?, ?)")
    .bind(...scopeKeys)
    .run();
}
