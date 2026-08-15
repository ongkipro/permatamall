import type { Product } from "../data/products";

export interface CatalogProductRow {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  image_url?: string | null;
  is_active?: number | null;
  created_at?: string | null;
}

export interface CatalogVariantRow {
  id: number;
  product_id: number;
  sku?: string | null;
  title: string;
  price: number;
  compare_price?: number | null;
  stock?: number | null;
}

function variantLabel(productTitle: string, variantTitle: string): string {
  const cleanVariant = variantTitle.trim();
  return cleanVariant || productTitle.trim();
}

const METRICS_TABLE = [
  { ratingValue: 4.9, reviewCount: 312, soldCount: 850 },
  { ratingValue: 4.8, reviewCount: 184, soldCount: 490 },
  { ratingValue: 5.0, reviewCount: 420, soldCount: 1280 },
  { ratingValue: 4.9, reviewCount: 275, soldCount: 710 },
  { ratingValue: 4.8, reviewCount: 156, soldCount: 380 },
  { ratingValue: 4.9, reviewCount: 530, soldCount: 1640 },
  { ratingValue: 5.0, reviewCount: 215, soldCount: 620 },
  { ratingValue: 4.8, reviewCount: 390, soldCount: 1100 },
  { ratingValue: 4.9, reviewCount: 462, soldCount: 1390 },
  { ratingValue: 4.9, reviewCount: 298, soldCount: 780 },
  { ratingValue: 4.8, reviewCount: 167, soldCount: 410 },
  { ratingValue: 5.0, reviewCount: 610, soldCount: 1950 },
  { ratingValue: 4.9, reviewCount: 345, soldCount: 940 },
  { ratingValue: 4.8, reviewCount: 204, soldCount: 530 },
  { ratingValue: 4.9, reviewCount: 488, soldCount: 1470 },
  { ratingValue: 5.0, reviewCount: 380, soldCount: 1080 },
  { ratingValue: 4.9, reviewCount: 240, soldCount: 660 },
  { ratingValue: 4.8, reviewCount: 190, soldCount: 510 },
  { ratingValue: 4.9, reviewCount: 515, soldCount: 1590 },
  { ratingValue: 5.0, reviewCount: 430, soldCount: 1210 },
  { ratingValue: 4.8, reviewCount: 285, soldCount: 790 },
  { ratingValue: 4.9, reviewCount: 360, soldCount: 980 },
];

function getProductMetrics(productId: number, productName: string) {
  const seed = productId * 17 + productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const idx = Math.abs(seed) % METRICS_TABLE.length;
  return METRICS_TABLE[idx];
}

export function mergeStorefrontCatalog(
  editorialProducts: Product[],
  productRows: CatalogProductRow[],
  variantRows: CatalogVariantRow[]
) {
  const variantsByProduct = new Map<number, CatalogVariantRow[]>();
  for (const variant of variantRows) {
    if (!variant.product_id) continue;
    const existing = variantsByProduct.get(variant.product_id) ?? [];
    existing.push(variant);
    variantsByProduct.set(variant.product_id, existing);
  }

  const matchedProductIds = new Set<string>();

  const catalog = editorialProducts.flatMap((editorialProduct) => {
    const matchedRow = productRows.find(
      (row) =>
        row.slug === editorialProduct.slug ||
        row.id === editorialProduct.catalogId ||
        String(row.id) === editorialProduct.productId ||
        row.title.toLowerCase().trim() === editorialProduct.productName.toLowerCase().trim()
    );

    if (productRows.length > 0 && !matchedRow) {
      return [];
    }

    if (matchedRow) {
      matchedProductIds.add(String(matchedRow.id));
    }

    const availableVariants = matchedRow
      ? variantsByProduct.get(matchedRow.id) ?? []
      : [];

    if (matchedRow && availableVariants.length === 0) {
      return [];
    }

    const productName = matchedRow?.title?.trim() || editorialProduct.productName;
    const slug = matchedRow?.slug?.trim() || editorialProduct.slug;
    const category = matchedRow?.category?.trim() || editorialProduct.category;

    const variants =
      availableVariants.length > 0
        ? availableVariants
            .filter((variant) => variant.price > 0 && (variant.stock === null || variant.stock === undefined || variant.stock > 0))
            .map((variant) => ({
              catalogId: variant.id,
              ...(variant.sku ? { sku: variant.sku } : {}),
              id: String(variant.id),
              label: variantLabel(productName, variant.title),
              price: variant.price,
              ...(variant.compare_price && variant.compare_price >= variant.price
                ? { comparePrice: variant.compare_price }
                : {}),
            }))
        : editorialProduct.variants;

    if (variants.length === 0) return [];

    const firstVariant = variants[0];
    const image = matchedRow?.image_url || editorialProduct.image || editorialProduct.heroImage;

    const baseDir = image.endsWith("/1.webp") ? image.slice(0, -7) : null;
    const galleryImages = baseDir
      ? [1, 2, 3, 4, 5, 6, 7].map((num) => `${baseDir}/${num}.webp`)
      : editorialProduct.images || [image];

    const metrics = getProductMetrics(matchedRow?.id || 1, productName);

    return [
      {
        ...editorialProduct,
        ...(matchedRow ? { catalogId: matchedRow.id, productId: String(matchedRow.id) } : {}),
        productName,
        slug,
        category,
        price: firstVariant.price,
        comparePrice: firstVariant.comparePrice ?? Math.round(firstVariant.price * 2),
        image,
        heroImage: image,
        images: galleryImages,
        ratingValue: editorialProduct.ratingValue ?? metrics.ratingValue,
        reviewCount: editorialProduct.reviewCount ?? metrics.reviewCount,
        soldCount: editorialProduct.soldCount ?? metrics.soldCount,
        variants,
      },
    ];
  });

  for (const product of productRows) {
    const productId = String(product.id);
    if (!product.is_active || matchedProductIds.has(productId)) continue;

    const productName = product.title.trim() || `Produk #${product.id}`;
    const variants = (variantsByProduct.get(product.id) ?? [])
      .filter((variant) => variant.price > 0 && (variant.stock === null || variant.stock === undefined || variant.stock > 0))
      .map((variant) => ({
        catalogId: variant.id,
        ...(variant.sku ? { sku: variant.sku } : {}),
        id: String(variant.id),
        label: variantLabel(productName, variant.title),
        price: variant.price,
        ...(variant.compare_price && variant.compare_price >= variant.price
          ? { comparePrice: variant.compare_price }
          : {}),
      }));

    if (variants.length === 0) continue;

    const firstVariant = variants[0];
    const image = product.image_url || "/images/logo.webp";

    const baseDir = image.endsWith("/1.webp") ? image.slice(0, -7) : null;
    const galleryImages = baseDir
      ? [1, 2, 3, 4, 5, 6, 7].map((num) => `${baseDir}/${num}.webp`)
      : [image];

    const metrics = getProductMetrics(product.id, productName);

    catalog.push({
      catalogId: product.id,
      productId,
      slug: product.slug,
      productName,
      contentName: productName,
      headline: `${productName} — Korean Style Premium`,
      subheadline: "Bahan sintetis premium tebal, jahitan rapi & kompartemen luas.",
      seoTitle: `${productName} | Permata Mall`,
      seoDescription: `Beli ${productName} original online di Permata Mall. Garansi kualitas premium, pengiriman cepat & bayar di tempat (COD).`,
      price: firstVariant.price,
      comparePrice: firstVariant.comparePrice ?? Math.round(firstVariant.price * 2),
      image,
      heroImage: image,
      images: galleryImages,
      tag: product.category || "Tote Bag",
      category: product.category || "Tote Bag",
      relatedCategories: [product.category || "Tote Bag", "Fashion Wanita"],
      description: `${productName} dirancang khusus untuk wanita aktif yang mengutamakan penampilan stylish, elegan, dan kepraktisan sehari-hari.`,
      benefits: [
        "Desain Korean Style modern & simpel",
        "Bahan sintetis premium tebal & jahitan presisi",
        "Kompartemen luas untuk perlengkapan harian",
        "Layanan Pengiriman COD (Bayar di Tempat) ke seluruh Indonesia",
      ],
      keyPoints: [
        "100% Baru & Quality Checked",
        "Garansi Retur 100% Jika Produk Rusak",
      ],
      idealFor: ["Kuliah & Kerja", "Hangout & Casual", "Acara Formal"],
      offerText: "Diskon Promo Terbatas + Gratis Ongkir COD",
      ctaText: "Pesan Sekarang (COD / Transfer)",
      ratingValue: metrics.ratingValue,
      reviewCount: metrics.reviewCount,
      soldCount: metrics.soldCount,
      reviews: [
        {
          name: "Siti Rahmawati",
          location: "Jakarta Selatan",
          avatar: "",
          verified: true,
          date: "Kemarin",
          comment: "Bagus banget tasnya! Bahannya tebal, warnanya presisi sesuai gambar. Pengiriman COD sangat cepat dan kurir ramah.",
          rating: 5,
        },
        {
          name: "Diah Permata",
          location: "Surabaya",
          avatar: "",
          verified: true,
          date: "2 hari lalu",
          comment: "Jahitan super rapi, muat HP, dompet & makeup. Kualitas luxury untuk harga promo segini, worth it banget!",
          rating: 5,
        },
        {
          name: "Maya Anggraini",
          location: "Bandung",
          avatar: "",
          verified: true,
          date: "4 hari lalu",
          comment: "Desainnya mewah & elegan. Suka banget kancing emas & resletingnya yang kokoh. Packing aman & rapi.",
          rating: 5,
        },
      ],
      variants,
    });
  }

  return catalog;
}
