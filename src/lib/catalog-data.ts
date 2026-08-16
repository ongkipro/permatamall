import type { Product } from "../data/products";
import { tenantConfig } from "./tenant.ts";

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
  } else if (t.includes("daira")) {
    subheadline = "Tas Selempang & Bahu Kanvas Premium Berserat Rapat, Kuat & Timeless.";
    description = "DAIRA Tas Selempang & Bahu Kanvas terbuat dari bahan kanvas premium berserat rapat yang kuat namun tetap lembut disentuh. Membawa kesan youthful, eco-friendly, dan timeless.";
    benefits = [
      "Kanvas berserat tebal & rapat yang tahan aus serta tidak gampang berbulu",
      "Tali kanvas adjustable lebar yang sangat nyaman untuk mobilitas tinggi",
      "Resleting logam kokoh dan pengunci magnetik tambahan",
      "Dapat dicuci dengan mudah jika terkena noda",
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
      "Lapisan furing satin lembut berkualitas tinggi di bagian interior",
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
  } else if (t.includes("soraya")) {
    subheadline = "Tote Bag Casual Minimalis Bergaris Bersih untuk Aktivitas Harian Wanita Modern.";
    description = "SORAYA Tote Bag Casual Minimalis dirancang bagi Kamu yang mengutamakan tampilan simpel namun tetap memancarkan kesan classy. Dibuat dari sintetis tebal bertekstur halus yang awet dan mudah dirawat.";
    benefits = [
      "Siluet minimalis clean-cut yang netral dipadukan busana apa saja",
      "Material sintetis tebal berstruktur kokoh yang tidak gampang mengelupas",
      "Kompartemen interior ber-zipper rapi muat berbagai kebutuhan harian",
      "Pegangan bahu yang pas dan tidak gampang melorot saat jalan",
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
  } else if (t.includes("keisya")) {
    subheadline = "Tas Selempang Chic Colorblock Kontras Warna Estetik Berkelas.";
    description = "KEISYA Tas Selempang Chic Colorblock memadukan kombinasi tone warna harmonis yang memberikan sentuhan segar pada OOTD Kamu. Ringan, kokoh, dan dilengkapi pengunci emas mewah.";
    benefits = [
      "Kombinasi warna kontras elegan khas boutique Korea",
      "Pengunci putar logam emas anti-karat berdaya tahan tinggi",
      "Tali selempang kulit sintetis dapat diatur fleksibel",
      "Kapasitas ideal untuk HP, dompet, kunci & lipstik",
    ];
  } else if (t.includes("jemina")) {
    subheadline = "Tote Bag Minimalis 2-in-1 dengan Kompartemen Ganda & Strap Fleksibel.";
    description = "JEMINA Tote Bag Minimalis 2-in-1 menghadirkan kepraktisan ganda dalam satu siluet ringkas. Dilengkapi dua kompartemen terpisah agar barang pribadi Kamu tertata sempurna.";
    benefits = [
      "Dua kompartemen terpisah dengan resleting independen",
      "Struktur 2-in-1: bisa ditinjau sebagai tote bag maupun shoulder bag",
      "Bahan luar tahan cipratan air dengan tekstur serat halus",
      "Ukuran proporsional untuk aktivitas kantor, kampus & santai",
    ];
  } else if (t.includes("halona")) {
    subheadline = "Tote Bag Double Lock System untuk Keamanan Maksimal Barang Berharga.";
    description = "HALONA Tote Bag Double Lock System menghadirkan pengunci ganda kombinasi magnetik dan resleting utama. Memberikan ketenangan ekstra saat membawa barang berharga di tempat umum.";
    benefits = [
      "Sistem pengunci ganda (Magnetik + Resleting Utama)",
      "Kompartemen khusus dompet & smartphone terlindung aman",
      "Bahan sintetis tebal berstruktur kokoh berdiri",
      "Pegangan halus yang tidak mengikis pakaian saat disandang",
    ];
  } else if (t.includes("emira")) {
    subheadline = "Tas Selempang & Handbag Dual Tone dengan Tekstur Kulit Lembut Mewah.";
    description = "EMIRA Tas Selempang & Handbag Dual Tone menawarkan fleksibilitas gaya dua warna yang anggun. Cocok dipadukan baik dengan gaun formal maupun busana casual sehari-hari.";
    benefits = [
      "Dua opsi pemakaian: digenggam sebagai handbag atau disandang sling bag",
      "Material sintetis elastis dengan sentuhan serat kulit ultra-lembut",
      "Aksen gantungan dekoratif berlapis emas yang menawan",
      "Interior berlapis furing tebal ber-resleting",
    ];
  } else if (t.includes("dily")) {
    subheadline = "Tote Bag Handle Bag Elegant dengan Pegangan Bundar Kokoh Khas Boutique.";
    description = "DILY Tote Bag Handle Bag Elegant memiliki ciri khas pegangan bundar kokoh yang memberikan struktur tegas dan mewah. Pilihan sempurna untuk wanita yang ingin tampil percaya diri.";
    benefits = [
      "Pegangan bundar terstruktur kokoh khas desain high-fashion",
      "Material sintetis tebal dengan keawetan jangka panjang",
      "Kapasitas muat iPad, dompet panjang & kosmetik",
      "Tersedia tali panjang fleksibel untuk pemakaian bahu",
    ];
  } else if (t.includes("caroline")) {
    subheadline = "Tas Selempang Moon Bag Korea dengan Siluet Bulan Sabit Ikonis Trendi.";
    description = "CAROLINE Tas Selempang Moon Bag Korea mengusung siluet bulan sabit melengkung yang sedang hits di kalangan fashion influencer Korea. Sangat nyaman disandangkan di bahu mengikuti bentuk tubuh.";
    benefits = [
      "Siluet Moon Bag bulan sabit yang ergonomis & fleksibel",
      "Resleting melengkung anti-macet untuk akses mudah",
      "Bahan ringan bertekstur lembut anti-stratch",
      "Tali bahu adjustable dengan gesper adjuster presisi",
    ];
  } else if (t.includes("berlyn")) {
    subheadline = "Tas Selempang Crescent Elegance dengan Aksen Quilting Presisi & Gold Hardware.";
    description = "BERLYN Tas Selempang Crescent Elegance menyajikan keindahan jahitan quilting simetris dengan paduan hardware emas mengkilap. Memancarkan aura feminin yang anggun dan berkelas.";
    benefits = [
      "Quilting presisi tebal dengan permukaan empuk menawan",
      "Hardware rantai emas berbobot mantap yang dilapisi anti-karat",
      "Klip pengunci magnetik kuat berdesain tersembunyi",
      "Ideal untuk pesta, dinner formal, hingga hangout akhir pekan",
    ];
  } else if (t.includes("ayien")) {
    subheadline = "Tote Bag Work & Campus Muat Laptop 14 Inch & Berkas A4.";
    description = "AYIEN Tote Bag Work & Campus dirancang khusus untuk memenuhi kebutuhan produktivitas wanita berkarir dan mahasiswi. Ukurannya pas memuat laptop 13-14 inch, binder A4, dan charger.";
    benefits = [
      "Kapasitas proporsional muat Laptop 14 inci & berkas A4",
      "Resleting utama tebal yang membendung air hujan ringan",
      "Saku sisipan luar untuk simpan kartu akses & HP",
      "Tali bahu diperkuat jahitan silang untuk daya tahan beban tinggi",
    ];
  } else if (t.includes("ariela")) {
    subheadline = "Tas Selempang Leather Look Tahan Cipratan Air & Mudah Dibersihkan.";
    description = "ARIELA Tas Selempang Leather Look menyajikan tampilan serat kulit asli yang kaya tekstur tanpa perawatan rumit. Tahan cipratan air dan cukup diusap lap basah untuk menjaga kebersihannya.";
    benefits = [
      "Finishing Leather Look serat alami yang tahan air & debu",
      "Mudah dibersihkan dan tidak gampang berjamur",
      "Kompartemen interior ganda dengan tempat penyimpan kartu",
      "Siluet tegas yang tetap rapi meski dalam keadaan kosong",
    ];
  } else if (t.includes("anggun")) {
    subheadline = "Tote Bag Plaid Multi-Kompartemen Sekat Interior Rapi & Terorganisir.";
    description = "ANGGUN Tote Bag Plaid Multi-Kompartemen hadir dengan desain sekat dalam yang terencana rapi. Tidak ada lagi barang yang berantakan atau bercampur di dalam tas.";
    benefits = [
      "Multi-Kompartemen interior dengan 3 sekat utama + 2 saku resleting",
      "Aksen jahitan geometris yang memberikan kesan modern",
      "Material sintetis tebal tidak letoy dan mempertahankan bentuk",
      "Sangat cocok untuk ibu muda, wanita pekerja & mahasiswi",
    ];
  } else if (t.includes("ajuna")) {
    subheadline = "Tas Bahu Korean Business Casual Menyempurnakan Gaya Profesional & Santai.";
    description = "AJUNA Tas Bahu Korean Business Casual memadukan kesan rapi profesional untuk suasana kerja dengan kepraktisan santai saat jam makan siang maupun weekend.";
    benefits = [
      "Gaya Business Casual ala drama Korea favorit",
      "Tali bahu datar yang empuk dan tidak menimbulkan bekas di pundak",
      "Kompartemen berkapasitas sedang muat tablet, mukena mini & pouch",
      "Tersedia dalam pilihan warna netral elegan",
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
              const comparePrice =
                variant.compare_price && variant.compare_price > variant.price
                  ? variant.compare_price
                  : undefined;
              return {
                catalogId: variant.id,
                ...(variant.sku ? { sku: variant.sku } : {}),
                id: String(variant.id),
                label: variantLabel(productName, variant.title),
                price: variant.price,
                ...(comparePrice ? { comparePrice } : {}),
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

    return [
      {
        ...editorialProduct,
        ...(matchedRow ? { catalogId: matchedRow.id, productId: String(matchedRow.id) } : {}),
        productName,
        slug,
        category,
        price: firstVariant.price,
        ...(firstVariant.comparePrice ? { comparePrice: firstVariant.comparePrice } : {}),
        image,
        heroImage: image,
        images: galleryImages,
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
        // Compare price is merchant data or nothing. Never synthesised.
        const comparePrice =
          variant.compare_price && variant.compare_price > variant.price
            ? variant.compare_price
            : undefined;
        return {
          catalogId: variant.id,
          ...(variant.sku ? { sku: variant.sku } : {}),
          id: String(variant.id),
          label: variantLabel(productName, variant.title),
          price: variant.price,
          ...(comparePrice ? { comparePrice } : {}),
        };
      });

    if (variants.length === 0) continue;

    const firstVariant = variants[0];
    const image = product.image_url || "/images/logo.webp";

    const baseDir = image.endsWith("/1.webp") ? image.slice(0, -7) : null;
    const galleryImages = baseDir
      ? [1, 2, 3, 4, 5, 6, 7].map((num) => `${baseDir}/${num}.webp`)
      : [image];

    const details = getRichProductDetails(product.id, productName, product.category || "Tote Bag");

    catalog.push({
      catalogId: product.id,
      productId,
      slug: product.slug,
      productName,
      contentName: productName,
      headline: `${productName} — Korean Style Premium`,
      subheadline: details.subheadline,
      seoTitle: `${productName} | ${tenantConfig.name}`,
      seoDescription: `Beli ${productName} original online di ${tenantConfig.name}. Garansi kualitas premium, pengiriman cepat & bayar di tempat (COD).`,
      price: firstVariant.price,
      ...(firstVariant.comparePrice ? { comparePrice: firstVariant.comparePrice } : {}),
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
      // Ratings, sold counts and reviews are merchant-owned evidence. They are
      // published through /admin/content or they do not exist. Downstream
      // consumers already omit the rating block, the review section and the
      // JSON-LD aggregateRating when these are absent.
      reviews: [],
      variants,
    });
  }

  return catalog;
}