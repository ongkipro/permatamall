# AdsBookCMS

> Verified against disk: 2026-08-16 @ `0d2e56a`

A self-contained direct-response commerce CMS that installs onto Cloudflare Workers. One install runs one store: storefront, landing-page builder, checkout with COD and online payment, order management, courier dispatch, ad-signal tracking, and an admin dashboard — in a single Worker with its own database.

**Install model: 1 installer = 1 Worker = 1 store.** Isolation comes from the deployment boundary, not from tenant routing inside the application. See `DECISIONS.md` ADR-001.

Ships with a demo dataset — 22 products with photography — so a fresh install has something real to look at. It is replaced through the CMS when a merchant onboards (`DECISIONS.md` ADR-011).

Reference install: [permatamall.shop](https://permatamall.shop) — Worker `cmsads-permatamall`. The `cmsads-*` resource names are legacy from the upstream engine and are not renamed, because renaming a Worker creates a new one and drops its custom domain, and D1 and R2 names cannot be changed in place.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Astro 7, full SSR (`output: 'server'`) |
| Islands | React 19 |
| Runtime | Cloudflare Workers (`nodejs_compat`) |
| Database | Cloudflare D1, accessed with raw prepared statements |
| Sessions / counters | Cloudflare KV |
| Media | Cloudflare R2 |
| AI | Workers AI (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`) for admin content drafting |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Package manager | npm (`package-lock.json` is authoritative) |

Requires Node 22+ and npm 10+.

---

## Commands

Every command below exists in `package.json`. There are no `tenant:*` commands; earlier documentation that referenced them described a different repository.

```bash
npm install            # or npm ci for a clean, lockfile-exact install

npm run dev            # astro dev on :4321
npm run cf:dev         # wrangler dev --local, closer to production

npm test               # node --test over src/lib/*.test.ts  (212 tests)
npm run check          # astro check && tsc --noEmit
npm run build          # astro build

npm run db:migrate:local    # apply migrations to local D1
npm run db:migrate:remote   # apply migrations to PRODUCTION D1 — approval required
npm run deploy              # wrangler deploy — deploys PRODUCTION
```

`npm run db:generate` (drizzle-kit) is currently **unsafe** — the Drizzle journal has diverged from the migration directory. Write migrations by hand. See `DECISIONS.md` ADR-005.

---

## Deploying

**Pushing to `main` deploys production.** `.github/workflows/deploy.yml` runs check → test → build → `wrangler deploy` on every push. There is no staging environment and no approval step between merge and live traffic.

Full detail, including migrations and rollback, is in `RELEASE.md`.

---

## Repository layout

```
src/
  pages/            98 files — storefront, admin, /api/*, /api/v1/*, feeds, media
  components/       76 files — admin/ forms/ home/ seo/ shared/ storefront/ tracking/ ui/
  lib/              68 modules + 42 colocated test files — all business logic
  db/               schema.ts (migration DSL only), 34 migrations, seed
  layouts/          BaseLayout, AdminLayout, EmbedLayout
  styles/           global.css (Tailwind v4 entry), form-hybrid.css (checkout)
  data/             reference data (Indonesian districts) + legal page templates
  middleware.ts     host redirect, click-id capture, session, role policy, embed CSP
scripts/            one-off maintenance scripts and the catalog seed
public/             static assets served by the Cloudflare adapter
```

---

## Documentation map

| Document | Owns |
| --- | --- |
| `ARCHITECTURE.md` | How the system actually works, plus the gap register (§10) |
| `DECISIONS.md` | Architecture decision record — read before changing structure |
| `RELEASE.md` | Deploy pipeline, migrations, versioning, rollback, approval boundary |
| `OBSERVABILITY.md` | What can and cannot be observed; what to enable first |
| `INSTALLATION.md` | Standing up a new install |
| `STATUS.md` | Current state of the running system |
| `UNIMPLEMENTED_SPECS.md` | Remaining work and external blockers |
| `PRD.md` | Product requirements |
| `TASKS.md` | Execution log |
| `BUILD-LOG.md` | Chronological build history |
| `DESIGN-SYSTEM.md` | Storefront and admin visual contract |
| `STOREFRONT_INTEGRATION.md` | Headless `/api/v1/*` integration contract |
| `MENGANTAR_INTEGRATION_SPEC.md` | Courier provider boundary |
| `TRACKING_SPECS.md` | Meta Pixel/CAPI, GTM, Google Ads signal contract |
| `AGENTS.md` | Working agreement for AI coding agents |
| `docs/GOOGLE_ADS_SETUP.md` | Google Ads and Merchant Center setup |

Documentation states only what is verifiable against the tree, and carries the date it was verified (`DECISIONS.md` ADR-010). If a document and the code disagree, the code is right and the document is a bug.

---

## Configuration

Configuration currently resolves from three independent places, and the difference matters:

- **Baked at build time** — site name, URL, description, logo, tagline, theme colour, locale, storefront template. These reach `import.meta.env` from `wrangler.jsonc` `vars` and `.env`, and are frozen into the bundle by `astro build`. Changing them requires a **rebuild**; redeploying an existing bundle with new vars changes nothing.
- **Worker runtime env** — secrets and a few public vars, read through `getRuntimeEnv()`. Changing these needs a deploy but no rebuild.
- **D1 `stores` row** — provider keys, tracking IDs, fee policy, payment toggles, CRM templates, support contact. Editable from `/admin` and effective immediately.

Note that `stores.name` and the build-time site name are **different values**: renaming the store in `/admin` does not change storefront branding. Making identity fully runtime-owned is gap **G1** and `DECISIONS.md` ADR-003.

---

## Status

The product goal is a WordPress-style installable CMS for Cloudflare. What ships today is the commerce engine running as a single deployed store. The distance between the two is tracked honestly as gaps **G1–G10** in `ARCHITECTURE.md` §10 — principally: runtime-owned identity, a first-run `/install` wizard, and schema auto-upgrade. The active backlog is Phase A in `TASKS.md`.
