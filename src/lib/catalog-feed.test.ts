import test from "node:test";
import assert from "node:assert/strict";
import {
  formatCatalogGroupId,
  formatCatalogItemId,
  formatContentId,
  generateGoogleCatalogXml,
  generateMetaCatalogXml,
  type CatalogProduct,
} from "./catalog-feed.ts";

test("formatContentId enforces minimum 5-digit pattern lock", () => {
  assert.equal(formatContentId(1), "10001");
  assert.equal(formatContentId("10001"), "10001");
  assert.equal(formatContentId(4001), "14001");
  assert.equal(formatContentId(434683), "434683");
  assert.equal(formatContentId("abc"), "00abc");
});

test("catalog IDs bind each item to immutable product and variant IDs", () => {
  assert.equal(formatCatalogGroupId("22"), "p10022");
  assert.deepEqual(formatCatalogItemId("22", 101), {
    itemId: "p10022-v10101",
    itemGroupId: "p10022",
  });
  assert.deepEqual(formatCatalogItemId("14001", "abc"), {
    itemId: "p14001-v00abc",
    itemGroupId: "p14001",
  });
});

test("generateGoogleCatalogXml groups color variants and leaves a bundle ungrouped", () => {
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
  assert.ok(xml.includes("<g:id>p10022-v10010</g:id>"));
  assert.ok(xml.includes("<g:id>p10022-v10011</g:id>"));
  assert.ok(xml.includes("<g:id>p10022-v10012</g:id>"));
  assert.equal(xml.match(/<g:item_group_id>p10022<\/g:item_group_id>/g)?.length, 2);
  assert.equal(xml.match(/<g:item_group_title>Tas Kanvas<\/g:item_group_title>/g)?.length, 2);
  assert.ok(xml.includes("<g:color>Black</g:color>"));
  assert.ok(xml.includes("<g:variant_option>color:Cream</g:variant_option>"));
  assert.ok(xml.includes("<g:multipack>2</g:multipack>"));
  assert.ok(!xml.includes("<g:mpn>"));
  assert.ok(xml.includes("<g:link>https://permatamall.shop/produk/tas-kanvas?variant_id=10</g:link>"));
  assert.ok(xml.includes("<g:description>Deskripsi produk detail. Varian: Warna Black.</g:description>"));
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
  assert.ok(xml.includes("<g:id>p15005-v10001</g:id>"));
  assert.ok(!xml.includes("<g:item_group_id>"));
  assert.ok(xml.includes("<g:fb_product_category>"));
  assert.ok(xml.includes("<g:image_link>https://r2.example.com/pompa.jpg</g:image_link>"));
});
