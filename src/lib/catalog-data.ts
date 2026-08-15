import type { Product } from "../data/products";

export type CatalogProductRow = {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  image_url: string | null;
  is_active: number | boolean | null;
};

export type CatalogVariantRow = {
  id: number;
  product_id: number;
  sku?: string;
  title: string;
  price: number;
  compare_price: number | null;
  stock: number | null;
};

export function formatVariantTitle(productName: string, rawTitle: string) {
  if (!rawTitle) return "Standard";
  let title = rawTitle.trim();

  if (title.includes(" - ")) {
    const parts = title.split(/\s*-\s*/);
    const firstPart = parts[0].toLowerCase();
    const prodLower = productName.toLowerCase();
    if (
      prodLower.includes(firstPart) ||
      firstPart.split(" ").some((w) => w.length > 3 && prodLower.includes(w))
    ) {
      title = parts.slice(1).join(" - ");
    }
  }

  title = title
    .replace(/\s*-\s*\d+([\.,]\d+)?\s*(rb|ribu|k)?\b.*/gi, "")
    .replace(/\s*rp\.?\s*[\d.]+/gi, "")
    .replace(/\s*\d+\s*(rb|ribu)\b/gi, "")
    .replace(/\s*gratis\s+ongkir/gi, "");

  title = title
    .replace(/\bbeli\s+(\d+)\s+dapat\s+(\d+)\s*(pcs)?\b/gi, "Beli $1 Dpt $2")
    .replace(/\bbeli\s+(\d+)\s+dpt\s+(\d+)\s*(pcs)?\b/gi, "Beli $1 Dpt $2")
    .replace(/\bbeli\s+(\d+)\s+pcs\b/gi, "Beli $1 Pcs")
    .replace(/\bbeli\s+(\d+)\s+botol\b/gi, "Beli $1 Botol")
    .replace(/\bbeli\s+(\d+)\s+set\b/gi, "Beli $1 Set")
    .replace(/\bbeli\s+(\d+)\s+pohon\b/gi, "Beli $1 Pohon")
    .replace(/\b1\s+botol\s+stamina\s+pria\s+pinang\s+(\d+)\s+butir\b/gi, "1 Botol ($1 Butir)")
    .replace(/\b2\s+botol\s+stamina\s+pria\s+pinang\s+(\d+)\s+butir\b/gi, "2 Botol ($1 Butir)")
    .replace(/\bpromo\s+(\d+)\s+kantong\b/gi, "$1 Kantong")
    .replace(/\bpromo\s+hemat\s+(\d+)\s+kantong\b/gi, "$1 Kantong")
    .replace(/\bterlaris\s+(\d+)\s+kantong\b/gi, "$1 Kantong")
    .replace(/\bcoba\s+(\d+)\s+botol\s+isi\s+(\d+)\b/gi, "1 Botol ($2 Butir)")
    .replace(/\bterlaris\s+(\d+)\s+botol\s+isi\s+(\d+)\b/gi, "2 Botol ($2 Butir)")
    .replace(/\bcoba\s+(\d+)\s+kantong\s+isi\s+(\d+)\b/gi, "1 Kantong ($2 Celup)")
    .replace(/\blebih\s+hemat\s+isi\s+(\d+)\s+celup\b/gi, "1 Kantong ($1 Celup)")
    .replace(/\bterlaris\s+(\d+)\s+kantong\s+(\d+)\s+celup\b/gi, "2 Kantong ($2 Celup)")
    .replace(/\bpaling\s+(laris|hemat)!\s*/gi, "")
    .replace(/\b(\d+)\s*ribu\s*\((\d+)\s*pcs\)/gi, "Beli $2 Pcs")
    .replace(/\blogo\s+brand\s+dapat\s+(\d+)\s*pcs/gi, "Logo ($1 Pcs)")
    .replace(/\bpolos\s+dapat\s+(\d+)\s*pcs/gi, "Polos ($1 Pcs)");

  title = title
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (!word) return "";
      if (word.startsWith("(") && word.endsWith(")")) {
        const inner = word.slice(1, -1);
        return "(" + inner.charAt(0).toUpperCase() + inner.slice(1).toLowerCase() + ")";
      }
      if (/^\d+[a-z]+$/i.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  if (/^\(\d+\s*Pcs\)$/i.test(title)) {
    const num = title.match(/\d+/)?.[0] ?? "1";
    title = `Beli ${num} Pcs`;
  }

  return title.trim().slice(0, 40) || "Standard";
}

function variantLabel(productName: string, variantTitle: string) {
  return formatVariantTitle(productName, variantTitle);
}

export function mergeStorefrontCatalog(
  editorialProducts: Product[],
  productRows: CatalogProductRow[],
  variantRows: CatalogVariantRow[],
) {
  const productsById = new Map(
    productRows.map((product) => [String(product.id), product]),
  );
  const variantsByProduct = new Map<number, CatalogVariantRow[]>();

  for (const variant of variantRows) {
    const variants = variantsByProduct.get(variant.product_id) ?? [];
    variants.push(variant);
    variantsByProduct.set(variant.product_id, variants);
  }

  const matchedProductIds = new Set<string>();

  const catalog = editorialProducts.flatMap((editorialProduct) => {
    const product = productsById.get(editorialProduct.productId);
    if (!product) return [];
    if (!product.is_active) return [];

    matchedProductIds.add(editorialProduct.productId);

    const productName = product.title.trim() || editorialProduct.productName;
    const variants = (variantsByProduct.get(product.id) ?? [])
      .filter((variant) => variant.price > 0 && (variant.stock === null || variant.stock > 0))
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

    if (variants.length === 0) return [];

    const firstVariant = variants[0];
    const image = product.image_url || editorialProduct.image;

    return [
      {
        ...editorialProduct,
        catalogId: product.id,
        productId: String(product.id),
        slug: product.slug,
        productName,
        contentName: productName,
        category: product.category || editorialProduct.category,
        image,
        heroImage: image,
        price: firstVariant.price,
        comparePrice: firstVariant.comparePrice ?? firstVariant.price,
        variants,
      },
    ];
  });

  for (const product of productRows) {
    const productId = String(product.id);
    if (!product.is_active || matchedProductIds.has(productId)) continue;

    const productName = product.title.trim() || `Produk #${product.id}`;
    const variants = (variantsByProduct.get(product.id) ?? [])
      .filter((variant) => variant.price > 0 && (variant.stock === null || variant.stock > 0))
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

    const baseDir = image.endsWith("/1.jpg") ? image.slice(0, -5) : null;
    const galleryImages = baseDir
      ? [1, 2, 3, 4, 5, 6, 7].map((num) => `${baseDir}/${num}.jpg`)
      : [image];

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
      ratingValue: 4.9,
      reviewCount: 128,
      soldCount: 485,
      reviews: [
        {
          name: "Siti Rahmawati",
          location: "Jakarta Selatan",
          avatar: "/images/social-proof-avatar.webp",
          verified: true,
          date: "Kemarin",
          comment: "Bagus banget tasnya! Bahannya tebal, warnanya sesuai gambar. Pengiriman COD cepat sekali.",
          rating: 5,
        },
        {
          name: "Diah Permata",
          location: "Surabaya",
          avatar: "/images/social-proof-avatar.webp",
          verified: true,
          date: "3 hari lalu",
          comment: "Jahitan rapi, muat banyak barang. Worth it banget untuk harga promo segini!",
          rating: 5,
        },
      ],
      variants,
    });
  }

  return catalog;
}
