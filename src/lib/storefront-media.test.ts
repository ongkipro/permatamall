import assert from "node:assert/strict";
import test from "node:test";
import {
  buildStorefrontMediaKey,
  MAX_STOREFRONT_MEDIA_BYTES,
  resolveGallerySelectionIndex,
  validateStorefrontMedia,
} from "./storefront-media.ts";

test("storefront media keys remain tenant-relative and path safe", () => {
  const file = { name: "Hero ../ Merchant.PNG", type: "image/png", size: 1024 };
  assert.deepEqual(validateStorefrontMedia(file), {
    extension: "png",
    base: "hero-merchant",
  });
  assert.equal(
    buildStorefrontMediaKey(file, "fixed-id", new Date("2026-08-10T00:00:00Z")),
    "content/2026-08/fixed-id-hero-merchant.png",
  );
});

test("storefront media rejects active content and oversized files", () => {
  assert.throws(
    () => validateStorefrontMedia({ name: "image.svg", type: "image/svg+xml", size: 100 }),
    /Format gambar/,
  );
  assert.throws(
    () => validateStorefrontMedia({ name: "image.webp", type: "image/webp", size: MAX_STOREFRONT_MEDIA_BYTES + 1 }),
    /maksimal 5 MB/,
  );
});

test("gallery selection follows image identity when failures reflow positions", () => {
  const source = ["1.webp", "2.webp", "3.webp", "4.webp", "5.webp", "6.webp", "7.webp"];

  assert.equal(
    resolveGallerySelectionIndex(source.slice(1), source, "5.webp"),
    3,
  );
  assert.equal(
    resolveGallerySelectionIndex(source.filter((image) => image !== "5.webp"), source, "5.webp"),
    4,
  );
  assert.equal(resolveGallerySelectionIndex([], source, "5.webp"), 0);
});
