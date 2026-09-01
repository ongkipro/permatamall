export type CmsVersionInfo = {
  version: string;
  channel: string;
  releaseTag: string;
  coreEngine: string;
  schemaVersion: number;
  lastUpdated: string;
};

export const CMS_VERSION: CmsVersionInfo = {
  version: "1.4.0",
  channel: "production",
  // Stock stops gating a sale (ADR-023). Schema 54 adds checkout replay dedupe.
  releaseTag: "2026.08-stock-unlimited",
  coreEngine: "Astro 7 SSR + Cloudflare Workers",
  schemaVersion: 54,
  lastUpdated: "2026-09-01",
};
