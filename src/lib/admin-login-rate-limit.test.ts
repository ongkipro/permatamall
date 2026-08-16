import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync, type StatementSync } from "node:sqlite";
import test from "node:test";
import {
  clearAdminLoginAttempts,
  consumeAdminLoginAttempt,
} from "./admin-login-rate-limit.ts";

type QueryValue = null | number | string | Uint8Array;

type MockD1Result = {
  success: true;
  results: Record<string, unknown>[];
  meta: { changes: number };
};

class SqliteD1Statement {
  private readonly database: DatabaseSync;
  readonly sql: string;
  readonly values: QueryValue[];

  constructor(
    database: DatabaseSync,
    sql: string,
    values: QueryValue[] = [],
  ) {
    this.database = database;
    this.sql = sql;
    this.values = values;
  }

  bind(...values: QueryValue[]) {
    return new SqliteD1Statement(this.database, this.sql, values);
  }

  async run() {
    return this.execute();
  }

  execute(): MockD1Result {
    if (/^\s*SELECT\b|\bRETURNING\b/i.test(this.sql)) {
      return {
        success: true,
        results: this.prepare().all(...this.values) as Record<string, unknown>[],
        meta: { changes: 0 },
      };
    }

    const result = this.prepare().run(...this.values);
    return {
      success: true,
      results: [],
      meta: { changes: Number(result.changes) },
    };
  }

  private prepare(): StatementSync {
    return this.database.prepare(this.sql);
  }
}

class SqliteD1Database {
  private readonly database = new DatabaseSync(":memory:");

  constructor() {
    this.database.exec(
      readFileSync(
        new URL(
          "../db/migrations/0036_admin_login_attempts.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
  }

  prepare(sql: string) {
    return new SqliteD1Statement(this.database, sql);
  }

  async batch(statements: SqliteD1Statement[]) {
    this.database.exec("BEGIN");
    try {
      const results = statements.map((statement) => statement.execute());
      this.database.exec("COMMIT");
      return results;
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
}

function createDatabase() {
  return new SqliteD1Database() as unknown as D1Database;
}

const windowStart = new Date("2026-08-16T00:00:00.000Z");

test("atomically blocks the sixth attempt for an IP and username-IP pair", async () => {
  const database = createDatabase();
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const result = await consumeAdminLoginAttempt(
      database,
      "admin",
      "203.0.113.10",
      windowStart,
    );
    assert.equal(result.allowed, true, `attempt ${attempt}`);
    assert.equal(result.remaining, 5 - attempt);
  }

  const blocked = await consumeAdminLoginAttempt(
    database,
    "admin",
    "203.0.113.10",
    windowStart,
  );
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
  assert.equal(blocked.resetAt, Date.parse("2026-08-16T00:15:00.000Z"));
});

test("does not let one source lock the username for other source addresses", async () => {
  const database = createDatabase();
  for (let attempt = 0; attempt < 6; attempt += 1) {
    await consumeAdminLoginAttempt(database, "admin", "203.0.113.10", windowStart);
  }

  const otherSource = await consumeAdminLoginAttempt(
    database,
    "admin",
    "203.0.113.11",
    windowStart,
  );
  assert.equal(otherSource.allowed, true);
  assert.equal(otherSource.remaining, 4);
});

test("retains a per-IP ceiling across username guesses", async () => {
  const database = createDatabase();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const result = await consumeAdminLoginAttempt(
      database,
      `candidate-${attempt}`,
      "203.0.113.12",
      windowStart,
    );
    assert.equal(result.allowed, true);
  }

  const blocked = await consumeAdminLoginAttempt(
    database,
    "candidate-6",
    "203.0.113.12",
    windowStart,
  );
  assert.equal(blocked.allowed, false);
});

test("expired windows reset and a successful login can clear its counters", async () => {
  const database = createDatabase();
  let latest = await consumeAdminLoginAttempt(
    database,
    "admin",
    "203.0.113.13",
    windowStart,
  );
  for (let attempt = 0; attempt < 5; attempt += 1) {
    latest = await consumeAdminLoginAttempt(
      database,
      "admin",
      "203.0.113.13",
      windowStart,
    );
  }
  assert.equal(latest.allowed, false);

  const nextWindow = await consumeAdminLoginAttempt(
    database,
    "admin",
    "203.0.113.13",
    new Date("2026-08-16T00:15:00.001Z"),
  );
  assert.equal(nextWindow.allowed, true);
  assert.equal(nextWindow.remaining, 4);

  await clearAdminLoginAttempts(database, nextWindow.scopeKeys);
  const afterClear = await consumeAdminLoginAttempt(
    database,
    "admin",
    "203.0.113.13",
    new Date("2026-08-16T00:15:01.000Z"),
  );
  assert.equal(afterClear.allowed, true);
  assert.equal(afterClear.remaining, 4);
});
