export type CmsVersionInfo = {
  version: string;
  channel: string;
  releaseTag: string;
  coreEngine: string;
  schemaVersion: number;
  lastUpdated: string;
};

export const CMS_VERSION: CmsVersionInfo = {
  version: "1.3.0",
  channel: "production",
  releaseTag: "2026.08-product-gallery",
  coreEngine: "Astro 7 SSR + Cloudflare Workers",
  schemaVersion: 39,
  lastUpdated: "2026-08-16",
};
