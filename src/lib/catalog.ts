import { editorialProducts, type Product } from "../data/products.ts";
import { getRuntimeEnv } from "./env.ts";
import {
  mergeStorefrontCatalog,
  type CatalogProductRow,
  type CatalogVariantRow,
} from "./catalog-data.ts";
import {
  loadPublishedProductContent,
  mergeRuntimeProductContent,
  parsePublishedContent,
  type ProductContent,
} from "./storefront-content.ts";
import { CANONICAL_SAMPLE_PRODUCT } from "./sample-product.ts";

async function loadCatalogRows(database: D1Database) {
  const [products, variants] = await database.batch([
    database.prepare(`
      SELECT id, title, slug, category, image_url, is_active, created_at
      FROM products
      ORDER BY created_at DESC, id DESC
    `),
    database.prepare(`
      SELECT id, product_id, sku, title, price, compare_price, stock
      FROM product_variants
      ORDER BY product_id ASC, id ASC
    `),
  ]);

  return {
    products: (products.results ?? []) as CatalogProductRow[],
    variants: (variants.results ?? []) as CatalogVariantRow[],
  };
}

async function loadLocalDevCatalogRows(key?: string) {
  try {
    const { DatabaseSync } = await import("node:sqlite");
    const { globSync } = await import("fs");
    const files = globSync(".wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite");
    const dbPath = files.find((f) => !f.endsWith("-shm") && !f.endsWith("-wal") && !f.includes("metadata"));
    if (!dbPath) return { products: [], variants: [] };
    const db = new DatabaseSync(dbPath);

    if (key !== undefined) {
      const queryById = /^[1-9]\d*$/.test(key);
      const product = db.prepare(`
        SELECT id, title, slug, category, image_url, is_active, created_at
        FROM products
        WHERE ${queryById ? "id" : "slug"} = ? AND is_active = 1
        LIMIT 1
      `).get(key) as unknown as CatalogProductRow | undefined;
      if (!product) return { products: [], variants: [] };

      const variants = db.prepare(`
        SELECT id, product_id, sku, title, price, compare_price, stock
        FROM product_variants
        WHERE product_id = ?
        ORDER BY id ASC
      `).all(product.id) as unknown as CatalogVariantRow[];
      return { products: [product], variants };
    }

    const products = db.prepare(`
      SELECT id, title, slug, category, image_url, is_active, created_at
      FROM products
      ORDER BY created_at DESC, id DESC
    `).all() as unknown as CatalogProductRow[];
    const variants = db.prepare(`
      SELECT id, product_id, sku, title, price, compare_price, stock
      FROM product_variants
      ORDER BY product_id ASC, id ASC
    `).all() as unknown as CatalogVariantRow[];
    return { products, variants };
  } catch {
    return { products: [], variants: [] };
  }
}

function mergeCatalogRows(
  rows: {
    products: CatalogProductRow[];
    variants: CatalogVariantRow[];
  },
  runtimeContent: Map<string, ProductContent>,
): Product[] {
  const presentations = mergeRuntimeProductContent(
    rows.products,
    runtimeContent,
  );
  const samplePresentation = editorialProducts.find(
    (product) =>
      product.productId === String(CANONICAL_SAMPLE_PRODUCT.id),
  );
  if (
    samplePresentation &&
    rows.products.some(
      (product) => product.id === CANONICAL_SAMPLE_PRODUCT.id,
    ) &&
    !presentations.some(
      (product) => product.productId === samplePresentation.productId,
    )
  ) {
    presentations.push(samplePresentation);
  }

  return mergeStorefrontCatalog(
    presentations,
    rows.products,
    rows.variants,
  );
}

async function loadCatalogProductRows(database: D1Database, key: string) {
  const queryById = /^[1-9]\d*$/.test(key);
  const product = await database
    .prepare(`
      SELECT id, title, slug, category, image_url, is_active, created_at
      FROM products
      WHERE ${queryById ? "id" : "slug"} = ? AND is_active = 1
      LIMIT 1
    `)
    .bind(key)
    .first<CatalogProductRow>();
  if (!product) return null;

  const variantStatement = database
    .prepare(`
      SELECT id, product_id, sku, title, price, compare_price, stock
      FROM product_variants
      WHERE product_id = ?
      ORDER BY id ASC
    `)
    .bind(product.id);
  const contentStatement = database
    .prepare(`
      SELECT content_key, published_json
      FROM storefront_content
      WHERE content_key = 'product:' || ?
        AND content_type = 'product'
        AND published_json IS NOT NULL
      LIMIT 1
    `)
    .bind(product.id);

  let variants: CatalogVariantRow[];
  const runtimeContent = new Map<string, ProductContent>();
  try {
    const [variantResult, contentResult] = await database.batch([
      variantStatement,
      contentStatement,
    ]);
    variants = (variantResult.results ?? []) as CatalogVariantRow[];

    const contentRow = (contentResult.results ?? [])[0] as
      | { content_key: string; published_json: string }
      | undefined;
    if (contentRow) {
      const content = parsePublishedContent(
        contentRow.content_key,
        contentRow.published_json,
      ) as ProductContent | null;
      if (content) runtimeContent.set(String(product.id), content);
    }
  } catch (error) {
    console.error("storefront-product-content-load", error);
    const variantResult = await variantStatement.all<CatalogVariantRow>();
    variants = variantResult.results ?? [];
  }

  return {
    rows: {
      products: [product],
      variants,
    },
    runtimeContent,
  };
}

export async function getStorefrontProducts(
  locals?: App.Locals,
): Promise<Product[]> {
  const database = getRuntimeEnv(locals)?.OMS_DB as D1Database | undefined;

  try {
    const rows = database && typeof database === "object"
      ? await loadCatalogRows(database)
      : await loadLocalDevCatalogRows();

    const runtimeContent = database && typeof database === "object"
      ? await loadPublishedProductContent(database)
      : new Map();

    return mergeCatalogRows(rows, runtimeContent);
  } catch (error) {
    console.error("storefront-catalog-load", error);
    return [];
  }
}

export async function getStorefrontProduct(locals: App.Locals, key: string) {
  const normalizedKey = key.trim();
  if (!normalizedKey) return undefined;

  const database = getRuntimeEnv(locals)?.OMS_DB as D1Database | undefined;

  try {
    if (database && typeof database === "object") {
      const loaded = await loadCatalogProductRows(database, normalizedKey);
      return loaded
        ? mergeCatalogRows(loaded.rows, loaded.runtimeContent)[0]
        : undefined;
    }

    const rows = await loadLocalDevCatalogRows(normalizedKey);
    return mergeCatalogRows(rows, new Map())[0];
  } catch (error) {
    console.error("storefront-product-load", error);
    return undefined;
  }
}
