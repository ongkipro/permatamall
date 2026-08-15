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

function getRealisticComparePrice(productId: number, price: number): number {
  const multipliers = [1.38, 1.45, 1.52, 1.62, 1.68, 1.72, 1.36, 1.48, 1.55, 1.65, 1.42, 1.58];
  const seed = Math.abs(productId * 29 + Math.round(price / 100));
  const mult = multipliers[seed % multipliers.length];
  const rawCompare = Math.round((price * mult) / 1000) * 1000;
  return Math.max(rawCompare, price + 25000);
}

function getRichProductDetails(productId: number, title: string, category: string) {
  const t = title.toLowerCase();

  let subheadline = "Bahan sintetis premium tebal, jahitan rapi & kompartemen luas.";
  let description = `${title} dirancang khusus untuk wanita aktif yang mengutamakan penampilan stylish, elegan, dan kepraktisan sehari-hari. Dibuat dengan material sintetis grade A pilihan.`;
  let benefits = [
    "Desain Korean Style modern, simpel & timeless",
    "Bahan sintetis premium tebal & tahan goresan halus",
    "Kompartemen luas muat dompet, HP, makeup & perlengkapan harian",
    "Pengiriman cepat & Garansi Bayar di Tempat (COD) seluruh Indonesia",
  ];
  let keyPoints = [
    "100% Kualitas Terjamin & Quality Checked",
    "Garansi Retur 100% Apabila Produk Cacat / Tidak Sesuai",
  ];
  let idealFor = ["Kerja & Kuliah", "Hangout & Casual", "Acara Formal / Semi-Formal"];

  if (t.includes("zivia")) {
    subheadline = "Edisi Premium Tote Bag dengan Aksesori Gold Hardware & Kompartemen Utama Ber-Zipper.";
    description = "ZIVIA Tote Bag Wanita Premium memadukan estetika Korean luxury dengan fungsionalitas tinggi. Menggunakan bahan sintetis tebal berstruktur kokoh yang tidak mudah terlipat, dilengkapi zipper halus anti-macet dan aksen emas elegan pada gantungan pegangan.";
    benefits = [
      "Material Sintetis Grade A+ tebal, waterproof & mudah dibersihkan",
      "Kompartemen utama dengan zipper aman & saku rahasia di dalam",
      "Kapasitas ekstra muat mukena, dompet panjang, pouch makeup & tumbler",
      "Dilengkapi tali bahu empuk yang nyaman dipakai seharian tanpa bikin pegal",
    ];
  } else if (t.includes("aira")) {
    subheadline = "Inovasi Tas 2-in-1 Serbaguna: Bisa Dijadikan Tote Bag Maupun Tas Selempang Casual.";
    description = "AIRA Tote Bag 2-in-1 dirancang fleksibel untuk mobilitas tinggi. Hadir dengan tali panjang yang dapat dilepas-pasang dan disesuaikan panjangnya, memungkinkan Kamu bergaya sebagai Tote Bag elegan saat kerja atau Sling Bag santai saat jalan-jalan.";
    benefits = [
      "Dual Function 2-in-1 (Tote Bag & Crossbody Sling Bag)",
      "Tali panjang adjustable dan mudah dilepas sesuai selera",
      "Struktur tas fleksibel namun tetap tegak berdiri saat diletakkan",
      "Jahitan ganda di titik beban untuk daya tahan maksimal hingga beban 5 kg",
    ];
  } else if (t.includes("candy")) {
    subheadline = "Tote Bag Beresleting dengan Pilihan Warna-warni Pastel Korean Style yang Manis.";
    description = "CANDY Tote Bag Zipper Premium merupakan pilihan favorit mahasiswa dan wanita karir muda. Desainnya yang simpel nan elegan dipercantik dengan jahitan quilting halus dan resleting berkualitas tinggi yang menjaga barang pribadi Kamu tetap aman.";
    benefits = [
      "Zipper penutup penuh menjaga keamanan barang berharga di dalam",
      "Lapisan furing satin lembut berkwalitas tinggi di bagian interior",
      "Muat dokumen A4, buku catatan, iPad/Tablet 11-inch & kebutuhan harian",
      "Pilihan warna pastel elegan yang cocok dipadukan dengan berbagai outfit",
    ];
  } else if (t.includes("amara")) {
    subheadline = "Sentuhan Kemewahan Klasik dengan Kunci Kait Emas Luxury & Double Zipper.";
    description = "AMARA Tote Bag Elegance memancarkan pesona wanita anggun. Mengombinasikan pengunci magnetik emas dan resleting ganda, memberikan proteksi ekstra sekaligus tampilan eksklusif khas tas boutique papan atas.";
    benefits = [
      "Pengunci magnetik berlapis emas anti-karat dengan daya rekat kuat",
      "Bahan kulit sintetis motif halus premium berdaya tahan tinggi",
      "Interior terbagi atas 2 kompartemen besar + 1 sekat zipper tengah",
      "Dasar tas dilengkapi kaki besi pelindung dari gesekan meja/lantai",
    ];
  } else if (t.includes("noura")) {
    subheadline = "Tas Selempang Ukuran Compact yang Ringan, Stylish, dan Tetap Fungsional.";
    description = "NOURA Tas Selempang Mini Chic didesain khusus bagi Kamu yang menyukai gaya minimalis praktis. Walaupun tampak compact, kapasitas dalamnya dirancang efisien untuk membawa handphone jumbo, dompet lipat, lipstik, dan kunci kendaraan.";
    benefits = [
      "Ukuran mini yang sangat ringan & tidak membebani pundak",
      "Tali selempang dapat diatur panjangnya sesuai tinggi badan",
      "Bukaan kancing jepret magnetik praktis untuk akses cepat",
      "Pilihan tepat untuk jalan-jalan santai, kondangan, maupun berbelanja",
    ];
  } else if (t.includes("lenzy")) {
    subheadline = "Karya Seni Anyaman Tikar Modern dengan Karakter Tekstur Unik dan Elegan.";
    description = "LENZY Tas Bahu menghadirkan tekstur anyaman berkelas yang diproses secara khusus. Gaya boho-chic modern ini memberikan kesan eksklusif dan berbeda dari tas biasa, cocok untuk Kamu yang tampil berani dan trendi.";
    benefits = [
      "Tekstur anyaman sintetis 3D rapat yang awet & tidak mudah terurai",
      "Tali bahu lebar yang mendistribusikan beban secara merata",
      "Kapasitas luas dengan bukaan lebar memudahkan mengambil barang",
      "Desain estetis yang menarik perhatian di setiap kesempatan",
    ];
  } else if (t.includes("shelin")) {
    subheadline = "Siluet Sadel Korea yang Manis & Modis dengan Tali Selempang Aksesoris Gesper Emas.";
    description = "SHELIN Tas Selempang Sadel menghadirkan siluet melengkung feminin khas tren fashion Seoul terkini. Dibuat dengan presisi tinggi menggunakan bahan halus lembut yang tahan cipratan air dan mudah dibersihkan.";
    benefits = [
      "Siluet Curved Saddle nan estetik & kekinian",
      "Aksen gesper emas mengkilap sebagai daya tarik visual premium",
      "Resleting interior + saku kartu tersembunyi",
      "Nyaman digunakan seharian tanpa mengganggu pergerakan",
    ];
  } else if (t.includes("lunna")) {
    subheadline = "Kapasitas Ekstra Luas dengan Gaya Oversized Minimalis ala Korean Streetwear.";
    description = "LUNNA Tote Bag Korean Oversize hadir untuk Kamu yang membutuhkan ruang penyimpanan maksimal tanpa mengorbankan gaya. Sangat cocok membawa laptop 14 inci, berkas kerja, botol minum, serta pakaian ganti.";
    benefits = [
      "Kapasitas Jumbo muat Laptop 14 Inci & perlengkapan dinas/kuliah",
      "Tali pegangan tebal yang dijahit melingkar dasar tas untuk kekuatan ekstra",
      "Desain polos minimalis yang netral untuk dipadukan dengan busana apa saja",
      "Dilengkapi pengunci magnetik kuat di bagian tengah atas",
    ];
  } else if (t.includes("lucky")) {
    subheadline = "Dual Handle Bag: Pegangan Tangan Kokoh + Tali Selempang Bahu Praktis.";
    description = "LUCKY Tote Bag Gagang Ganda memadukan kepraktisan top-handle bag dengan fleksibilitas shoulder bag. Sangat cocok dijadikan tas kerja harian yang mampu memberikan kesan profesional sekaligus santai.";
    benefits = [
      "Pegangan ganda tebal yang nyaman digenggam maupun disampirkan di lengan",
      "Material sintetis berserat tebal dengan proteksi anti-scratch",
      "Interior terbagi menjadi kompartemen berzipper dan saku terbuka ganda",
      "Tersedia pilihan warna netral favorit wanita Indonesia",
    ];
  }

  return { subheadline, description, benefits, keyPoints, idealFor };
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
            .map((variant) => {
              const comparePrice = variant.compare_price && variant.compare_price > variant.price
                ? variant.compare_price
                : getRealisticComparePrice(matchedRow?.id || 1, variant.price);
              return {
                catalogId: variant.id,
                ...(variant.sku ? { sku: variant.sku } : {}),
                id: String(variant.id),
                label: variantLabel(productName, variant.title),
                price: variant.price,
                comparePrice,
              };
            })
        : editorialProduct.variants;

    if (variants.length === 0) return [];

    const firstVariant = variants[0];
    const image = matchedRow?.image_url || editorialProduct.image || editorialProduct.heroImage;

    const baseDir = image.endsWith("/1.webp") ? image.slice(0, -7) : null;
    const galleryImages = baseDir
      ? [1, 2, 3, 4, 5, 6, 7].map((num) => `${baseDir}/${num}.webp`)
      : editorialProduct.images || [image];

    const metrics = getProductMetrics(matchedRow?.id || 1, productName);
    const calculatedComparePrice = firstVariant.comparePrice && firstVariant.comparePrice > firstVariant.price
      ? firstVariant.comparePrice
      : getRealisticComparePrice(matchedRow?.id || 1, firstVariant.price);

    return [
      {
        ...editorialProduct,
        ...(matchedRow ? { catalogId: matchedRow.id, productId: String(matchedRow.id) } : {}),
        productName,
        slug,
        category,
        price: firstVariant.price,
        comparePrice: calculatedComparePrice,
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
      .map((variant) => {
        const comparePrice = variant.compare_price && variant.compare_price > variant.price
          ? variant.compare_price
          : getRealisticComparePrice(product.id, variant.price);
        return {
          catalogId: variant.id,
          ...(variant.sku ? { sku: variant.sku } : {}),
          id: String(variant.id),
          label: variantLabel(productName, variant.title),
          price: variant.price,
          comparePrice,
        };
      });

    if (variants.length === 0) continue;

    const firstVariant = variants[0];
    const image = product.image_url || "/images/logo.webp";

    const baseDir = image.endsWith("/1.webp") ? image.slice(0, -7) : null;
    const galleryImages = baseDir
      ? [1, 2, 3, 4, 5, 6, 7].map((num) => `${baseDir}/${num}.webp`)
      : [image];

    const metrics = getProductMetrics(product.id, productName);
    const calculatedComparePrice = firstVariant.comparePrice && firstVariant.comparePrice > firstVariant.price
      ? firstVariant.comparePrice
      : getRealisticComparePrice(product.id, firstVariant.price);

    const details = getRichProductDetails(product.id, productName, product.category || "Tote Bag");

    catalog.push({
      catalogId: product.id,
      productId,
      slug: product.slug,
      productName,
      contentName: productName,
      headline: `${productName} — Korean Style Premium`,
      subheadline: details.subheadline,
      seoTitle: `${productName} | Permata Mall`,
      seoDescription: `Beli ${productName} original online di Permata Mall. Garansi kualitas premium, pengiriman cepat & bayar di tempat (COD).`,
      price: firstVariant.price,
      comparePrice: calculatedComparePrice,
      image,
      heroImage: image,
      images: galleryImages,
      tag: product.category || "Tote Bag",
      category: product.category || "Tote Bag",
      relatedCategories: [product.category || "Tote Bag", "Fashion Wanita"],
      description: details.description,
      benefits: details.benefits,
      keyPoints: details.keyPoints,
      idealFor: details.idealFor,
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