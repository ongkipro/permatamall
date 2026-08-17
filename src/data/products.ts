export type ProductVariant = {
  catalogId?: number;
  sku?: string;
  id: string;
  label: string;
  price: number;
  comparePrice?: number;
};

export type ProductReview = {
  name: string;
  location: string;
  avatar: string;
  verified: boolean;
  date: string;
  comment: string;
  rating: number;
};

export type Product = {
  catalogId?: number;
  slug: string;
  productId: string;
  productName: string;
  contentName: string;
  headline: string;
  subheadline: string;
  seoTitle: string;
  seoDescription: string;
  price: number;
  /** Merchant-set strike-through price. Absent when the merchant has not set one. */
  comparePrice?: number;
  image: string;
  heroImage: string;
  images?: string[];
  tag?: string;
  category: string;
  relatedCategories: string[];
  relatedTags?: string[];
  description: string;
  benefits: string[];
  keyPoints: string[];
  idealFor: string[];
  offerText: string;
  ctaText: string;
  ratingValue?: number;
  reviewCount?: number;
  soldCount?: number;
  reviews: ProductReview[];
  variants: ProductVariant[];
};

export type ProductEditorialContent = Pick<
  Product,
  | "subheadline"
  | "seoTitle"
  | "seoDescription"
  | "tag"
  | "relatedTags"
  | "description"
  | "benefits"
  | "keyPoints"
  | "idealFor"
>;

export const editorialProductContentByCatalogId: Readonly<
  Record<number, ProductEditorialContent>
> = {
  2: {
    subheadline:
      "Tote bag 2-in-1 bergaya Korea dengan tas pendamping dalam warna senada.",
    seoTitle: "AIRA Tote Bag 2-in-1 Korean Style",
    seoDescription:
      "Lihat AIRA tote bag 2-in-1 bergaya Korea dengan tas pendamping senada, empat pilihan warna, serta opsi pembelian satuan atau paket.",
    tag: "Desain 2-in-1",
    relatedTags: ["Korean style", "Tas pendamping", "Smart casual"],
    description:
      "AIRA memadukan tote bag bersiluet tegas dengan tas pendamping berukuran ringkas. Garis panel, gantungan dekoratif, dan warna senada membentuk tampilan Korean style yang rapi.",
    benefits: [
      "Set 2-in-1 menyatukan tote bag dan tas pendamping senada.",
      "Siluet tegas memberi tampilan yang rapi.",
      "Empat pilihan warna memudahkan padu padan.",
    ],
    keyPoints: [
      "Desain 2-in-1",
      "Tas pendamping senada",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya smart casual", "Tampilan kerja", "Koleksi warna netral"],
  },
  3: {
    subheadline:
      "Tote bag berstruktur dengan detail zipper dan aksen gantung pada bagian depan.",
    seoTitle: "CANDY Tote Bag Zipper Premium",
    seoDescription:
      "Kenali CANDY tote bag dengan siluet tegas, detail zipper depan, aksen gantung, empat pilihan warna, dan opsi satuan atau paket.",
    tag: "Detail Zipper",
    relatedTags: ["Tote bag", "Zipper", "Siluet tegas"],
    description:
      "CANDY menampilkan bentuk tote bag yang tegas dengan panel depan ber-zipper dan aksen gantung vertikal. Pegangan panjang dan garis bersih memberi karakter modern tanpa detail berlebihan.",
    benefits: [
      "Detail zipper menjadi aksen utama pada panel depan.",
      "Pegangan panjang melengkapi siluet tote bag.",
      "Bentuk tegas memberi kesan modern dan rapi.",
    ],
    keyPoints: [
      "Zipper depan",
      "Aksen gantung vertikal",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya modern", "Tampilan kerja", "Padu padan minimalis"],
  },
  13: {
    subheadline:
      "Tote bag bersiluet lebar dengan detail double-lock system dan panel depan minimal.",
    seoTitle: "HALONA Tote Bag Double-Lock System",
    seoDescription:
      "Lihat HALONA tote bag bersiluet lebar dengan detail double-lock system, pegangan panjang, empat warna, serta pilihan satuan atau paket.",
    tag: "Double-Lock",
    relatedTags: ["Tote bag", "Double-lock", "Siluet lebar"],
    description:
      "HALONA mengusung siluet tote bag lebar dengan detail double-lock system sebagai penanda desain. Panel depan yang bersih dan pegangan panjang menghasilkan tampilan sederhana namun tegas.",
    benefits: [
      "Double-lock system menjadi detail khas pada desain.",
      "Siluet lebar memberi proporsi tote bag yang seimbang.",
      "Panel depan minimal mudah dipadukan dengan berbagai gaya.",
    ],
    keyPoints: [
      "Double-lock system",
      "Pegangan panjang",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya minimalis", "Tampilan harian", "Padu padan smart casual"],
  },
  6: {
    subheadline:
      "Tote bag kasual minimalis dengan permukaan bertekstur dan dua tali bahu panjang.",
    seoTitle: "SORAYA Tote Bag Casual Minimalis",
    seoDescription:
      "Kenali SORAYA tote bag kasual minimalis dengan permukaan bertekstur, dua tali bahu panjang, empat pilihan warna, serta opsi satuan atau paket.",
    tag: "Casual Minimalis",
    relatedTags: ["Tote bag", "Tekstur", "Kasual"],
    description:
      "SORAYA mengandalkan bentuk tote bag klasik dengan permukaan bertekstur dan dua tali bahu panjang. Detail yang ringkas menjaga tampilannya tetap kasual, minimalis, dan mudah dipadukan.",
    benefits: [
      "Permukaan bertekstur memberi karakter pada desain sederhana.",
      "Dua tali panjang membentuk tampilan tote bag klasik.",
      "Garis minimalis mudah masuk ke padu padan harian.",
    ],
    keyPoints: [
      "Tekstur menyeluruh",
      "Dua tali bahu panjang",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya kasual", "Tampilan minimalis", "Koleksi sehari-hari"],
  },
  10: {
    subheadline:
      "Tote bag Korean style dengan gagang ganda dan detail saku berflap di bagian depan.",
    seoTitle: "LUCKY Tote Bag Gagang Ganda Korea",
    seoDescription:
      "Lihat LUCKY tote bag Korean style dengan gagang ganda, detail saku berflap, empat pilihan warna, dan opsi pembelian satuan atau paket.",
    tag: "Gagang Ganda",
    relatedTags: ["Korean style", "Gagang ganda", "Saku depan"],
    description:
      "LUCKY memadukan bentuk tote bag membulat dengan gagang ganda dan detail saku berflap di bagian depan. Aksen panel dan garis lengkung menonjolkan karakter Korean style yang hangat.",
    benefits: [
      "Gagang ganda menjadi ciri utama siluetnya.",
      "Detail saku berflap memperkaya tampilan depan.",
      "Garis membulat memberi karakter Korean style.",
    ],
    keyPoints: [
      "Gagang ganda",
      "Detail saku berflap",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya Korean casual", "Tampilan feminin", "Padu padan bernuansa hangat"],
  },
  9: {
    subheadline:
      "Tote bag oversize bergaya Korea dengan badan lebar dan aksen sudut kontras.",
    seoTitle: "LUNNA Tote Bag Korean Oversize",
    seoDescription:
      "Kenali LUNNA tote bag Korean oversize dengan badan lebar, pegangan panjang, aksen sudut kontras, empat warna, serta pilihan satuan atau paket.",
    tag: "Siluet Oversize",
    relatedTags: ["Korean style", "Oversize", "Tote bag"],
    description:
      "LUNNA tampil dalam siluet tote bag oversize dengan badan lebar dan pegangan panjang. Aksen pada penutup serta sudut bawah memberi kontras pada desain Korean style yang bersih.",
    benefits: [
      "Siluet oversize menjadi fokus utama desain.",
      "Aksen sudut kontras mempertegas bentuk tas.",
      "Pegangan panjang menjaga proporsi tetap seimbang.",
    ],
    keyPoints: [
      "Model oversize",
      "Aksen sudut kontras",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya Korean casual", "Tampilan kampus", "Padu padan oversize"],
  },
  1: {
    subheadline:
      "Tote bag anyaman bernuansa premium dengan scarf dekoratif pada salah satu pegangan.",
    seoTitle: "ZIVIA Tote Bag Anyaman Premium",
    seoDescription:
      "Lihat ZIVIA tote bag anyaman dengan scarf dekoratif, pegangan panjang, siluet tegas, empat pilihan warna, dan opsi satuan atau paket.",
    tag: "Anyaman Premium",
    relatedTags: ["Anyaman", "Scarf dekoratif", "Tote bag"],
    description:
      "ZIVIA menggabungkan permukaan anyaman dengan siluet tote bag yang tegas. Scarf dekoratif pada salah satu pegangan menjadi aksen kontras yang membuat desain tampil lebih khas.",
    benefits: [
      "Permukaan anyaman memberi dimensi visual.",
      "Scarf dekoratif menjadi aksen yang mudah dikenali.",
      "Siluet tegas menjaga tampilan tetap rapi.",
    ],
    keyPoints: [
      "Tekstur anyaman",
      "Scarf dekoratif",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya polished casual", "Tampilan kerja", "Padu padan bertekstur"],
  },
  7: {
    subheadline:
      "Tas bahu anyaman tikar dengan siluet lembut dan gantungan bunga dekoratif.",
    seoTitle: "LENZY Tas Bahu Anyaman Tikar Elegan",
    seoDescription:
      "Kenali LENZY tas bahu anyaman tikar dengan siluet lembut, gantungan bunga dekoratif, empat pilihan warna, serta opsi satuan atau paket.",
    tag: "Anyaman Tikar",
    relatedTags: ["Tas bahu", "Anyaman tikar", "Aksen bunga"],
    description:
      "LENZY menampilkan anyaman tikar pada tas bahu bersiluet lembut. Gantungan bunga dan garis melengkung menghadirkan aksen feminin pada desain yang tetap ringan secara visual.",
    benefits: [
      "Anyaman tikar memberi tekstur khas pada permukaan.",
      "Gantungan bunga memperkuat aksen feminin.",
      "Siluet melengkung memberi tampilan yang lembut.",
    ],
    keyPoints: [
      "Anyaman tikar",
      "Gantungan bunga",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya feminin", "Tampilan santai", "Padu padan bertekstur"],
  },
  8: {
    subheadline:
      "Tas selempang model saddle bergaya Korea dengan detail buckle dan eyelet.",
    seoTitle: "SHELIN Tas Selempang Saddle Korean Style",
    seoDescription:
      "Lihat SHELIN tas selempang saddle Korean style dengan detail buckle dan eyelet, empat pilihan warna, serta opsi pembelian satuan atau paket.",
    tag: "Saddle Style",
    relatedTags: ["Saddle bag", "Korean style", "Buckle"],
    description:
      "SHELIN membawa siluet saddle ke dalam tas selempang bergaya Korea. Detail buckle, eyelet, dan panel melengkung membentuk tampilan berkarakter tanpa kehilangan garis yang ringkas.",
    benefits: [
      "Siluet saddle memberi bentuk yang mudah dikenali.",
      "Detail buckle dan eyelet memperkuat karakter desain.",
      "Garis melengkung menjaga tampilannya tetap ringkas.",
    ],
    keyPoints: [
      "Model saddle",
      "Detail buckle dan eyelet",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya Korean casual", "Tampilan edgy", "Padu padan akhir pekan"],
  },
  5: {
    subheadline:
      "Tas selempang mini dengan bentuk melengkung, top handle, dan aksen logam depan.",
    seoTitle: "NOURA Tas Selempang Mini Chic",
    seoDescription:
      "Kenali NOURA tas selempang mini chic dengan bentuk melengkung, top handle, aksen logam depan, empat warna, dan pilihan satuan atau paket.",
    tag: "Mini Chic",
    relatedTags: ["Tas mini", "Top handle", "Chic"],
    description:
      "NOURA hadir sebagai tas selempang mini dengan badan melengkung dan top handle yang ringkas. Aksen logam pada panel depan memberi titik fokus pada tampilannya yang chic.",
    benefits: [
      "Ukuran visual mini menghasilkan siluet yang ringkas.",
      "Top handle melengkapi karakter handbag.",
      "Aksen logam depan menjadi titik fokus desain.",
    ],
    keyPoints: [
      "Siluet mini",
      "Top handle",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya chic", "Tampilan feminin", "Padu padan ringkas"],
  },
  11: {
    subheadline:
      "Tas selempang chic dengan panel colorblock, tekstur quilted, dan detail rantai.",
    seoTitle: "KEISYA Tas Selempang Chic Colorblock",
    seoDescription:
      "Lihat KEISYA tas selempang chic dengan panel colorblock, tekstur quilted, detail rantai, empat pilihan warna, serta opsi satuan atau paket.",
    tag: "Chic Colorblock",
    relatedTags: ["Colorblock", "Quilted", "Detail rantai"],
    description:
      "KEISYA memadukan panel colorblock dengan tekstur quilted dan detail rantai pada tas selempang. Komposisi warna serta flap depan membentuk tampilan chic yang menonjol.",
    benefits: [
      "Panel colorblock memberi kontras visual.",
      "Tekstur quilted menambah dimensi pada permukaan.",
      "Detail rantai mempertegas gaya chic.",
    ],
    keyPoints: [
      "Panel colorblock",
      "Tekstur quilted",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya chic", "Tampilan feminin", "Padu padan beraksen"],
  },
  15: {
    subheadline:
      "Tote bag handle bag bergaya elegan dengan bentuk tegas dan pegangan berwarna kontras.",
    seoTitle: "DILY Tote Bag Handle Bag Elegant",
    seoDescription:
      "Kenali DILY tote bag handle bag dengan siluet tegas, pegangan berwarna kontras, empat pilihan warna, serta opsi satuan atau paket.",
    tag: "Elegant Handle",
    relatedTags: ["Handle bag", "Tote bag", "Kontras warna"],
    description:
      "DILY menampilkan badan tote bag yang bersih dengan pegangan panjang berwarna kontras. Proporsi tegak dan detail minimal memberi karakter handle bag yang elegan.",
    benefits: [
      "Pegangan kontras menjadi aksen utama desain.",
      "Proporsi tegak memberi tampilan yang rapi.",
      "Panel minimal mudah dipadukan dengan beragam gaya.",
    ],
    keyPoints: [
      "Pegangan warna kontras",
      "Siluet tegak",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Tampilan kerja", "Gaya elegan minimalis", "Padu padan smart casual"],
  },
  12: {
    subheadline:
      "Tote bag minimalis 2-in-1 dengan tas pendamping senada dan detail strap depan.",
    seoTitle: "JEMINA Tote Bag Minimalis 2-in-1",
    seoDescription:
      "Lihat JEMINA tote bag minimalis 2-in-1 dengan tas pendamping senada, detail strap depan, empat warna, dan opsi pembelian satuan atau paket.",
    tag: "Minimalis 2-in-1",
    relatedTags: ["2-in-1", "Tas pendamping", "Minimalis"],
    description:
      "JEMINA menyatukan tote bag minimalis dengan tas pendamping dalam warna senada. Detail strap dan kancing pada panel depan memberi aksen kecil pada siluet yang tegas.",
    benefits: [
      "Set 2-in-1 menyertakan tas pendamping senada.",
      "Detail strap depan memberi aksen tanpa terlihat ramai.",
      "Siluet tegas mendukung gaya minimalis.",
    ],
    keyPoints: [
      "Desain 2-in-1",
      "Tas pendamping senada",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya minimalis", "Tampilan kerja", "Padu padan monokrom"],
  },
  14: {
    subheadline:
      "Tas selempang yang tampil sebagai handbag, dengan panel dual tone dan top handle.",
    seoTitle: "EMIRA Crossbody Handbag Dual Tone",
    seoDescription:
      "Kenali EMIRA crossbody handbag dengan panel dual tone, top handle, tali panjang, empat pilihan warna, serta opsi pembelian satuan atau paket.",
    tag: "Dual Tone",
    relatedTags: ["Crossbody", "Handbag", "Dual tone"],
    description:
      "EMIRA menggabungkan bentuk handbag dengan tali panjang untuk tampilan crossbody. Panel dual tone, top handle, dan garis melengkung menciptakan karakter kasual yang rapi.",
    benefits: [
      "Bentuk handbag dan tali panjang memberi dua karakter tampilan.",
      "Panel dual tone menghasilkan kontras yang jelas.",
      "Top handle memperkuat siluet handbag.",
    ],
    keyPoints: [
      "Crossbody handbag",
      "Panel dual tone",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya kasual rapi", "Tampilan feminin", "Padu padan dual tone"],
  },
  4: {
    subheadline:
      "Tote bag dengan detail lock dan zipper, dilengkapi tas pendamping senada.",
    seoTitle: "AMARA Tote Bag Elegance Lock dan Zipper",
    seoDescription:
      "Lihat AMARA tote bag dengan detail lock dan zipper, tas pendamping senada, empat pilihan warna, serta opsi pembelian satuan atau paket.",
    tag: "Lock + Zipper",
    relatedTags: ["Tote bag", "Lock", "Zipper"],
    description:
      "AMARA menampilkan tote bag elegan dengan detail lock dan zipper sebagai aksen desain. Tas pendamping senada melengkapi komposisi dengan bentuk yang lebih ringkas.",
    benefits: [
      "Detail lock dan zipper menjadi ciri utama desain.",
      "Tas pendamping senada melengkapi set.",
      "Pegangan panjang menjaga siluet tetap seimbang.",
    ],
    keyPoints: [
      "Detail lock dan zipper",
      "Tas pendamping senada",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Tampilan kerja", "Gaya elegan", "Padu padan warna netral"],
  },
  16: {
    subheadline:
      "Tas selempang moon bag bergaya Korea dengan panel anyaman dan top handle ringkas.",
    seoTitle: "CAROLINE Tas Selempang Moon Bag Korea",
    seoDescription:
      "Kenali CAROLINE moon bag Korean style dengan panel anyaman, top handle ringkas, empat pilihan warna, serta opsi pembelian satuan atau paket.",
    tag: "Moon Bag",
    relatedTags: ["Moon bag", "Korean style", "Anyaman"],
    description:
      "CAROLINE menghadirkan siluet moon bag bergaya Korea dengan panel anyaman pada bagian depan. Top handle, flap melengkung, dan tali panjang membentuk tampilan ringkas bertekstur.",
    benefits: [
      "Siluet moon bag memberi bentuk melengkung yang khas.",
      "Panel anyaman menambah dimensi visual.",
      "Top handle melengkapi tampilan yang ringkas.",
    ],
    keyPoints: [
      "Model moon bag",
      "Panel anyaman",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya Korean casual", "Tampilan feminin", "Padu padan bertekstur"],
  },
  17: {
    subheadline:
      "Tas selempang crescent berukuran ringkas dengan top handle dan garis lengkung tegas.",
    seoTitle: "BERLYN Tas Selempang Crescent Elegance",
    seoDescription:
      "Lihat BERLYN tas selempang crescent dengan top handle, garis lengkung tegas, aksen logam, empat warna, dan pilihan satuan atau paket.",
    tag: "Crescent Elegance",
    relatedTags: ["Crescent bag", "Top handle", "Elegan"],
    description:
      "BERLYN menerapkan bentuk crescent pada tas selempang berukuran ringkas. Top handle, garis lengkung, dan detail logam kecil memberi kesan elegan pada desain yang padat.",
    benefits: [
      "Bentuk crescent menciptakan siluet melengkung.",
      "Top handle mempertegas karakter handbag.",
      "Aksen logam kecil memberi titik fokus.",
    ],
    keyPoints: [
      "Siluet crescent",
      "Top handle",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya elegan", "Tampilan feminin", "Padu padan ringkas"],
  },
  18: {
    subheadline:
      "Tote bag work & campus dengan bentuk hobo lebar dan tali bahu menyatu.",
    seoTitle: "AYIEN Tote Bag Work dan Campus",
    seoDescription:
      "Kenali AYIEN tote bag work dan campus dengan bentuk hobo lebar, tali bahu menyatu, empat pilihan warna, serta opsi pembelian satuan atau paket.",
    tag: "Work + Campus",
    relatedTags: ["Work style", "Campus style", "Hobo tote"],
    description:
      "AYIEN memadukan bentuk tote bag dengan siluet hobo yang lebar dan tali bahu menyatu. Garis sederhana serta panel bersih membuatnya selaras dengan gaya work & campus.",
    benefits: [
      "Siluet hobo lebar memberi karakter santai.",
      "Tali bahu menyatu menjaga garis desain tetap bersih.",
      "Panel minimal mendukung padu padan work & campus.",
    ],
    keyPoints: [
      "Work & campus style",
      "Siluet hobo",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Tampilan kerja", "Gaya kampus", "Padu padan kasual"],
  },
  19: {
    subheadline:
      "Tas selempang leather-look dengan siluet hobo, detail flap, dan aksen tali dekoratif.",
    seoTitle: "ARIELA Tas Selempang Leather-Look",
    seoDescription:
      "Lihat ARIELA tas selempang leather-look dengan siluet hobo, detail flap, aksen tali dekoratif, empat warna, dan opsi satuan atau paket.",
    tag: "Leather-Look",
    relatedTags: ["Leather-look", "Hobo bag", "Tas selempang"],
    description:
      "ARIELA tampil dalam siluet hobo dengan permukaan leather-look dan detail flap pada sisi depan. Aksen tali dekoratif memberi gerak pada desain tas selempang yang santai.",
    benefits: [
      "Permukaan leather-look memberi karakter visual.",
      "Siluet hobo membentuk garis yang lembut.",
      "Aksen tali dekoratif memperkaya tampilan.",
    ],
    keyPoints: [
      "Leather-look",
      "Siluet hobo",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya kasual", "Tampilan edgy", "Padu padan bernuansa gelap"],
  },
  20: {
    subheadline:
      "Tote bag plaid dengan konsep multi-kompartemen dan detail tali pada kedua sisi.",
    seoTitle: "ANGGUN Tote Bag Plaid Multi-Kompartemen",
    seoDescription:
      "Kenali ANGGUN tote bag plaid multi-kompartemen dengan detail tali samping, gantungan dekoratif, empat warna, serta opsi satuan atau paket.",
    tag: "Multi-Kompartemen",
    relatedTags: ["Plaid", "Multi-kompartemen", "Tote bag"],
    description:
      "ANGGUN mengusung tote bag plaid dengan konsep multi-kompartemen. Detail tali pada kedua sisi, gantungan dekoratif, dan pegangan kontras memberi tampilan yang ramai namun terarah.",
    benefits: [
      "Konsep multi-kompartemen menjadi fokus produknya.",
      "Detail tali samping memberi karakter pada siluet.",
      "Gantungan dekoratif menambah aksen visual.",
    ],
    keyPoints: [
      "Desain plaid",
      "Konsep multi-kompartemen",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya kasual", "Tampilan beraksen", "Padu padan warna hangat"],
  },
  21: {
    subheadline:
      "Tas bahu Korean business casual dengan siluet lembut serta detail buckle dan eyelet.",
    seoTitle: "AJUNA Tas Bahu Korean Business Casual",
    seoDescription:
      "Lihat AJUNA tas bahu Korean business casual dengan siluet lembut, detail buckle dan eyelet, empat warna, serta pilihan satuan atau paket.",
    tag: "Business Casual",
    relatedTags: ["Business casual", "Korean style", "Tas bahu"],
    description:
      "AJUNA membawa gaya Korean business casual ke dalam tas bahu bersiluet lembut. Detail buckle, eyelet, dan aksen gantung memberi karakter pada panel berwarna senada.",
    benefits: [
      "Siluet lembut memberi tampilan business casual.",
      "Detail buckle dan eyelet mempertegas karakter desain.",
      "Panel senada menjaga komposisi warna tetap rapi.",
    ],
    keyPoints: [
      "Korean business casual",
      "Buckle dan eyelet",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Tampilan kerja", "Gaya Korean casual", "Padu padan smart casual"],
  },
  22: {
    subheadline:
      "Tas selempang dan tas bahu berbahan kanvas dengan siluet saddle dan panel bermotif.",
    seoTitle: "DAIRA Tas Selempang dan Bahu Kanvas",
    seoDescription:
      "Kenali DAIRA tas selempang dan bahu berbahan kanvas dengan siluet saddle, panel bermotif, empat pilihan warna, serta opsi satuan atau paket.",
    tag: "Kanvas Bermotif",
    relatedTags: ["Kanvas", "Saddle bag", "Tas bahu"],
    description:
      "DAIRA memadukan fungsi tas selempang dan tas bahu dalam siluet saddle berbahan kanvas. Panel bermotif, flap melengkung, dan aksen logam memberi detail pada bentuk yang ringkas.",
    benefits: [
      "Bentuknya memadukan karakter tas selempang dan tas bahu.",
      "Bahan kanvas dan panel bermotif memberi tekstur visual.",
      "Flap melengkung mempertegas siluet saddle.",
    ],
    keyPoints: [
      "Bahan kanvas",
      "Panel bermotif",
      "Black, Cream, Mocca, dan Burgundy",
    ],
    idealFor: ["Gaya kasual", "Tampilan akhir pekan", "Padu padan bertekstur"],
  },
};

const baseProducts: Product[] = [];

export const editorialProducts: Product[] = baseProducts;

export const products: Product[] = baseProducts;

export function getProductSelectionByVariantId(variantId: string) {
  for (const product of products) {
    const variant = product.variants.find((candidate) => candidate.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

export function formatRp(value: number) {
  return `Rp${Math.round(value).toLocaleString('id-ID').replace(/,/g, '.')}`;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
