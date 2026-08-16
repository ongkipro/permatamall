import test from "node:test";
import assert from "node:assert/strict";
import {
  formatContentId,
  formatCatalogItemId,
  generateGoogleCatalogXml,
  generateMetaCatalogXml,
  type CatalogProduct,
} from "./catalog-feed.ts";

test("formatContentId preserves the canonical D1 product ID", () => {
  assert.equal(formatContentId(1), "1");
  assert.equal(formatContentId("22"), "22");
  assert.equal(formatContentId(434683), "434683");
  assert.throws(() => formatContentId("abc"), /positive D1 integer/);
  assert.throws(() => formatContentId(""), /positive D1 integer/);
});

test("formatCatalogItemId returns variant ID for single-variant products", () => {
  const result = formatCatalogItemId("434683", "9001", 1);
  assert.equal(result.itemId, "9001");
  assert.equal(result.itemGroupId, undefined);
});

test("formatCatalogItemId groups the first variant under its product ID", () => {
  const result = formatCatalogItemId("22", "106", 2);
  assert.equal(result.itemId, "106");
  assert.equal(result.itemGroupId, "22");
});

test("formatCatalogItemId keeps every variant's canonical D1 ID", () => {
  const result = formatCatalogItemId("22", "107", 2);
  assert.equal(result.itemId, "107");
  assert.equal(result.itemGroupId, "22");
});

test("generateGoogleCatalogXml uses variant IDs grouped by product ID", () => {
  const mockProducts: CatalogProduct[] = [
    {
      productId: 22,
      slug: "bibit-sirsak",
      productName: "Bibit Sirsak Juara",
      category: "Pertanian",
      heroImage: "/images/hero.jpg",
      variants: [
        { id: 10, label: "Paket 1 Batang", price: 85000, sku: "variant_NO8meDAONBXBZr4lawMCaFOp" },
        { id: 11, label: "Paket 2 Batang", price: 150000 },
      ],
    },
  ];

  const xml = generateGoogleCatalogXml(mockProducts, "https://permatamall.shop");
  assert.ok(xml.includes("<g:id>10</g:id>"));
  assert.ok(xml.includes("<g:id>11</g:id>"));
  assert.equal(xml.match(/<g:item_group_id>22<\/g:item_group_id>/g)?.length, 2);
  assert.ok(xml.includes("<g:link>https://permatamall.shop/produk/bibit-sirsak</g:link>"));
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

test("generateMetaCatalogXml emits one canonical item per variant", () => {
  const mockProducts: CatalogProduct[] = [
    {
      productId: 15005,
      slug: "pompa-air",
      productName: "Pompa Air Portable",
      category: "Alat Rumah Tangga",
      heroImage: "https://r2.example.com/pompa.jpg",
      variants: [
        { id: 201, label: "Warna Black", price: 120000, stock: 4, sku: "variant_ABC123" },
        { id: 202, label: "Paket 2", price: 220000, stock: 0, sku: "variant_DEF456" },
      ],
    },
  ];

  const xml = generateMetaCatalogXml(mockProducts, "https://permatamall.shop");
  assert.equal(xml.match(/<item>/g)?.length, 2);
  assert.ok(xml.includes("<g:id>201</g:id>"));
  assert.ok(xml.includes("<g:id>202</g:id>"));
  assert.equal(xml.match(/<g:item_group_id>15005<\/g:item_group_id>/g)?.length, 2);
  assert.ok(xml.includes("<g:title>Pompa Air Portable - Warna Black</g:title>"));
  assert.ok(xml.includes("<g:custom_label_0>Warna Black</g:custom_label_0>"));
  assert.ok(xml.includes("<g:color>Black</g:color>"));
  assert.ok(xml.includes("<g:availability>out_of_stock</g:availability>"));
  assert.ok(xml.includes("<g:fb_product_category>"));
  assert.ok(xml.includes("<g:image_link>https://r2.example.com/pompa.jpg</g:image_link>"));
});
