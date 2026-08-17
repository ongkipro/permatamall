import assert from "node:assert/strict";
import test from "node:test";
import {
  editorialProductContentByCatalogId,
  type Product,
} from "../data/products.ts";
import { mergeStorefrontCatalog } from "./catalog-data.ts";

function product(slug: string, productId: string): Product {
  return {
    slug,
    productId,
    productName: slug,
    contentName: `${slug} content`,
    headline: `${slug} headline`,
    subheadline: `${slug} subheadline`,
    seoTitle: slug,
    seoDescription: slug,
    price: 100000,
    comparePrice: 150000,
    image: `/images/${slug}.webp`,
    heroImage: `/images/${slug}.webp`,
    tag: slug,
    category: slug,
    relatedCategories: [],
    description: slug,
    benefits: [],
    keyPoints: [],
    idealFor: [],
    offerText: slug,
    ctaText: slug,
    reviews: [],
    variants: [
      { id: `${slug}-variant`, label: `${slug} - 500ml`, price: 100000 },
    ],
  };
}

const expectedSeededProductBrands = [
  "ZIVIA",
  "AIRA",
  "CANDY",
  "AMARA",
  "NOURA",
  "SORAYA",
  "LENZY",
  "SHELIN",
  "LUNNA",
  "LUCKY",
  "KEISYA",
  "JEMINA",
  "HALONA",
  "EMIRA",
  "DILY",
  "CAROLINE",
  "BERLYN",
  "AYIEN",
  "ARIELA",
  "ANGGUN",
  "AJUNA",
  "DAIRA",
] as const;

test("PermataMall editorial copy covers every seeded product with distinct content", () => {
  const entries = Object.entries(editorialProductContentByCatalogId);
  assert.deepEqual(
    entries.map(([id]) => Number(id)),
    Array.from({ length: 22 }, (_, index) => index + 1),
  );
  assert.equal(
    new Set(entries.map(([, content]) => content.description)).size,
    entries.length,
  );

  for (const [id, content] of entries) {
    const expectedBrand = expectedSeededProductBrands[Number(id) - 1];
    assert.ok(expectedBrand);
    assert.ok(content.seoTitle.startsWith(`${expectedBrand} `));
    assert.ok(content.seoDescription.includes(expectedBrand));
    assert.ok(content.description.startsWith(`${expectedBrand} `));
    assert.ok(content.subheadline.length > 0);
    assert.ok(content.seoTitle.length <= 60);
    assert.ok(
      content.seoDescription.length >= 120 &&
        content.seoDescription.length <= 160,
    );
    assert.equal(content.benefits.length, 3);
    assert.equal(content.keyPoints.length, 3);
    assert.equal(content.idealFor.length, 3);
    assert.doesNotMatch(
      JSON.stringify(content),
      /kulit asli|original|garansi|gratis ongkir|waterproof/i,
    );
  }
});

const aussie = product("aussie", "10001");
const bensu = product("bensu", "10002");

test("D1 product identity and sellable variants override editorial catalog operations", () => {
  const products = mergeStorefrontCatalog(
    [aussie, bensu],
    [
      {
        id: 10001,
        title: "Aussie Admin",
        slug: "aussie-admin",
        category: "Admin Category",
        image_url: "/assets/uploads/aussie.webp",
        is_active: 1,
      },
    ],
    [
      {
        id: 20001,
        product_id: 10001,
        title: "500ml",
        price: 151000,
        compare_price: 229000,
        stock: 4,
      },
      {
        id: 20002,
        product_id: 10001,
        title: "1 Liter",
        price: 300000,
        compare_price: 349000,
        stock: 0,
      },
    ],
  );

  const merged = products.find(
    (product) => product.productId === aussie.productId,
  );
  assert.ok(merged);
  assert.equal(merged.productName, "Aussie Admin");
  assert.equal(merged.slug, "aussie-admin");
  assert.equal(merged.category, "Admin Category");
  assert.equal(merged.image, "/assets/uploads/aussie.webp");
  assert.equal(merged.price, 151000);
  assert.deepEqual(merged.variants, [
    {
      catalogId: 20001,
      id: "20001",
      label: "500ml",
      price: 151000,
      comparePrice: 229000,
    },
  ]);
  assert.ok(!products.some((product) => product.productId === bensu.productId));
});

test("inactive or checkout-incomplete D1 products are hidden from storefront output", () => {
  const baseRow = {
    id: 10001,
    title: "Aussie",
    slug: "aussie",
    category: null,
    image_url: null,
  };

  assert.deepEqual(
    mergeStorefrontCatalog([aussie], [{ ...baseRow, is_active: 0 }], []),
    [],
  );
  assert.deepEqual(
    mergeStorefrontCatalog(
      [aussie],
      [{ ...baseRow, is_active: 1 }],
      [
        {
          id: 20001,
          product_id: 10001,
          title: "500ml",
          price: 0,
          compare_price: null,
          stock: 10,
        },
      ],
    ),
    [],
  );
});
test("custom D1 products created manually without editorial match are synthesized correctly", () => {
  const customProductRow = {
    id: 50001,
    title: "Pupuk Organik Super",
    slug: "pupuk-organik-super",
    category: "Pupuk",
    image_url: "/uploads/pupuk.webp",
    is_active: 1,
  };
  const customVariantRows = [
    {
      id: 60001,
      product_id: 50001,
      sku: "PUPUK-1L",
      title: "1 Liter",
      price: 120000,
      compare_price: 150000,
      stock: 50,
    },
  ];

  const products = mergeStorefrontCatalog([], [customProductRow], customVariantRows);
  assert.equal(products.length, 1);
  assert.equal(products[0].productId, "50001");
  assert.equal(products[0].productName, "Pupuk Organik Super");
  assert.equal(products[0].slug, "pupuk-organik-super");
  assert.equal(products[0].price, 120000);
  assert.equal(products[0].variants[0].label, "1 Liter");
  assert.equal(products[0].headline, "Pupuk Organik Super");
  assert.equal(products[0].seoTitle, "Pupuk Organik Super");
  assert.deepEqual(products[0].images, ["/uploads/pupuk.webp"]);
  assert.deepEqual(products[0].benefits, []);
  assert.deepEqual(products[0].keyPoints, []);
  assert.deepEqual(products[0].idealFor, []);
  assert.doesNotMatch(
    JSON.stringify(products[0]),
    /Korean|original|garansi|COD|gratis ongkir/i,
  );
});

test("conventional catalog media paths expose the complete seven-image gallery", () => {
  const products = mergeStorefrontCatalog(
    [],
    [
      {
        id: 22,
        title: "DAIRA Tas Selempang & Bahu Kanvas",
        slug: "daira-tas-selempang-bahu-kanvas",
        category: "Tas Selempang",
        image_url:
          "/images/products/daira-tas-selempang-bahu-kanvas/1.webp",
        is_active: 1,
      },
    ],
    [
      {
        id: 106,
        product_id: 22,
        title: "Hitam",
        price: 128_500,
        stock: 3,
      },
      {
        id: 107,
        product_id: 22,
        title: "Coklat",
        price: 128_500,
        stock: 2,
      },
    ],
  );

  assert.equal(products.length, 1);
  assert.deepEqual(
    products[0].images,
    [1, 2, 3, 4, 5, 6, 7].map(
      (position) =>
        `/images/products/daira-tas-selempang-bahu-kanvas/${position}.webp`,
    ),
  );
  assert.equal(
    products[0].subheadline,
    editorialProductContentByCatalogId[22].subheadline,
  );
  assert.equal(
    products[0].description,
    editorialProductContentByCatalogId[22].description,
  );
  assert.deepEqual(
    products[0].benefits,
    editorialProductContentByCatalogId[22].benefits,
  );
});
