import { sendMetaCapiEvent, type MetaCustomData, type MetaUserData } from "./meta-capi.ts";

/**
 * Transactional outbox for Meta CAPI.
 *
 * A conversion event is recorded in D1 *before* it is transmitted, so a network
 * blip, a Meta 429, or an expired token cannot silently discard revenue signal.
 * Failed events retry with exponential backoff, drained opportunistically by
 * later storefront traffic — no cron trigger or queue binding required, which
 * matters because the Astro Cloudflare adapter owns the Worker entrypoint.
 */

export type OutboxEvent = {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  userData: MetaUserData;
  customData: MetaCustomData;
};

type OutboxRow = {
  id: number;
  event_id: string;
  event_name: string;
  payload: string;
  attempts: number;
  max_attempts: number;
};

/** Meta error codes: 4/17/613 are rate limits, 190 means the token is dead. */
const RATE_LIMIT_CODES = new Set([4, 17, 613]);
const INVALID_TOKEN_CODE = 190;
const MAX_DRAIN_BATCH = 10;

export type RetryDecision = {
  status: "sent" | "pending" | "failed";
  delayMs: number;
};

/**
 * Pure so the backoff ladder is testable without a database or a live Meta.
 * Rate limits wait a flat 15 minutes; everything else doubles from two minutes
 * and caps at an hour. A dead token is terminal — retrying only burns quota.
 */
export function decideRetry(
  outcome: { success: boolean; errorCode?: number },
  attempts: number,
  maxAttempts: number,
): RetryDecision {
  if (outcome.success) return { status: "sent", delayMs: 0 };

  const nextAttempt = attempts + 1;
  if (outcome.errorCode === INVALID_TOKEN_CODE || nextAttempt >= maxAttempts) {
    return { status: "failed", delayMs: 0 };
  }
  const delayMs = RATE_LIMIT_CODES.has(outcome.errorCode ?? -1)
    ? 15 * 60_000
    : Math.min(2 ** nextAttempt, 60) * 60_000;
  return { status: "pending", delayMs };
}

function readErrorCode(response: unknown): number | undefined {
  const error = (response as { error?: { code?: unknown } } | null)?.error;
  return typeof error?.code === "number" ? error.code : undefined;
}

/**
 * Records the event as pending. Returns false when the same event name and ID
 * are already known, so replayed browser/server copies collapse without
 * allowing another event type to reserve a future Purchase ID.
 */
export async function enqueueCapiEvent(
  database: D1Database,
  event: OutboxEvent,
): Promise<boolean> {
  const now = new Date().toISOString();
  const result = await database
    .prepare(
      `INSERT OR IGNORE INTO capi_event_outbox
         (event_id, event_name, payload, status, next_retry_at, created_at, updated_at)
       VALUES (?, ?, ?, 'pending', ?, ?, ?)`,
    )
    .bind(event.eventId, event.eventName, JSON.stringify(event), now, now, now)
    .run();
  return Boolean(result.meta?.changes);
}

async function transmit(
  database: D1Database,
  row: OutboxRow,
  pixelId: string,
  accessToken: string,
) {
  let event: OutboxEvent;
  try {
    event = JSON.parse(row.payload) as OutboxEvent;
  } catch {
    // Unparseable payloads can never succeed; retrying them is pure waste.
    await database
      .prepare(
        `UPDATE capi_event_outbox
         SET status = 'failed', last_error = 'payload tidak dapat dibaca', updated_at = ?
         WHERE id = ?`,
      )
      .bind(new Date().toISOString(), row.id)
      .run();
    return false;
  }

  const result = await sendMetaCapiEvent(
    event.eventName,
    event.eventId,
    event.eventSourceUrl,
    event.userData,
    event.customData,
    pixelId,
    accessToken,
  );

  const decision = decideRetry(
    { success: result.success, errorCode: readErrorCode(result.response) },
    row.attempts,
    row.max_attempts,
  );
  const now = Date.now();

  await database
    .prepare(
      `UPDATE capi_event_outbox
       SET status = ?, attempts = attempts + ?, last_error = ?, next_retry_at = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      decision.status,
      decision.status === "sent" ? 0 : 1,
      decision.status === "sent" ? null : (result.reason ?? "unknown"),
      new Date(now + decision.delayMs).toISOString(),
      new Date(now).toISOString(),
      row.id,
    )
    .run();

  return decision.status === "sent";
}

/** Sends one already-enqueued event immediately. */
export async function deliverCapiEvent(
  database: D1Database,
  eventId: string,
  eventName: string,
  pixelId: string,
  accessToken: string,
) {
  const row = await database
    .prepare(
      `SELECT id, event_id, event_name, payload, attempts, max_attempts
       FROM capi_event_outbox
       WHERE event_id = ? AND event_name = ? AND status = 'pending'
       LIMIT 1`,
    )
    .bind(eventId, eventName)
    .first<OutboxRow>();
  if (!row) return false;
  return transmit(database, row, pixelId, accessToken);
}

/**
 * Retries events whose backoff has elapsed. Bounded per call so a burst of
 * failures cannot turn one storefront request into a long-running drain.
 */
export async function drainCapiOutbox(
  database: D1Database,
  pixelId: string,
  accessToken: string,
  maxBatch = MAX_DRAIN_BATCH,
): Promise<number> {
  const due = await database
    .prepare(
      `SELECT id, event_id, event_name, payload, attempts, max_attempts
       FROM capi_event_outbox
       WHERE status = 'pending' AND next_retry_at <= ? AND attempts < max_attempts
       ORDER BY id ASC LIMIT ?`,
    )
    .bind(
      new Date().toISOString(),
      Math.max(1, Math.min(MAX_DRAIN_BATCH, Math.floor(maxBatch))),
    )
    .all<OutboxRow>();

  let sent = 0;
  for (const row of due.results ?? []) {
    if (await transmit(database, row, pixelId, accessToken)) sent += 1;
  }
  return sent;
}
