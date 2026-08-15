# AUTO_UPDATE_DEPLOY.md — Tenant Auto-Update & Automated Cloudflare Deployment Guide

> **CANONICAL AUTO-DEPLOY & VERSION UPDATE CONTRACT**  
> This file provides the step-by-step instructions for AI agents, maintainers, and automated CI/CD pipelines to automatically pull core CMS updates, bump version tags, and deploy Worker releases to Cloudflare Workers.

---

## 1. Overview: How Tenant Auto-Deploy Works

When a new core CMS feature is pushed to the repository or when the version tag is bumped (e.g. `v1.0.0` $\rightarrow$ `v1.0.1`), tenant Workers can be deployed automatically via two pathways:

1. **Automated GitHub Actions CI/CD Pipeline**:
   - Triggered automatically on `push` to `main` or `petanisejahtera-preview`, or on tag `v*`.
   - Validates all tenant environments, builds each tenant bundle, and deploys every tenant Worker to Cloudflare using Wrangler CLI.

2. **AI Agent CLI Command Hook**:
   - AI agents working on tenant environments run `CF_DEPLOY_REMOTE=1 npm run tenant:deploy:all` to deploy all registered tenants, or `CF_DEPLOY_REMOTE=1 npm run tenant:deploy -- <tenant>` to deploy a specific tenant.

---

## 2. GitHub Secrets Setup for Automated Deployment

To enable zero-touch automatic deployment when pushing code to GitHub:

1. Open your GitHub Repository: **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions**.
2. Add the following Repository Secrets:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API token with **Edit Workers** and **D1/R2/KV Edit** permissions.
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found in Cloudflare Dashboard URL or `wrangler whoami`).

Once configured, any push to `main` or a `v*` tag will automatically run `.github/workflows/tenant-auto-deploy.yml` and update all live tenant Workers!

---

## 3. Instructions for AI Coding Assistants (Version Update & Deploy)

When an AI assistant (Claude, Codex, Antigravity, OMP, Pi, ChatGPT) is asked to perform a core update or deploy a new release, follow these exact steps:

### Step 1: Set Baseline or Bump Version Number
Open [`src/lib/version.ts`](./src/lib/version.ts) and verify or update the version string:
```ts
export const CMS_VERSION: CmsVersionInfo = {
  version: "1.0.0", // Baseline version (bump to 1.0.1 on bugfix, 1.1.0 on feature)
  channel: "production",
  releaseTag: "2026.08-stable",
  coreEngine: "Astro 7 SSR + Cloudflare Workers",
  schemaVersion: 23,
  lastUpdated: "2026-08-12",
};
```

### Step 2: Validate System Health
Before deploying, execute typecheck and test verification:
```bash
npm run check
npm test
npm run tenant:validate
```

### Step 3: Execute Remote Deployment

#### Option A: Deploy All Tenants (Batch Auto-Deploy)
```bash
CF_DEPLOY_REMOTE=1 npm run tenant:deploy:all
```

#### Option B: Deploy Single Tenant
```bash
CF_DEPLOY_REMOTE=1 npm run tenant:deploy -- petanisejahtera-preview
```

---

## 4. Manual / Cron Sync Command for External AI Agents

If an external AI agent or tenant maintainer wants to pull the latest core update and auto-deploy in one command:

```bash
git pull origin main && \
npm run tenant:validate && \
CF_DEPLOY_REMOTE=1 npm run tenant:deploy:all
```

---

## 5. Summary of Tenant Commands

| Command | Purpose |
| --- | --- |
| `npm run tenant:list` | List all registered tenant environments |
| `npm run tenant:validate` | Validate bindings, D1 schemas, and env vars for all tenants |
| `npm run tenant:build -- <tenant>` | Build standalone Worker bundle for target tenant |
| `npm run tenant:deploy -- <tenant>` | Deploy Worker build for target tenant to Cloudflare |
| `npm run tenant:deploy:all` | **Batch auto-deploy ALL registered tenant Workers** |
