import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/**
 * The storefront image contract (DESIGN-SYSTEM.md "Contract"): a public `<img>`
 * says whether it is the page's first paint or can wait (`loading="eager"` for
 * the likely LCP image and the header brand, `"lazy"` for everything else), and
 * reserves its box with `width` and `height` so nothing shifts when it arrives.
 * `loading` left off means eager, which on a below-the-fold photo costs an ad
 * landing real bytes and on a forgotten one nobody can tell intent from
 * oversight. CMS landing HTML is covered separately by `deferOffscreenImages`.
 *
 * Fix the tag, not this test. An exception below needs a reason a reviewer can
 * check against the file, and an exception that no longer matches a tag fails
 * the suite so the list cannot outlive the code it excuses.
 */
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

// /hello (the admin login) and AdminLayout are the admin surface (DESIGN-SYSTEM §0.2), not this contract.
const ADMIN = new Set(["src/pages/hello.astro", "src/layouts/AdminLayout.astro"]);
const all = [
  ...walk("src/components/storefront"),
  ...walk("src/layouts"),
  ...walk("src/scripts"),
  ...walk("src/pages").filter((f) => !f.startsWith("src/pages/admin/") && !f.startsWith("src/pages/api/")),
].filter((f) => !ADMIN.has(f) && !f.endsWith(".test.ts"));
const files = all.filter((f) => f.endsWith(".astro") || f.endsWith(".ts"));
/** A file type the scan cannot read (`.tsx`, `.mdx`, `.js` …) would be a public image it never sees. */
const unread = all.filter((f) => !files.includes(f) && !f.endsWith(".md") && !f.endsWith(".json"));

/**
 * Every `<img …>` in `source`, read to its real end. A `>` inside `{…}` or inside a
 * quoted value is not the end, and a quote opened inside `{…}` is honoured too. A tag
 * that never closes throws: a guard that silently drops what it cannot read fails open.
 *
 * lazy: the scan does not know it is inside a comment or a JS string, so a prose
 * `<img` in a `//` comment can open a quote that never closes (it then throws, it
 * does not pass). Upgrade path: tokenize `.ts` with the TypeScript scanner and
 * `.astro` with `@astrojs/compiler` once a false throw actually happens.
 */
function imgTags(source: string): { tag: string; index: number }[] {
  const tags: { tag: string; index: number }[] = [];
  for (const start of source.matchAll(/<img\s/gi)) {
    let depth = 0;
    let quote = "";
    let end = -1;
    for (let i = start.index; i < source.length && end < 0; i++) {
      const ch = source[i];
      if (quote) {
        if (ch === quote) quote = "";
      } else if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch;
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        depth--;
      } else if (ch === ">" && depth === 0) {
        end = i;
      }
    }
    if (end < 0) throw new Error(`unterminated <img at offset ${start.index}`);
    tags.push({ tag: source.slice(start.index, end + 1), index: start.index });
  }
  return tags;
}

/** A real attribute name: not `data-loading=`, not `max-width=`, and not text inside a value. */
function hasAttr(tag: string, name: string): boolean {
  const bare = tag.replace(/"[^"]*"|'[^']*'|`[^`]*`/g, '""');
  return new RegExp(`(?<![\\w-])${name}\\s*=`).test(bare);
}

/**
 * `loading` that always renders: a literal `lazy`/`eager`, or an expression whose
 * every branch is one. `loading={props.loading}` or `{x ? "eager" : undefined}`
 * renders no attribute at all when the value is undefined, which is the oversight
 * this guard exists to catch.
 */
function declaresLoading(tag: string): boolean {
  const at = tag.replace(/"[^"]*"|'[^']*'|`[^`]*`/g, (q) => " ".repeat(q.length)).search(/(?<![\w-])loading\s*=/);
  if (at < 0) return false;
  const value = tag.slice(at).replace(/^loading\s*=\s*/, "");
  if (/^(["'])(lazy|eager)\1/.test(value)) return true;
  const expr = value.match(/^\$?\{([^}]*)\}/)?.[1] ?? "";
  const one = /^\s*(["'`])(lazy|eager)\1\s*$/;
  const ternary = /^[^?]+\?\s*(["'`])(lazy|eager)\1\s*:\s*(["'`])(lazy|eager)\3\s*$/;
  return one.test(expr) || ternary.test(expr);
}

type Skip = "loading" | "dimensions";
/** `tags` is how many tags the exception covers (default 1), checked exactly. */
const EXCEPTIONS: { file: string; contains: string; skip: Skip[]; why: string; tags?: number }[] = [
  {
    file: "src/components/storefront/tracking/MetaPixelBase.astro",
    contains: "facebook.com/tr",
    skip: ["loading"],
    why: "1x1 pixel inside <noscript>; no layout, and a lazy beacon might never fire",
  },
  {
    file: "src/components/storefront/shared/SiteBrand.astro",
    contains: "src={uploadedLogo}",
    skip: ["dimensions"],
    why: "uploaded logo of unknown aspect: height-bound inline, width auto, max 168px",
  },
  {
    file: "src/components/storefront/forms/FormHybridContent.astro",
    contains: "src={bannerImage}",
    skip: ["dimensions"],
    why: "merchant promo banner, unknown intrinsic size; h-auto w-full, lazy, below the form",
  },
  {
    file: "src/components/storefront/forms/FormMiddleContent.astro",
    contains: "src={bannerImage}",
    skip: ["dimensions"],
    why: "merchant promo banner, unknown intrinsic size; h-auto w-full, lazy, below the form",
  },
  {
    file: "src/pages/[slug].astro",
    contains: "src={config.src}",
    skip: ["dimensions"],
    why: "a CMS image section stores only src and alt, so there is no size to declare; eager first, lazy after",
    tags: 2,
  },
  {
    file: "src/pages/payment.astro",
    contains: 'id="qr-image"',
    skip: ["loading", "dimensions"],
    why: "hidden until script sets a generated QR, inside a fixed-size box",
  },
  {
    file: "src/pages/thanks.astro",
    contains: 'id="payment-qr-image"',
    skip: ["loading", "dimensions"],
    why: "hidden until script sets a generated QR, inside a fixed-size box",
  },
];

test("every public <img> declares loading and reserves its box", () => {
  const used = new Set<number>();
  const matches = EXCEPTIONS.map(() => 0);
  const failures: string[] = unread.map((f) => `${f} is a file type this scan cannot read`);
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    // A DOM-built image never appears as `<img` text, so it would ship unchecked.
    for (const m of source.matchAll(/createElement\(\s*["'`]img["'`]\s*\)|new Image\(/gi)) {
      failures.push(`${file}:${source.slice(0, m.index).split("\n").length} builds an image through the DOM; write the tag as markup or a string this scan reads`);
    }
    for (const { tag, index } of imgTags(source)) {
      const missing: Skip[] = [];
      const names: string[] = [];
      if (!declaresLoading(tag)) (missing.push("loading"), names.push("loading"));
      if (!hasAttr(tag, "width")) (missing.push("dimensions"), names.push("width"));
      if (!hasAttr(tag, "height")) (missing.push("dimensions"), names.push("height"));
      const hit = EXCEPTIONS.findIndex((e) => e.file === file && tag.includes(e.contains));
      if (hit >= 0) matches[hit]++;
      const excused = hit >= 0 ? EXCEPTIONS[hit].skip : [];
      // An exception counts as used only when it actually excused something.
      if (hit >= 0 && missing.some((m) => excused.includes(m))) used.add(hit);
      const unexcused = names.filter((_, i) => !excused.includes(missing[i]));
      if (unexcused.length) {
        const line = source.slice(0, index).split("\n").length;
        failures.push(`${file}:${line} is missing ${unexcused.join(", ")}`);
      }
    }
  }
  // An exception excuses the tags it names. Another tag that happens to share
  // its src expression is new code nobody reviewed against the reason.
  EXCEPTIONS.forEach((e, i) => {
    const want = e.tags ?? 1;
    if (matches[i] > want) failures.push(`${e.file} ~ ${e.contains} matches ${matches[i]} tags; the exception covers ${want}`);
  });
  assert.deepEqual(failures, []);
  const stale = EXCEPTIONS.filter((_, i) => !used.has(i)).map((e) => `${e.file} ~ ${e.contains}`);
  assert.deepEqual(stale, [], "an exception that excuses nothing must be deleted");
});

test("the scan reads a tag to its real end and cannot be satisfied by look-alikes", () => {
  const tags = imgTags('<img alt={`a > b`} src="x>y" loading="lazy" /> <img\n width="1"\n/> <img alt={c ? "}" : ""} src="a" /> <IMG src="u" />');
  assert.equal(tags.length, 4, "the tag name is case-insensitive");
  assert.ok(hasAttr(tags[0].tag, "loading"));
  assert.ok(hasAttr(tags[2].tag, "src") && !hasAttr(tags[2].tag, "loading"), "a `}` in a string must not end the expression early");
  assert.ok(!hasAttr('<img data-loading="x" max-width="1" alt="width = 3" />', "loading"));
  assert.ok(!hasAttr('<img data-loading="x" max-width="1" alt="width = 3" />', "width"));
  assert.throws(() => imgTags('<img src="a" loading="lazy"'), /unterminated/);
  assert.ok(files.some((f) => f.endsWith("form-hybrid.ts")), "the walk must reach the scripts that build <img> strings");
  assert.ok(!files.includes("src/layouts/AdminLayout.astro"), "the admin layout is not the public surface");
  assert.ok(files.length > 20, "the walk must actually find the storefront files");
});

test("loading counts only when it always renders", () => {
  for (const ok of ['loading="lazy"', "loading='eager'", "loading={i === 0 ? 'eager' : 'lazy'}", 'loading={"lazy"}']) {
    assert.ok(declaresLoading(`<img src="a" ${ok} />`), ok);
  }
  for (const bad of ["loading={props.loading}", "loading={eager ? 'eager' : undefined}", 'loading="auto"', "loading={x ?? 'lazy'}", 'alt="loading=lazy"']) {
    assert.ok(!declaresLoading(`<img src="a" ${bad} />`), bad);
  }
});
