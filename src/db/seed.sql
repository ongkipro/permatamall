PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO stores (
  id, name, slug, mengantar_api_key, autolaris_api_key, meta_pixel_id,
  meta_capi_token, google_ads_conversion_id, google_ads_conversion_label, created_at
) VALUES (
  1, 'CMSAds Demo Store', 'cmsads-demo', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-01T08:00:00.000Z'
);

INSERT OR IGNORE INTO warehouses (
  id, store_id, name, origin_area_id, origin_label, pickup_address_id, address, city, province
) VALUES (
  1, 1, 'Kedai A29', '5fc64616f8f44b34aa4cd7d4', 'KREMBANGAN SELATAN, KREMBANGAN, SURABAYA, JAWA TIMUR',
  '657077c8bf5f9f283685e29a', 'Jl. Branjangan 18A', 'SURABAYA', 'JAWA TIMUR'
);

UPDATE stores
SET support_whatsapp = COALESCE(support_whatsapp, '081234567890')
WHERE id = 1;

UPDATE warehouses
SET contact_name = COALESCE(contact_name, 'Rini'),
    contact_phone = COALESCE(contact_phone, '085854117766')
WHERE id = 1;

INSERT INTO products (
  id, store_id, title, slug, category, is_active, image_url, created_at
) VALUES
  (10002, 1, 'Bensu', 'bensu', 'Growth Restart Stimulator', 1, '/images/bensu.webp', '2026-08-01T08:00:00.000Z'),
  (10001, 1, 'Aussie Sample', 'aussie', 'Aussie Sawit Ganoderma', 1, '/images/aussie.webp', '2026-08-01T08:00:00.000Z'),
  (10004, 1, 'Kojien', 'kojien', 'Crop Stability & Yield Support', 1, '/images/kojien.webp', '2026-08-01T08:00:00.000Z'),
  (10003, 1, 'Saratoga', 'saratoga', 'Strategic Plant Serum', 1, '/images/saratoga.webp', '2026-08-01T08:00:00.000Z'),
  (434683, 1, 'Asahan Portable', 'asahan-portable', 'Asahan Pisau', 1, '/images/produk/asahan-portable.webp', '2026-08-01T08:00:00.000Z'),
  (434685, 1, 'Alat Anti Ngorok', 'alat-anti-ngorok', 'Alat Bantu Tidur', 1, '/images/produk/alat-anti-ngorok.webp', '2026-08-01T08:00:00.000Z'),
  (434686, 1, 'Kunci Lipat', 'kunci-lipat', 'Kunci Multifungsi', 1, '/images/produk/kunci-lipat.webp', '2026-08-01T08:00:00.000Z'),
  (434687, 1, 'Kepala Kunci Shock Universal', 'kunci-shock-universal', 'Kunci Shock', 1, '/images/produk/kunci-shock-universal.webp', '2026-08-01T08:00:00.000Z'),
  (434721, 1, 'Bibit Bunga Sutra bomba', 'bibit-bunga-sutra-bomba', 'Benih Bunga', 1, '/images/bunga-sutra/bunga-sutra-hero.webp', '2026-08-01T08:00:00.000Z'),
  (439727, 1, 'Kapsul Herbal Pinang', 'kapsul-herbal-pinang', 'Kesehatan Herbal', 1, '/images/produk/kapsul-herbal-pinang-hero.webp', '2026-08-01T08:00:00.000Z'),
  (439725, 1, 'Kapsul Brotowali', 'kapsul-brotowali', 'Kesehatan Herbal', 1, '/images/produk/kapsul-brotowali-hero.webp', '2026-08-01T08:00:00.000Z'),
  (439712, 1, 'Teh Kunyit Jahe', 'teh-kunyit-jahe', 'Minuman Kesehatan', 1, '/images/produk/teh-kunyit-jahe-real-hero.webp', '2026-08-01T08:00:00.000Z'),
  (439711, 1, 'Bibit Jeruk Lemon California', 'bibit-jeruk-kalifornia', 'Tanaman Buah', 1, '/images/produk/bibit-jeruk-kalifornia.webp', '2026-08-01T08:00:00.000Z'),
  (439710, 1, 'Pupuk Pelebat Buah', 'pupuk-pelebat-buah', 'Nutrisi Tanaman', 1, '/images/produk/pupuk-pelebat-buah-hero.webp', '2026-08-01T08:00:00.000Z'),
  (439708, 1, 'Teh Daun Insulin', 'teh-daun-insulin', 'Minuman Kesehatan', 1, '/images/produk/teh-daun-insulin-hero.webp', '2026-08-01T08:00:00.000Z'),
  (439706, 1, 'Kapsul Kumis Kucing', 'kapsul-kumis-kucing', 'Kesehatan Herbal', 1, '/images/produk/kapsul-kumis-kucing-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440001, 1, 'Bibit Mangga Import Jepang', 'bibit-mangga-jepang', 'Tanaman Buah', 1, '/images/produk/bibit-mangga-jepang-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440002, 1, 'Obat Rayap Rayentra DGV', 'obat-rayap', 'Pemberantas Hama', 1, '/images/produk/obat-rayap-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440270, 1, 'Bibit Sirsak Juara', 'bibit-sirsak-juara', 'Tanaman Buah', 1, '/images/produk/bibit-sirsak-juara-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440273, 1, 'Cardoor Pro Peredam Pintu Mobil', 'cardoor-pro', 'Perkakas Otomotif', 1, '/images/produk/cardoor-pro-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440279, 1, 'Bibit Markisa Pasima', 'bibit-markisa-pasima', 'Tanaman Buah', 1, '/images/markisa/markisa-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440391, 1, 'Pompa Bensin & Cairan Manual Siphon', 'pompa-air-portable', 'Perkakas Otomotif', 1, '/images/pompa-portable/pompa-portable-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440644, 1, 'Bibit Duku Longkong Super Sweet', 'bibit-duku-longkong', 'Tanaman Buah', 1, '/images/duku/duku-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440665, 1, 'Reparo Pasta Perbaikan Dinding Instant', 'pasta-perbaikan-dinding', 'Perkakas Rumah', 1, '/images/pasta-dinding/pasta-dinding-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440672, 1, 'Vegetable Big Cutter 14 in 1 Multifungsi', 'vegetable-big-cutter', 'Perkakas Rumah', 1, '/images/vegetable-cutter/cutter-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440746, 1, 'Bibit Sawo Sawesta Super Jumbo', 'bibit-sawo-sawesta', 'Tanaman Buah', 1, '/images/sawo/sawo-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440751, 1, 'Kacamata Anti Radiasi Blueray Photochromic', 'kacamata-anti-radiasi', 'Fashion & Kesehatan', 1, '/images/kacamata-radiasi/kacamata-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440808, 1, 'Bibit Jeruk Santang Madu Super Genjah', 'bibit-jeruk-santang', 'Tanaman Buah', 1, '/images/jeruk-santang/jeruk-hero.webp', '2026-08-01T08:00:00.000Z'),
  (440816, 1, 'Lampu Jagung LED E27 3 Warna', 'lampu-jagung-led', 'Elektronik & Perlengkapan Rumah', 1, '/images/lampu/lampu-hero.webp', '2026-08-01T08:00:00.000Z'),
  (441650, 1, 'Bibit Buah Jamblang Hitam', 'bibit-buah-jamblang', 'Tanaman Buah', 1, '/images/jamblang/jamblang-hero.webp', '2026-08-01T08:00:00.000Z'),
  (441656, 1, 'Sealant Cement Dempul Penambal Lubang Praktis', 'sealant-cement', 'Perkakas Rumah', 1, '/images/sealant/sealant-hero.webp', '2026-08-01T08:00:00.000Z'),
  (441657, 1, 'Lem Jaysuing Transparan Anti Bocor & Rembes', 'lem-jaysuing', 'Perkakas Rumah', 1, '/images/produk/lem-jaysuing.webp', '2026-08-01T08:00:00.000Z'),
  (441659, 1, 'Tutup Makanan Serbaguna Tudung Saji Lipat Insulasi', 'tutup-makanan', 'Perkakas Dapur', 1, '/images/produk/tutup-makanan.webp', '2026-08-01T08:00:00.000Z'),
  (441661, 1, 'Alat Siram Tanaman Otomatis Irigasi Tetes Drip Spike System', 'alat-siram-otomatis', 'Perkakas Kebun', 1, '/images/produk/alat-siram-otomatis.webp', '2026-08-01T08:00:00.000Z'),
  (441665, 1, 'Bibit Unggul Rambutan Pulasan Langka Okulasi Cepat Berbuah', 'bibit-rambutan', 'Tanaman Buah', 1, '/images/produk/bibit-rambutan.webp', '2026-08-01T08:00:00.000Z'),
  (441672, 1, 'Kursi Jongkok Toilet Portable Ergonomis Bebas Nyeri Lutut', 'kursi-jongkok-toilet', 'Perkakas Rumah', 1, '/images/produk/kursi-jongkok-toilet.webp', '2026-08-01T08:00:00.000Z')
ON CONFLICT(id) DO UPDATE SET
  title = excluded.title,
  slug = excluded.slug,
  category = excluded.category,
  is_active = excluded.is_active,
  image_url = excluded.image_url;

INSERT INTO product_variants (
  id, product_id, sku, title, price, compare_price, weight_grams, stock
) VALUES
  (20020, 10002, 'BENSU-STD', 'Standar', 130000, 182000, 500, 200),
  (20021, 10001, 'AUSSIE-STD', 'Standar', 130000, 182000, 500, 200),
  (20022, 10004, 'KOJIEN-STD', 'Standar', 215000, 301000, 500, 200),
  (20023, 10003, 'SARATOGA-STD', 'Standar', 150000, 210000, 500, 200),
  (20024, 434683, 'ASAHANPORTABLE-STD', 'Standar', 150000, 210000, 500, 200),
  (20025, 434685, 'ALATANTINGOROK-STD', 'Standar', 300000, 420000, 500, 200),
  (20026, 434686, 'KUNCILIPAT-STD', 'Standar', 130000, 182000, 500, 200),
  (20027, 434687, 'KUNCISHOCKUNIVERSAL-STD', 'Standar', 130000, 182000, 500, 200),
  (20028, 434721, 'BIBITBUNGASUTRABOMBA-STD', 'Standar', 215000, 301000, 500, 200),
  (20029, 439727, 'KAPSULHERBALPINANG-STD', 'Standar', 139000, 194600, 500, 200),
  (20030, 439725, 'KAPSULBROTOWALI-STD', 'Standar', 135000, 189000, 500, 200),
  (20031, 439712, 'TEHKUNYITJAHE-STD', 'Standar', 268000, 375200, 500, 200),
  (20032, 439711, 'BIBITJERUKKALIFORNIA-STD', 'Standar', 79000, 110600, 500, 200),
  (20033, 439710, 'PUPUKPELEBATBUAH-STD', 'Standar', 79000, 110600, 500, 200),
  (20034, 439708, 'TEHDAUNINSULIN-STD', 'Standar', 119000, 166600, 500, 200),
  (20035, 439706, 'KAPSULKUMISKUCING-STD', 'Standar', 79000, 110600, 500, 200),
  (20036, 440001, 'BIBITMANGGAJEPANG-STD', 'Standar', 79000, 110600, 500, 200),
  (20037, 440002, 'OBATRAYAP-STD', 'Standar', 119000, 166600, 500, 200),
  (20038, 440270, 'BIBITSIRSAKJUARA-STD', 'Standar', 99000, 138600, 500, 200),
  (20039, 440273, 'CARDOORPRO-STD', 'Standar', 99000, 138600, 500, 200),
  (20040, 440279, 'BIBITMARKISAPASIMA-STD', 'Standar', 169000, 236600, 500, 200),
  (20041, 440391, 'POMPAAIRPORTABLE-STD', 'Standar', 149000, 208600, 500, 200),
  (20042, 440644, 'BIBITDUKULONGKONG-STD', 'Standar', 149000, 208600, 500, 200),
  (20043, 440665, 'PASTAPERBAIKANDINDING-STD', 'Standar', 289000, 404600, 500, 200),
  (20044, 440672, 'VEGETABLEBIGCUTTER-STD', 'Standar', 79000, 110600, 500, 200),
  (20045, 440746, 'BIBITSAWOSAWESTA-STD', 'Standar', 79000, 110600, 500, 200),
  (20046, 440751, 'KACAMATAANTIRADIASI-STD', 'Standar', 129000, 180600, 500, 200),
  (20047, 440808, 'BIBITJERUKSANTANG-STD', 'Standar', 99000, 138600, 500, 200),
  (20048, 440816, 'LAMPUJAGUNGLED-STD', 'Standar', 99000, 138600, 500, 200),
  (20049, 441650, 'BIBITBUAHJAMBLANG-STD', 'Standar', 199000, 278600, 500, 200),
  (20050, 441656, 'SEALANTCEMENT-STD', 'Standar', 125000, 175000, 500, 200),
  (20051, 441657, 'LEMJAYSUING-STD', 'Standar', 125000, 175000, 500, 200),
  (20052, 441659, 'TUTUPMAKANAN-STD', 'Standar', 199000, 278600, 500, 200),
  (20053, 441661, 'ALATSIRAMOTOMATIS-STD', 'Standar', 298000, 417200, 500, 200),
  (20054, 441665, 'BIBITRAMBUTAN-STD', 'Standar', 104000, 145600, 500, 200),
  (20055, 441672, 'KURSIJONGKOKTOILET-STD', 'Standar', 104000, 145600, 500, 200)
ON CONFLICT(id) DO UPDATE SET
  product_id = excluded.product_id,
  sku = excluded.sku,
  title = excluded.title,
  price = excluded.price,
  compare_price = excluded.compare_price,
  weight_grams = excluded.weight_grams,
  stock = excluded.stock;

INSERT OR IGNORE INTO courier_rules (
  id, store_id, courier_code, is_enabled, is_cod_enabled, excluded_provinces
) VALUES
  (1, 1, 'JNE', 1, 1, 'papua,papua barat,papua tengah,papua pegunungan,papua selatan'),
  (2, 1, 'SiCepat', 1, 1, 'papua pegunungan,papua selatan'),
  (3, 1, 'J&T', 1, 1, 'papua pegunungan'),
  (4, 1, 'SAP', 1, 1, 'papua,maluku utara'),
  (5, 1, 'Ninja', 1, 1, 'papua pegunungan'),
  (6, 1, 'Anteraja', 1, 1, 'papua pegunungan,papua selatan'),
  (7, 1, 'Lion', 1, 1, 'papua pegunungan'),
  (8, 1, 'IDexpress', 1, 1, 'papua pegunungan'),
  (9, 1, 'Paxel', 1, 0, 'papua,maluku,nusa tenggara timur'),
  (10, 1, 'Pos', 1, 1, 'papua pegunungan');
