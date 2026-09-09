import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/**
 * By the time the completion state is written the order already exists in D1.
 * Anything that throws between that point and the navigation strands a buyer on
 * the submitting spinner with a real order behind them — and because the server
 * Purchase is only ever triggered from `/thanks`, neither the Pixel leg nor the
 * Conversions API leg fires either.
 *
 * `sessionStorage.setItem` is exactly such a throw: Safari's private mode has
 * historically raised on any write, and a browser set to block site data does
 * the same.
 */

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

const FORMS = [
  ["form-hybrid", "../scripts/form-hybrid.ts"],
  ["form-middle", "../scripts/form-middle.ts"],
] as const;

test("a failed completion-state write can never block the redirect", () => {
  for (const [label, path] of FORMS) {
    const source = read(path);
    const index = source.indexOf('sessionStorage.setItem("thanks_state"');
    assert.ok(index > 0, `${label} must write the completion state`);
    const before = source.slice(Math.max(0, index - 400), index);
    assert.match(
      before,
      /try \{\s*$/,
      `${label} writes thanks_state unguarded — a storage failure would strand a real order`,
    );
  }
});
