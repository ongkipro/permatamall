import assert from "node:assert/strict";
import test from "node:test";
import { getAdTaxonomy } from "./ad-taxonomy.ts";

test("automatically classifies agricultural/fertilizer products to Google Category ID 2863", () => {
  const result = getAdTaxonomy("Pertanian", "Pupuk Sawit Ganoderma", "Pupuk pelindung akar kelapa sawit");
  assert.equal(result.googleCategoryId, 2863);
  assert.equal(result.googleCategoryName, "Home & Garden > Lawn & Garden > Gardening > Fertilizer");
  assert.equal(result.metaCategoryName, "Home & Garden > Lawn & Garden > Gardening > Fertilizer");
  assert.equal(result.productType, "Pertanian > Pupuk & Nutrisi");
});

test("automatically classifies skincare/kojic products to Google Category ID 2547", () => {
  const result = getAdTaxonomy("Kecantikan", "Kojic Soap Soap Bar Glowing", "Sabun pemutih wajah dan badan");
  assert.equal(result.googleCategoryId, 2547);
  assert.equal(result.googleCategoryName, "Health & Beauty > Personal Care > Cosmetics > Skin Care");
  assert.equal(result.metaCategoryName, "Health & Beauty > Personal Care > Cosmetics > Skin Care");
  assert.equal(result.productType, "Kecantikan & Perawatan > Skincare");
});

test("automatically classifies herbal stamina products to Google Category ID 642", () => {
  const result = getAdTaxonomy("Kesehatan", "Madu Pinang Muda Stamina Pria", "Herbal alami penambah vitalitas");
  assert.equal(result.googleCategoryId, 642);
  assert.equal(result.googleCategoryName, "Health & Beauty > Health Care > Biotherapy & Alternative Medicine > Herbal Supplements");
  assert.equal(result.metaCategoryName, "Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements");
  assert.equal(result.productType, "Kesehatan > Suplemen Herbal");
});

test("automatically classifies kitchen sharpening tools to Google Category ID 645", () => {
  const result = getAdTaxonomy("Perkakas", "Pengasah Pisau Portable", "Alat asahan pisau dapur serbaguna");
  assert.equal(result.googleCategoryId, 645);
  assert.equal(result.googleCategoryName, "Home & Garden > Kitchen & Dining > Kitchen Tools & Utensils");
  assert.equal(result.metaCategoryName, "Home & Garden > Kitchen & Dining > Kitchen Tools & Utensils");
  assert.equal(result.productType, "Perkakas & Rumah Tangga > Alat Dapur");
});

test("provides clean fallback taxonomy when product input is empty or custom", () => {
  const result = getAdTaxonomy("Custom Category", "Unclassified Item", "");
  assert.equal(result.googleCategoryId, 645);
  assert.equal(result.productType, "Umum > Custom Category");
});
