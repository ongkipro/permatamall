/**
 * Automatic Google & Meta Product Taxonomy Engine
 *
 * Automatically maps product category, title, and description to official:
 * 1. Google Product Category (GPC) Numeric ID (e.g. 2863)
 * 2. Google Product Category Full Path String (e.g. "Home & Garden > Lawn & Garden > Gardening > Fertilizer")
 * 3. Meta Commerce Product Category Path (e.g. "Home & Garden > Lawn & Garden > Gardening > Fertilizer")
 * 4. Structured Product Type Path (e.g. "Pertanian > Pupuk & Nutrisi")
 *
 * Zero manual effort required by merchant — fully derived from catalog metadata.
 */

export interface AdTaxonomy {
  googleCategoryId: number;
  googleCategoryName: string;
  metaCategoryName: string;
  productType: string;
}

interface TaxonomyRule {
  id: number;
  googlePath: string;
  metaPath: string;
  productType: string;
  keywords: string[];
}

const TAXONOMY_RULES: TaxonomyRule[] = [
  {
    id: 2863,
    googlePath: "Home & Garden > Lawn & Garden > Gardening > Fertilizer",
    metaPath: "Home & Garden > Lawn & Garden > Gardening > Fertilizer",
    productType: "Pertanian > Pupuk & Nutrisi",
    keywords: [
      "pupuk", "fertilizer", "sawit", "padi", "cabai", "jagung", "tanaman", "ganoderma",
      "pertanian", "hama", "buah", "daun", "akar", "nutrisi tanaman", "organik", "nPK"
    ],
  },
  {
    id: 2849,
    googlePath: "Home & Garden > Lawn & Garden > Gardening",
    metaPath: "Home & Garden > Lawn & Garden > Gardening",
    productType: "Pertanian > Perkebunan & Benih",
    keywords: ["benih", "biji", "bibit", "kebun", "taman", "media tanam", "pot"],
  },
  {
    id: 2547,
    googlePath: "Health & Beauty > Personal Care > Cosmetics > Skin Care",
    metaPath: "Health & Beauty > Personal Care > Cosmetics > Skin Care",
    productType: "Kecantikan & Perawatan > Skincare",
    keywords: [
      "skincare", "skin care", "serum", "lotion", "cream", "krim", "pemutih", "kojic",
      "kojien", "wajah", "kulit", "glowing", "acne", "jerawat", "toner", "sunscreen"
    ],
  },
  {
    id: 567,
    googlePath: "Health & Beauty > Personal Care > Soap",
    metaPath: "Health & Beauty > Personal Care > Soap",
    productType: "Kecantikan & Perawatan > Sabun & Mandi",
    keywords: ["sabun", "soap", "body wash", "mandi", "cleanser"],
  },
  {
    id: 642,
    googlePath: "Health & Beauty > Health Care > Biotherapy & Alternative Medicine > Herbal Supplements",
    metaPath: "Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements",
    productType: "Kesehatan > Suplemen Herbal",
    keywords: [
      "herbal", "madu", "stamina", "vitalitas", "jamu", "pinang", "teh herbal",
      "suplemen", "kesehatan", "obat herbal", "kapsul"
    ],
  },
  {
    id: 1604,
    googlePath: "Apparel & Accessories > Clothing",
    metaPath: "Apparel & Accessories > Clothing",
    productType: "Fashion & Pakaian > Pakaian",
    keywords: ["baju", "kaos", "shirt", "celana", "jaket", "hoodie", "pakaian", "dress", "gamis", "fashion"],
  },
  {
    id: 645,
    googlePath: "Home & Garden > Kitchen & Dining > Kitchen Tools & Utensils",
    metaPath: "Home & Garden > Kitchen & Dining > Kitchen Tools & Utensils",
    productType: "Perkakas & Rumah Tangga > Alat Dapur",
    keywords: ["pisau", "asahan", "alat dapur", "dapur", "pengasah", "potong", "perkakas", "rumah tangga"],
  },
  {
    id: 222,
    googlePath: "Electronics",
    metaPath: "Electronics",
    productType: "Elektronik & Gadget",
    keywords: ["elektronik", "gadget", "hp", "charger", "kabel", "headset", "lampu", "led"],
  },
];

const DEFAULT_TAXONOMY: AdTaxonomy = {
  googleCategoryId: 645,
  googleCategoryName: "Home & Garden > Kitchen & Dining > Kitchen Tools & Utensils",
  metaCategoryName: "Home & Garden > Kitchen & Dining > Kitchen Tools & Utensils",
  productType: "Umum > Produk Pilihan",
};

/**
 * Derives Google & Meta Product Taxonomy automatically from product metadata.
 */
export function getAdTaxonomy(
  category?: string | null,
  title?: string | null,
  description?: string | null
): AdTaxonomy {
  const combinedText = [category, title, description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (!combinedText.trim()) {
    return DEFAULT_TAXONOMY;
  }

  let bestRule: TaxonomyRule | null = null;
  let maxMatchCount = 0;

  for (const rule of TAXONOMY_RULES) {
    let matchCount = 0;
    for (const keyword of rule.keywords) {
      if (combinedText.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    if (matchCount > maxMatchCount) {
      maxMatchCount = matchCount;
      bestRule = rule;
    }
  }

  if (bestRule) {
    return {
      googleCategoryId: bestRule.id,
      googleCategoryName: bestRule.googlePath,
      metaCategoryName: bestRule.metaPath,
      productType: bestRule.productType,
    };
  }

  // Fallback cleanly using category name if available
  const cleanCategory = (category || "").trim();
  return {
    ...DEFAULT_TAXONOMY,
    productType: cleanCategory ? `Umum > ${cleanCategory}` : DEFAULT_TAXONOMY.productType,
  };
}
