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
  comparePrice: number;
  image: string;
  heroImage: string;
  tag: string;
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

const baseProducts: Product[] = [
  {
    slug: 'asahan-portable',
    productId: '434683',
    productName: 'Asahan Portable',
    contentName: 'Asahan Portable',
    headline: 'Asahan Pisau Portable, Tajamkan Pisau dalam Hitungan Detik',
    subheadline:
      'Ukuran travel size yang ringan dan mudah disimpan. Cukup gesek beberapa kali, pisau dapur kembali tajam.',
    seoTitle: 'Asahan Pisau Portable - Praktis dan Mudah Dibawa',
    seoDescription:
      'Asahan pisau portable ukuran kecil dan ringan. Praktis untuk dapur rumah, warung, dan dibawa bepergian. Bisa COD ke seluruh Indonesia.',
    price: 79000,
    comparePrice: 135000,
    image: '/images/produk/asahan-portable.webp',
    heroImage: '/images/produk/asahan-portable.webp',
    tag: 'Perkakas Dapur',
    category: 'Asahan Pisau',
    relatedCategories: ['Dapur', 'Perkakas'],
    relatedTags: ['Asahan Pisau', 'Pengasah Portable'],
    description:
      'Asahan pisau genggam berukuran kecil dengan mata asah di bagian atas. Bentuknya ringkas seperti gagang pisau sehingga mudah disimpan di laci dapur atau dibawa bepergian.',
    benefits: [
      'Menajamkan kembali pisau dapur yang tumpul dengan beberapa gesekan',
      'Bentuk kecil dan ringan, mudah disimpan dan dibawa ke mana saja',
      'Gagang bertekstur agar genggaman tidak licin saat dipakai',
    ],
    keyPoints: [
      'Ukuran travel size, muat di laci, tas, atau kotak perkakas',
      'Cocok untuk pisau dapur rumah, warung makan, dan kebutuhan berkemah',
      'Tersedia paket Beli 1 dan Beli 2 dengan harga lebih hemat',
    ],
    idealFor: ['Dapur rumah', 'Warung makan', 'Berkemah dan bepergian', 'Kotak perkakas'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.8,
    reviewCount: 213,
    soldCount: 1400,
    reviews: [
      {
        name: 'Bu Ningsih',
        location: 'Sidoarjo, Jawa Timur',
        avatar: '/images/petani/petani-02.webp',
        verified: true,
        date: '2026-07-08',
        comment:
          'Pisau di warung saya cepat tumpul karena dipakai terus. Digesek asahan ini beberapa kali langsung enak lagi buat motong. Simpel, tinggal taruh laci.',
        rating: 5,
      },
      {
        name: 'Pak Darmaji',
        location: 'Klaten, Jawa Tengah',
        avatar: '/images/petani/petani-01.webp',
        verified: true,
        date: '2026-06-30',
        comment:
          'Bentuknya kecil tapi hasilnya bagus. Pisau dapur sama pisau lipat buat mancing dua-duanya jadi tajam lagi. Pegangannya juga tidak licin.',
        rating: 5,
      },
      {
        name: 'Mbak Yuli',
        location: 'Bandar Lampung, Lampung',
        avatar: '/images/petani/petani-04.webp',
        verified: true,
        date: '2026-06-21',
        comment:
          'Awalnya ragu karena murah, ternyata beneran kepakai tiap hari. Ibu saya sampai minta dibelikan satu lagi buat di rumah.',
        rating: 4,
      },
    ],
    variants: [
      { id: 'variant_9xcHIAhJRnIN8-Yeg7bTE68s', label: 'Beli 1 Pcs', price: 79000, comparePrice: 135000 },
      {
        id: 'variant_2_8vuTxS3vq4IghA8RC60N0d',
        label: 'Beli 2 Pcs',
        price: 119000,
        comparePrice: 229000,
      },
    ],
  },
  {
    slug: 'alat-anti-ngorok',
    productId: '434685',
    productName: 'Alat Anti Ngorok',
    contentName: 'LEGA Anti Ngorok',
    headline: 'Alat Anti Ngorok, Bantu Tidur Lebih Tenang',
    subheadline:
      'Klip hidung silikon lembut yang membantu melegakan aliran napas saat tidur. Beli 1 paket dapat 3 klip dengan kotak penyimpanan.',
    seoTitle: 'Alat Anti Ngorok Klip Hidung Silikon - Nyaman Dipakai',
    seoDescription:
      'Klip hidung silikon lembut untuk membantu mengurangi dengkuran saat tidur. Bisa dicuci dan dipakai ulang, dilengkapi kotak penyimpanan. Bisa COD.',
    price: 79000,
    comparePrice: 149000,
    image: '/images/produk/alat-anti-ngorok.webp',
    heroImage: '/images/produk/alat-anti-ngorok.webp',
    tag: 'Kenyamanan Tidur',
    category: 'Alat Bantu Tidur',
    relatedCategories: ['Kesehatan', 'Tidur'],
    relatedTags: ['Anti Ngorok', 'Alat Bantu Tidur'],
    description:
      'Klip hidung berbahan silikon lembut yang dipasang di dalam hidung saat tidur untuk membantu melegakan aliran napas. Ringan, nyaman dipakai, dan dilengkapi kotak penyimpanan bening agar tetap higienis.',
    benefits: [
      'Membantu mengurangi kebiasaan mendengkur saat tidur',
      'Material silikon lembut sehingga nyaman dipakai semalaman',
      'Bisa dicuci dengan air mengalir dan dipakai berulang kali',
      'Satu paket berisi 3 klip, bisa disebar di kamar, tas, dan tempat menginap',
    ],
    keyPoints: [
      'Dipakai dengan cara dijepitkan ringan di dalam hidung sebelum tidur',
      'Kotak penyimpanan bening menjaga alat tetap bersih saat dibawa',
      'Bukan alat medis; bila gangguan tidur berlanjut, konsultasikan ke dokter',
    ],
    idealFor: ['Pasangan yang terganggu dengkuran', 'Perjalanan dan menginap', 'Pemakaian harian di rumah'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.8,
    reviewCount: 327,
    soldCount: 2100,
    reviews: [
      {
        name: 'Bu Rahma',
        location: 'Bekasi, Jawa Barat',
        avatar: '/images/petani/petani-06.webp',
        verified: true,
        date: '2026-07-10',
        comment:
          'Suami saya ngoroknya kenceng banget sampai saya susah tidur. Malam pertama pakai masih kaget-kaget, sekarang suaranya jauh berkurang. Saya akhirnya bisa tidur satu kamar lagi.',
        rating: 5,
      },
      {
        name: 'Pak Hasan',
        location: 'Makassar, Sulawesi Selatan',
        avatar: '/images/petani/petani-03.webp',
        verified: true,
        date: '2026-07-02',
        comment:
          'Sering dinas luar kota dan sekamar sama teman. Alat ini kecil, tinggal jepit sebelum tidur. Kata teman sekamar dengkuran saya sekarang halus, tidak seberisik dulu.',
        rating: 5,
      },
      {
        name: 'Mas Bayu',
        location: 'Sleman, Yogyakarta',
        avatar: '/images/petani/petani-05.webp',
        verified: true,
        date: '2026-06-18',
        comment:
          'Dua tiga malam pertama rasanya aneh di hidung, setelah itu terbiasa. Napas lewat hidung terasa lebih plong. Dapat 3 biji jadi bisa taruh satu di tas.',
        rating: 4,
      },
    ],
    variants: [
      {
        id: 'variant_3WdVVDkWQQ81eyFDiQosS5Ct',
        label: 'Beli 1 Dpt 3',
        price: 79000,
        comparePrice: 149000,
      },
      {
        id: 'variant_Hcm_ThmmJPv6ajbMPvO55QsX',
        label: 'Beli 2 Dpt 6',
        price: 119000,
        comparePrice: 229000,
      },
    ],
  },
  {
    slug: 'kunci-lipat',
    productId: '434686',
    productName: 'Kunci Lipat',
    contentName: 'Kunci Lipat Multifungsi',
    headline: 'Kunci Lipat Multifungsi, Satu Alat untuk Banyak Pekerjaan',
    subheadline:
      'Set kunci L dan obeng dalam satu gagang lipat yang ringkas. Kokoh untuk sepeda, motor, dan perbaikan rumah.',
    seoTitle: 'Kunci Lipat Multifungsi - Set Kunci L dan Obeng Ringkas',
    seoDescription:
      'Kunci lipat multifungsi berisi set kunci L dan obeng dalam satu gagang ringkas. Praktis untuk sepeda, motor, dan perbaikan rumah. Bisa COD.',
    price: 99000,
    comparePrice: 169000,
    image: '/images/produk/kunci-lipat.webp',
    heroImage: '/images/produk/kunci-lipat.webp',
    tag: 'Perkakas Portable',
    category: 'Kunci Multifungsi',
    relatedCategories: ['Perkakas', 'Sepeda', 'Motor'],
    relatedTags: ['Kunci L', 'Multitool', 'Perkakas Sepeda'],
    description:
      'Perkakas lipat serbaguna berisi set kunci L berbagai ukuran dan mata obeng yang terlipat rapi dalam satu gagang. Sekali genggam, hampir semua baut umum di sepeda, motor, dan perabot rumah bisa ditangani.',
    benefits: [
      'Beberapa ukuran kunci L dan obeng terkumpul dalam satu alat',
      'Terlipat ringkas, muat di saku, tas sepeda, atau jok motor',
      'Rangka kokoh untuk pemakaian berulang sehari-hari',
    ],
    keyPoints: [
      'Buka mata kunci yang dibutuhkan, sisanya tetap terlipat rapi di gagang',
      'Cocok untuk setel stang, sadel, rem sepeda, hingga rakit perabot',
      'Pengganti praktis satu kotak kunci saat bepergian',
    ],
    idealFor: ['Pesepeda', 'Pengendara motor', 'Perbaikan rumah', 'Dibawa bepergian'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 154,
    soldCount: 980,
    reviews: [
      {
        name: 'Mas Andri',
        location: 'Semarang, Jawa Tengah',
        avatar: '/images/petani/petani-07.webp',
        verified: true,
        date: '2026-07-06',
        comment:
          'Selalu masuk tas kalau gowes. Setel sadel, stang, sama kencangin baut botol minum cukup satu alat ini. Lipatannya kokoh, tidak oblak.',
        rating: 5,
      },
      {
        name: 'Pak Yusuf',
        location: 'Depok, Jawa Barat',
        avatar: '/images/petani/petani-08.webp',
        verified: true,
        date: '2026-06-27',
        comment:
          'Saya simpan di bagasi motor. Kepakai banget waktu spion kendor di jalan. Ukuran kunci L-nya lengkap buat keperluan harian.',
        rating: 5,
      },
      {
        name: 'Bu Sari',
        location: 'Malang, Jawa Timur',
        avatar: '/images/petani/petani-04.webp',
        verified: true,
        date: '2026-06-15',
        comment:
          'Beli buat suami, malah saya yang sering pakai buat rakit rak sama kencangin engsel pintu. Praktis, tidak perlu buka kotak perkakas.',
        rating: 5,
      },
    ],
    variants: [
      { id: 'variant_41lX-U5WU7gqtLpCAd4-JuGE', label: 'Beli 1 Pcs', price: 99000, comparePrice: 169000 },
      { id: 'variant_C5Gr_4EhS4C6YKPQjbVvfUqo', label: 'Beli 2 Pcs', price: 169000, comparePrice: 289000 },
    ],
  },
  {
    slug: 'kunci-shock-universal',
    productId: '434687',
    productName: 'Kepala Kunci Shock Universal',
    contentName: 'Kepala Kunci Shock Universal',
    headline: 'Satu Kepala Kunci untuk Baut 10 sampai 19 mm',
    subheadline:
      'Pin baja di dalam kepala menyesuaikan bentuk mur dan baut secara otomatis. Tidak perlu ganti-ganti mata kunci.',
    seoTitle: 'Kepala Kunci Shock Universal 10-19 mm - Drive 3/8 Inci',
    seoDescription:
      'Kepala kunci shock universal untuk mur dan baut 10-19 mm, drive 3/8 inci. Pin baja menyesuaikan bentuk baut otomatis. Bisa COD.',
    price: 149000,
    comparePrice: 249000,
    image: '/images/produk/kunci-shock-universal.webp',
    heroImage: '/images/produk/kunci-shock-universal.webp',
    tag: 'Perkakas Bengkel',
    category: 'Kunci Shock',
    relatedCategories: ['Perkakas', 'Bengkel', 'Otomotif'],
    relatedTags: ['Kunci Shock', 'Kunci Universal', 'Perkakas Otomotif'],
    description:
      'Kepala kunci shock dengan pin baja per yang menyesuaikan diri ke bentuk mur dan baut ukuran 10 sampai 19 mm. Terpasang ke gagang ratchet standar drive 3/8 inci (9,5 mm), dimensi kepala 24-37 mm dengan tinggi 52 mm.',
    benefits: [
      'Satu kepala mencengkeram mur dan baut ukuran 10 sampai 19 mm',
      'Pin baja otomatis mengikuti bentuk kepala baut, termasuk yang sudah aus',
      'Bodi logam berlapis krom untuk pemakaian bengkel sehari-hari',
    ],
    keyPoints: [
      'Kompatibel dengan gagang ratchet drive 3/8 inci (9,5 mm)',
      'Mengurangi kebutuhan membawa satu set mata kunci lengkap',
      'Dimensi ringkas: diameter 24-37 mm, tinggi 52 mm',
    ],
    idealFor: ['Bengkel rumahan', 'Perawatan motor dan mobil', 'Kotak perkakas serbaguna'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.8,
    reviewCount: 121,
    soldCount: 760,
    reviews: [
      {
        name: 'Pak Gunawan',
        location: 'Bogor, Jawa Barat',
        avatar: '/images/petani/petani-01.webp',
        verified: true,
        date: '2026-07-04',
        comment:
          'Baut ukuran nanggung yang biasanya bikin bingung cari mata kunci, sekarang tinggal tempel langsung nyekam. Dipakai di ratchet 3/8 saya pas.',
        rating: 5,
      },
      {
        name: 'Mas Rendi',
        location: 'Surabaya, Jawa Timur',
        avatar: '/images/petani/petani-03.webp',
        verified: true,
        date: '2026-06-24',
        comment:
          'Buat servis ringan motor di rumah enak banget. Baut yang kepalanya sudah agak aus juga masih bisa dicengkeram pinnya.',
        rating: 5,
      },
      {
        name: 'Pak Slamet',
        location: 'Purwokerto, Jawa Tengah',
        avatar: '/images/petani/petani-08.webp',
        verified: true,
        date: '2026-06-12',
        comment:
          'Isi kotak perkakas jadi ringkas, tidak perlu bawa satu set mata shock. Bahannya berat dan terasa kuat.',
        rating: 4,
      },
    ],
    variants: [
      {
        id: 'variant_vV97itBQ-zXpVQtHk1n-Uh1p',
        label: 'Beli 1 Pcs',
        price: 149000,
        comparePrice: 249000,
      },
      {
        id: 'variant_ia5mPmxhW7zkio5mgpvEbbHW',
        label: 'Beli 2 Pcs',
        price: 289000,
        comparePrice: 489000,
      },
    ],
  },
  {
    slug: 'kapsul-herbal-pinang',
    productId: '439727',
    productName: 'Kapsul Herbal Pinang',
    contentName: 'Kapsul Herbal Pinang Stamina Pria',
    headline: 'STAMINA PRIA MELEJIT TANPA BATAS — Bertenaga Seharian Tanpa Lemah Layu!',
    subheadline:
      'Ekstrak buah pinang pilihan 100% alami untuk dongkrak stamina, vitalitas & kebugaran pria dewasa secara brutal & instan!',
    seoTitle: 'Kapsul Herbal Pinang Stamina Pria - 100% Alami & Berkhasiat',
    seoDescription:
      'Kapsul Herbal Pinang racikan alami stamina pria. Bantu tubuh lebih bugar, bertenaga, & tidak gampang lelah. Bisa COD ke seluruh Indonesia.',
    price: 99000,
    comparePrice: 199000,
    image: '/images/produk/kapsul-herbal-pinang-hero.webp',
    heroImage: '/images/produk/kapsul-herbal-pinang-hero.webp',
    tag: 'Herbal Stamina',
    category: 'Kesehatan Herbal',
    relatedCategories: ['Herbal', 'Kesehatan Pria'],
    relatedTags: ['Kapsul Pinang', 'Stamina Pria', 'Herbal Alami'],
    description:
      'Kapsul Herbal Pinang mengandung ekstrak tanaman obat pilihan yang diproses higienis untuk menjaga daya tahan tubuh dan kebugaran pria sehari-hari.',
    benefits: [
      'Bikin tubuh makin kekar, tegap & tidak gampang loyo',
      'Terbuat dari 100% racikan ekstrak buah pinang murni tanpa bahan kimia',
      'Stamina & daya tahan fisik melonjak drastis seharian',
    ],
    keyPoints: [
      'Formula ramuan herbal tanpa bahan kimia berbahaya',
      'Dikemas rapi & higienis dalam botol tersegel',
      'Bisa kirim COD bayar saat barang tiba di rumah',
    ],
    idealFor: ['Pria dewasa', 'Pekerja keras', 'Kebutuhan stamina harian'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 385,
    soldCount: 2400,
    reviews: [
      {
        name: 'Pak Hery',
        location: 'Tangerang, Banten',
        avatar: '/images/petani/petani-01.webp',
        verified: true,
        date: '2026-07-28',
        comment:
          'Sumpah kaget banget pas nyoba! Badan terasa jauh lebih bugar dan stamina terjaga seharian full. Istri sampai geleng-geleng!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_aEe_TQwyLZJWWGFKPVNNZxJW',
        label: '1 Botol (50)',
        price: 99000,
        comparePrice: 199000,
      },
      {
        id: 'variant_L8VLq40xU0EAdE3UXXmKcxyU',
        label: '2 Botol (100)',
        price: 199000,
        comparePrice: 349000,
      },
    ],
  },
  {
    slug: 'kapsul-brotowali',
    productId: '439725',
    productName: 'Kapsul Brotowali',
    contentName: 'Kapsul Brotowali Herbal Alami',
    headline: 'JAMU HERBAL TANPA PAHITT — Gula Darah Stabil & Pegal Linu Hilang Seketika!',
    subheadline:
      'Manfaat ekstrak tanaman brotowali murni untuk rontokkan pegal linu, bersihkan darah, & jaga imun tubuh tanpa pahit!',
    seoTitle: 'Kapsul Brotowali Herbal Alami - Bantu Jaga Imun & Kebugaran',
    seoDescription:
      'Kapsul Brotowali ramuan tradisional praktis tanpa rasa pahit. Membantu menjaga kesehatan tubuh & stamina harian. Bisa COD.',
    price: 125000,
    comparePrice: 199000,
    image: '/images/produk/kapsul-brotowali-hero.webp',
    heroImage: '/images/produk/kapsul-brotowali-hero.webp',
    tag: 'Herbal Kesehatan',
    category: 'Kesehatan Herbal',
    relatedCategories: ['Herbal', 'Kesehatan'],
    relatedTags: ['Brotowali', 'Jamu Kapsul', 'Herbal Alami'],
    description:
      'Ekstrak Brotowali murni yang dikemas dalam bentuk kapsul sehingga praktis dikonsumsi tanpa rasa pahit berlebih di lidah.',
    benefits: [
      'Lumpuhkan pegal linu & capek di persendian seketika',
      'Bantu normalkan kadar gula darah secara aman',
      'Praktis diminum tanpa perlu ngerasain rasa pahit enek',
    ],
    keyPoints: [
      'Ekstrak brotowali murni higienis',
      'Aman untuk dikonsumsi rutin sesuai aturan',
      'Pengiriman cepat & garansi COD',
    ],
    idealFor: ['Menjaga kesehatan harian', 'Orang tua & dewasa', 'Pekerja aktif'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 342,
    soldCount: 1890,
    reviews: [
      {
        name: 'Bu Warsini',
        location: 'Boyolali, Jawa Tengah',
        avatar: '/images/petani/petani-02.webp',
        verified: true,
        date: '2026-07-29',
        comment:
          'Dulu menderita pegal linu bertahun-tahun & males minum jamu brotowali karena pahit banget. Pas nyoba kapsul ini langsung hilang capeknya!',
        rating: 5,
      },
    ],
    variants: [
      { id: 'variant_i1HSC42_byCV7Fp4Uc_pysqg', label: 'Beli 1 Botol', price: 125000, comparePrice: 199000 },
      { id: 'variant_ru071bcPfpz-Q6zvh5XJnyKK', label: 'Beli 2 Botol', price: 199000, comparePrice: 299000 },
      {
        id: 'variant_10rsFGU2Qk53xEyB3WjSjLmH',
        label: 'Beli 3 Botol',
        price: 298000,
        comparePrice: 449000,
      },
    ],
  },
  {
    slug: 'teh-kunyit-jahe',
    productId: '439712',
    productName: 'Teh Kunyit Jahe',
    contentName: 'Teh Kunyit Jahe Herbal Hangat',
    headline: 'RAHASIA LAMBUNG ADEM & BADAN SEGAR — Rontokkan Lemak Jahat & Masuk Angin!',
    subheadline:
      'Seduhan ajaib kunyit & jahe murni celup. Tenggorokan plong, perut nyaman, & badan hangat sepanjang malam!',
    seoTitle: 'Teh Kunyit Jahe Celup Herbal - Alami & Menyegarkan',
    seoDescription:
      'Teh celup kunyit jahe nikmat dan menyehatkan. Cocok untuk kehangatan tubuh & lambung sehat. Bisa COD seluruh Indonesia.',
    price: 104000,
    comparePrice: 179000,
    image: '/images/produk/teh-kunyit-jahe-real-hero.webp',
    heroImage: '/images/produk/teh-kunyit-jahe-real-hero.webp',
    tag: 'Teh Herbal',
    category: 'Minuman Kesehatan',
    relatedCategories: ['Teh', 'Herbal'],
    relatedTags: ['Teh Kunyit', 'Teh Jahe', 'Herbal Celup'],
    description:
      'Teh celup ramuan alami kunyit dan jahe pilihan yang memberikan rasa hangat khas dan aroma menyegarkan untuk rileksasi tubuh.',
    benefits: [
      'Menghangatkan badan & seketika melegakan pernapasan',
      'Bikin lambung & pencernaan terasa super adem dan bebas kembung',
      'Kantong celup higienis siap seduh kapan saja',
    ],
    keyPoints: [
      '100% racikan rimpang kunyit & jahe alami',
      'Tanpa pengawet & pemanis buatan',
      'Bisa bayar di tempat (COD)',
    ],
    idealFor: ['Penyeduh teh harian', 'Orang yang gampang masuk angin', 'Rileksasi malam'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 410,
    soldCount: 3500,
    reviews: [
      {
        name: 'Mbak Ratna',
        location: 'Malang, Jawa Timur',
        avatar: '/images/petani/petani-04.webp',
        verified: true,
        date: '2026-07-26',
        comment:
          'Sumpah rasanya hangat nikmat banget! Perut saya yang gampang kembung langsung lega dan adem dalam hitungan menit.',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_xelex9k8WUV_BolN8wfCqseO',
        label: '20 Kantong',
        price: 104000,
        comparePrice: 179000,
      },
      {
        id: 'variant_xBIIyY2EpcqelB5gC7OIk70B',
        label: '30 Kantong',
        price: 119000,
        comparePrice: 219000,
      },
      {
        id: 'variant_Lme8K4ukWwTQc4QvwSe59wxP',
        label: '50 Kantong',
        price: 179000,
        comparePrice: 299000,
      },
    ],
  },
  {
    slug: 'teh-daun-insulin',
    productId: '439708',
    productName: 'Teh Daun Insulin',
    contentName: 'Teh Daun Insulin Herbal',
    headline: 'GULA DARAH STABIL KEMBALI NORMAL — Rahasia Bebas Lemah & Tubuh Segar Bugar!',
    subheadline:
      'Seduhan ajaib daun insulin pilihan murni dalam kantong celup praktis untuk memelihara gula darah & stamina harian.',
    seoTitle: 'Teh Daun Insulin Herbal Celup - Bantu Kontrol Gula Darah',
    seoDescription:
      'Teh celup daun insulin herbal alami. Solusi segar & praktis bantu jaga kadar gula darah & tubuh segar. Bisa COD.',
    price: 99000,
    comparePrice: 179000,
    image: '/images/produk/teh-daun-insulin-hero.webp',
    heroImage: '/images/produk/teh-daun-insulin-hero.webp',
    tag: 'Teh Herbal',
    category: 'Minuman Kesehatan',
    relatedCategories: ['Teh', 'Herbal'],
    relatedTags: ['Daun Insulin', 'Teh Herbal', 'Kadar Gula'],
    description:
      'Teh celup berbahan dasar daun insulin (Smallanthus sonchifolius) alami yang diproses rapi untuk menyajikan minuman herbal kaya manfaat.',
    benefits: [
      'Bantu normalkan kadar gula darah secara bertahap & aman',
      'Kembalikan stamina tubuh yang sering lemas & ngantukan',
      'Seduhan nikmat praktis siap minum setiap hari',
    ],
    keyPoints: ['Daun insulin murni tanpa campuran kimia', 'Kantong teh celup higienis', 'Bisa bayar tunai saat COD'],
    idealFor: ['Penderita gula darah tinggi', 'Kesehatan lansia & dewasa', 'Konsumsi herbal rutin'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 430,
    soldCount: 3600,
    reviews: [
      {
        name: 'Pak Slamet',
        location: 'Klaten, Jawa Tengah',
        avatar: '/images/petani/petani-05.webp',
        verified: true,
        date: '2026-07-24',
        comment:
          'Cek gula darah rutin setelah minum teh ini langsung turun stabil! Badan terasa enteng dan tidak cepat lelah lagi.',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_pofINwpbb3Leejn6_dgRHUHI',
        label: '20 Kantong',
        price: 99000,
        comparePrice: 179000,
      },
      {
        id: 'variant_tgYotypggbvS9jLHekfPhrAe',
        label: '30 Kantong',
        price: 119000,
        comparePrice: 219000,
      },
      {
        id: 'variant_omw5SQLxCOz9UXhcgFlJk-Pg',
        label: '50 Kantong',
        price: 179000,
        comparePrice: 299000,
      },
    ],
  },
  {
    slug: 'kapsul-kumis-kucing',
    productId: '439706',
    productName: 'Kapsul Kumis Kucing',
    contentName: 'Kapsul Kumis Kucing Herbal',
    headline: 'KENCING LANCAR & PLONG SEKETIKA — Peluruh Batu Ginjal & Infeksi Saluran Kemih!',
    subheadline:
      'Ekstrak daun kumis kucing pekat untuk hancurkan batu ginjal, atasi kencing anyang-anyangan & perih seketika!',
    seoTitle: 'Kapsul Kumis Kucing Herbal - Perlancar Buang Air & Ginjal',
    seoDescription:
      'Kapsul kumis kucing ekstrak alami. Membantu melancarkan buang air kecil & kesehatan saluran kemih. Bisa COD.',
    price: 119000,
    comparePrice: 199000,
    image: '/images/produk/kapsul-kumis-kucing-hero.webp',
    heroImage: '/images/produk/kapsul-kumis-kucing-hero.webp',
    tag: 'Herbal Kesehatan',
    category: 'Kesehatan Herbal',
    relatedCategories: ['Herbal', 'Kesehatan'],
    relatedTags: ['Kumis Kucing', 'Saluran Kemih', 'Kapsul Ginjal'],
    description:
      'Kapsul ekstrak Kumis Kucing (Orthosiphon aristatus) alami yang dikenal secara tradisional untuk membantu melancarkan air seni dan meluruhkan sisa kotoran ginjal.',
    benefits: [
      'Bikin buang air kecil super lancar, deras & bebas rasa perih',
      'Peluruh alami sisa kotoran & endapan batu di saluran ginjal',
      'Atasi kencing anyang-anyangan secara cepat dan tuntas',
    ],
    keyPoints: [
      'Bahan herbal tradisional murni',
      'Aman dikonsumsi sesuai aturan pakai',
      'Pengiriman COD cepat ke seluruh Indonesia',
    ],
    idealFor: ['Kesehatan saluran kemih', 'Orang tua & pria/wanita dewasa', 'Pencegahan gangguan ginjal'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 365,
    soldCount: 2950,
    reviews: [
      {
        name: 'Pak Hendra',
        location: 'Cirebon, Jawa Barat',
        avatar: '/images/petani/petani-03.webp',
        verified: true,
        date: '2026-07-22',
        comment:
          'Dulu tiap mau kencing perih dan sakit banget sampai nangis. Minum kapsul ini 2 hari langsung PLONG deras banget kencingnya!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant__YoY3n0QGt4Yt9J-9GgRKxb1',
        label: '1 Botol (50)',
        price: 119000,
        comparePrice: 199000,
      },
      {
        id: 'variant_U2_nupA3wc2A-SNyfLoOKhev',
        label: '2 Botol (100)',
        price: 199000,
        comparePrice: 299000,
      },
    ],
  },
  {
    slug: 'obat-rayap',
    productId: '440002',
    productName: 'Obat Rayap Rayentra DGV',
    contentName: 'Obat Rayap Rayentra DGV Super Ampuh',
    headline: 'BASMI RAYAP SAMPAI KE RATUNYA! — Kayu & Perabot Rumah Aman 100%!',
    subheadline:
      'Formula pembasmi rayap semprot sistemik pekat. Sekali semprot, rayap mati massal sampai ke sarang dan ratunya!',
    seoTitle: 'Obat Pembasmi Rayap Rayentra DGV - Basmi Sampai Sarang & Ratu',
    seoDescription:
      'Obat rayap semprot ampuh Rayentra DGV. Membasmi rayap kayu, tanah, & pondasi rumah sampai ke sarang & ratunya. Garansi COD.',
    price: 104000,
    comparePrice: 189000,
    image: '/images/produk/obat-rayap-hero.webp',
    heroImage: '/images/produk/obat-rayap-hero.webp',
    tag: 'Perkakas Rumah',
    category: 'Pemberantas Hama',
    relatedCategories: ['Pest Control', 'Perkakas'],
    relatedTags: ['Obat Rayap', 'Rayentra DGV', 'Pembasmi Rayap'],
    description:
      'Cairan pembasmi rayap sistemik Rayentra DGV yang bekerja cepat meresap ke dalam serat kayu dan sarang tanah untuk memusnahkan koloni rayap secara total.',
    benefits: [
      'Membasmi rayap kayu & tanah secara total sampai ke ratunya',
      'Mencegah rayap datang kembali menggerogoti pintu, kusen, & plafon',
      'Formula tidak merusak warna atau finishing kayu rumah',
    ],
    keyPoints: [
      'Semprotan praktis siap pakai tanpa racun berbau sengat',
      'Bekerja sistemik menular ke seluruh koloni rayap',
      'Bisa bayar tunai COD saat paket tiba',
    ],
    idealFor: ['Kusen pintu & jendela', 'Plafon & atap kayu', 'Perabot lemari kayu'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 260,
    soldCount: 1450,
    reviews: [
      {
        name: 'Pak Mulyono',
        location: 'Depok, Jawa Barat',
        avatar: '/images/petani/petani-08.webp',
        verified: true,
        date: '2026-07-31',
        comment:
          'Kusen pintu rumah saya yang udah keropos digerogoti rayap langsung bersih gak ada rayap sama sekali setelah disemprot ini!',
        rating: 5,
      },
    ],
    variants: [
      { id: 'variant_obat_rayap_1', label: 'Beli 1 Botol', price: 104000, comparePrice: 189000 },
      { id: 'variant_obat_rayap_2', label: 'Beli 2 Botol', price: 179000, comparePrice: 299000 },
    ],
  },
  {
    slug: 'cardoor-pro',
    productId: '440273',
    productName: 'Cardoor Pro Peredam Pintu Mobil',
    contentName: 'Cardoor Pro Bantal Peredam Pintu Mobil',
    headline: 'TUTUP PINTU MOBIL JADI HALUS & KEDAP — Lindungi Dari Benturan & Lecet Serta Meredam Bising!',
    subheadline:
      'Bantalan karet silikon peredam benturan pintu mobil. Pemasangan pnp mudah, fleksibel untuk pintu, kap mesin & bagasi belakang. Paket isi 4 pcs, garansi COD.',
    seoTitle: 'Cardoor Pro Bantal Peredam Pintu Mobil Anti Benturan & Bising',
    seoDescription:
      'Cardoor Pro peredam benturan pintu mobil. Redam suara tutup pintu banting, lindungi lecet body, perekat 3M super kuat. Paket 4 pcs, garansi COD.',
    price: 79000,
    comparePrice: 149000,
    image: '/images/produk/cardoor-pro-hero.webp',
    heroImage: '/images/produk/cardoor-pro-hero.webp',
    tag: 'Aksesori Otomotif',
    category: 'Perkakas Otomotif',
    relatedCategories: ['Otomotif', 'Aksesori Mobil', 'Peredam'],
    relatedTags: ['Cardoor Pro', 'Peredam Pintu', 'Aksesori Mobil'],
    description:
      'Cardoor Pro bantalan silikon pelindung peredam benturan pintu mobil, kap mesin, dan bagasi belakang. Mengurangi getaran bising & mencegah benturan keras.',
    benefits: [
      'Redam benturan keras saat pintu mobil ditutup banting',
      'Melindungi cat pintu mobil dari risiko benturan lecet',
      'Perekat 3M tahan air anti lepas meski dicuci mobil',
    ],
    keyPoints: [
      'Bahan silikon tebal elastis & tahan panas',
      'Mudah dipasang PNP tanpa perlu merusak cat',
      'Bisa bayar tunai saat COD',
    ],
    idealFor: [
      'Pemilik mobil pribadi harian',
      'Mobil keluarga & armada taksi/travel',
      'Perlindungan bodi mobil dari lecet',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 520,
    soldCount: 2400,
    reviews: [
      {
        name: 'Pak Gunawan',
        location: 'Tangerang, Banten',
        avatar: '/images/petani/petani-08.webp',
        verified: true,
        date: '2026-08-03',
        comment:
          'Dipasang di 4 pintu mobil Avanza saya, pas ditutup suara "bleg"-nya jadi halus banget kayak mobil mewah! Perekatnya kuat banget.',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_dr0bVgxrmP1xQQ_ifOY32WVc',
        label: 'Logo (4 Pcs)',
        price: 99000,
        comparePrice: 179000,
      },
      {
        id: 'variant_IAYW7dGp4mlBhwmhEeIXuaX6',
        label: 'Polos (4 Pcs)',
        price: 79000,
        comparePrice: 149000,
      },
    ],
  },
  {
    slug: 'pompa-air-portable',
    productId: '440391',
    productName: 'Pompa Bensin & Cairan Manual Siphon',
    contentName: 'Pompa Tangan Manual Transfer Bensin & Cairan Siphon',
    headline: 'POMPA MANUAL SEDOT BENSIN & CAIRAN — Kuras Bensin, Oli & Air Praktis Tanpa Disedot Mulut!',
    subheadline:
      'Alat pompa tangan siphon manual tebal dengan bola sedot karet fleksibel & klem pengunci. Kuras bensin tangki motor/mobil, kuras oli & air aman tanpa butuh listrik!',
    seoTitle: 'Pompa Bensin Manual & Transfer Cairan Siphon: Kuras Bensin & Air Aman Tanpa Colokan',
    seoDescription:
      'Pompa Manual Transfer Bensin, Oli & Air Siphon. Praktis kuras bensin tangki motor/mobil, oli mesin & air aquarium aman tanpa disedot mulut. Garansi COD Rp 79rb.',
    price: 79000,
    comparePrice: 159000,
    image: '/images/pompa-portable/pompa-portable-hero.webp',
    heroImage: '/images/pompa-portable/pompa-portable-hero.webp',
    tag: 'Perkakas Otomotif',
    category: 'Perkakas Otomotif',
    relatedCategories: ['Perkakas', 'Otomotif', 'Pompa Bensin', 'Rumah Tangga'],
    relatedTags: ['Pompa Bensin', 'Pompa Manual', 'Siphon Pump', 'Kuras Bensin'],
    description:
      'Alat pompa tangan manual siphon fleksibel yang dilengkapi bola pompa karet elastis dengan katup penahan arus balik (anti-backflow valve) dan selang transparan tebal. Sangat praktis untuk menguras bensin tangki kendaraan, menguras oli, aquarium, hingga galon air tanpa perlu dicolok listrik atau disedot menggunakan mulut.',
    benefits: [
      'Aliran cairan cepat dengan katup penahan arus balik anti-backflow',
      'Praktis & aman 100% bebas risiko bensin tersedot ke mulut',
      'Desain portable tanpa butuh listrik/baterai, siap dipakai saat darurat',
    ],
    keyPoints: [
      'Bola pompa karet tebal & selang transparan elastis',
      'Klem besi pengunci mencegah kebocoran cairan',
      'Multifungsi untuk bensin, solar, oli, & air',
    ],
    idealFor: [
      'Penyedotan & transfer bensin/solar darurat',
      'Pengurasan oli mesin kendaraan motor & mobil',
      'Pengurasan bak mandi, aquarium & galon air',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 380,
    soldCount: 2150,
    reviews: [
      {
        name: 'Pak Sugeng Priyadi',
        location: 'Semarang, Jawa Tengah',
        avatar: '/images/petani/petani-01.webp',
        verified: true,
        date: '2026-08-05',
        comment:
          'Sangat berguna saat motor mogok habis bensin di jalan. Tinggal pompa 2-3 kali pakai bola karetnya, bensin langsung mengalir lancar dari mobil ke jerigen tanpa perlu mulut disedot!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_yVx7dQNTFg9zISsOIg2ithWm',
        label: 'Beli 1 Set',
        price: 79000,
        comparePrice: 159000,
      },
      {
        id: 'variant_kywV1KIW8sBxo5KVZiZUkxcM',
        label: 'Beli 2 Set',
        price: 169000,
        comparePrice: 299000,
      },
    ],
  },
  {
    slug: 'pasta-perbaikan-dinding',
    productId: '440665',
    productName: 'Reparo Pasta Perbaikan Dinding Instant',
    contentName: 'Reparo Pasta Penambal Perbaikan Dinding Retak Anti Air Anti Jamur 500g',
    headline: 'PASTA PERBAIKAN DINDING REPARO — Tambal Retak & Rembesan Dinding Rapi Halus Instan Tanpa Tukang!',
    subheadline:
      'Formula ajaib pasta penambal dinding instan REPARO. Retak rambut, dinding bocor lembap, lubang paku, & jamur langsung hilang permanen menyatu dengan warna cat dinding!',
    seoTitle: 'Reparo Pasta Perbaikan Dinding Retak Anti Air & Jamur: Tambal Dinding Instan',
    seoDescription:
      'Reparo Pasta Perbaikan Dinding Retak 500g. Cepat kering, tahan air anti jamur, mudah dipakai DIY tanpa tukang, warna putih halus menyatu cat. COD Rp 99rb.',
    price: 99000,
    comparePrice: 198000,
    image: '/images/pasta-dinding/pasta-dinding-hero.webp',
    heroImage: '/images/pasta-dinding/pasta-dinding-hero.webp',
    tag: 'Perkakas Rumah',
    category: 'Perkakas Rumah',
    relatedCategories: ['Bangunan', 'DIY', 'Perbaikan Dinding', 'Anti Bocor'],
    relatedTags: ['Pasta Dinding', 'Reparo', 'Penambal Dinding', 'Dinding Retak', 'Anti Jamur'],
    description:
      'REPARO Pasta Perbaikan Dinding Instan 500 gram solusi praktis menambal dinding retak, rembesan bocor, lubang bekas paku, hingga dinding berjamur. Cepat kering, tahan air & anti jamur, warna putih bening menyatu dengan warna tembok asli tanpa meninggalkan bekas guratan kasar.',
    benefits: [
      'Menambal retak dinding & rembesan air rapi halus instan dalam 5 menit',
      'Formula kedap air & anti jamur mencegah kerusakan dinding berulang',
      'Mudah dipakai sendiri (DIY) tanpa perlu panggil tukang mahal',
    ],
    keyPoints: [
      'Cepat kering, kuat, & warna putih menyatu dengan cat tembok',
      'Bebas bau menyengat & aman ramah lingkungan (Non-toxic)',
      'Bisa bayar tunai di tempat (COD) & garansi rapi',
    ],
    idealFor: [
      'Pemilik rumah dengan dinding retak atau rembesan bocor',
      'Perbaikan lubang bekas paku & bekas kupasan cat lama',
      'DIY perbaikan interior & eksterior rumah praktis',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 420,
    soldCount: 2350,
    reviews: [
      {
        name: 'Pak Sugeng Widodo',
        location: 'Semarang, Jawa Tengah',
        avatar: '/images/petani/petani-07.webp',
        verified: true,
        date: '2026-08-07',
        comment:
          'Dinding kamar yang retak rambut dan lembap bekas rembes air hujan langsung mulus lagi pakai Reparo! Caranya gampang banget tinggal oles pakai kape lalu ratakan. Keringnya cepat & warnanya menyatu sama cat!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_Qyx9moWXcxqYdTYw0y41vo9P',
        label: '1 Tub 500g',
        price: 99000,
        comparePrice: 198000,
      },
    ],
  },
  {
    slug: 'vegetable-big-cutter',
    productId: '440672',
    productName: 'Vegetable Big Cutter 14 in 1 Multifungsi',
    contentName: 'Vegetable Big Cutter Alat Pemotong Parutan Sayur Buah Multifungsi Jumbo 14 in 1',
    headline:
      'VEGETABLE BIG CUTTER 14 IN 1 — Potong, Iris, & Parut Sayur Buah Presisi Rapi 10x Lebih Cepat Tanpa Takut Teriris!',
    subheadline:
      'Alat potong pemotong sayur & buah jumbo multifungsi 14 in 1. Potong dadu, iris tipis renyah, & parut halus kilat hanya dalam hitungan detik. Dilengkapi wadah jumbo & penutup pelindung tangan anti teriris!',
    seoTitle: 'Vegetable Big Cutter 14 in 1 Multifungsi: Alat Pemotong Parut Sayur Jumbo',
    seoDescription:
      'Vegetable Big Cutter 14 in 1 Multifungsi. Pisau stainless ultra tajam, wadah jumbo 2L, pelindung tangan aman, bahan food grade BPA free. Promo COD Rp 105rb.',
    price: 105000,
    comparePrice: 220000,
    image: '/images/vegetable-cutter/cutter-hero.webp',
    heroImage: '/images/vegetable-cutter/cutter-hero.webp',
    tag: 'Dapur & Masak',
    category: 'Perkakas Rumah',
    relatedCategories: ['Dapur', 'Alat Masak', 'Pemotong Sayur', 'Parutan'],
    relatedTags: ['Vegetable Cutter', 'Pemotong Sayur', 'Parutan Multifungsi', 'Dapur Praktis'],
    description:
      'Vegetable Big Cutter 14 in 1 Jumbo alat pemotong dan parutan sayur buah multifungsi serbaguna. Dilengkapi 7 mata pisau stainless steel super tajam anti karat, wadah penampung transparan kapasitas besar, pegangan ergonomis, serta fitur Safety Hand Guard agar jari aman dari bahaya teriris pisau.',
    benefits: [
      'Memotong, mengiris & memarut sayur/buah 10x lebih cepat presisi rapi',
      'Dilengkapi Safety Hand Guard melindungi jari 100% aman dari pisau tajam',
      'Wadah penampung jumbo 2 Liter menjaga meja dapur tetap bersih tanpa berantakan',
    ],
    keyPoints: [
      '7 mata pisau stainless steel ultra tajam & tahan karat',
      'Bahan Food Grade BPA Free tebal tahan benturan',
      'Bisa bayar tunai di tempat (COD) & garansi rapi',
    ],
    idealFor: [
      'Ibu rumah tangga & pengusaha katering/kuliner',
      'Persiapan bumbu & potongan sayur tumis/sup kilat',
      'Potongan kentang goreng, salad, & buah segar rapi',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 510,
    soldCount: 3120,
    reviews: [
      {
        name: 'Bu Hajjah Nurul',
        location: 'Surabaya, Jawa Timur',
        avatar: '/images/petani/petani-dewi.webp',
        verified: true,
        date: '2026-08-07',
        comment:
          'Sangat membantu di dapur! Ngeracang bawang, kentang, dan wortel buat sup langsung kelar dalam 2 menit. Wadah tampungnya besar dan ada alat pendorong jari jadi tidak takut kena pisau. Recommended banget!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_5zL2yIup6FmR0VGxlwcQremH',
        label: '14 in 1 Jumbo',
        price: 105000,
        comparePrice: 220000,
      },
    ],
  },
  {
    slug: 'bibit-sawo-sawesta',
    productId: '440746',
    productName: 'Bibit Sawo Sawesta Super Jumbo',
    contentName: 'Bibit Sawo Sawesta Okulasi Super Manis Genjah Berbuah Lebat',
    headline: 'BIBIT SAWO SAWESTA SUPER JUMBO — Buah Manis Legit Berbuah Lebat Genjah 1-2 Tahun di Pot Teras!',
    subheadline:
      'Bibit Sawo Sawesta varietas unggul okulasi. Ukuran buah jumbo tebal daging manis pasir tanpa asam, pohon sangat genjah cepat berbuah lebat walau ditanam di pot teras rumah!',
    seoTitle: 'Bibit Sawo Sawesta Super Jumbo: Cepat Berbuah Genjah di Pot Teras',
    seoDescription:
      'Bibit Sawo Sawesta Jumbo Okulasi Super Manis. Daging buah tebal legit tanpa asam, pohon genjah cepat berbuah di pot/lahan. Garansi COD Rp 99rb.',
    price: 99000,
    comparePrice: 250000,
    image: '/images/sawo/sawo-hero.webp',
    heroImage: '/images/sawo/sawo-hero.webp',
    tag: 'Tanaman Buah',
    category: 'Tanaman Buah',
    relatedCategories: ['Bibit', 'Buah', 'Tabulampot', 'Pertanian'],
    relatedTags: ['Bibit Sawo', 'Sawo Sawesta', 'Sawo Jumbo', 'Bibit Okulasi'],
    description:
      'Bibit Sawo Sawesta Jumbo varietas unggulan hasil okulasi vegetatif. Memiliki daging buah sangat tebal, tekstur manis pasir legit tanpa rasa asam, serta pohon sangat genjah yang mampu berbuah lebat berdompol-dompol walau ditanam di pot teras rumah (Tabulampot).',
    benefits: [
      'Buah Sawo Sawesta berukuran jumbo dengan rasa manis legit pasir khas',
      'Bibit hasil okulasi vegetatif genjah cepat berbuah dalam 1-2 tahun',
      'Pohon sangat tahan panas & cepat adaptif di dataran rendah maupun tinggi',
    ],
    keyPoints: [
      'Bibit okulasi unggulan genjah berbuah melimpah',
      'Sangat cocok untuk Tabulampot pot teras & lahan pekarangan',
      'Bisa bayar tunai di tempat (COD) & garansi bibit segar',
    ],
    idealFor: [
      'Pebisnis kebun buah & pecinta tabulampot teras rumah',
      'Konsumsi buah sawo super manis legit keluarga',
      'Investasi tanaman buah bernilai ekonomis tinggi',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 380,
    soldCount: 2150,
    reviews: [
      {
        name: 'Pak Haji Mustofa',
        location: 'Kudus, Jawa Tengah',
        avatar: '/images/petani/petani-01.webp',
        verified: true,
        date: '2026-08-07',
        comment:
          'Bibit Sawo Sawesta okulasi yang dikirim sangat segar & batangnya kokoh! Tanam 1.5 tahun di pot teras rumah langsung keluar bakal buah berdompol-dompol. Buahnya besar & manis legit banget!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_tGfubtzWENvwYU_46JrerwCs',
        label: '1 Pohon',
        price: 99000,
        comparePrice: 250000,
      },
      {
        id: 'variant_h8YcKebouNaOzT_SIKY3orFg',
        label: '2 Pohon',
        price: 149000,
        comparePrice: 400000,
      },
      {
        id: 'variant_vAtYpy4bx6CkB5tVbvvD3mYd',
        label: '3 Pohon',
        price: 199000,
        comparePrice: 550000,
      },
    ],
  },
  {
    slug: 'kacamata-anti-radiasi',
    productId: '440751',
    productName: 'Kacamata Anti Radiasi Blueray Photochromic',
    contentName: 'Kacamata Anti Radiasi Blueray Photochromic Filter Sinar Biru UV 400',
    headline:
      'KACAMATA ANTI RADIASI BLUERAY PHOTOCHROMIC — Bebas Mata Lelah & Pusing 100% Lindungi Mata Dari Radiasi HP/Komputer!',
    subheadline:
      'Kacamata anti radiasi dual action Blueray & Photochromic. Otomatis tangkal 99% radiasi sinar biru layar gadget & otomatis berubah gelap saat terkena sinar matahari UV!',
    seoTitle: 'Kacamata Anti Radiasi Blueray Photochromic: Filter Sinar Biru & UV 400',
    seoDescription:
      'Kacamata Anti Radiasi Blueray Photochromic. Lensa ganda tangkal sinar biru gadget & berubah gelap outdoor UV 400. Frame titanium ringan promo COD Rp 99rb.',
    price: 99000,
    comparePrice: 250000,
    image: '/images/kacamata-radiasi/kacamata-hero.webp',
    heroImage: '/images/kacamata-radiasi/kacamata-hero.webp',
    tag: 'Aksesoris & Fashion',
    category: 'Fashion & Kesehatan',
    relatedCategories: ['Kacamata', 'Kesehatan Mata', 'Anti Radiasi', 'Photochromic'],
    relatedTags: ['Kacamata Anti Radiasi', 'Lensa Blueray', 'Lensa Photochromic', 'Kacamata HP Komputer'],
    description:
      'Kacamata Anti Radiasi Blueray Photochromic teknologi lensa pintar terkini. Memfilter radiasi sinar biru (blue light) berbahaya dari gadget HP, laptop, dan TV serta secara otomatis bertransisi menjadi gelap saat berada di bawah terik matahari outdoor. Dilengkapi frame titanium alloy ultra ringan, fleksibel anti patah, & desain stylish unisex cocok untuk pria maupun wanita.',
    benefits: [
      'Menghilangkan mata lelah, perih, berair, & pusing akibat menatap layar HP/laptop berjam-jam',
      'Dual Lensa: Blueray (filter layar indoor) + Photochromic (transisi gelap matahari outdoor)',
      'Frame Titanium Alloy ultra ringan anti patah & sangat nyaman dipakai seharian',
    ],
    keyPoints: [
      'Lensa 100% Blueray Cut & UV 400 Protection',
      'Frame Titanium Alloy fleksibel anti patah & unisex',
      'Bisa bayar tunai di tempat (COD) & lengkap bonus hardcase',
    ],
    idealFor: [
      'Pekerja kantoran, gamer, & pengguna HP/laptop harian',
      'Pengendara motor/mobil yang sering terpapar terik matahari',
      'Pencegahan mata minus, lelah, & katarak akibat sinar radiasi',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 430,
    soldCount: 2890,
    reviews: [
      {
        name: 'Mas Rizky Pratama',
        location: 'Jakarta Selatan',
        avatar: '/images/petani/petani-07.webp',
        verified: true,
        date: '2026-08-07',
        comment:
          'Keren banget kacamatanya! Kerja depan laptop 8 jam tidak ada lagi mata perih atau pusing. Pas jalan keluar ruangan lansung berubah gelap adem di mata. Frame-nya juga sangat ringan & kokoh!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_Q-wkNwPgly9THiI3bLtdJSYE',
        label: '1 Pcs Standard',
        price: 99000,
        comparePrice: 250000,
      },
    ],
  },
  {
    slug: 'bibit-jeruk-santang',
    productId: '440808',
    productName: 'Bibit Jeruk Santang Madu Super Genjah',
    contentName: 'Bibit Jeruk Santang Madu Okulasi Unggul Cepat Berbuah Manis Tanpa Biji',
    headline:
      'BIBIT JERUK SANTANG MADU SUPER GENJAH — Buah Manis Segar Berbuah Lebat Berdompolan 6-12 Bulan di Pot Teras!',
    subheadline:
      'Bibit Jeruk Santang Madu varietas unggul okulasi. Rasa buah super manis segar berair tanpa biji, pohon sangat genjah langsung rajin berbuah lebat walau ditanam di pot teras rumah!',
    seoTitle: 'Bibit Jeruk Santang Madu Super Genjah: Berbuah Lebat Cepat di Pot Teras',
    seoDescription:
      'Bibit Jeruk Santang Madu Okulasi Super Manis. Berbuah lebat berdompolan 6-12 bulan di pot/lahan, rasa manis segar tanpa biji. Promo COD Rp 99rb.',
    price: 99000,
    comparePrice: 250000,
    image: '/images/jeruk-santang/jeruk-hero.webp',
    heroImage: '/images/jeruk-santang/jeruk-hero.webp',
    tag: 'Tanaman Buah',
    category: 'Tanaman Buah',
    relatedCategories: ['Bibit', 'Buah', 'Jeruk Santang', 'Tabulampot'],
    relatedTags: ['Bibit Jeruk Santang', 'Jeruk Santang Madu', 'Bibit Okulasi', 'Jeruk Tabulampot'],
    description:
      'Bibit Jeruk Santang Madu unggulan hasil okulasi vegetatif. Berasal dari varietas asli asal Asiatik yang sangat terkenal dengan rasa manis legit tanpa biji, aroma harum segar, serta karakter pohon yang sangat genjah (cepat berbuah berdompol-dompol melimpah 6-12 bulan di pot teras rumah).',
    benefits: [
      'Buah Jeruk Santang Madu super manis legit, segar berair, & tanpa biji',
      'Bibit okulasi vegetatif genjah cepat berbuah melimpah dalam 6-12 bulan',
      'Pohon rimbun pendek sangat cantik untuk hiasan Tabulampot teras rumah',
    ],
    keyPoints: [
      'Bibit okulasi unggulan berbuah lebat berdompolan',
      'Sangat genjah & mudah adaptasi di dataran rendah/tinggi',
      'Bisa bayar tunai di tempat (COD) & garansi bibit segar',
    ],
    idealFor: [
      'Pebisnis kebun buah & pecinta hiasan tabulampot teras rumah',
      'Konsumsi jeruk madu segar kaya vitamin C untuk keluarga',
      'Investasi tanaman buah bernilai ekonomis tinggi',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 520,
    soldCount: 3410,
    reviews: [
      {
        name: 'Pak Haji Ahmad',
        location: 'Tangerang, Banten',
        avatar: '/images/petani/petani-01.webp',
        verified: true,
        date: '2026-08-07',
        comment:
          'Bibit Jeruk Santang Madu okulasi yang dikirim segar & rimbun banget! Tanam 8 bulan di pot teras rumah langsung keluar bunga & berbuah lebat berdompol-dompol. Buahnya sangat manis & tidak ada bijinya!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_gDRbVbOsNOWDbaLaGwfloG4S',
        label: '1 Pohon',
        price: 99000,
        comparePrice: 250000,
      },
      {
        id: 'variant_AmTp3ESHxSf8_v6bDPnG1-ef',
        label: '2 Pohon',
        price: 159000,
        comparePrice: 450000,
      },
    ],
  },
  {
    slug: 'lampu-jagung-led',
    productId: '440816',
    productName: 'Lampu Jagung LED E27 3 Warna',
    contentName: 'Lampu Jagung LED E27 3 Warna Cahaya High Power Super Terang',
    headline: 'LAMPU JAGUNG LED E27 3 WARNA — Super Terang 360° Menerangi Seluruh Ruangan Hemat Listrik 90%!',
    subheadline:
      'Lampu Jagung LED E27 dengan 3 pilihan warna cahaya (Cool White, Warm White, Natural White). Desain 360° super terang benderang, hemat listrik 90%, fitting E27 rumahan, & promo Beli 1 Dapat 3 Pcs!',
    seoTitle: 'Lampu Jagung LED E27 3 Warna: Super Terang 360° & Hemat Listrik 90%',
    seoDescription:
      'Lampu Jagung LED E27 3 Warna Cahaya. Super terang 360°, hemat listrik 90%, fitting rumahan E27 standar, awet anti panas. Promo Beli 1 Dapat 3 Pcs Rp 99rb COD.',
    price: 99000,
    comparePrice: 250000,
    image: '/images/lampu/lampu-hero.webp',
    heroImage: '/images/lampu/lampu-hero.webp',
    tag: 'Elektronik & Rumah',
    category: 'Elektronik & Perlengkapan Rumah',
    relatedCategories: ['Lampu Jagung', 'Lampu LED', 'Lampu 3 Warna', 'Hemat Listrik'],
    relatedTags: ['Lampu Jagung LED', 'Lampu E27 3 Warna', 'Lampu Super Terang', 'Lampu Hemat Listrik'],
    description:
      'Lampu Jagung LED E27 3 Warna teknologi pencahayaan hemat energi 360 derajat. Memiliki 3 mode warna cahaya (Putih Cool White, Kuning Warm White, & Natural White) yang bisa diganti secara praktis lewat saklar. Dilengkapi chip LED high power yang sangat awet, hemat listrik hingga 90%, serta sangat pas untuk fitting plafon E27 rumahan.',
    benefits: [
      '3 Warna Cahaya dalam 1 Lampu — Putih Cool White, Kuning Warm White, & Natural White (ganti lewat saklar)',
      'Beli 1 Dapat 3 Pcs / Beli 2 Dapat 6 Pcs — Promo hemat luar biasa khusus hari ini',
      'Pencahayaan 360 Derajat — Menyinari seluruh sudut ruangan terang benderang tanpa bayangan & hemat listrik 90%',
    ],
    keyPoints: [
      '3 Mode Warna Cahaya Praktis Tinggal Klik Saklar',
      'Desain Corn Bulb 360 Derajat Fitting Rumahan E27',
      'Bisa bayar tunai di tempat (COD) & garansi retur',
    ],
    idealFor: [
      'Penerangan ruang tamu, kamar tidur, dapur, teras, toko, & gudang',
      'Penghematan tagihan listrik bulanan rumah tangga',
      'Pencahayaan fleksibel yang bisa disesuaikan dengan suasana ruangan',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 680,
    soldCount: 4210,
    reviews: [
      {
        name: 'Bapak H. Darmawan',
        location: 'Bandung, Jawa Barat',
        avatar: '/images/petani/petani-03.webp',
        verified: true,
        date: '2026-08-07',
        comment:
          'Lampu Jagung LED 3 Warna ini keren & terang banget! Beli 1 dapet 3 pcs harga 99rb murah banget. Bisa diganti warna putih, kuning, & natural tinggal klik saklar. Listrik rumah jadi hemat banget!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_jbFKpSxOv4J6VrIiZH8Qw9uG',
        label: 'Beli 1 Dpt 3',
        price: 99000,
        comparePrice: 250000,
      },
      {
        id: 'variant_E7e_HcR2CBy7jwhT1RGiJadu',
        label: 'Beli 2 Dpt 6',
        price: 149000,
        comparePrice: 450000,
      },
    ],
  },
  {
    slug: 'sealant-cement',
    productId: '441656',
    productName: 'Sealant Cement Dempul Penambal Lubang Praktis',
    contentName: 'Sealant Cement Dempul Penambal Lubang AC Pipa & Dinding Instant',
    headline: 'SEALANT CEMENT PENAMBAL LUBANG PRAKTIS — Solusi Instan Menambal Bocor, Dinding Retak, & Celah Pipa/AC!',
    subheadline:
      'Sealant dempul serbaguna penambal lubang & celah otomatis kering & lunak mudah dibentuk. Tahan air, minyak, panas, & korosi instan tanpa ribet!',
    seoTitle: 'Sealant Cement Dempul Penambal Lubang AC & Dinding Anti Bocor',
    seoDescription:
      'Sealant Cement dempul penambal lubang praktis. Tahan air, minyak, panas & instan otomatis mengeras. Promo Beli 1 Dapat 10 Pcs Rp 99rb COD.',
    price: 99000,
    comparePrice: 185000,
    image: '/images/sealant/sealant-hero.webp',
    heroImage: '/images/sealant/sealant-hero.webp',
    tag: 'Perkakas Rumah',
    category: 'Perkakas Rumah',
    relatedCategories: ['Sealant', 'Dempul', 'Penambal Lubang', 'Perkakas Rumah'],
    relatedTags: ['Sealant Cement', 'Penambal Lubang AC', 'Penambal Pipa Bocor', 'Dempul Instan'],
    description:
      'Sealant dempul penambal lubang praktis serbaguna terbuat dari bahan Rubber and Silicone fleksibel. Dapat digunakan untuk memperbaiki lubang dinding, celah pipa air, alur kabel, dan lubang AC. Otomatis mengeras tahan air, panas, dan korosi.',
    benefits: [
      'Relatif Lebih Cepat Kering Dan Mengeras Otomatis',
      'Formula Disempurnakan Tahan Terhadap Panas, Minyak, Air, & Korosi',
      'Lunak & Sangat Mudah Dibentuk Sesuai Celah / Lubang Dinding',
    ],
    keyPoints: [
      '1 Bungkus Isi 25 Gram Rubber Silicone Premium',
      'Cocok Diaplikasikan Di Beton, Fiberglass, Logam, PVC, Plastik, Kayu, & Aquarium',
      'Garansi COD & Bayar Saat Barang Sampai',
    ],
    idealFor: [
      'Menutup lubang bekas pipa AC & kabel alur dinding',
      'Tambal pipa air bocor & retakan beton/kayu',
      'Perbaikan praktis mandiri rumah tangga tanpa panggil tukang',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Amankan Promo Sekarang',
    ratingValue: 4.9,
    reviewCount: 520,
    soldCount: 3890,
    reviews: [
      {
        name: 'Pak Sugeng Priyanto',
        location: 'Semarang, Jawa Tengah',
        avatar: '/images/petani/petani-04.webp',
        verified: true,
        date: '2026-08-09',
        comment:
          'Sealant dempul cement ini bagus banget! Lubang AC di kamar yang bocor rembes langsung tertutup rapat. Teksturnya gampang dibentuk & cepet kering mengeras. Beli 1 dapet 10 bungkus worth it banget!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_n56aL6x8Cq80ACVTr3WtXyyg',
        label: 'Beli 1 Dpt 10',
        price: 99000,
        comparePrice: 185000,
      },
      {
        id: 'variant_x4mubiqlMf1KBHYDpQAOmvj5',
        label: 'Beli 1 Dpt 20',
        price: 149000,
        comparePrice: 370000,
      },
    ],
  },
  {
    slug: 'lem-jaysuing',
    productId: '441657',
    productName: 'Lem Jaysuing Transparan Anti Bocor & Rembes',
    contentName: 'Lem Jaysuing Transparan Pelapis Anti Bocor Atap Seng Dinding Keramik',
    headline:
      'LEM JAYSUING TRANSPARAN ANTI BOCOR — Lapisan Bening Ajaib Penutup Bocor, Rembesan Dinding & Atap Instan!',
    subheadline:
      'Lem transparan pelapis anti bocor & rembes tahan air, sinar UV, & cuaca ekstrem. Bening tidak merusak estetika dinding, atap, seng, & keramik!',
    seoTitle: 'Lem Jaysuing Transparan Anti Bocor & Rembes Lapisan Bening Ajaib',
    seoDescription:
      'Lem Jaysuing Transparan Anti Bocor & Rembes. Lapisan bening ajaib kedap air 100%, tahan UV & cuaca. Promo Beli 1 Gratis 1 Rp 99rb COD.',
    price: 99000,
    comparePrice: 220000,
    image: '/images/produk/lem-jaysuing.webp',
    heroImage: '/images/produk/lem-jaysuing.webp',
    tag: 'Perkakas Rumah',
    category: 'Perkakas Rumah',
    relatedCategories: ['Lem Transparan', 'Anti Bocor', 'Pelapis Rembes', 'Perkakas Rumah'],
    relatedTags: ['Lem Jaysuing', 'Lem Anti Bocor Transparan', 'Pelapis Anti Rembes', 'Lem Bening'],
    description:
      'Lem Jaysuing Transparan Anti Bocor adalah cairan pelapis bening berteknologi tinggi untuk mengatasi kebocoran pada atap, dinding retak, celah keramik kamar mandi, dak beton, dan pipa. Hasil akhir bening transparan kedap air 100% dan sangat awet.',
    benefits: [
      'Hasil Akhir Bening Transparan — Tidak merusak warna & estetika permukaan',
      'Kedap Air 100% & Tahan Cuaca Ekstrem — Tahan panas terik sinar UV & hujan lebat',
      'Dapat Diaplikasikan Di Segala Permukaan — Beton, semen, keramik, genteng, kayu, & seng',
    ],
    keyPoints: [
      'Pelapis Cairan Bening Transparan Kedap Air',
      'Mudah Dioleskan Menggunakan Kuas / Roll',
      'Garansi COD & Bisa Bayar Saat Barang Sampai',
    ],
    idealFor: [
      'Melapisi dak beton & genteng yang bocor/rembes',
      'Menutup celah nat keramik kamar mandi yang merembes',
      'Melindungi dinding luar dari serapan air hujan',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Amankan Promo Sekarang',
    ratingValue: 4.9,
    reviewCount: 480,
    soldCount: 3420,
    reviews: [
      {
        name: 'Pak Bambang Triyono',
        location: 'Tangerang, Banten',
        avatar: '/images/petani/petani-05.webp',
        verified: true,
        date: '2026-08-09',
        comment:
          'Lem Jaysuing Transparan ini ampuh banget! Atap seng & dak beton rumah pas hujan gak ada bocor rembes lagi. Hasilnya bening rapih gak ngerusak tampilan. Beli 1 dapet 2 kaleng worth it banget!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_bgpWKPMV-QBCZ5isqv58Nf71',
        label: 'Beli 1 Dpt 2',
        price: 99000,
        comparePrice: 220000,
      },
    ],
  },
  {
    slug: 'tutup-makanan',
    productId: '441659',
    productName: 'Tutup Makanan Serbaguna Tudung Saji Lipat Insulasi',
    contentName: 'Tutup Makanan Lipat Serbaguna Penahan Panas Anti Lalat & Debu',
    headline: 'TUTUP MAKANAN SERBAGUNA LIPAT INSULASI — Jaga Makanan Tetap Hangat, Higenis & Bebas Lalat Debu!',
    subheadline:
      'Tudung saji lipat berbahan alumunium foil insulasi panas premium. Melindungi sajian makanan dari lalat, kecoa, & debu sekaligus menjaga kehangatan masakan!',
    seoTitle: 'Tutup Makanan Serbaguna Tudung Saji Lipat Penahan Panas & Anti Lalat',
    seoDescription:
      'Tutup Makanan Serbaguna Tudung Saji Lipat Insulasi Panas. Melindungi makanan dari lalat & debu, praktis bisa dilipat hemat tempat. Promo Rp 99rb COD.',
    price: 99000,
    comparePrice: 199000,
    image: '/images/produk/tutup-makanan.webp',
    heroImage: '/images/produk/tutup-makanan.webp',
    tag: 'Perkakas Dapur',
    category: 'Perkakas Dapur',
    relatedCategories: ['Tutup Makanan', 'Tudung Saji', 'Insulasi Panas', 'Perkakas Dapur'],
    relatedTags: ['Tutup Makanan Lipat', 'Tudung Saji Insulasi', 'Penutup Makanan Anti Lalat', 'Tutup Saji Thermal'],
    description:
      'Tutup Makanan Serbaguna Tudung Saji Lipat Insulasi Panas adalah penutup sajian meja makan praktis modern. Dilengkapi lapisan alumunium foil thermal insulasi tahan panas di bagian dalam yang menjaga kehangatan lauk masakan lebih lama serta mencegah lalat, kecoa, dan debu hinggap. Sangat mudah dilipat dan disimpan.',
    benefits: [
      'Lapisan Alumunium Foil Thermal Insulasi — Jaga hidangan masakan tetap hangat & lezat',
      'Proteksi 100% Anti Lalat, Serangga & Debu — Sajian makanan keluarga lebih higienis & aman',
      'Desain Lipat Praktis Hemat Tempat — Mudah dibuka-tutup & disimpan saat tidak digunakan',
    ],
    keyPoints: [
      'Lapisan Dalam Thermal Foil Penahan Suhu Panas',
      'Bahan Luar Waterproof Tahan Air & Mudah Dibersihkan',
      'Garansi COD & Bayar Tunai Saat Paket Sampai',
    ],
    idealFor: [
      'Menutup lauk-pauk meja makan keluarga sehari-hari',
      'Menjaga makanan hangat saat acara makan bersama',
      'Pengganti tudung saji plastik konvensional yang makan tempat',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Amankan Promo Sekarang',
    ratingValue: 4.9,
    reviewCount: 610,
    soldCount: 4150,
    reviews: [
      {
        name: 'Bu Hajjah Sutarni',
        location: 'Solo, Jawa Tengah',
        avatar: '/images/petani/petani-dewi.webp',
        verified: true,
        date: '2026-08-10',
        comment:
          'Tudung saji lipat insulasi ini bagus banget! Makanan tetap hangat pas suami pulang kerja, lalat gak bisa masuk sama sekali. Pas gak dipakai tinggal dilipat tipis gak bikin meja berantakan.',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_ndspleRtqqvHRS2F4yowEV1R',
        label: '1 Pcs Standard',
        price: 99000,
        comparePrice: 199000,
      },
    ],
  },
  {
    slug: 'kursi-jongkok-toilet',
    productId: '441672',
    productName: 'Kursi Jongkok Toilet Portable Ergonomis Bebas Nyeri Lutut',
    contentName: 'Kursi Jongkok Toilet Portable Dudukan Ergonomis Tahan Beban 110kg',
    headline:
      'INOVASI KURSI JONGKOK TOILET PORTABLE NO.1 — Sulap Toilet Jongkok Jadi Toilet Duduk Mewah Dalam 3 Detik, Bebas Ngeri Lutut & Kram Seumur Hidup!',
    subheadline:
      'Solusi praktis 100% tanpa bongkar & tanpa renovasi keramik mahal! Desain ergonomis super kokoh tahan beban hingga 110 kg, aman anti licin anti selip untuk lansia, ibu hamil, & penderita nyeri sendi. Promo 50% COD!',
    seoTitle: 'Kursi Jongkok Toilet Portable Ergonomis Bebas Nyeri Lutut',
    seoDescription:
      'Kursi Jongkok Toilet Portable Dudukan Ergonomis Tahan Beban 110kg. Sulap toilet jongkok jadi toilet duduk dalam 3 detik tanpa bongkar. Promo Rp 149rb COD.',
    price: 149000,
    comparePrice: 288000,
    image: '/images/produk/kursi-jongkok-toilet.webp',
    heroImage: '/images/produk/kursi-jongkok-toilet.webp',
    tag: 'Perkakas Rumah',
    category: 'Perkakas Rumah',
    relatedCategories: ['Kursi Toilet', 'Alat Toilet', 'Perkakas Rumah', 'Kesehatan Lansia'],
    relatedTags: ['Kursi Jongkok Toilet', 'Toilet Duduk Portable', 'Kursi Mandi Lansia', 'Penyangga Toilet'],
    description:
      'Kursi Jongkok Toilet Portable Ergonomis adalah alat bantu toilet revolusioner yang dapat mengubah toilet jongkok menjadi toilet duduk dengan instan tanpa perlu bongkar keramik atau biaya renovasi mahal. Dirancang khusus dengan struktur plastik PP tebal super kokoh (tahan beban hingga 110kg), permukaan bertekstur anti selip, dan kaki karet tahan licin yang sangat aman bagi lansia, ibu hamil, maupun siapapun yang sering kram dan nyeri lutut.',
    benefits: [
      'Bebas Nyeri Lutut, Kram & Pegal Saat Ke Belakang — Duduk santai & nyaman tanpa membebankan persendian kaki',
      'Desain Ergonomis Compact Super Kokoh — Menahan beban tubuh hingga 110 kg secara stabil & seimbang',
      '100% Praktis Tanpa Bongkar & Renovasi — Cukup pasangkan di atas kloset jongkok rumah tanpa alat tambahan',
    ],
    keyPoints: [
      'Bahan Plastik PP Premium Tebal & Kaki Karet Anti Licin',
      'Mudah Dibersihkan, Ringan & Bisa Bongkar Pasang Ditinggal Bepergian',
      'Garansi COD & Bayar Tunai Saat Paket Sampai',
    ],
    idealFor: [
      'Lansia / orang tua yang kaki & lututnya sering lemas',
      'Ibu hamil yang kesulitan dan kram saat jongkok',
      'Solusi toilet duduk murah praktis untuk rumah kontrakan / kos',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Amankan Promo Sekarang',
    ratingValue: 4.9,
    reviewCount: 930,
    soldCount: 7120,
    reviews: [
      {
        name: 'Ibu Hj. Maryam',
        location: 'Tangerang, Banten',
        avatar: '/images/petani/petani-dewi.webp',
        verified: true,
        date: '2026-08-10',
        comment:
          'Kursi toilet jongkok ini sangat menolong ibu saya yang usianya 68 tahun. Sekarang ke belakang gak perlu dituntun atau nangis kesakitan lagi karena lutut lemas. Produk sangat kokoh dan gak licin!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_NO8meDAONBXBZr4lawMCaFOp',
        label: '1 Pcs Standard',
        price: 149000,
        comparePrice: 288000,
      },
    ],
  },
  {
    slug: 'bibit-bunga-sutra-bomba',
    productId: '434721',
    productName: 'Bibit Bunga Sutra bomba',
    contentName: 'Benih Bunga Sutra Bombay Premium',
    headline: 'Benih Bunga Sutra Bombay Premium — Tumbuh Mekar Warna-Warni',
    subheadline:
      'Benih unggul dengan daya tumbuh 98%. Bunga cepat mekar, warna-warni mempesona, tahan panas, dan sangat mudah dirawat.',
    seoTitle: 'Bibit Bunga Sutra Bombay Premium - Tumbuh Cepat Mekar Indah',
    seoDescription:
      'Benih Bunga Sutra Bombay Premium warna-warni cantik. Daya tumbuh 98%, mekar indah dalam 1 minggu, tahan panas. Bisa COD ke seluruh Indonesia.',
    price: 79000,
    comparePrice: 149000,
    image: '/images/bunga-sutra/bunga-sutra-hero.webp',
    heroImage: '/images/bunga-sutra/bunga-sutra-hero.webp',
    tag: 'Tanaman Hias',
    category: 'Benih Bunga',
    relatedCategories: ['Tanaman', 'Kebun', 'Bunga'],
    relatedTags: ['Sutra Bombay', 'Bunga Portulaca', 'Krokot Hias'],
    description:
      'Benih bunga Sutra Bombay (Portulaca Grandiflora) kualitas premium import dengan daya kecambah tinggi hingga 98%. Menghasilkan kelopak bunga ganda warna-warni cerah yang tahan cuaca panas dan mekar indah sepanjang hari.',
    benefits: [
      'Daya tumbuh benih mencapai 98%, cepat berkecambah dalam 3-7 hari',
      'Kelopak bunga ganda (double petal) dengan variasi warna-warni cerah mempesona',
      'Sangat tahan panas matahari terik dan tidak gampang layu/mati',
      'Cocok ditanam di pot, planter box balkon, keranjang gantung, maupun taman rumah',
    ],
    keyPoints: [
      '1 Paket kemasan benih lengkap berisi ratusan biji siap tanam',
      'Bonus petunjuk cara semai dan panduan perawatan harian',
      'Garansi benih pasti tumbuh — jaminan produk berkualitas tinggi',
    ],
    idealFor: ['Penghobi tanaman hias', 'Taman halaman rumah', 'Pot balkon apartemen', 'Hadiah tanaman cantik'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 412,
    soldCount: 3200,
    reviews: [
      {
        name: 'Bu Nur Hidayah',
        location: 'Bogor, Jawa Barat',
        avatar: '/images/bunga-sutra/testi-ibu-nur.webp',
        verified: true,
        date: '2026-07-15',
        comment:
          'Baru seminggu disemai bijinya udah pada tumbuh hijau-hijau! Sekarang bunganya mekar warna merah ungu kuning cantik banget di halaman rumah. Tetangga pada nanyain beli di mana.',
        rating: 5,
      },
      {
        name: 'Pak Bambang',
        location: 'Solo, Jawa Tengah',
        avatar: '/images/lega/testi-pak-hasan.webp',
        verified: true,
        date: '2026-07-11',
        comment:
          'Dulu pernah beli benih pasar gak ada yang tumbuh. Beli di sini alhamdulillah tumbuhnya subur banget. Tahan panas terik pula, gak usah ribet siram tiap jam.',
        rating: 5,
      },
      {
        name: 'Mbak Siska',
        location: 'Bandung, Jawa Barat',
        avatar: '/images/lega/testi-bu-dewi.webp',
        verified: true,
        date: '2026-07-05',
        comment:
          'Ditaruh di pot gantung balkon apartemen jadi cantik banget! Warna-warni meriah. Bikin rumah makin adem dipandang.',
        rating: 5,
      },
    ],
    variants: [
      { id: 'variant_FL8QYgRdZm8NFNGw2-KEkDMx', label: '1 Pack isi 10.000 Bibit', price: 79000, comparePrice: 149000 },
      { id: 'variant_WqEZYmcr8ZsuATVPEABah-3T', label: '2 Pack 20.000 Bibit', price: 129000, comparePrice: 229000 },
    ],
  },
  {
    slug: 'bibit-jeruk-kalifornia',
    productId: '439711',
    productName: 'Bibit Jeruk Lemon California',
    contentName: 'Bibit Jeruk Lemon California Unggul',
    headline: 'POHON PENDEK BUAH SUPER LEBAT: Panen Lemon Segar Kaya Vitamin C Langsung Di Pot!',
    subheadline:
      'Bibit Jeruk Lemon California okulasi super genjah. Ditanam di pot teras rumah langsung berbuah lebat berair melimpah untuk infused water & stamina harian!',
    seoTitle: 'Bibit Jeruk Lemon California Unggul: Cepat Berbuah Berair Melimpah',
    seoDescription:
      'Bibit Jeruk Lemon California okulasi super cepat berbuah. Cocok untuk pot rumah & kebun. Kaya Vitamin C, bisa COD ke seluruh Indonesia.',
    price: 85000,
    comparePrice: 149000,
    image: '/images/produk/bibit-jeruk-kalifornia.webp',
    heroImage: '/images/produk/bibit-jeruk-kalifornia.webp',
    tag: 'Bibit Buah',
    category: 'Tanaman Buah',
    relatedCategories: ['Tanaman', 'Kebun', 'Buah'],
    relatedTags: ['Jeruk Lemon California', 'Tabulampot', 'Bibit Unggul'],
    description:
      'Bibit tanaman Jeruk Lemon California siap tanam hasil okulasi unggul. Cepat menghasilkan buah lemon segar berair melimpah kaya Vitamin C untuk infused water & kesehatan harian.',
    benefits: [
      'Hasil okulasi genjah cepat berbuah lebat walau di dalam pot',
      'Bulir buah tebal berair melimpah segar kaya Vitamin C',
      'Super tahan banting di segala cuaca & gampang dirawat',
    ],
    keyPoints: [
      'Bibit segar siap tanam dipacking aman',
      'Bonus petunjuk perawatan & pemupukan',
      'Bisa bayar tunai COD',
    ],
    idealFor: ['Penghobi tanaman buah', 'Pekarangan rumah', 'Tabulampot'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 298,
    soldCount: 1650,
    reviews: [
      {
        name: 'Pak Bambang',
        location: 'Magelang, Jawa Tengah',
        avatar: '/images/petani/petani-01.webp',
        verified: true,
        date: '2026-07-25',
        comment:
          'Baru ditaruh di pot 3 bulan langsung keluar calon buah rimbun banget! Tetangga sampai mampir minta bibitnya.',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_lMQ7Qvh4oR5q6ksY7W5DArs1',
        label: 'Bibit Jeruk Lemon California',
        price: 85000,
        comparePrice: 149000,
      },
    ],
  },
  {
    slug: 'pupuk-pelebat-buah',
    productId: '439710',
    productName: 'Pupuk Pelebat Buah',
    contentName: 'Pupuk Pelebat Buah Super',
    headline: 'BUNGA TIDAK BOLEH RONTOK! — Rangsang Pembuahan Gila-Gilaan Di Setiap Dahan!',
    subheadline:
      'Formula nutrisi racikan kalium & fosfat super pekat untuk lebatkan buah melimpah pada semua jenis pohon & tanaman!',
    seoTitle: 'Pupuk Pelebat Buah Super - Bunga Lebat & Cegah Rontok',
    seoDescription:
      'Pupuk racikan pelebat buah ampuh. Menstimulasi bunga & buah lebat anti rontok. Bisa COD ke seluruh Indonesia.',
    price: 99000,
    comparePrice: 179000,
    image: '/images/produk/pupuk-pelebat-buah-hero.webp',
    heroImage: '/images/produk/pupuk-pelebat-buah-hero.webp',
    tag: 'Pupuk Pertanian',
    category: 'Nutrisi Tanaman',
    relatedCategories: ['Pupuk', 'Kebun', 'Pertanian'],
    relatedTags: ['Pupuk Buah', 'Pelebat Bunga', 'Nutrisi Tanaman'],
    description:
      'Pupuk pelebat buah khusus diformulasikan untuk merangsang pembentukan calon bunga dan mencegah rontoknya buah muda.',
    benefits: [
      'Merangsang bunga & calon buah berlipat ganda dalam hitungan hari',
      'Kunci calon buah agar 100% tidak rontok diterjang angin & hujan',
      'Dongkrak rasa manis & bobot buah jadi super mantap',
    ],
    keyPoints: [
      'Mudah diserap oleh akar dan daun tanaman',
      'Cocok untuk buah pot, kebun, & sayur-mayur',
      'Garansi pengiriman COD aman',
    ],
    idealFor: ['Petani & pekebun', 'Tanaman dalam pot', 'Pohon buah rumah'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 376,
    soldCount: 2100,
    reviews: [
      {
        name: 'Pak Sugeng',
        location: 'Kediri, Jawa Timur',
        avatar: '/images/petani/petani-08.webp',
        verified: true,
        date: '2026-07-27',
        comment:
          'Pohon mangga saya yang tadinya rontok parah langsung berbuah lebat bergelayutan sampai cabang mau patah!',
        rating: 5,
      },
    ],
    variants: [
      { id: 'variant_N7s58ShaI32estAgOxCcyd0t', label: 'Pupuk Pelebat Buah', price: 99000, comparePrice: 179000 },
    ],
  },
  {
    slug: 'bibit-mangga-jepang',
    productId: '440001',
    productName: 'Bibit Mangga Import Jepang',
    contentName: 'Bibit Mangga Miyazaki Jepang Unggul',
    headline: 'MANGGA SULTAN JEPANG MESHAN — Berbuah Manis Legit & Harum Di Pot Teras!',
    subheadline:
      'Varietas Mangga Miyazaki Jepang import okulasi genjah. Pohon pendek, berbuah merah merona super manis & harum!',
    seoTitle: 'Bibit Mangga Import Jepang Miyazaki - Pohon Pendek Berbuah Lebat',
    seoDescription:
      'Bibit Mangga Import Jepang Miyazaki okulasi super genjah. Daging tebal, manis legit, cocok untuk tabulampot pot teras rumah. Bisa COD.',
    price: 85000,
    comparePrice: 149000,
    image: '/images/produk/bibit-mangga-jepang-hero.webp',
    heroImage: '/images/produk/bibit-mangga-jepang-hero.webp',
    tag: 'Bibit Buah',
    category: 'Tanaman Buah',
    relatedCategories: ['Tanaman', 'Kebun', 'Buah'],
    relatedTags: ['Mangga Jepang', 'Miyazaki', 'Tabulampot'],
    description:
      'Bibit Mangga Miyazaki Jepang import hasil okulasi kualitas premium dengan daging buah tebal tanpa serat, rasa super manis, dan warna merah eksotis.',
    benefits: [
      'Pohon pendek genjah cepat berbuah lebat walau ditanam di pot teras',
      'Buah mangga eksotis berwarna merah keemasan dengan rasa manis legit',
      'Daging buah tebal manis tanpa serat halus yang mengganggu',
    ],
    keyPoints: [
      'Bibit okulasi unggul siap tanam dipacking aman',
      'Sangat gampang dirawat & tahan cuaca panas Indonesia',
      'Garansi COD bayar saat bibit sampai',
    ],
    idealFor: ['Penghobi tanaman buah mewah', 'Tabulampot teras rumah', 'Koleksi kebun'],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 180,
    soldCount: 920,
    reviews: [
      {
        name: 'Pak Hidayat',
        location: 'Semarang, Jawa Tengah',
        avatar: '/images/petani/petani-07.webp',
        verified: true,
        date: '2026-07-30',
        comment:
          'Bibit mangga Jepang datang segar banget! Dipasang di pot depan rumah langsung tumbuh tunas baru. Sangat recommended!',
        rating: 5,
      },
    ],
    variants: [
      { id: 'variant_mangga_jepang_1', label: 'Beli 1 Bibit Mangga Jepang', price: 85000, comparePrice: 149000 },
      { id: 'variant_mangga_jepang_2', label: 'Beli 2 Bibit Mangga Jepang Hemat', price: 149000, comparePrice: 289000 },
    ],
  },
  {
    slug: 'bibit-sirsak-juara',
    productId: '440270',
    productName: 'Bibit Sirsak Juara',
    contentName: 'Bibit Sirsak Ratu Juara Okulasi Super',
    headline: 'PANEN SIRSAK RATU JUMBO MANIS LEGIT — Pohon Pendek Berbuah Rimbun Di Pot Teras!',
    subheadline:
      'Bibit Sirsak Juara okulasi genjah unggulan. Daging tebal super lembut, manis segar berkhasiat tinggi & bebas asam berlebih.',
    seoTitle: 'Bibit Sirsak Juara Okulasi Genjah: Pohon Pendek Berbuah Lebat',
    seoDescription:
      'Bibit Sirsak Juara okulasi genjah unggulan. Daging tebal, manis segar, cepat berbuah di pot teras rumah. Garansi COD.',
    price: 99000,
    comparePrice: 179000,
    image: '/images/produk/bibit-sirsak-juara-hero.webp',
    heroImage: '/images/produk/bibit-sirsak-juara-hero.webp',
    tag: 'Tanaman Buah',
    category: 'Tanaman Buah',
    relatedCategories: ['Bibit', 'Buah', 'Tabulampot'],
    relatedTags: ['Sirsak Juara', 'Bibit Buah', 'Okulasi'],
    description:
      'Bibit Sirsak Juara hasil perbanyakan okulasi vegetatif unggulan. Pohon pendek genjah siap berbuah di pot teras rumah.',
    benefits: [
      'Pohon pendek 1 meter di pot sudah rajin berbuah lebat',
      'Daging sirsak super tebal manis segar kaya antioksidan',
      'Perbanyakan okulasi vegetatif genjah cepat panen',
    ],
    keyPoints: [
      'Bibit okulasi unggul cepat berbuah',
      'Akar rimbun sehat tahan cuaca tropis',
      'Bisa bayar tunai saat COD',
    ],
    idealFor: [
      'Pekebun rumah & pecinta tabulampot',
      'Konsumsi buah segar kaya vitamin sekeluarga',
      'Koleksi tanaman buah eksotis',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 380,
    soldCount: 1800,
    reviews: [
      {
        name: 'Pak Hidayat',
        location: 'Magelang, Jawa Tengah',
        avatar: '/images/petani/petani-07.webp',
        verified: true,
        date: '2026-08-01',
        comment:
          'Bibit sirsak juara sampai dengan segar, akar rimbun! Tanam di pot teras 8 bulan langsung keluar calon buah jumbo.',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_YSOJXTtJ3zELZAl314nrfFQX',
        label: 'Bibit Sirsak Juara - 1 Pcs Rp 99.000',
        price: 99000,
        comparePrice: 179000,
      },
      {
        id: 'variant_CuTPFRogip8Jui9I7tGw5tq8',
        label: 'PALING LARIS! 2 Pcs Rp 149.000',
        price: 149000,
        comparePrice: 249000,
      },
      {
        id: 'variant_eeRVE4IO6FuTF7clDjo_OCKG',
        label: 'PALING HEMAT! 3 Pcs Rp 199.000',
        price: 199000,
        comparePrice: 329000,
      },
    ],
  },
  {
    slug: 'bibit-markisa-pasima',
    productId: '440279',
    productName: 'Bibit Markisa Pasima',
    contentName: 'Bibit Markisa Madu Pasima Okulasi Super',
    headline: 'PANEN MARKISA MADU SUPER MANIS — Pohon Pendek Berbuah Rimbun Di Pot Teras!',
    subheadline:
      'Bibit Markisa Madu PASIMA hasil okulasi unggulan. Buah lebat beraroma wangi harum, rasa manis segar kaya vitamin C & bebas asam pekat!',
    seoTitle: 'Bibit Markisa Madu Pasima Okulasi Super: Pohon Pendek Berbuah Lebat',
    seoDescription:
      'Bibit Markisa Madu PASIMA okulasi unggulan. Pohon genjah berbuah manis lebat di pot teras rumah. Garansi COD & bibit segar sampai tujuan.',
    price: 99000,
    comparePrice: 200000,
    image: '/images/markisa/markisa-hero.webp',
    heroImage: '/images/markisa/markisa-hero.webp',
    tag: 'Tanaman Buah',
    category: 'Tanaman Buah',
    relatedCategories: ['Bibit', 'Buah', 'Tabulampot'],
    relatedTags: ['Markisa Pasima', 'Markisa Madu', 'Bibit Buah', 'Okulasi'],
    description:
      'Bibit Markisa Madu PASIMA hasil perbanyakan sambung okulasi unggulan. Pohon genjah dan kuat, siap tumbuh lebat berbuah manis di pot maupun pekarangan.',
    benefits: [
      'Pohon cepat tumbuh dan berbuah manis melimpah',
      'Buah beraroma harum segar dengan perpaduan rasa manis madu khas',
      'Bibit okulasi vegetatif sehat, tahan hama & adaptif di dataran rendah/tinggi',
    ],
    keyPoints: [
      'Bibit sambung okulasi unggul cepat berbuah',
      'Mudah ditanam di pot teras maupun lahan terbuka',
      'Bisa bayar tunai saat COD di tempat',
    ],
    idealFor: [
      'Pekebun rumah & pecinta tabulampot',
      'Konsumsi buah segar kaya vitamin & antioksidan',
      'Penghias pagar & kanopi peneduh teras indah',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 240,
    soldCount: 1250,
    reviews: [
      {
        name: 'Pak Bambang Setyo',
        location: 'Kendal, Jawa Tengah',
        avatar: '/images/petani/petani-07.webp',
        verified: true,
        date: '2026-08-03',
        comment:
          'Bibit Markisa Pasima cepat sekali beradaptasi. Tanam di pot teras pakai tiang rambat, daunnya rimbun hijau dan langsung keluar calon bunga!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_Sgm4FPtQ4YuIWNjWIiNx0lFG',
        label: 'Bibit Markisa Pasima - 1 Pcs Rp 99.000',
        price: 99000,
        comparePrice: 200000,
      },
      {
        id: 'variant_6mlcBgP8H23zwdoWE_9KVQCZ',
        label: 'PALING LARIS! 2 Pcs Rp 149.000',
        price: 149000,
        comparePrice: 300000,
      },
      {
        id: 'variant_vL8oEyYEq3gqpWmcAecv4vBs',
        label: 'PALING HEMAT! 3 Pcs Rp 199.000',
        price: 199000,
        comparePrice: 400000,
      },
    ],
  },
  {
    slug: 'bibit-duku-longkong',
    productId: '440644',
    productName: 'Bibit Duku Longkong Super Sweet',
    contentName: 'Bibit Duku Longkong Thailand Okulasi Super Manis Tanpa Biji',
    headline: 'BIBIT DUKU LONGKONG SUPER MANIS TANPA BIJI — Berbuah Lebat Dompolan Rimbun Genjah 2-3 Tahun!',
    subheadline:
      'Bibit Duku Longkong Thailand super manis legit tanpa biji. Daging buah tebal bening bagai kristal, rasa manis luar biasa tanpa asam, genjah cepat berbuah di pot/lahan!',
    seoTitle: 'Bibit Duku Longkong Thailand Super Manis Tanpa Biji: Cepat Berbuah Genjah',
    seoDescription:
      'Bibit Duku Longkong Thailand Okulasi Super Manis. Daging bening tebal tanpa biji, pohon genjah cepat berbuah lebat & tahan cuaca. Garansi COD Rp 99rb.',
    price: 99000,
    comparePrice: 250000,
    image: '/images/duku/duku-hero.webp',
    heroImage: '/images/duku/duku-hero.webp',
    tag: 'Tanaman Buah',
    category: 'Tanaman Buah',
    relatedCategories: ['Bibit', 'Buah', 'Tabulampot', 'Pertanian'],
    relatedTags: ['Bibit Duku', 'Duku Longkong', 'Duku Tanpa Biji', 'Bibit Okulasi'],
    description:
      'Bibit Duku Longkong Thailand varietas unggulan hasil okulasi vegetatif. Memiliki daging buah sangat tebal, bening transparan, super manis legit tanpa rasa sepat/asam, serta minim atau tanpa biji sama sekali. Pohon sangat genjah, mampu berbuah lebat berdompol-dompol walau ditanam di pot teras rumah.',
    benefits: [
      'Buah Duku Longkong super manis legit tanpa biji dan daging bening tebal',
      'Bibit hasil perbanyakan okulasi cepat berbuah dalam 2-3 tahun',
      'Pohon sangat adaptif di dataran rendah maupun tinggi, mudah dirawat',
    ],
    keyPoints: [
      'Bibit okulasi unggulan genjah cepat panen melimpah',
      'Cocok ditanam di pot teras (Tabulampot) maupun kebun',
      'Bisa bayar tunai di tempat (COD) & garansi bibit sehat',
    ],
    idealFor: [
      'Pebisnis kebun buah & tabulampot teras rumah',
      'Konsumsi buah duku super manis keluarga',
      'Investasi tanaman buah bernilai ekonomis tinggi',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Lanjutkan Pemesanan',
    ratingValue: 4.9,
    reviewCount: 310,
    soldCount: 1890,
    reviews: [
      {
        name: 'Pak Haji Rohman',
        location: 'Palembang, Sumatera Selatan',
        avatar: '/images/petani/petani-01.webp',
        verified: true,
        date: '2026-08-06',
        comment:
          'Bibit Duku Longkong yang dikirim sangat segar, batang kokoh dan akar lebat! Tanam 2 tahun lalu sekarang sudah dompolan berbuah manis legit tanpa biji. Mantap!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_vKz8fw653mQ8LT5fPAZDh-zw',
        label: '1 Pohon Bibit Duku Longkong Rp 99.000',
        price: 99000,
        comparePrice: 250000,
      },
      {
        id: 'variant_N2wmvY3BPjcF5_VsY-VnCTGU',
        label: 'PALING LARIS! Beli 2 Pohon Rp 149.000',
        price: 149000,
        comparePrice: 400000,
      },
      {
        id: 'variant_HrOMfYl15sVlsSG7Rddr3ZCa',
        label: 'PALING HEMAT! Beli 3 Pohon Rp 199.000',
        price: 199000,
        comparePrice: 550000,
      },
    ],
  },
  {
    slug: 'bibit-buah-jamblang',
    productId: '441650',
    productName: 'Bibit Buah Jamblang Hitam',
    contentName: 'Bibit Buah Jamblang Hitam Duwet Unggulan Vegetatif',
    headline: 'BIBIT BUAH JAMBLANG HITAM (DUWET) UNGGULAN — Kokoh, Cepat Berbuah, Cepat Panen di Pot & Pekarangan!',
    subheadline:
      'Bibit Buah Jamblang Hitam (Duwet) unggulan hasil perbanyakan vegetatif pilihan. Tanaman kokoh, cepat berbuah, dan sangat cocok ditanam di pot maupun pekarangan rumah sebagai koleksi buah legendaris yang mulai langka.',
    seoTitle: 'Bibit Buah Jamblang Hitam (Duwet) Unggulan Okulasi Cepat Berbuah',
    seoDescription:
      'Bibit Buah Jamblang Hitam (Duwet) unggulan hasil perbanyakan vegetatif pilihan. Tanaman kokoh, cepat berbuah di pot & pekarangan. Promo Cuma Rp 85.000 COD!',
    price: 85000,
    comparePrice: 160000,
    image: '/images/jamblang/jamblang-hero.webp',
    heroImage: '/images/jamblang/jamblang-hero.webp',
    tag: 'Tanaman Buah',
    category: 'Tanaman Buah',
    relatedCategories: ['Bibit', 'Buah', 'Tabulampot', 'Pertanian'],
    relatedTags: ['Bibit Jamblang', 'Buah Duwet', 'Jamblang Hitam', 'Bibit Okulasi'],
    description:
      'Bibit Buah Jamblang Hitam (Duwet) unggulan hasil perbanyakan vegetatif pilihan. Tanaman kokoh, cepat berbuah, dan sangat cocok ditanam di pot maupun pekarangan rumah sebagai koleksi buah legendaris yang mulai langka.',
    benefits: [
      'Tanaman All-Rounder — Pas untuk Segala Jenis Lahan (Lahan Sempit, Pot / Tabulampot, Maupun Kebun)',
      'Bibit Unggulan Vegetatif — Kokoh, cepat berbuah & tahan hama penyakit',
      'Investasi Hijau Puluhan Tahun — Hemat dibanding beli buah petikan eceran',
    ],
    keyPoints: [
      'Perbanyakan Vegetatif Pilihan Siap Tanam',
      'Cocok Ditanam di Pot / Pekarangan Rumah',
      'Garansi COD & Pengiriman Aman Ke Seluruh Indonesia',
    ],
    idealFor: [
      'Pencinta tanaman & pemburu buah langka legendaris',
      'Konsumsi keluarga & edukasi buah masa kecil anak-anak',
      'Penghias teras rumah sekaligus investasi hijau jangka panjang',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Amankan Stok Sekarang',
    ratingValue: 4.9,
    reviewCount: 240,
    soldCount: 1540,
    reviews: [
      {
        name: 'Pak H. Subagyo',
        location: 'Yogyakarta, D.I. Yogyakarta',
        avatar: '/images/petani/petani-02.webp',
        verified: true,
        date: '2026-08-08',
        comment:
          'Sudah lama nyari bibit buah jamblang hitam yang asli. Bibit sampai kondisi sangat segar dan sehat, pengemasan rapih. Tanam di pot teras 6 bulan langsung tumbuh tunas rimbun. Mantap banget!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_oUXnoCAJhWpZgqM6qwrBqZ19',
        label: '1 Pohon Bibit Buah Jamblang Hitam Rp 85.000',
        price: 85000,
        comparePrice: 160000,
      },
    ],
  },
  {
    slug: 'alat-siram-otomatis',
    productId: '441661',
    productName: 'Alat Siram Tanaman Otomatis Irigasi Tetes Drip Spike System',
    contentName: 'Alat Siram Tanaman Otomatis Drip System Tahan 30 Hari Tanpa Listrik',
    headline: 'ALAT SIRAM AUTOMATIC DRIP SYSTEM — Pohon Subur 10X Lipat, Bebas Layu Walau Ditinggal Mudik 30 Hari!',
    subheadline:
      'Sistem penyiraman tetes otomatis tanpa listrik & tanpa pompa. Katup pengatur tetesan presisi menjaga tanah selalu lembab sempurna 24 jam nonstop!',
    seoTitle: 'Alat Siram Tanaman Otomatis Irigasi Tetes Drip Spike System',
    seoDescription:
      'Alat Siram Tanaman Otomatis Irigasi Tetes Drip Spike System. Menyiram otomatis 24 jam nonstop tanpa listrik. Promo 10 Pcs Rp 99rb / 20 Pcs Rp 125rb COD.',
    price: 99000,
    comparePrice: 250000,
    image: '/images/produk/alat-siram-otomatis.webp',
    heroImage: '/images/produk/alat-siram-otomatis.webp',
    tag: 'Perkakas Kebun',
    category: 'Perkakas Kebun',
    relatedCategories: ['Alat Siram', 'Irigasi Tetes', 'Tabulampot', 'Perkakas Kebun'],
    relatedTags: ['Alat Siram Otomatis', 'Irigasi Drip Spike', 'Siram Tanaman Otomatis', 'Penyiram Tanaman'],
    description:
      'Alat Siram Tanaman Otomatis Irigasi Tetes Drip Spike System adalah inovasi penyiraman pot dan kebun yang bekerja secara mandiri tanpa memerlukan listrik atau pompa air. Dilengkapi keran pengatur kecepatan tetesan air yang dapat disesuaikan (1-15 hari tetesan stabil) untuk menjaga akar tanaman tetap segar dan lembab terlindungi.',
    benefits: [
      'Menyiram Otomatis 24 Jam Nonstop Tanpa Listrik & Tanpa Pompa — Tenang ditinggal bepergian / mudik hingga 30 hari',
      'Katup Pengatur Kecepatan Tetesan Air Presisi — Cegah tanaman pembusukan akar / kekeringan',
      'Universal Sangat Praktis — Cukup pasangkan ke botol minum plastik standar (Aqua, Sprite, dll)',
    ],
    keyPoints: [
      'Bahan Plastik PP Tebal Awet & Tahan Panas Terik UV',
      'Pengatur Tetesan Air Dapat Diatur 1 - 15 Hari Tetesan Stabil',
      'Garansi COD & Bayar Tunai Saat Paket Sampai',
    ],
    idealFor: [
      'Pencinta tanaman hias & tabulampot pot rumah',
      'Solusi siram otomatis saat liburan / mudik luar kota',
      'Penghematan penggunaan air siram kebun harian',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Amankan Promo Sekarang',
    ratingValue: 4.9,
    reviewCount: 740,
    soldCount: 5230,
    reviews: [
      {
        name: 'Pak Sugeng Riyadi',
        location: 'Bogor, Jawa Barat',
        avatar: '/images/petani/petani-06.webp',
        verified: true,
        date: '2026-08-10',
        comment:
          'Alat siram otomatis ini penyelamat tanaman banget! Kemarin mudik 2 minggu pas pulang semua bunga & bibit buah di pot tetep segar bugar gak ada yang layu. Paket 10 pcs murah banget!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_b58XHpeAME-aLw0NHTxjMVhj',
        label: 'Beli 1 Dapat 10 Pcs Alat Siram Otomatis Rp 99.000',
        price: 99000,
        comparePrice: 250000,
      },
      {
        id: 'variant_bTeRVIzPoBBl2t-PMhxDfrw-',
        label: 'PALING HEMAT! Beli 2 Dapat 20 Pcs Alat Siram Otomatis Rp 125.000',
        price: 125000,
        comparePrice: 450000,
      },
    ],
  },
  {
    slug: 'bibit-rambutan',
    productId: '441665',
    productName: 'Bibit Unggul Rambutan Pulasan Langka Okulasi Cepat Berbuah',
    contentName: 'Bibit Unggul Rambutan Pulasan Eksotis Daging Ngelotok Manis Legit',
    headline: 'BIBIT UNGGUL RAMBUTAN PULASAN EKSOTIS — Panen Buah Langka Manis Legit & Ngelotok di Pekarangan Rumah!',
    subheadline:
      'Bibit unggul okulasi perbanyakan vegetatif cepat berbuah. Daging tebal, super manis, tidak lengket di biji, dan sangat tahan cuaca!',
    seoTitle: 'Bibit Unggul Rambutan Pulasan Langka Okulasi Cepat Berbuah',
    seoDescription:
      'Bibit Unggul Rambutan Pulasan Eksotis Okulasi. Buah manis legit, daging tebal ngelotok mudah terkelupas dari biji. Promo Rp 85rb COD.',
    price: 85000,
    comparePrice: 170000,
    image: '/images/produk/bibit-rambutan.webp',
    heroImage: '/images/produk/bibit-rambutan.webp',
    tag: 'Tanaman Buah',
    category: 'Tanaman Buah',
    relatedCategories: ['Bibit Tanaman', 'Tanaman Buah', 'Rambutan Pulasan', 'Tabulampot'],
    relatedTags: ['Bibit Rambutan Pulasan', 'Rambutan Pulasan Okulasi', 'Bibit Buah Eksotis', 'Pulasan Ngelotok'],
    description:
      'Bibit Unggul Rambutan Pulasan (Nephelium mutabile) adalah varietas buah eksotis kerabat rambutan yang sangat diminati karena rasa daging buahnya yang jauh lebih manis legit, tidak berair berlebihan, serta daging buah yang sangat mudah terkelupas dari bijinya (ngelotok). Bibit hasil okulasi/stek pilihan yang cepat berbuah dan cocok untuk pekarangan maupun tabulampot.',
    benefits: [
      'Hasil Okulasi / Perbanyakan Vegetatif Unggul — Pohon lebih pendek & cepat berbuah lebat dalam 1-2 tahun',
      'Daging Buah Tebal & Manis Legit Ngelotok — Bebas rasa asam & tidak lengket di biji',
      'Buah Eksotis Langka Bernilai Tinggi — Bikin pekarangan rumah semakin teduh, asri & produktif',
    ],
    keyPoints: [
      'Bibit Sehat Bebas Hama & Penyakit',
      'Tinggi Bibit 50-70 cm Siap Tanam Pot / Lahan Pekarangan',
      'Garansi COD & Ganti Baru Jika Bibit Rusak Saat Pengiriman',
    ],
    idealFor: [
      'Koleksi tanaman buah eksotis pekarangan rumah',
      'Menanam dalam pot besar (tabulampot) halaman minimalis',
      'Investasi buah langka keluarga tanpa harus beli mahal di luar',
    ],
    offerText: 'Bisa COD, bayar saat barang sampai',
    ctaText: 'Pesan Bibit Unggul Sekarang',
    ratingValue: 4.9,
    reviewCount: 820,
    soldCount: 6140,
    reviews: [
      {
        name: 'Pak H. Achmad Fauzi',
        location: 'Kuningan, Jawa Barat',
        avatar: '/images/petani/petani-04.webp',
        verified: true,
        date: '2026-08-10',
        comment:
          'Bibit rambutan pulasan sampai dengan selamat dan masih sangat segar. Daunnya hijau lebat dan batangnya kokoh. Pelayanan mantap beneran bisa COD!',
        rating: 5,
      },
    ],
    variants: [
      {
        id: 'variant_rOp3WZZgixNBVfVeixx_JokW',
        label: 'PROMO Bibit Unggul Rambutan Pulasan Rp 85.000',
        price: 85000,
        comparePrice: 170000,
      },
    ],
  }
];

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
