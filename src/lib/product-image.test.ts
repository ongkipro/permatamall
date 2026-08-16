import assert from "node:assert/strict";
import test from "node:test";
import {
  hasWebpSignature,
  MAX_PRODUCT_IMAGE_SIZE,
} from "./product-image.ts";

test("product images are capped at exactly two binary MiB", () => {
  assert.equal(MAX_PRODUCT_IMAGE_SIZE, 2 * 1024 * 1024);
});

test("WebP validation requires both RIFF and WEBP signatures", () => {
  assert.equal(
    hasWebpSignature(new TextEncoder().encode("RIFF0000WEBP")),
    true,
  );
  assert.equal(
    hasWebpSignature(new TextEncoder().encode("RIFF0000PNG ")),
    false,
  );
  assert.equal(hasWebpSignature(new Uint8Array([0x52, 0x49, 0x46, 0x46])), false);
});
