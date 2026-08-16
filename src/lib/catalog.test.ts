import assert from "node:assert/strict";
import test from "node:test";
import { getStorefrontProduct } from "./catalog.ts";

type QueryValue = null | number | string | Uint8Array;

class MockStatement {
  readonly database: MockD1Database;
  readonly sql: string;
  readonly values: QueryValue[];

  constructor(
    database: MockD1Database,
    sql: string,
    values: QueryValue[] = [],
  ) {
    this.database = database;
    this.sql = sql;
    this.values = values;
  }

  bind(...values: QueryValue[]) {
    return new MockStatement(this.database, this.sql, values);
  }

  async first<T>() {
    this.database.firstStatements.push(this);
    return this.database.product as T | null;
  }

  async all<T>() {
    this.database.allStatements.push(this);
    return { results: this.database.variants as T[] };
  }
}

class MockD1Database {
  readonly product = {
    id: 90901,
    title: "Tas Terpilih",
    slug: "tas-terpilih",
    category: "Tas",
    image_url: "/products/tas-terpilih.webp",
    is_active: 1,
    created_at: "2026-08-16T00:00:00.000Z",
  };
  readonly variants = [
    {
      id: 91901,
      product_id: this.product.id,
      sku: "TAS-SELECTED",
      title: "Hitam",
      price: 125_000,
      compare_price: 175_000,
      stock: 8,
    },
  ];
  readonly firstStatements: MockStatement[] = [];
  readonly allStatements: MockStatement[] = [];
  readonly batches: MockStatement[][] = [];

  prepare(sql: string) {
    return new MockStatement(this, sql);
  }

  async batch(statements: MockStatement[]) {
    this.batches.push(statements);
    return statements.map((statement) => ({
      results: /FROM\s+product_variants/i.test(statement.sql)
        ? this.variants
        : [],
    }));
  }
}

function compactSql(sql: string) {
  return sql.replace(/\s+/g, " ").trim();
}

test("getStorefrontProduct scopes the product, variant, and content reads", async () => {
  const database = new MockD1Database();
  const locals = {
    runtimeEnv: { OMS_DB: database as unknown as D1Database },
  } as unknown as App.Locals;

  const product = await getStorefrontProduct(locals, "tas-terpilih");

  assert.equal(product?.productId, String(database.product.id));
  assert.equal(product?.slug, database.product.slug);
  assert.deepEqual(product?.variants.map((variant) => variant.id), ["91901"]);

  assert.equal(database.firstStatements.length, 1);
  assert.match(
    compactSql(database.firstStatements[0]!.sql),
    /FROM products WHERE slug = \? AND is_active = 1 LIMIT 1/,
  );
  assert.deepEqual(database.firstStatements[0]!.values, ["tas-terpilih"]);

  assert.equal(database.batches.length, 1);
  assert.equal(database.batches[0]!.length, 2);
  const variantStatement = database.batches[0]![0]!;
  const contentStatement = database.batches[0]![1]!;
  assert.match(compactSql(variantStatement.sql), /WHERE product_id = \?/);
  assert.deepEqual(variantStatement.values, [database.product.id]);
  assert.match(
    compactSql(contentStatement.sql),
    /WHERE content_key = 'product:' \|\| \?/,
  );
  assert.deepEqual(contentStatement.values, [database.product.id]);
  assert.equal(database.allStatements.length, 0);
});

test("getStorefrontProduct keeps canonical numeric product-id callers scoped", async () => {
  const database = new MockD1Database();
  const locals = {
    runtimeEnv: { OMS_DB: database as unknown as D1Database },
  } as unknown as App.Locals;

  const product = await getStorefrontProduct(
    locals,
    String(database.product.id),
  );

  assert.equal(product?.slug, database.product.slug);
  assert.match(
    compactSql(database.firstStatements[0]!.sql),
    /FROM products WHERE id = \? AND is_active = 1 LIMIT 1/,
  );
  assert.deepEqual(database.firstStatements[0]!.values, [
    String(database.product.id),
  ]);
});
