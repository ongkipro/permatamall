import { editorialProducts, type Product } from "../data/products";
import { getRuntimeEnv } from "./env";
import {
  mergeStorefrontCatalog,
  type CatalogProductRow,
  type CatalogVariantRow,
} from "./catalog-data";
import {
  loadPublishedProductContent,
  mergeRuntimeProductContent,
} from "./storefront-content";
import { CANONICAL_SAMPLE_PRODUCT } from "./sample-product";

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

async function loadLocalDevCatalogRows() {
  try {
    const { DatabaseSync } = await import("node:sqlite");
    const { globSync } = await import("fs");
    const files = globSync(".wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite");
    const dbPath = files.find((f) => !f.endsWith("-shm") && !f.endsWith("-wal") && !f.includes("metadata"));
    if (!dbPath) return { products: [], variants: [] };
    const db = new DatabaseSync(dbPath);
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
    return mergeStorefrontCatalog(presentations, rows.products, rows.variants);
  } catch (error) {
    console.error("storefront-catalog-load", error);
    return [];
  }
}

export async function getStorefrontProduct(locals: App.Locals, key: string) {
  const products = await getStorefrontProducts(locals);

  return products.find(
    (product) =>
      product.slug === key ||
      product.productId === key ||
      String(product.catalogId) === key,
  );
}
