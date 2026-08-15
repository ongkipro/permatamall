import assert from "node:assert/strict";
import test from "node:test";
import { deleteCatalogProduct } from "./product-mutation.ts";
import {
  CANONICAL_SAMPLE_PRODUCT,
  getSampleProductMutationError,
  SAMPLE_PRODUCT_MUTATION_ERROR,
} from "./sample-product.ts";

type MockStatement = {
  sql: string;
  args: unknown[];
  bind: (...args: unknown[]) => MockStatement;
  first: () => Promise<unknown>;
};

function createDatabase(options: { exists: boolean; referenceCount: number }) {
  const batches: MockStatement[][] = [];
  const database = {
    prepare(sql: string) {
      const statement: MockStatement = {
        sql,
        args: [],
        bind(...args: unknown[]) {
          statement.args = args;
          return statement;
        },
        async first() {
          if (sql.includes("SELECT id FROM products")) {
            return options.exists ? { id: statement.args[0] } : null;
          }
          return null;
        },
      };
      return statement;
    },
    async batch(statements: MockStatement[]) {
      batches.push(statements);
      return statements.map((_, index) => ({
        success: true,
        results: [],
        meta: {
          changes:
            index === 1 && options.referenceCount === 0 ? 1 : 0,
        },
      }));
    },
  } as unknown as D1Database;
  return { database, batches };
}

test("canonical sample product keeps the approved identity and variants", () => {
  assert.deepEqual(
    {
      id: CANONICAL_SAMPLE_PRODUCT.id,
      slug: CANONICAL_SAMPLE_PRODUCT.slug,
      variants: CANONICAL_SAMPLE_PRODUCT.variants.map((variant) => ({
        title: variant.title,
        price: variant.price,
        weightGrams: variant.weightGrams,
      })),
    },
    {
      id: 10001,
      slug: "asahan-portable",
      variants: [
        { title: "Beli 1 Pcs", price: 79000, weightGrams: 300 },
        { title: "Beli 2 Pcs (Hemat)", price: 119000, weightGrams: 600 },
      ],
    },
  );
});

test("sample product mutation guard rejects the canonical ID only", () => {
  assert.equal(
    getSampleProductMutationError(CANONICAL_SAMPLE_PRODUCT.id),
    SAMPLE_PRODUCT_MUTATION_ERROR,
  );
  assert.equal(
    getSampleProductMutationError(String(CANONICAL_SAMPLE_PRODUCT.id)),
    SAMPLE_PRODUCT_MUTATION_ERROR,
  );
  assert.equal(getSampleProductMutationError(10002), null);
});

test("sample product deletion is protected without touching D1", async () => {
  let databaseTouched = false;
  const database = {
    prepare() {
      databaseTouched = true;
      throw new Error("D1 must not be called for the sample product");
    },
  } as unknown as D1Database;

  assert.deepEqual(
    await deleteCatalogProduct(database, CANONICAL_SAMPLE_PRODUCT.id),
    { status: "protected" },
  );
  assert.equal(databaseTouched, false);
});



test("product deletion rejects products referenced by orders", async () => {
  const { database, batches } = createDatabase({
    exists: true,
    referenceCount: 2,
  });

  assert.deepEqual(await deleteCatalogProduct(database, 10002), {
    status: "referenced",
  });
  assert.equal(batches.length, 1);
  assert.match(batches[0][0].sql, /NOT EXISTS/);
  assert.match(batches[0][1].sql, /NOT EXISTS/);
});

test("product deletion removes variants before an unreferenced product", async () => {
  const { database, batches } = createDatabase({
    exists: true,
    referenceCount: 0,
  });

  assert.deepEqual(await deleteCatalogProduct(database, 10002), {
    status: "deleted",
  });
  assert.equal(batches.length, 1);
  assert.match(batches[0][0].sql, /DELETE FROM product_variants/);
  assert.match(batches[0][1].sql, /DELETE FROM products/);
  assert.deepEqual(batches[0].map((statement) => statement.args), [
    [10002, 10002],
    [10002, 10002],
  ]);
});

test("product deletion reports a missing product without writes", async () => {
  const { database, batches } = createDatabase({
    exists: false,
    referenceCount: 0,
  });

  assert.deepEqual(await deleteCatalogProduct(database, 10002), {
    status: "not_found",
  });
  assert.equal(batches.length, 0);
});
