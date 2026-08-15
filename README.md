# CMSAds Engine — Direct-Response Storefront and Merchant OMS

CMSAds is a self-hosted direct-response commerce platform built with Astro 7 SSR, React 19 islands, Cloudflare Workers, Workers AI, D1, R2, KV, and Tailwind CSS 4.

It combines:

- tenant-specific storefronts, catalogs, checkout forms (`form-hybrid`, `form-middle`, `form-full`), legal routes, and order confirmation;
- one tenant-independent merchant admin for orders, shipping, catalog, analytics, tracking, payments, developer settings, content, and access control;
- multi-platform conversion signal engine (Meta Ads CAPI outbox with deterministic `event_id`, Google Ads/TikTok click-ID cookie persistence, E.164 phone hashing);
- instant inline product catalog status toggling, one-click landing page duplication, order bulk status updates, and secure SHA-256 hashed API key management;
- explicit Mengantar logistics aggregator and AutoLaris payment boundaries;
- deployment-per-tenant isolation with one independently built Worker and one isolated resource set per merchant;
- runtime-owned tenant content: D1 owns instructions and structured drafts/publications, R2 owns media, and Git owns schemas, renderers, and shared behavior.
## Platform Contract

| Dimension | Active contract |
| --- | --- |
| Profile | `platform` |
| Overlays | `multi-tenant`, `custom-domain`, `commerce`, `personal-data`, `ai-system`, `mobile-desktop`, `data-analytics` |
| Public runtime | Integrated: CMSAds Worker owns the Custom Domain and public storefront. Headless: a separate storefront Worker owns public routes and reaches a service-only CMSAds backend through a private service binding. |
| Interactive admin | React islands inside one canonical responsive Astro shell |
| Operational state | Tenant D1: catalog, orders, payments, shipping, tracking config, provider config, access, and runtime content |
| Media | Tenant R2 through authenticated upload and immutable public media routes |
| Sessions and quotas | Tenant KV |
| AI | One Workers AI binding per Worker; generation creates validated drafts and never publishes automatically |
| Tenant routing | Explicit `custom-domain` or `service-only` ingress selected before provisioning; no hostname-to-database dispatcher |
| Release | One explicit tenant per guarded build, dry-run, migration, deployment, rollback, and smoke-test boundary |

Public renderers and AI-generated drafts do not synthesize ratings, reviews, sales counts, bestseller labels, comparison discounts, guarantees, provider identity, or waybills. Evidence-backed trust fields require explicit operator input. Provider and legal documentation describes observed repository behavior and known blockers; it does not claim provider certification or jurisdiction-specific compliance.

## Start Here

AI coding agents and maintainers MUST begin with [`AGENTS.md`](./AGENTS.md), then read only the documents relevant to the requested change. Merchant collaborators and storefront AI customization assistants MUST read [`COLLABORATOR_GUIDE.md`](./COLLABORATOR_GUIDE.md). Code, migrations, runtime configuration, and executed evidence take precedence over stale prose; stale prose must be corrected in the same change.

> **CRITICAL ARCHITECTURAL BOUNDARY: CORE CMS vs TENANT COLLABORATORS**  
> - **Core System Owner (Paduka Ongki)**: Owns CMS engine, Admin OMS UI, Backend APIs (`/src/pages/api`), D1 Schema/Migrations, Mengantar/AutoLaris logic, and order persistence. Only the Owner commits/pushes updates to the core CMS repository.  
> - **Collaborators & Tenant AI Assistants**: Pull core CMS updates, configure tenant bindings (`wrangler.jsonc`, `.dev.vars.<tenant>`), deploy tenant Workers, and customize storefront visual presentation (logo, color tokens, hero banners) in designated storefront slots.  
> - **LOCKED CHECKOUT FORMS**: Checkout forms (`form-hybrid`, `form-middle`, `form-full`) **MUST NOT** be structurally modified or broken. Field validation, state management, hybrid dispatch, RTS scoring, and payment/shipping handlers are off-limits for collaborators; only visual color styling may be adjusted.
### Canonical documentation ownership

| File | Owns |
| --- | --- |
| [`AGENTS.md`](./AGENTS.md) | AI-agent operating contract, source precedence, validation, approval gates, and handoff |
| [`COLLABORATOR_GUIDE.md`](./COLLABORATOR_GUIDE.md) | Merchant collaborator & AI storefront customization guide, core lock rules, and deployment boundaries |
| [`VERSION.md`](./VERSION.md) | Core CMS version registry, UI version badge integration, and release deployment runbook |
| [`AUTO_UPDATE_DEPLOY.md`](./AUTO_UPDATE_DEPLOY.md) | Automated GitHub Actions CI/CD setup, batch tenant deployment (`npm run tenant:deploy:all`), and AI agent auto-update contract |
| [`README.md`](./README.md) | Repository orientation, document map, supported workflows, and current platform boundaries |
| [`PRD.md`](./PRD.md) | Observable product requirements, non-goals, constraints, and milestones |
| [`PLAN.md`](./PLAN.md) | Architecture, data ownership, runtime-content lifecycle, and release topology |
| [`TASKS.md`](./TASKS.md) | Requirement-to-task traceability, completed phases, and active backlog |
| [`STATUS.md`](./STATUS.md) | Current implementation, routes, fixtures, deployment boundaries, and executed evidence |
| [`BUILD-LOG.md`](./BUILD-LOG.md) | Append-only chronological implementation and verification history |
| [`CLOUDFLARE_MULTI_TENANT.md`](./CLOUDFLARE_MULTI_TENANT.md) | Tenant registry, Worker/resource isolation, provisioning, release, rollback, and cleanup runbook |
| [`INSTALLATION.md`](./INSTALLATION.md) | Portable local bootstrap, new-account preparation, immutable canonical-sample provisioning, data onboarding, and release gates |
| [`STOREFRONT_INTEGRATION.md`](./STOREFRONT_INTEGRATION.md) | Custom frontend ownership, canonical CMSAds forms, province policy, headless gateway, public-data gaps, Meta Ads contract, and reusable AI implementation prompt |
| [`MENGANTAR_INTEGRATION_SPEC.md`](./MENGANTAR_INTEGRATION_SPEC.md) | Mengantar endpoint status, active order-to-shipment lifecycle, and blocked contracts |
| [`TRACKING_SPECS.md`](./TRACKING_SPECS.md) | Meta Pixel/CAPI, GTM, Google Ads, event identity, and deduplication contracts |
| [`STOREFRONT_DESIGN_SYSTEM.md`](./STOREFRONT_DESIGN_SYSTEM.md) | Storefront layout, interaction, responsive, accessibility, and trust-signal rules |
| [`design-tokens.md`](./design-tokens.md) | Legacy `compact-market` token profile and tenant-theme boundaries |
| [`UNIMPLEMENTED_SPECS.md`](./UNIMPLEMENTED_SPECS.md) | Genuine remaining work, provider blockers, merchant input, and operator-gated actions |
| [`doc/preview/index.html`](./doc/preview/index.html) | Indonesian visual explanation of the accepted contracts; never a competing source of truth |

Historical entries in `BUILD-LOG.md` remain factual records of the behavior and checks that existed at that time. Later entries, active requirements, current code, and `STATUS.md` identify superseded behavior.

## Repository Layout

```text
cmsads/
├── AGENTS.md
├── README.md
├── PRD.md
├── PLAN.md
├── TASKS.md
├── STATUS.md
├── BUILD-LOG.md
├── CLOUDFLARE_MULTI_TENANT.md
├── INSTALLATION.md
├── STOREFRONT_INTEGRATION.md
├── MENGANTAR_INTEGRATION_SPEC.md
├── TRACKING_SPECS.md
├── STOREFRONT_DESIGN_SYSTEM.md
├── UNIMPLEMENTED_SPECS.md
├── design-tokens.md
├── wrangler.jsonc                    # Canonical tenant/resource registry
├── .github/workflows/
│   └── fleet-release.yml             # Validate and dry-run matrix; exact-tenant manual release
├── doc/preview/                       # Seven-page Indonesian visual system guide
├── public/                            # Repository-owned static assets
├── scripts/
│   ├── install.sh                     # Lockfile-pinned local bootstrap
│   ├── install-tenant.ts              # Guarded merchant provisioning
│   └── tenant.ts                      # Tenant lifecycle, build, migration, and deployment wrapper
└── src/
    ├── components/
    │   ├── admin/                     # Interactive admin islands
    │   ├── forms/                     # Shared checkout forms
    │   ├── storefront/templates/      # `compact-market` and `wide-catalog`
    │   ├── shared/                    # Shared Astro chrome
    │   └── tracking/                  # Meta and Google browser tracking
    ├── db/
    │   ├── schema.ts
    │   ├── migrations/
    │   └── seed.sql                   # Deterministic local fixture only
    ├── lib/                           # Domain, provider, auth, content, and tenant helpers
    ├── pages/
    │   ├── admin/
    │   ├── api/
    │   ├── produk/
    │   ├── index.astro
    │   └── thanks.astro
    └── scripts/                       # Storefront browser scripts
```

## State and Content Ownership

### Catalog and checkout

- Tenant D1 `products` and `product_variants` own immutable generated IDs, slugs, titles, activation, price, compare price, weight, stock, and image override.
- The canonical product ID is also the ads `content_id`; the repository does not maintain a second catalog identity.
- `/admin/products` links every title to its dedicated editor and provides an **instant inline active/inactive toggle switch** that mutates status directly in D1 with optimistic UI updates. Product deletion requires explicit confirmation, removes unreferenced variants and the product in one D1 batch, and fails with `409` when any variant belongs to an order; use draft/inactive state instead.
- `/admin/landing-pages` supports section-based page building with a **one-click "Duplikasi Page" action** that clones pages and section trees into a independent `-copy` slug without section ID collisions.
- `/admin/orders` provides **quick status filter chips with live counts** (`Semua`, `Terbengkalai`, `Menunggu`, `Diproses`, `Dikirim`, `Selesai`, `Batal`), **multi-select bulk status updates**, and `<mark>` invoice query highlighting.
- `GET /api/form-config` accepts an active product ID or slug, an optional canonical variant ID, and `middle`, `full`, or `hybrid` mode. It returns canonical render URLs without duplicating form markup.
- Checkout never trusts browser price, shipping cost, stock, or weight. The server resolves the active D1 variant, re-fetches the eligible quote, validates courier/service/cost, and persists order, items, stock, and abandoned lead conversions atomically. Partial phone/name inputs record abandoned orders (`shipping_status = abandoned`) which are promoted in-place to `pending` upon full submission without duplicate rows.
- Online checkout stops at `/payment` instead of presenting a successful `/thanks` receipt. The payment route renders the recorded AutoLaris QRIS payload or VA/payment code, polls the token-protected order status, and redirects to `/thanks` only after D1 reports a paid-equivalent status. COD continues directly to `/thanks`.
- `/admin/settings/crm` inserts order-backed variables including customer WhatsApp, full address, district, shipping cost, total, courier, and waybill into Welcome/Follow-up templates. Order detail renders copy shortcuts for formatted addresses and WhatsApp templates.
- `/admin/settings/developer` provides **Headless API Key Management** with instant named key generation, one-time secret display, visual copy feedback, active key table, and D1 SHA-256 hashed secret persistence (`developer_api_keys` table via migration `0030_developer_api_keys.sql`).
- `/admin/payments` reports AutoLaris API-key and callback-secret readiness separately. Its check validates local configuration only; it does not claim provider connectivity or create a test invoice.
### Runtime storefront content

- Tenant D1 `storefront_content` owns validated manual or AI drafts and explicitly published home/product content.
- The selected Worker combines its stored non-secret instruction with operational D1 product facts, invokes its own Workers AI binding, validates strict structured JSON, and saves a draft.
- Publication is a separate authenticated mutation. Missing instructions, invalid or oversized JSON, raw HTML, invalid keys, or an absent draft cannot replace the current publication.
- Operational IDs, price, stock, payment, logistics, ads configuration, credentials, and order state cannot be overridden by content JSON.
- Runtime-managed tenants fail closed: missing home content renders an honest setup state and unpublished product presentation is omitted. The legacy Petani content pack remains an explicit migration boundary until its reviewed runtime cutover is completed.
- Tenant media belongs in R2 and is served from immutable `/media/content/*` URLs. KV is not a content store.

### Operator access

The owner creates named users under `/admin/settings/access`; each new user must replace the temporary password at first login. One deny-by-default policy drives both server enforcement and visible navigation.

| Role | Allowed workspace |
| --- | --- |
| `owner` | Every tenant workflow, including exclusive user management |
| `admin` | Every tenant workflow except user management |
| `advertiser` | Dashboard, products, storefront content/media, ads/tracking, and own profile |
| `customer_service` | Dashboard, orders, shipping, customer checks/rates, and own profile |

Unauthorized admin APIs return `403`; unauthorized pages return the user to the role's default dashboard. Migration `0018_operator_roles.sql` converts legacy collaborators to advertisers and invalidates their old sessions.

## Active Order-to-Shipment Lifecycle

1. Checkout persists a new order with `shipping_status = pending`. Checkout and AutoLaris reconciliation never create a Mengantar shipment automatically.
2. Order Management owns verification. The operator resolves the destination against Mengantar, checks payment readiness, selects an eligible courier/service, verifies warehouse data, and corrects customer/address details.
3. An explicit single or checklist-based bulk Push action in Order Management calls Mengantar. Bulk `/order` requests run sequentially and return an independent `success`, `unpaid`, `skipped`, or `failed` result for every selected order.
4. Only an explicitly accepted provider response may persist `provider_order_id`, set `shipping_status = processing`, record `confirmed_at`, and expose the order in Shipping.
5. Provider rejection or transport failure clears the dispatch claim, preserves an actionable error, and leaves the order `pending` in Order Management for correction and retry. Accepted siblings are not rolled back.
6. Shipping contains provider-created shipments only. It owns resi visibility, lifecycle status, and pickup scheduling—not provider creation.
7. A provider-accepted non-COD unpaid draft may have `isPaid: false` and no `cnote_no`. CMSAds never invents or infers a waybill.

This lifecycle is implemented and locally verified. Live provider mutation remains a separately approved production side effect.

## Product Form Links and Embedding

- Every product action menu exposes `Embed form`. CMSAds verifies that the product is active and checkout-ready before showing usable integration output.
- Select `middle`, `full`, or `hybrid` and the initial canonical variant. Copy **CMSAds widget** for landing-page builders; it is the recommended responsive option. Direct links, a plain iframe, and the legacy inline auto-height adapter remain available.
- Paste the entire widget snippet into an HTML/embed block. It contains `<cmsads-form-widget>` plus `cmsads-form-widget.js`; the nested eager iframe is a fixed-height fallback and remains usable if the builder blocks JavaScript. The loader upgrades that same iframe, keeps it full-width, reacts to `product-id`, `variant-id`, and `mode` attribute changes, and validates both the exact CMSAds origin and iframe window before applying resize messages.
- The widget and iframe point to `/embed/form`; CMSAds still owns live catalog identity, price, stock, destination, shipping, payment eligibility, idempotency, order persistence, and server tracking. The embedded renderer does not load base GTM, Google Ads, or Meta PageView scripts. Do not copy rendered form markup into another repository.
- Manage landing-page origins through **Settings → Store & CS → Embed checkout domains**. Enter one exact HTTPS origin per line, such as `https://shop.example`; a root domain and each subdomain are distinct origins, while paths, queries, fragments, credentials, and wildcards are rejected. A saved D1 value takes effect immediately without a rebuild. `PUBLIC_EMBED_ALLOWED_ORIGINS` remains only as the cutover fallback until a legacy tenant first saves this policy. If the form is blank, inspect the browser for a CSP `frame-ancestors` rejection; do not disable iframe security.
- Only `/embed/form` may be framed. Admin, API, payment, confirmation, canonical form, and ordinary storefront routes remain protected by `X-Frame-Options: DENY`.

## Tenant and Worker Model

`wrangler.jsonc` is the registry source of truth. Every environment declares an ingress mode:

| Tenant slug | Worker | Ingress | Public route |
| --- | --- | --- | --- |
| `petanisejahtera-preview` | `cmsads-petanisejahtera-preview` | `custom-domain` | `preview.petanisejahtera.com` |

`petanisejahtera.com` is also excluded from CMSAds routing. It remains owned by the standalone [`ongkipro/petanisejahtera`](https://github.com/ongkipro/petanisejahtera) Worker; the former `cmsads-petanisejahtera` Worker and its isolated storage are retained but have no committed CMSAds deployment target.

Every environment repeats complete variables and stable bindings. `npm run tenant:validate` rejects unknown templates/content packs, duplicate Worker/domain/resource identities, missing bindings, a route on a `service-only` backend, a missing route on a `custom-domain` tenant, and canonical-origin mismatches.


### Portable installation and storefront topologies

[`INSTALLATION.md`](./INSTALLATION.md) is the canonical new-account runbook. `./scripts/install.sh` is local-only: it installs the lockfile, validates the registry, generates types, and runs static checks. It does not authenticate Cloudflare, provision or deploy resources, migrate remote D1, configure DNS/secrets, or import data.

A provisioned merchant starts with independently named D1/KV/R2/AI resources, the repository schema, one store row, and one forced-rotation owner credential. `importsExistingTenantData` remains `false`; products, content, media, customers, orders, provider configuration, tracking credentials, sessions, and secrets must be onboarded for that merchant rather than copied from another tenant.

| Topology | Frontend repository | Public owner | CMSAds boundary |
| --- | --- | --- | --- |
| Integrated | Canonical CMSAds repository; no separate frontend GitHub repository required | CMSAds Worker on an exact Custom Domain | Storefront, forms, admin, and API share one tenant-specific Worker. |
| Headless service-only | One separate storefront repository for the exact tenant | Separate storefront Worker | CMSAds remains in the canonical repository, has no public route, and receives reviewed operational paths through a private service binding. |
| Canonical CMSAds forms | CMSAds repository, exposed directly or through a reviewed headless gateway | CMSAds or storefront gateway | `/hybrid-form`, `/middle-form`, and `/full-form` are canonical. Existing `/form-hybrid`, `/form-middle`, and `/form-full` links remain active through query-preserving permanent redirects. |
| Public data and executable storefront adapter | CMSAds public contracts plus code in the tenant storefront repository | Storefront Worker | Public bootstrap/catalog APIs, a proven framework-neutral adapter, complete Meta handoff, and consent propagation still require implementation and proof. |

The storefront may be visually and structurally custom, but CMSAds remains authoritative for catalog identity, form validation, store-level `cod_disabled_province_codes`, shipping/payment eligibility, order persistence, operator lifecycle, and server tracking. The reusable prompt in [`STOREFRONT_INTEGRATION.md`](./STOREFRONT_INTEGRATION.md) blocks fake static catalog fallback while public bootstrap/catalog APIs are absent.

Do not fork the CMSAds backend per merchant. A separate repository is only for a headless tenant's public storefront. Authentication, schema, admin, order, payment, shipping, tracking guards, migrations, and provider integrations continue to ship from the canonical CMSAds repository.

New-tenant schema/installer flows preserve one non-merchant, admin/API-immutable sample: product `10001`, slug `aussie`, title `Aussie Sample`; variant `20001` (`500ml`, Rp150,000, `600g`) and variant `20002` (`1 Liter`, Rp300,000, `1100g`). Local mutation proof returned `409`; remote provisioning or deployment was not performed.

## Local Setup

Requirements:

- Node.js 22 or newer;
- npm 10 or newer;
- a POSIX shell;
- no global Astro, TypeScript, or Wrangler installation.

```bash
./scripts/install.sh
```

The installer runs `npm ci`, validates the tenant registry, generates Cloudflare types for the default development profile, and runs Astro/TypeScript checks.

### Work with one selected tenant

```bash
npm run tenant:list
npm run tenant:list -- --json
npm run tenant:validate

npm run tenant:migrate:local -- petanisejahtera-preview
npm run tenant:dev -- petanisejahtera-preview

npm run tenant:types -- petanisejahtera-preview
npm run tenant:build -- petanisejahtera-preview
npm run tenant:dry-run -- petanisejahtera-preview
```

Prepare `.dev.vars.<tenant>` through a secure local path. Never print, commit, paste into documentation, or copy credentials between tenants.

### Project checks

```bash
npm test
npm run check
npm run build
```

Use the smallest executable proof first:

- UI change: run the selected tenant and exercise the affected desktop and mobile flow in a real browser.
- API bug fix: reproduce the failing request, apply the fix, and repeat the same request.
- D1 schema change: generate and inspect SQL, then apply only to the selected local tenant before testing.
- Tenant config change: validate, generate types, build, and dry-run the exact tenant.
- Documentation-only change: audit Markdown/HTML links, fragments, duplicate IDs, visual-guide navigation, portable paths, and `git diff --check`; do not run unrelated application builds.

## Provisioning and Release

Preview a merchant plan without side effects:

```bash
npm run tenant:install -- --plan \
  --slug merchant-b \
  --domain shop.example.com \
  --name "Merchant B" \
  --owner-name "Merchant Owner" \
  --owner-email owner@example.com \
  --template wide-catalog \
  --ingress custom-domain
```

Provisioning, remote migration, deployment, secret changes, DNS/domain changes, Worker deletion, and storage deletion are separate production approvals. Required guard variables are safety checks, not approval:

```bash
CF_D1_REMOTE=1 npm run tenant:migrate:remote -- <tenant>
CF_DEPLOY_REMOTE=1 npm run tenant:deploy -- <tenant>
```

Never call `wrangler deploy` directly, use an unnamed migration, infer a tenant from the branch or hostname, loop over tenants, or delete D1/KV/R2 while removing an orphan Worker. See [`CLOUDFLARE_MULTI_TENANT.md`](./CLOUDFLARE_MULTI_TENANT.md) for exact release, inventory, cleanup, smoke-test, and rollback procedures.

## AI Agent Quick Start

1. Read [`AGENTS.md`](./AGENTS.md), [`STATUS.md`](./STATUS.md), and [`INSTALLATION.md`](./INSTALLATION.md).
2. Select the exact tenant, Cloudflare account boundary, integrated/headless topology, and affected product contract; do not infer them from prior conversation or branch name.
3. For storefront, form, gateway, or tracking work, read [`STOREFRONT_INTEGRATION.md`](./STOREFRONT_INTEGRATION.md) and the owning canonical specification from the table above.
4. Inspect code, migrations, configuration, and call sites before editing an exported or shared contract.
5. Preserve tenant isolation, the immutable canonical sample, payment/shipping separation, sequential Mengantar dispatch, CMSAds-owned canonical form state and fail-closed geo policy, canonical Meta identity, draft-before-publish AI behavior, and evidence-only trust signals.
6. Run the smallest behavioral proof plus the checks required by `AGENTS.md`.
7. Update `STATUS.md` and append `BUILD-LOG.md` for material changes; update requirements/tasks only when their contract or state changes.
8. Report exact files, checks, observed outcomes, remote side effects, deployment state, and whether the commit remains local.

The Indonesian visual handoff is available at [`doc/preview/index.html`](./doc/preview/index.html), including a dedicated [AI-agent workflow](./doc/preview/ai-agent.html). The visual guide explains the repository contracts; Markdown specifications, source code, migrations, runtime configuration, and executed command output remain authoritative.

## Security and Repository Boundary

This repository is intended to remain private because it contains merchant OMS implementation details. Secrets, customer data, payment records, auth sessions, and provider credentials must never be copied into Git, documentation, prompts, logs, fixtures, or screenshots. Commit only safe examples such as `.env.example`; never commit `.env`, `.dev.vars*`, or credential exports.
