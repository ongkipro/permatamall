# STATUS — AdsBookCMS

> Verified against disk: 2026-08-16 @ `0d2e56a` · branch `chore/adsbookcms-foundation`

Current state of the system. Implemented behaviour lives here; history lives in `BUILD-LOG.md`; remaining work lives in `UNIMPLEMENTED_SPECS.md`; structure lives in `ARCHITECTURE.md`.

The previous version of this file described a different repository — it opened by declaring the project to be another merchant's preview deployment, listed that merchant's catalog as this store's, and cited a D1 database belonging to a different account. It has been rewritten from the tree rather than patched.

---

## 1. Deployment

| Field | Value |
| --- | --- |
| Product | AdsBookCMS (single) |
| Worker | `cmsads-permatamall` |
| Domains | `permatamall.shop`, `www.permatamall.shop` (both custom domains) |
| D1 | `cmsads-permatamall-d1` |
| R2 | `cmsads-permatamall-assets` |
| KV | `SESSION` |
| Version | `1.2.0` / `2026.08-hardened` (`src/lib/version.ts`) |
| Schema | 35 migration files, `0000`–`0034` |
| Environments | one — no staging, no `env.*` blocks |
| CI | push to `main` → check → test → build → `wrangler deploy` |

Live check on 2026-08-16: `/` 200, `/produk` 200, `sitemap.xml` lists 8 pages + 22 products.

---

## 2. Verification baseline

| Gate | Result |
| --- | --- |
| `npm test` | **215 / 215 passing** |
| `npx tsc --noEmit` | 0 errors |
| `npx astro check` | 0 errors, 0 warnings, 37 hints |
| `npm run build` | server built, ~4s |

---

## 3. What is implemented

**Storefront** — SSR home with two selectable templates, product listing with progressive load-more, product detail with variant selection and sticky mobile CTA, custom 404 with related products, hand-authored `sitemap.xml`, Google and Meta catalog feeds, JSON-LD (Organization, WebSite, Product, ItemList, Breadcrumb).

**Landing pages** — D1-backed builder with ordered `html` and `form` sections, drag reorder, shortcode pills, 480px mobile canvas preview, rendered through the `/[slug]` catch-all with admin-gated `?preview=1`.

**Checkout** — three form modes (hybrid, middle, full) plus a geo-resolved variant and a cross-origin embed. Province-based COD gating from trusted Cloudflare geo, district autocomplete over a 7,285-district index, live Mengantar rate quotes, honeypot and rate-limit guards, `submit_token` idempotency, atomic order + items + stock reservation.

**Payments** — COD, manual bank transfer with seller bank accounts, and AutoLaris QRIS/VA with per-channel toggles, fee-bearer policy (buyer or seller) for both payment and COD fees, a dedicated instruction page with copy-to-clipboard and countdown, and idempotent webhook reconciliation.

**Orders and shipping** — operator-controlled dispatch to Mengantar under a single-flight lease, sequential shipment creation with independent per-order results, pickup address and schedule synchronisation with the provider, receiver RTS scoring, and a shipping lifecycle view separate from pending intake.

**Admin** — 27 pages: dashboard analytics, orders and order detail, product CRUD, landing pages, content workbench with Workers AI drafting, shipping, expeditions, RTS/rate checker, payments, balance reconciliation ledger, ads configuration for Meta and Google, store/warehouse/CRM settings, operator access management, and developer API keys.

**Headless API** — seven `/api/v1/*` routes (storefront descriptor, products list and detail, district lookup, shipping rates, checkout, tracking events) authenticated by API key against `developer_api_keys` with an origin allowlist.

**Tracking** — Meta Pixel plus server-side CAPI through a durable outbox with retry and shared per-order `event_id`, Google Tag and Ads conversion configuration with region-scoped Consent Mode v2, TikTok event hooks, and click-id capture for `gclid`/`gbraid`/`wbraid`/`fbclid`/`ttclid`.

---

## 4. Data state

17 tables. `stores` is a single row carrying provider keys, tracking ids, fee policy, payment toggles, CRM templates, embed origins, AI instructions, and COD province exclusions.

Live catalog: 22 women's handbag products with 110 variants, seeded by `scripts/seed-catalog.sql`.

Known data issues, all tracked:

- The local development D1 still holds the previously provisioned warehouse row — a real address, phone number, and Mengantar ObjectIds. The repository is clean, but that data lives in local state and presumably in the remote database; scrubbing it needs a remote write and is a separate decision.
- The demo seed is `scripts/seed-catalog.sql`, run with `npm run db:reset:demo:local`. It is **destructive to the catalog** by design — a demo seed's job is a known state — but its deletes are guarded so they never touch order history. The former `src/db/seed.sql`, which held two previous merchants' catalogs plus genuine-looking provider ids, a real address and a real phone number, was deleted on 2026-08-16.
- `schema.ts` is missing two tables and three columns that exist in migrations; the Drizzle journal stops at `0030`.

---

## 5. Work completed on 2026-08-16

Content and identity cleanup, on branch `chore/adsbookcms-foundation`:

- Legal pages templated on `{{store}}` and resolved at render, replacing hardcoded references to a previous merchant on `/syarat-ketentuan`, `/disclaimer`, and `/kontak`. `/kontak` now renders the support WhatsApp number from D1 instead of a foreign one, and the foreign operational address was removed rather than replaced with an invented one.
- `/disclaimer` fixed — the page had an unterminated frontmatter block, so the route never compiled and returned 404 in production while remaining listed in `sitemap.xml`.
- Page metadata on `/tentang`, `/testimoni`, `/sitemap`, and `/kebijakan-cookie` switched from a third merchant's brand to `tenantConfig.name`.
- Default home hero copy replaced with neutral text; the previous default described an agriculture and household catalog.
- Fallback merchant name in CRM templates and the fallback product name on `/thanks` neutralised.
- Deleted: five dead components carrying legacy campaign logic, the unreferenced `siteContact` block with a foreign email, WhatsApp, and address, and roughly 39 MB of another merchant's images and articles that were publicly fetchable on this domain (`public/` went from 67 MB to 28 MB).
- Documentation re-founded: `ARCHITECTURE.md`, `DECISIONS.md`, `RELEASE.md`, and `OBSERVABILITY.md` created; `README.md`, `INSTALLATION.md`, `AGENTS.md`, and this file rewritten; `CLOUDFLARE_MULTI_TENANT.md`, `AUTO_UPDATE_DEPLOY.md`, `design-tokens.md`, and the `doc/` preview site deleted as upstream-engine material.

---

## 6. Known issues

| Severity | Issue |
| --- | --- |
| High | The embedded checkout snippet fires Meta Purchase with **no** event id, at redirect time before payment is verified. Any embedded install sharing the store's pixel double-counts, and counts unpaid online orders (gap **G10**) |
| Note | Meta Purchase deduplication between the hosted storefront and CAPI was broken until 2026-08-16 and is now fixed. The correction is forward-only: Meta offers no retroactive merge, so historical Purchase counts remain roughly doubled and historical ROAS understated. Treat the deploy date as a reporting break |
| High | The headless origin allowlist is not connected to the admin. `resolveAllowedOrigins` reads environment only, and the variable it expects is declared nowhere — authorising a new storefront domain requires a code change and a deploy |
| Medium | `src/lib/auth.ts` — session signing, verification, and the entire admin role policy — has no test coverage |
| Medium | `/hybrid-form` renders a different visual system from every other checkout surface — green float labels, green focus ring, and an orange gradient submit button against the boutique palette used everywhere else |
| Medium | Authenticated `/api/v1/*` responses, including `/api/v1/storefront`, are served with `public` cache directives |
| Medium | No observability: Workers Logs disabled, no error reporting, no alerting (`OBSERVABILITY.md`) |
| Medium | Identity is build-time; renaming the store in `/admin` does not change storefront branding (gap **G1**) |

---

## 7. Distance to the product goal

AdsBookCMS is intended to install like WordPress: point a domain at it, open the site, fill in a form. What exists is the commerce engine running as one deployed store. The eight gaps between those two states are enumerated as **G1–G8** in `ARCHITECTURE.md` §10, with decisions recorded as ADR-003, ADR-004, ADR-006, and ADR-007 in `DECISIONS.md`.
