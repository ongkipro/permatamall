export const CANONICAL_SAMPLE_PRODUCT = {
  id: 10001,
  slug: "asahan-portable",
  title: "Asahan Portable Sample",
  category: "Peralatan Dapur",
  imageUrl: "/images/produk/asahan-portable.webp",
  variants: [
    {
      id: 20001,
      sku: "ASH-PORTABLE-1",
      title: "Beli 1 Pcs",
      price: 79000,
      comparePrice: 149000,
      weightGrams: 300,
      stock: 350,
    },
    {
      id: 20002,
      sku: "ASH-PORTABLE-2",
      title: "Beli 2 Pcs (Hemat)",
      price: 119000,
      comparePrice: 229000,
      weightGrams: 600,
      stock: 180,
    },
  ],
} as const;

export const SAMPLE_PRODUCT_MUTATION_ERROR =
  "Produk contoh tidak dapat diubah atau dihapus. Unggah produk lain untuk penggunaan sebenarnya.";

export function isCanonicalSampleProductId(value: unknown) {
  if (typeof value !== "number" && typeof value !== "string") return false;
  const productId = Number(value);
  return Number.isInteger(productId) && productId === CANONICAL_SAMPLE_PRODUCT.id;
}

export function getSampleProductMutationError(productId: unknown) {
  return isCanonicalSampleProductId(productId)
    ? SAMPLE_PRODUCT_MUTATION_ERROR
    : null;
}
