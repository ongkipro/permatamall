export type CmsVersionInfo = {
  version: string;
  channel: string;
  releaseTag: string;
  coreEngine: string;
  schemaVersion: number;
  lastUpdated: string;
};

export const CMS_VERSION: CmsVersionInfo = {
  version: "1.4.1",
  channel: "production",
  // Schema 55 retains Meta request identity for delayed paid Purchase events.
  releaseTag: "2026.09-meta-signal-parity",
  coreEngine: "Astro 7 SSR + Cloudflare Workers",
  schemaVersion: 55,
  lastUpdated: "2026-09-02",
};
