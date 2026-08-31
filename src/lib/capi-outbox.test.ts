import assert from "node:assert/strict";
import test from "node:test";
import { decideRetry } from "./capi-outbox.ts";

const MINUTE = 60_000;

test("a delivered event is settled and never retried", () => {
  assert.deepEqual(decideRetry({ success: true }, 0, 5), { status: "sent", delayMs: 0 });
});

test("transient failures back off exponentially instead of hammering Meta", () => {
  assert.deepEqual(decideRetry({ success: false }, 0, 5), { status: "pending", delayMs: 2 * MINUTE });
  assert.deepEqual(decideRetry({ success: false }, 1, 5), { status: "pending", delayMs: 4 * MINUTE });
  assert.deepEqual(decideRetry({ success: false }, 2, 5), { status: "pending", delayMs: 8 * MINUTE });
});

test("rate limits wait a flat window rather than doubling", () => {
  for (const code of [4, 17, 613]) {
    assert.deepEqual(decideRetry({ success: false, errorCode: code }, 1, 5), {
      status: "pending",
      delayMs: 15 * MINUTE,
    });
  }
});

test("a dead access token is terminal — retrying only burns quota", () => {
  assert.equal(decideRetry({ success: false, errorCode: 190 }, 0, 5).status, "failed");
});

test("events stop retrying once the attempt budget is spent", () => {
  assert.equal(decideRetry({ success: false }, 4, 5).status, "failed");
  assert.equal(decideRetry({ success: false }, 3, 5).status, "pending");
});

test("backoff is capped so a stale event cannot schedule itself years out", () => {
  assert.equal(decideRetry({ success: false }, 20, 50).delayMs, 60 * MINUTE);
});

/**
 * The stall this pair of assertions exists to prevent.
 *
 * `deliverCapiEvent` (inline, from `/api/meta-event`) and `drainCapiOutbox`
 * (a visitor's, or the hourly cron's) can work the same row at once. Both read
 * the same `attempts`, both decide "pending", and both apply `attempts + 1` —
 * so the row ends up `pending` at or past `max_attempts`. While the drain
 * filtered on `attempts < max_attempts`, that row was never selected again and
 * never settled either. It stopped, silently. All 169 stalled rows on the live
 * install were in exactly that state, the Purchase for a real order among them.
 */
test("a row already at its attempt budget is still drained, and settles instead of stalling", async () => {
  const seen: string[] = [];
  const row = {
    id: 1,
    event_id: "INV-10011",
    event_name: "Purchase",
    payload: JSON.stringify({
      eventName: "Purchase",
      eventId: "INV-10011",
      eventSourceUrl: "https://example.test/thanks",
      userData: {},
      customData: { orderNumber: "INV-10011" },
    }),
    attempts: 5,
    max_attempts: 5,
    created_at: "2026-08-29T07:43:27.234Z",
  };

  const database = {
    prepare(sql: string) {
      seen.push(sql);
      const statement = {
        bind: () => statement,
        async all() {
          return { results: sql.includes("SELECT id, event_id") ? [row] : [] };
        },
        async run() {
          return { meta: { changes: 1 } };
        },
      };
      return statement;
    },
  } as unknown as D1Database;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ events_received: 1 }), { status: 200 })) as typeof fetch;
  try {
    const { drainCapiOutbox } = await import("./capi-outbox.ts");
    await drainCapiOutbox(database, "111", "token");
  } finally {
    globalThis.fetch = originalFetch;
  }

  const select = seen.find((sql) => sql.includes("SELECT id, event_id"));
  assert.ok(select, "the drain must issue its select");
  assert.ok(
    !/attempts\s*<\s*max_attempts/.test(select),
    "the drain must not exclude a row that is already at its budget — that is what makes a stall permanent",
  );

  const update = seen.find((sql) => sql.includes("UPDATE capi_event_outbox"));
  assert.ok(update, "the drain must write the outcome back");
  assert.ok(
    /attempts \+ 1 >= max_attempts/.test(update),
    "the terminal check must be re-evaluated in SQL against the row's current attempts, not the value this call read",
  );
});

/**
 * `event_time` is when the conversion happened, not when we managed to deliver
 * it. The outbox exists to retry, so computing it at send time was guaranteed
 * to be wrong for exactly the events that needed the outbox most: the stalled
 * Purchase for INV-10011 would have been filed under the day its retry
 * succeeded, two days after the order was placed.
 */
test("a retried event reports when it happened, not when it was finally delivered", async () => {
  const createdAt = "2026-08-29T07:43:27.234Z";
  const enqueuedEventTime = Math.floor(new Date(createdAt).getTime() / 1000);
  let sentBody: any = null;

  const withPayload = (payload: Record<string, unknown>) => ({
    id: 1,
    event_id: "INV-10011",
    event_name: "Purchase",
    payload: JSON.stringify({
      eventName: "Purchase",
      eventId: "INV-10011",
      eventSourceUrl: "https://example.test/thanks",
      userData: {},
      customData: { orderNumber: "INV-10011" },
      ...payload,
    }),
    attempts: 1,
    max_attempts: 5,
    created_at: createdAt,
  });

  const makeDb = (row: unknown) =>
    ({
      prepare(sql: string) {
        const statement = {
          bind: () => statement,
          async all() {
            return { results: sql.includes("SELECT id, event_id") ? [row] : [] };
          },
          async run() {
            return { meta: { changes: 1 } };
          },
        };
        return statement;
      },
    }) as unknown as D1Database;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    sentBody = JSON.parse(String(init.body));
    return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
  }) as unknown as typeof fetch;
  try {
    const { drainCapiOutbox } = await import("./capi-outbox.ts");

    // Stored by a current enqueue.
    await drainCapiOutbox(makeDb(withPayload({ eventTime: enqueuedEventTime })), "111", "tok");
    assert.equal(sentBody.data[0].event_time, enqueuedEventTime);

    // Enqueued before `eventTime` was stored: fall back to the row's own
    // creation time, never to "now".
    sentBody = null;
    await drainCapiOutbox(makeDb(withPayload({})), "111", "tok");
    assert.equal(sentBody.data[0].event_time, enqueuedEventTime);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

/** A backlog of PageViews must never delay the revenue event behind it. */
test("Purchase drains ahead of top-of-funnel events", async () => {
  let select = "";
  const database = {
    prepare(sql: string) {
      if (sql.includes("SELECT id, event_id")) select = sql;
      const statement = {
        bind: () => statement,
        async all() {
          return { results: [] };
        },
        async run() {
          return { meta: { changes: 0 } };
        },
      };
      return statement;
    },
  } as unknown as D1Database;

  const { drainCapiOutbox } = await import("./capi-outbox.ts");
  await drainCapiOutbox(database, "111", "tok");

  const purchaseFirst = select.indexOf("'Purchase' THEN 0");
  const byId = select.indexOf("id ASC");
  assert.ok(purchaseFirst > -1, "the drain must order Purchase ahead of other events");
  assert.ok(byId > purchaseFirst, "within a class the order must stay id ASC, so nothing is starved");
});
