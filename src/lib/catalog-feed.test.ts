import test from "node:test";
import assert from "node:assert/strict";
import {
  formatCatalogItemId,
  generateGoogleCatalogXml,
  generateMetaCatalogXml,
  type CatalogProduct,
} from "./catalog-feed.ts";

test("formatCatalogItemId returns product ID as itemId for single-variant products even if SKU exists", () => {
  const result = formatCatalogItemId("434683", { id: 101, label: "Default", price: 50000, sku: "variant_NO8meDAONBXBZr4lawMCaFOp" }, 0, 1);
  assert.equal(result.itemId, "434683");
  assert.equal(result.itemGroupId, undefined);
});

test("formatCatalogItemId returns product ID for first variant of multi-variant products", () => {
  const result = formatCatalogItemId("4001", { id: 10, label: "Paket 1", price: 85000 }, 0, 2);
  assert.equal(result.itemId, "4001");
  assert.equal(result.itemGroupId, undefined);
});

test("formatCatalogItemId returns indexed suffix and itemGroupId for secondary variants", () => {
  const result = formatCatalogItemId("4001", { id: 11, label: "Paket 2", price: 150000 }, 1, 2);
  assert.equal(result.itemId, "4001_v2");
  assert.equal(result.itemGroupId, "4001");
});

test("generateGoogleCatalogXml emits valid g:id matching content_id and g:item_group_id", () => {
  const mockProducts: CatalogProduct[] = [
    {
      productId: 4001,
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
  assert.ok(xml.includes("<g:id>4001</g:id>"));
  assert.ok(xml.includes("<g:id>4001_v2</g:id>"));
  assert.ok(xml.includes("<g:item_group_id>4001</g:item_group_id>"));
  assert.ok(xml.includes("<g:link>https://permatamall.shop/produk/bibit-sirsak</g:link>"));
  assert.ok(xml.includes("<g:price>85000 IDR</g:price>"));
});

test("generateMetaCatalogXml emits valid fb_product_category and matching content_id g:id", () => {
  const mockProducts: CatalogProduct[] = [
    {
      productId: 5005,
      slug: "pompa-air",
      productName: "Pompa Air Portable",
      category: "Alat Rumah Tangga",
      heroImage: "https://r2.example.com/pompa.jpg",
      variants: [{ id: 1, label: "Standard", price: 120000, sku: "variant_ABC123" }],
    },
  ];

  const xml = generateMetaCatalogXml(mockProducts, "https://permatamall.shop");
  assert.ok(xml.includes("<g:id>5005</g:id>"));
  assert.ok(!xml.includes("<g:item_group_id>"));
  assert.ok(xml.includes("<g:fb_product_category>"));
  assert.ok(xml.includes("<g:image_link>https://r2.example.com/pompa.jpg</g:image_link>"));
});
