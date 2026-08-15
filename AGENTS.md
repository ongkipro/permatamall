# AGENTS.md — CMSAds Repository Contract

This file is the entry point for AI coding agents working in CMSAds. Read it before changing code or documentation.

## 1. Repository Purpose

CMSAds is an Astro 7 SSR commerce and merchant OMS backend running on Cloudflare Workers. It may also render an integrated public storefront, while a headless tenant may use a separately deployed storefront Worker and keep CMSAds service-only. React islands provide interactive admin surfaces. Cloudflare D1 stores operational data, KV stores sessions and quotas, and R2 stores tenant assets.

The repository uses deployment-per-tenant isolation:

- one shared source repository;
- one named Cloudflare environment and independently built Worker per tenant;
- one isolated D1, KV, and R2 resource set plus one Workers AI binding per tenant;
- stable application binding names: `OMS_DB`, `SESSION`, `ASSET_BUCKET`, and `AI`;
- no runtime hostname-to-database dispatch.

Read [`CLOUDFLARE_MULTI_TENANT.md`](./CLOUDFLARE_MULTI_TENANT.md) before changing tenant configuration, bindings, content selection, migrations, or deployment commands.
Read [`INSTALLATION.md`](./INSTALLATION.md) for portable local bootstrap, new-account provisioning, no-data-import onboarding, and integrated versus headless setup. Read [`STOREFRONT_INTEGRATION.md`](./STOREFRONT_INTEGRATION.md) before changing public storefront, form, gateway, or Meta Ads behavior.
Read [`COLLABORATOR_GUIDE.md`](./COLLABORATOR_GUIDE.md) for merchant collaborator guidelines, core CMS locking rules, and allowed storefront visual customizations.

### 1.1 Collaborator & AI Customization Rules (Core Lock vs Tenant Customization)

- **Owner-Only Core Engine**: CMS Ads engine core (`src/pages/api/`, `src/db/`, `src/components/admin/`, `src/lib/order-persistence.ts`, `src/lib/mengantar-client.ts`, `src/lib/autolaris-client.ts`, `src/lib/rts-scoring.ts`) is strictly owned by **Paduka Ongki (Core Owner)**. Only the Core Owner is authorized to push commits to the core repository.
- **Collaborator & Merchant AIs**: Merchant collaborators and external AI customization agents MUST NOT push core commits or modify backend CMS engine code. They pull upstream CMS updates, configure tenant bindings, and deploy tenant Worker builds.
- **Locked Checkout Forms**: Checkout form structures (`form-hybrid`, `form-middle`, `form-full`) are locked. Collaborators and external AI agents MUST NOT modify form input names, validation scripts (`form-hybrid.ts`, `form-middle.ts`), state resolution, or payment/shipping handling. Visual color styling, typography, and container padding MAY be adjusted via CSS tokens.
## 2. Mandatory Documentation Protocol (AI AGENT MANDATE: ALWAYS UPDATE .MD FILES)

**CRITICAL RULE FOR ALL AI CODING AGENTS**: Any code modification, bug fix, feature addition, DB migration, UI tweak, or production deployment MUST be documented in the repository's Markdown files before completing a task or handing off to the user.

### Required Markdown Files Updates per Task:
1. **`BUILD-LOG.md` (Append-Only Chronological History)**:
   - MUST append a new section for every completed task or deployment (`## Feature / Fix Title — YYYY-MM-DD`).
   - MUST state: Root cause / problem, key improvements & code changes, verification proof (`node --test`, build status), and deployment status (`wrangler deploy` worker commit hash).
2. **`STATUS.md` (Live Project State)**:
   - MUST update `Last Updated` date to current date (`YYYY-MM-DD`).
   - MUST reflect the latest feature availability, live worker deployment status, and verified active contracts.
3. **`TASKS.md` (Task Traceability)**:
   - MUST check off completed task items (`- [x] TXXX`) or append a new task item under the appropriate phase.
   - Ensure all requirement dependencies and acceptance criteria trace accurately.
4. **`PRD.md` & `README.md` (Product & Repository Ownership)**:
   - MUST update requirements, platform capabilities, or setup guidelines whenever system boundaries, endpoints, or features expand.

### Document Source Matrix
Use disk state, not model memory. Read only the documents relevant to the task:

| Need | Source |
|---|---|
| Repository orientation and supported workflows | [`README.md`](./README.md) |
| Core CMS version registry, UI version badge, and deployment runbook | [`VERSION.md`](./VERSION.md) |
| Automated CI/CD, tenant batch deploy (`npm run tenant:deploy:all`), and auto-update guide | [`AUTO_UPDATE_DEPLOY.md`](./AUTO_UPDATE_DEPLOY.md) |
| Chronological implementation evidence (MANDATORY APPEND) | [`BUILD-LOG.md`](./BUILD-LOG.md) |
| Requirements (MUST STAY ACCURATE) | [`PRD.md`](./PRD.md) |
| Architecture and ownership decisions | [`PLAN.md`](./PLAN.md) |
| Traceable implementation backlog (MUST MARK DONE) | [`TASKS.md`](./TASKS.md) |
| Live project state & evidence (MUST UPDATE DATE & STATE) | [`STATUS.md`](./STATUS.md) |
| Cloudflare tenant topology, inventory, cleanup, and commands | [`CLOUDFLARE_MULTI_TENANT.md`](./CLOUDFLARE_MULTI_TENANT.md) |
| Portable installation, new-account onboarding, and no-data-import provisioning | [`INSTALLATION.md`](./INSTALLATION.md) |
| Headless storefront, locked forms, gateway, and Meta Ads integration | [`STOREFRONT_INTEGRATION.md`](./STOREFRONT_INTEGRATION.md) |
| Mengantar behavior and known gaps | [`MENGANTAR_INTEGRATION_SPEC.md`](./MENGANTAR_INTEGRATION_SPEC.md) |
| Tracking contracts | [`TRACKING_SPECS.md`](./TRACKING_SPECS.md) |
| Storefront UI rules | [`STOREFRONT_DESIGN_SYSTEM.md`](./STOREFRONT_DESIGN_SYSTEM.md) and [`design-tokens.md`](./design-tokens.md) |
| Genuine remaining work and blockers | [`UNIMPLEMENTED_SPECS.md`](./UNIMPLEMENTED_SPECS.md) |
| Indonesian visual handoff | [`doc/preview/index.html`](./doc/preview/index.html) |

When documentation and code disagree, code and executable evidence win. Update the stale document in the same change.
## 3. First-Time Local Setup

Requirements:

- Node.js 22 or newer;
- npm 10 or newer;
- POSIX shell;
- no globally installed TypeScript, Astro, or Wrangler is required.

From the repository root:

```bash
./scripts/install.sh
```

The installer performs the supported bootstrap sequence:

1. verifies Node.js and npm versions;
2. runs `npm ci` using the committed lockfile;
3. validates tenant configuration;
4. generates Cloudflare binding types for `petanisejahtera-preview`, or for the registered profile selected by `CMSADS_DEFAULT_TENANT`;
5. runs Astro and TypeScript static validation.

Do not replace this with `npm install`, install project tools globally, or modify the lockfile unless dependency work is explicitly required.

This local installer does not authenticate Cloudflare, create resources, migrate remote D1, deploy, configure DNS or secrets, or import merchant data. See [`INSTALLATION.md`](./INSTALLATION.md) before preparing a new Cloudflare account or tenant.

## 4. Local Tenant Workflow

List and validate known tenant profiles:

```bash
npm run tenant:list
npm run tenant:validate
```

Prepare the selected tenant's local secrets in `.dev.vars.<tenant>`. Never print, commit, copy into documentation, or place secrets in public Wrangler variables.

Run exactly one tenant:

```bash
npm run tenant:migrate:local -- petanisejahtera
npm run tenant:dev -- petanisejahtera
```

Build and validate exactly one tenant:

```bash
npm run tenant:types -- petanisejahtera
npm run tenant:build -- petanisejahtera
npm run tenant:dry-run -- petanisejahtera
```

Use `petanisejahtera-preview` only for isolated preview verification. It is not a separate merchant content pack.

## 5. Required Engineering Invariants

- Reuse existing helpers, schemas, route patterns, and UI primitives before adding code or dependencies.
- Keep Astro for SSR and shared/static surfaces. Use React islands only where browser interactivity requires them.
- Keep operational prices, stock, products, orders, credentials, provider state, tenant instructions, drafts, and publications in the selected tenant's D1 or Worker environment—not MDX or a committed merchant content pack.
- Reserve MDX for optional editorial long-form content. Runtime-managed merchants use D1 content and R2 media; missing content must fail closed instead of falling back to another merchant.
- Treat provisioning as an isolated bootstrap with one immutable canonical sample. A new tenant receives isolated D1/KV/R2/AI resources, schema, one store row, one forced-rotation owner credential, product `10001` (`aussie`, `Aussie Sample`), and variants `20001` (`500ml`, Rp150,000, `600g`) and `20002` (`1 Liter`, Rp300,000, `1100g`). It never imports another tenant's merchant products, content, media, customers, orders, provider configuration, tracking credentials, sessions, or secrets. Admin/API mutation must not alter or delete the sample.
- Preserve the ingress topology selected before provisioning: `custom-domain` lets CMSAds own the integrated public origin; `service-only` gives CMSAds no public route and requires a separately owned storefront Worker with a reviewed private service-binding gateway.
- A custom headless frontend may own layout, routes, motion, and copy presentation, but it may not fork catalog identity, price, stock, shipping, payment, order persistence, operator lifecycle, or tracking identity.
- CMSAds owns the middle/full/hybrid form state and mutation contracts at `/middle-form`, `/full-form`, and `/hybrid-form`; never add legacy `/form-*` aliases. Known eligible province resolves middle, while store-disabled or unknown geo resolves full. Keep store-level `cod_disabled_province_codes` distinct from courier/provider exclusions. Public bootstrap/catalog APIs, an executable framework-neutral adapter, and cross-storefront consent remain planned until their owning tasks have proof.
- Keep Meta CAPI tokens server-only. Browser and server Purchase must share the dedicated per-order event ID and canonical D1 product ID; a page interaction or unqualified order is never Purchase.
- Preserve the distinction between payment status and shipping status. Checkout and payment reconciliation change order/payment state but never bypass explicit operator confirmation and Shipping release.
- Never expose raw API keys, tokens, password hashes, webhook secrets, customer records, payment data, or authentication sessions.
- Never fire concurrent Mengantar `POST /order` requests. Single and bulk Push actions belong only in Shipping and must use the shared sequential queue with per-order results.
- Persist provider identity and `cnote_no` only from an accepted response. A provider failure remains retryable in `processing`; an accepted unpaid draft may have no waybill.
- Workers AI may create only a validated draft from the selected tenant's instruction and D1 facts. Publication remains an explicit authenticated action, and evidence-backed trust fields remain manual.
- Do not claim provider behavior was live-verified when only local stubs, validation paths, credential-missing responses, or selection-only UI were exercised.
- Do not create a shared-D1 tenancy path or choose a database from request host/input.
- Do not modify storefront conversion structure or design tokens incidentally during admin/backend work.

## 6. Validation Contract

Use the smallest executable proof for the changed behavior, then run the project checks appropriate to the change.

```bash
npm test
npm run check
npm run build
```

Additional requirements:

- UI changes: run the built or development Worker and exercise the changed route in a browser, including 390px mobile behavior when responsive UI is affected.
- Performance & Latency contract: ALWAYS check CMS Admin panel and public Front-End speed/responsiveness. Read APIs (`GET`) MUST be 100% side-effect free and read-only without blocking `DELETE`/`UPDATE` write locks. Ensure D1 queries are indexed (`orders(shipping_status, created_at)`) and UI pagination remains bounded (20 items/page).
- D1 schema changes: run `npm run db:generate`, inspect the generated SQL, and apply it only to the selected local tenant before testing.
- Tenant configuration changes: run `npm run tenant:validate`, tenant type generation, the tenant build, and `tenant:dry-run`.
- Documentation-only changes: validate Markdown and HTML links, fragments, duplicate IDs, visual-guide navigation, portable paths, and `git diff --check`; do not run unrelated application builds.

Record material implementation, remote-resource, or verification changes in `STATUS.md` and append one factual entry to `BUILD-LOG.md`. Update `PRD.md` and `TASKS.md` only when requirements, acceptance criteria, traceability, or backlog state actually change.

## 7. Approval-Gated Operations

Do not perform any of the following without explicit operator approval in the current conversation:

- reading or printing secret files, credential values, or authentication sessions;
- remote D1 migrations or writes;
- Cloudflare deployment, DNS, Custom Domain, secret, KV, R2, or Worker mutations;
- Worker deletion and D1/KV/R2 deletion, which are separate approvals and must never be bundled implicitly;
- destructive database or filesystem operations;
- package upgrades or new dependencies outside the requested scope;
- commits or pushes unless explicitly requested.

Remote commands are intentionally guarded:

```bash
CF_D1_REMOTE=1 npm run tenant:migrate:remote -- <tenant>
CF_DEPLOY_REMOTE=1 npm run tenant:deploy -- <tenant>
```

The flags are necessary but do not replace operator approval. Never loop over all tenants for remote operations. Before deleting an orphan Worker, prove that it has no Custom Domain, route, or enabled `workers.dev` endpoint; name the exact Worker in the approval; and retain shared D1/KV/R2 resources unless their deletion is separately approved.

## 8. Handoff Standard

A completed handoff states:

- exact files and contracts changed;
- exact verification commands or browser/API scenarios exercised;
- observed results and any credential-gated limits;
- migration or deployment status;
- whether the worktree is clean and whether commits remain local.

Never report scaffolding, placeholders, or an unverified subset as complete.
