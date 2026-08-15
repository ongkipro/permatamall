ALTER TABLE `stores` ADD `cod_disabled_province_codes` text DEFAULT 'PA,PB,PD,PT,PE,PS,MA,MU,NT,KU,SR,GO,KR,AC,BE' NOT NULL;

INSERT INTO `products` (
  `id`,
  `store_id`,
  `title`,
  `slug`,
  `category`,
  `is_active`,
  `image_url`,
  `created_at`
)
SELECT
  10001,
  `id`,
  'Aussie Sample',
  'aussie',
  'Aussie Sawit Ganoderma',
  1,
  '/images/aussie.webp',
  '2026-08-01T08:00:00.000Z'
FROM `stores`
WHERE `id` = (SELECT MIN(`id`) FROM `stores`)
ON CONFLICT(`id`) DO UPDATE SET
  `title` = 'Aussie Sample',
  `slug` = 'aussie',
  `category` = 'Aussie Sawit Ganoderma',
  `is_active` = 1,
  `image_url` = '/images/aussie.webp';

INSERT INTO `product_variants` (
  `id`,
  `product_id`,
  `sku`,
  `title`,
  `price`,
  `compare_price`,
  `weight_grams`,
  `stock`
) VALUES
  (20001, 10001, 'AUS-500ML', '500ml', 150000, 229000, 600, 350),
  (20002, 10001, 'AUS-1L', '1 Liter', 300000, 349000, 1100, 180)
ON CONFLICT(`id`) DO UPDATE SET
  `product_id` = excluded.`product_id`,
  `sku` = excluded.`sku`,
  `title` = excluded.`title`,
  `price` = excluded.`price`,
  `compare_price` = excluded.`compare_price`,
  `weight_grams` = excluded.`weight_grams`,
  `stock` = excluded.`stock`;
