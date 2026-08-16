CREATE TABLE product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  product_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE INDEX idx_product_images_product_order
ON product_images(product_id, sort_order, id);

INSERT INTO product_images (product_id, url, sort_order)
SELECT id, image_url, 0
FROM products
WHERE image_url IS NOT NULL AND trim(image_url) != '';
