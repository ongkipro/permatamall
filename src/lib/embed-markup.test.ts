import assert from "node:assert/strict";
import test from "node:test";
import { buildEmbedMarkup } from "./embed-markup.ts";

const markup = buildEmbedMarkup({
  origin: "https://forms.example",
  embedUrl:
    "https://forms.example/embed/form?mode=hybrid&product_id=10001&variant_id=20002",
  elementId: "cmsads-order-form-10001",
  title: 'Form pemesanan Aussie "Sample"',
  productId: "10001",
  variantId: "20002",
  mode: "hybrid",
});

test("widget keeps a usable iframe fallback and canonical form identity", () => {
  assert.match(markup.widget, /^<cmsads-form-widget /);
  assert.match(markup.widget, /product-id="10001"/);
  assert.match(markup.widget, /variant-id="20002"/);
  assert.match(markup.widget, /mode="hybrid"/);
  assert.match(markup.widget, /<iframe [^>]*loading="eager"/);
  assert.match(markup.widget, /src="https:\/\/forms\.example\/embed\/form\?/);
  assert.match(markup.widget, /Form pemesanan Aussie &quot;Sample&quot;/);
  assert.match(markup.widget, /<script async src="https:\/\/forms\.example\/cmsads-form-widget\.js"><\/script>$/);
});

test("legacy snippets remain safe fallbacks", () => {
  assert.match(markup.plainIframe, /loading="lazy"/);
  assert.match(markup.plainIframe, /height="1000"/);
  assert.match(markup.autoHeightIframe, /event\.origin!=="https:\/\/forms\.example"/);
  assert.match(markup.autoHeightIframe, /event\.source!==frame\.contentWindow/);
  assert.match(markup.autoHeightIframe, /Math\.min\(12000,height\)/);
  assert.match(markup.autoHeightIframe, /cmsads:checkout-redirect/);
  assert.match(markup.autoHeightIframe, /target\.origin==="https:\/\/forms\.example"/);
  assert.match(markup.autoHeightIframe, /target\.pathname==="\/payment"/);
  assert.match(markup.autoHeightIframe, /target\.pathname==="\/thanks"/);
});
