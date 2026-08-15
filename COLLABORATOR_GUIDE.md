# COLLABORATOR_GUIDE.md — Collaborator & AI Storefront Customization Guide

> **STRICT ARCHITECTURAL BOUNDARY & OWNERSHIP RULE**  
> This file defines the operational contract for merchant collaborators, tenant maintainers, and external AI coding assistants working on storefront customization.

---

## 1. System Topology & Repository Ownership

CMSAds operates as a multi-tenant headless/integrated commerce platform with a strict core-engine vs. storefront separation:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           CORE CMS & ENGINE                             │
│                     (OWNER-ONLY WRITE & COMMIT)                         │
│                                                                         │
│  - Admin OMS UI & React Islands        - Database Schema & Migrations   │
│  - Backend API Routes (/src/pages/api) - Mengantar & AutoLaris Logic    │
│  - Order Persistence & RTS Scoring     - Form Dispatch & State Logic    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                             UPSTREAM GIT PULL
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      TENANT STOREFRONT SURFACE                          │
│               (COLLABORATORS & MERCHANT AI ASSISTANTS)                  │
│                                                                         │
│  - Tenant Logo & Brand Identity        - Color Tokens & Styling         │
│  - Product Grid & Catalog Presentation - Hero Marketing Banners         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Roles & Access Matrix

| Surface / Action | Core Owner (Paduka Ongki) | Collaborator / Merchant AI |
| --- | --- | --- |
| Core CMS Code (`src/pages/api/`, `src/db/`, `src/lib/`, `src/components/admin/`) | ✅ Full Read/Write | ❌ **PROHIBITED** (Read-Only) |
| Git Push & Commit to Core CMS Repository | ✅ Authorized | ❌ **PROHIBITED** (Pull Only) |
| Tenant Worker Deployment (`npm run tenant:deploy -- <tenant>`) | ✅ Authorized | ✅ Authorized for assigned tenant |
| Storefront Visual Customization (Logo, Colors, Copy) | ✅ Authorized | ✅ Authorized in Storefront Slots |
| Checkout Form Structure & Validation Logic (`form-hybrid`, `form-middle`, `form-full`) | ✅ Authorized | ❌ **LOCKED** (Color Styling Only) |

---

## 2. Rules for Collaborators & External AI Assistants

When assisting a merchant or customizing a tenant storefront, AI coding agents (Claude, Codex, Antigravity, OMP, Pi, ChatGPT, etc.) **MUST** adhere to the following rules:

### 🔴 Prohibited Actions
1. **NO PUSH / NO COMMIT TO CORE CMS REPOSITORY**: Collaborators and external AI agents must **never** push code updates back to the primary CMSAds core repository. All upstream CMS code updates flow one way (Owner $\rightarrow$ Repository $\rightarrow$ Collaborator pull).
2. **NO ALTERATION OF CORE ENGINE OR APIS**: Do **not** modify files in `src/pages/api/`, `src/db/schema.ts`, `src/db/migrations/`, `src/components/admin/`, `src/lib/order-persistence.ts`, `src/lib/mengantar-client.ts`, `src/lib/autolaris-client.ts`, or `src/lib/rts-scoring.ts`.
3. **NO ALTERATION OF CHECKOUT FORM STRUCTURE**: Do **not** remove, rename, or reorder form fields, validation logic, state management scripts (`form-hybrid.ts`, `form-middle.ts`), GeoIP hybrid resolution logic, or payment/shipping handling in `src/components/forms/`.

### 🟢 Allowed Customizations
1. **Storefront Brand & Color Tokens**: Customize logo SVG/WebP assets, CSS color variables, and Tailwind theme tokens (e.g. primary emerald green, slate background, typography) inside storefront components (`src/components/storefront/`).
2. **Storefront Presentation Templates**: Adjust layout grids, product hero banners, marketing copy, and catalog cards in `src/components/storefront/templates/` (`compact-market` or custom presentation slots).
3. **Form Visual Styling Only**: You MAY change CSS classes or visual colors of checkout form containers and buttons, provided the underlying form element IDs, input names, data attributes, and event scripts remain completely untouched.
4. **Tenant Configuration**: Update tenant env bindings in `.dev.vars.<tenant>` or `wrangler.jsonc` (e.g. `PUBLIC_SITE_NAME`, `PUBLIC_SITE_LOGO`, `PUBLIC_SITE_THEME_COLOR`).

---

## 3. Workflow for Customizing a Tenant Storefront

To customize a storefront for a specific merchant tenant:

### Rung 1: Pull Upstream Updates
Always work from the latest core CMS baseline:
```bash
git pull origin petanisejahtera-preview # or canonical main branch
```

### Rung 2: Configure Tenant Environment
Set up tenant metadata in `wrangler.jsonc` or `.dev.vars.<tenant>`:
```env
PUBLIC_TENANT_SLUG="mymerchant"
PUBLIC_SITE_NAME="Toko Tani Makmur"
PUBLIC_SITE_LOGO="/images/mymerchant-logo.svg"
PUBLIC_SITE_THEME_COLOR="#15803D"
```

### Rung 3: Apply Visual Theme Overrides
Update visual tokens in `src/components/storefront/` or custom CSS without touching core scripts:
- Logo asset: `public/images/<tenant>-logo.svg`
- Accent colors: override CSS tokens `--color-primary` or Tailwind class defaults.

### Rung 4: Validate and Deploy
Run standard tenant validation and deploy the Worker to Cloudflare:
```bash
npm run tenant:validate
npm run tenant:build -- mymerchant
npm run tenant:deploy -- mymerchant
```

---

## 4. Troubleshooting & Assistance

If a collaborator or AI agent detects a bug in the core CMS backend or checkout form logic:
- **Do not patch the core engine directly.**
- Submit a detailed issue report or contact **Paduka Ongki (Core System Owner)** to issue an official core patch.
