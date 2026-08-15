# VERSION.md — CMSAds Core Versioning & Deployment Guide

> **CANONICAL VERSION REGISTRY & RELEASE DEPLOYMENT CONTRACT**  
> This file defines the core CMS versioning lifecycle, UI badge rendering, and the step-by-step runbook for AI coding assistants to bump versions and deploy Worker releases via Wrangler.

---

## 1. Current System Version Registry

| Field | Active Value |
| --- | --- |
| **Core CMS Version** | `v1.2.0` |
| **Release Tag** | `2026.08-hardened` |
| **Release Channel** | `production` |
| **Schema Version** | `34` (`0034_complete_repair_suite.sql`) |
| **Engine Stack** | `Astro 7 SSR + React 19 Islands + Cloudflare Workers + D1 + R2 + KV` |
| **Last Updated** | `2026-08-15` |
| **Source File** | [`src/lib/version.ts`](./src/lib/version.ts) |

---

## 2. Dashboard UI Version Integration

The core CMS version is displayed in the CMS Admin Dashboard UI/UX:

- **Location**: Admin Shell Sidebar Footer (`AppSidebar.tsx`).
- **Visual Presentation**:
  - Compact badge displaying `CMS Core v1.0.0`.
  - Animated emerald pulse status indicator showing active engine readiness.
  - Automatically hidden when sidebar is collapsed in icon-only mode.

```text
┌──────────────────────────────────────────────┐
│  🟢 CMS Core                         v1.0.0  │
└──────────────────────────────────────────────┘
```

---

## 3. Runbook for AI Assistants: Updating & Deploying CMS Releases

When an AI coding agent (Claude, Codex, Antigravity, OMP, Pi, etc.) or maintainer implements core CMS updates, follow this exact version update and deployment sequence:

### Step 1: Check & Bump Version Number
Open [`src/lib/version.ts`](./src/lib/version.ts) and update the version metadata:
```ts
export const CMS_VERSION: CmsVersionInfo = {
  version: "1.0.1", // Baseline is 1.0.0. Bump version: Patch (1.0.x), Minor feature (1.x.0)
  channel: "production",
  releaseTag: "2026.08-stable",
  coreEngine: "Astro 7 SSR + Cloudflare Workers",
  schemaVersion: 23,
  lastUpdated: "2026-08-12",
};
```
Also update `"version": "1.2.1"` in `package.json` if bumping a milestone release.

### Step 2: Validate System Integrity
Run tests and Astro/TypeScript check to ensure zero regressions:
```bash
npm test
npm run check
```

### Step 3: Run Tenant Registry Validation
Verify tenant configurations:
```bash
npm run tenant:validate
```

### Step 4: Build & Dry-Run Deployment
Build the target merchant tenant Worker:
```bash
npm run tenant:build -- petanisejahtera-preview # or assigned tenant slug
npm run tenant:dry-run -- petanisejahtera-preview
```

### Step 5: Deploy Release to Cloudflare Worker
Deploy the updated Worker build to Cloudflare:
```bash
# Standard local deploy (using local secrets/vars)
npm run tenant:deploy -- petanisejahtera-preview

# Remote production deploy (with remote asset/binding reconciliation)
CF_DEPLOY_REMOTE=1 npm run tenant:deploy -- petanisejahtera-preview
```

### Step 6: Record Executed Evidence
Document the new version number, commit hash, and Cloudflare Worker version ID in [`STATUS.md`](./STATUS.md) and [`BUILD-LOG.md`](./BUILD-LOG.md).

---

## 4. Automated CI/CD & Batch Deployment

For full auto-deploy workflow details via GitHub Actions and batch tenant deployment commands (`npm run tenant:deploy:all`), see [`AUTO_UPDATE_DEPLOY.md`](./AUTO_UPDATE_DEPLOY.md).
