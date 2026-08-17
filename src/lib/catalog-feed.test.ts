import test from "node:test";
import assert from "node:assert/strict";
import {
  formatCatalogItemId,
  formatContentId,
  generateGoogleCatalogXml,
  generateMetaCatalogXml,
  type CatalogProduct,
} from "./catalog-feed.ts";

test("formatContentId preserves the persisted provider ID exactly", () => {
  assert.equal(formatContentId(1), "1");
  assert.equal(formatContentId("10001"), "10001");
  assert.equal(formatContentId(4001), "4001");
  assert.equal(formatContentId(434683), "434683");
  assert.throws(() => formatContentId(""), /positive persisted D1 row ID/);
  assert.throws(() => formatContentId("abc"), /positive persisted D1 row ID/);
  assert.throws(() => formatContentId("01"), /positive persisted D1 row ID/);
  assert.throws(() => formatContentId(0), /positive persisted D1 row ID/);
});

test("catalog item ID is the exact numeric product key", () => {
  assert.equal(formatCatalogItemId("22"), "22");
  assert.equal(formatCatalogItemId(14001), "14001");
});

test("generateGoogleCatalogXml emits one product item regardless of variant count", () => {
  const mockProducts: CatalogProduct[] = [
    {
      productId: 22,
      slug: "tas-kanvas",
      productName: "Tas Kanvas",
      category: "Tas Wanita",
      heroImage: "/images/hero.jpg",
      headline: "Headline singkat",
      description: "Deskripsi produk detail.",
      variants: [
        { id: 10, label: "Warna Black", price: 85000, sku: "variant-black" },
        { id: 11, label: "Warna Cream", price: 85000, sku: "variant-cream" },
        { id: 12, label: "Paket Hemat 2 Pcs", price: 150000, sku: "variant-bundle" },
      ],
    },
  ];

  const xml = generateGoogleCatalogXml(mockProducts, "https://permatamall.shop");
  assert.equal(xml.match(/<item>/g)?.length, 1);
  assert.ok(xml.includes("<g:id>22</g:id>"));
  assert.ok(!xml.includes("<g:item_group_id>"));
  assert.ok(!xml.includes("<g:id>10</g:id>"));
  assert.ok(!xml.includes("variant_id="));
  assert.ok(xml.includes("<g:link>https://permatamall.shop/produk/tas-kanvas</g:link>"));
  assert.ok(xml.includes("<g:description>Deskripsi produk detail.</g:description>"));
  assert.ok(xml.includes("<g:price>85000 IDR</g:price>"));
});

test("generateGoogleCatalogXml emits g:sale_price when comparePrice is greater than price", () => {
  const mockProducts: CatalogProduct[] = [
    {
      productId: 16001,
      slug: "zivia-tote-bag",
      productName: "ZIVIA Tote Bag",
      category: "Tote Bag",
      heroImage: "/images/zivia.jpg",
      variants: [
        { id: 1, label: "Black", price: 128500, comparePrice: 300000 },
      ],
    },
  ];

  const xml = generateGoogleCatalogXml(mockProducts, "https://permatamall.shop");
  assert.ok(xml.includes("<g:price>300000 IDR</g:price>"));
  assert.ok(xml.includes("<g:sale_price>128500 IDR</g:sale_price>"));
  assert.ok(xml.includes("<g:google_product_category>6551</g:google_product_category>"));
});

test("generateMetaCatalogXml emits valid fb_product_category and matching content_id g:id", () => {
  const mockProducts: CatalogProduct[] = [
    {
      productId: 15005,
      slug: "pompa-air",
      productName: "Pompa Air Portable",
      category: "Alat Rumah Tangga",
      heroImage: "https://r2.example.com/pompa.jpg",
      variants: [{ id: 1, label: "Standard", price: 120000, sku: "variant_ABC123" }],
    },
  ];

  const xml = generateMetaCatalogXml(mockProducts, "https://permatamall.shop");
  assert.ok(xml.includes("<g:id>15005</g:id>"));
  assert.ok(!xml.includes("<g:item_group_id>"));
  assert.ok(xml.includes("<g:fb_product_category>"));
  assert.ok(xml.includes("<g:image_link>https://r2.example.com/pompa.jpg</g:image_link>"));
});
