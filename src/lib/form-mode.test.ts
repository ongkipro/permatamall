import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getCodDisabledProvinceCodes,
  resolveFormModeContext,
  resolveFormModeFromProvince,
} from "./form-mode.ts";
import { validateProvinceCodeList } from "./province.ts";

function requestWithCf(
  cf: Record<string, unknown>,
  url = "https://example.com/hybrid-form",
) {
  const request = new Request(url);
  Object.defineProperty(request, "cf", { value: cf });
  return request;
}

test("known non-excluded province codes and names resolve to middle mode", () => {
  const disabledCodes = getCodDisabledProvinceCodes();
  assert.equal(resolveFormModeFromProvince("JI", disabledCodes), "middle");
  assert.equal(
    resolveFormModeFromProvince("Jawa Timur", disabledCodes),
    "middle",
  );
});

test("provider formal Jakarta and Yogyakarta names remain COD-eligible when only Jawa Timur is disabled", () => {
  const disabledCodes = ["JI"];
  assert.equal(
    resolveFormModeFromProvince("Daerah Khusus Ibukota Jakarta", disabledCodes),
    "middle",
  );
  assert.equal(
    resolveFormModeFromProvince("Daerah Istimewa Yogyakarta", disabledCodes),
    "middle",
  );
  assert.equal(
    resolveFormModeFromProvince("Jawa Timur", disabledCodes),
    "full",
  );
});

test("excluded province codes and names resolve to full mode", () => {
  const disabledCodes = getCodDisabledProvinceCodes();
  assert.equal(resolveFormModeFromProvince("PA", disabledCodes), "full");
  assert.equal(resolveFormModeFromProvince("Papua", disabledCodes), "full");
});

test("unknown or absent provinces default to full mode in hybrid mode", () => {
  const disabledCodes = getCodDisabledProvinceCodes();
  assert.equal(resolveFormModeFromProvince("", disabledCodes), "full");
  assert.equal(resolveFormModeFromProvince("Atlantis", disabledCodes), "full");
});

test("Cloudflare regionCode is the primary hybrid dispatch signal", async () => {
  const context = await resolveFormModeContext(
    requestWithCf({ regionCode: "JI", region: "Papua" }),
    ["PA"],
  );
  assert.equal(context.provinceCode, "JI");
  assert.equal(context.resolvedMode, "middle");
  assert.equal(context.source, "cloudflare");
});
test("explicit form routes bypass geo while query mode remains authoritative", async () => {
  const explicit = await resolveFormModeContext(
    requestWithCf({ regionCode: "PA" }),
    ["PA"],
    "middle",
  );
  assert.equal(explicit.mode, "middle");
  assert.equal(explicit.resolvedMode, "middle");
  assert.equal(explicit.source, "explicit");

  const forcedMiddle = await resolveFormModeContext(
    requestWithCf(
      { regionCode: "PA" },
      "https://example.com/full-form?form=middle",
    ),
    ["PA"],
    "full",
  );
  assert.equal(forcedMiddle.mode, "middle");
  assert.equal(forcedMiddle.resolvedMode, "middle");
  assert.equal(forcedMiddle.source, "query");

  const forcedFull = await resolveFormModeContext(
    requestWithCf(
      { regionCode: "JI" },
      "https://example.com/middle-form?form=full",
    ),
    ["PA"],
    "middle",
  );
  assert.equal(forcedFull.mode, "full");
  assert.equal(forcedFull.resolvedMode, "full");
  assert.equal(forcedFull.source, "query");
});

test("query hybrid restores geo-adaptive resolution over an explicit route", async () => {
  const context = await resolveFormModeContext(
    requestWithCf(
      { regionCode: "JI" },
      "https://example.com/full-form?form=hybrid",
    ),
    ["PA"],
    "full",
  );
  assert.equal(context.mode, "hybrid");
  assert.equal(context.resolvedMode, "middle");
  assert.equal(context.source, "cloudflare");
});

test("Cloudflare region name and headers remain dispatch fallbacks", async () => {
  const namedContext = await resolveFormModeContext(
    requestWithCf({ region: "Papua" }),
    ["PA"],
  );
  assert.equal(namedContext.provinceCode, "PA");
  assert.equal(namedContext.resolvedMode, "full");

  const headerContext = await resolveFormModeContext(
    new Request("https://example.com/hybrid-form", {
      headers: { "x-cf-region-code": "JB" },
    }),
    ["PA"],
  );
  assert.equal(headerContext.provinceCode, "JB");
  assert.equal(headerContext.resolvedMode, "middle");
});

test("province policy validation rejects unknown ISO suffix codes", () => {
  assert.deepEqual(validateProvinceCodeList(["PA", "JB"]), {
    success: true,
    codes: ["PA", "JB"],
  });
  assert.deepEqual(validateProvinceCodeList(["PA", "XX"]), {
    success: false,
    invalidCodes: ["XX"],
  });
});
