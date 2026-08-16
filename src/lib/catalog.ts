import type { Product } from "../data/products.ts";
import { getRuntimeEnv } from "./env.ts";
import { mergeStorefrontCatalog } from "./catalog-data.ts";
import type {
  CatalogImageRow,
  CatalogProductRow,
  CatalogVariantRow,
} from "./catalog-data.ts";
import {
  loadPublishedProductContent,
  mergeRuntimeProductContent,
  parsePublishedContent,
} from "./storefront-content.ts";
import type { ProductContent } from "./storefront-content.ts";

async function loadCatalogRows(database: D1Database) {
  const [products, variants, images] = await database.batch([
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
    database.prepare(`
      SELECT product_id, url
      FROM product_images
      ORDER BY product_id ASC, sort_order ASC, id ASC
    `),
  ]);

  return {
    products: (products.results ?? []) as CatalogProductRow[],
    variants: (variants.results ?? []) as CatalogVariantRow[],
    images: (images.results ?? []) as CatalogImageRow[],
  };
}

async function loadLocalDevCatalogRows(key?: string) {
  // Local-only fallback: static Node imports cannot enter the Cloudflare Worker bundle.
  try {
    const { DatabaseSync } = await import("node:sqlite");
    const { globSync } = await import("fs");
    const files = globSync(".wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite");
    const dbPath = files.find((f) => !f.endsWith("-shm") && !f.endsWith("-wal") && !f.includes("metadata"));
    if (!dbPath) return { products: [], variants: [], images: [] };
    const db = new DatabaseSync(dbPath);

    if (key !== undefined) {
      const queryById = /^[1-9]\d*$/.test(key);
      const product = db.prepare(`
        SELECT id, title, slug, category, image_url, is_active, created_at
        FROM products
        WHERE ${queryById ? "id" : "slug"} = ? AND is_active = 1
        LIMIT 1
      `).get(key) as unknown as CatalogProductRow | undefined;
      if (!product) return { products: [], variants: [], images: [] };

      const variants = db.prepare(`
        SELECT id, product_id, sku, title, price, compare_price, stock
        FROM product_variants
        WHERE product_id = ?
        ORDER BY id ASC
      `).all(product.id) as unknown as CatalogVariantRow[];
      const images = db.prepare(`
        SELECT product_id, url
        FROM product_images
        WHERE product_id = ?
        ORDER BY sort_order ASC, id ASC
      `).all(product.id) as unknown as CatalogImageRow[];
      return { products: [product], variants, images };
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
    const images = db.prepare(`
      SELECT product_id, url
      FROM product_images
      ORDER BY product_id ASC, sort_order ASC, id ASC
    `).all() as unknown as CatalogImageRow[];
    return { products, variants, images };
  } catch {
    return { products: [], variants: [], images: [] };
  }
}

function mergeCatalogRows(
  rows: {
    products: CatalogProductRow[];
    variants: CatalogVariantRow[];
    images: CatalogImageRow[];
  },
  runtimeContent: Map<string, ProductContent>,
) {
  const presentations = mergeRuntimeProductContent(
    rows.products,
    runtimeContent,
  );
  return mergeStorefrontCatalog(
    presentations,
    rows.products,
    rows.variants,
    rows.images,
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
  const imageStatement = database
    .prepare(`
      SELECT product_id, url
      FROM product_images
      WHERE product_id = ?
      ORDER BY sort_order ASC, id ASC
    `)
    .bind(product.id);
  const contentStatement = database
    .prepare(`
      SELECT content_key, published_json
      FROM storefront_content
      WHERE content_key = ? AND content_type = 'product'
        AND published_json IS NOT NULL
      LIMIT 1
    `)
    .bind(`product:${product.id}`);

  let variants: CatalogVariantRow[];
  let images: CatalogImageRow[];
  const runtimeContent = new Map<string, ProductContent>();
  try {
    const [variantResult, imageResult, contentResult] = await database.batch([
      variantStatement,
      imageStatement,
      contentStatement,
    ]);
    variants = (variantResult.results ?? []) as CatalogVariantRow[];
    images = (imageResult.results ?? []) as CatalogImageRow[];

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
    images = [];
  }

  return {
    rows: {
      products: [product],
      variants,
      images,
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
