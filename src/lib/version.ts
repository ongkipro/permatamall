export type CmsVersionInfo = {
  version: string;
  channel: string;
  releaseTag: string;
  coreEngine: string;
  schemaVersion: number;
  lastUpdated: string;
};

export const CMS_VERSION: CmsVersionInfo = {
  version: "1.4.2",
  channel: "production",
  // Schema 55 remains current; this release changes provider transport only.
  releaseTag: "2026.09-autolaris-submit-advice",
  coreEngine: "Astro 7 SSR + Cloudflare Workers",
  schemaVersion: 56,
  lastUpdated: "2026-09-02",
};
