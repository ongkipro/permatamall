# STATUS — AdsBookCMS

> Verified against disk and production: 2026-08-16 · deployed source commit `93d86f0` · branch `docs/login-panel-ux-audit` pushed
>
> Gates on the deployed source: `npm run check` 306 files / 0 errors /
> 0 warnings / 0 hints · `npm test` 232 / 232 · `npm run build` complete ·
> fresh local D1 migrations complete through `0035`.

Current state of the system. Implemented behaviour lives here; history lives in `BUILD-LOG.md`; remaining work lives in `UNIMPLEMENTED_SPECS.md`; structure lives in `ARCHITECTURE.md`.

The previous version of this file described a different repository — it opened by declaring the project to be another merchant's preview deployment, listed that merchant's catalog as this store's, and cited a D1 database belonging to a different account. It has been rewritten from the tree rather than patched.

---

## 1. Deployment

| Field | Value |
| --- | --- |
| Product | AdsBookCMS (single) |
| Worker | `cmsads-permatamall` |
| Worker version | `8e908287-4544-4876-a1e1-5dd0e8438628` |
| Domains | `permatamall.shop`, `www.permatamall.shop` (both custom domains) |
| D1 | `cmsads-permatamall-d1` |
| R2 | `cmsads-permatamall-assets` |
| KV | `SESSION` |
| Version | `1.2.0` / `2026.08-hardened` (`src/lib/version.ts`) |
| Schema | 36 migration files, `0000`–`0035` |
| Environments | one — no staging, no `env.*` blocks |
| CI | push to `main` → check → test → build → `wrangler deploy` |

Live check on 2026-08-16: `/hello` and `/produk/daira-tas-selempang-bahu-kanvas` returned 200 after deployment with no browser console/page/request errors; `/` and `/produk` returned 200 in the preceding production smoke; `sitemap.xml` lists 8 pages + 22 products.

---

## 2. Verification baseline

| Gate | Result |
| --- | --- |
| `npm test` | **232 / 232 passing** |
| `npm run check` | 306 files · 0 errors · 0 warnings · 0 hints |
| `npm run build` | Cloudflare server bundle complete |
| Browser smoke | Production `/hello` passed at 390×844 and 1280×900 with no horizontal overflow, one H1, visible tenant identity, synchronized password toggle, and no console/page errors; the production product detail returned 200 with one `<main>` and the expected H1. Local Worker verification additionally covered bootstrap rotation, dual-counter 429 behaviour, and corrupt-session logout recovery |

---

## 3. What is implemented

**Storefront** — SSR home with two selectable templates, product listing with progressive load-more, product detail with variant selection and sticky mobile CTA, custom 404 with related products, hand-authored `sitemap.xml`, Google and Meta catalog feeds, JSON-LD (Organization, WebSite, Product, ItemList, Breadcrumb).

**Landing pages** — D1-backed builder with ordered `html` and `form` sections, drag reorder, shortcode pills, 480px mobile canvas preview, rendered through the `/[slug]` catch-all with admin-gated `?preview=1`.

**Checkout** — three form modes (hybrid, middle, full) plus a geo-resolved variant and a cross-origin embed. Province-based COD gating from trusted Cloudflare geo, district autocomplete over a 7,285-district index, live Mengantar rate quotes, honeypot and rate-limit guards, `submit_token` idempotency, atomic order + items + stock reservation.

**Payments** — COD, manual bank transfer with seller bank accounts, and AutoLaris QRIS/VA with per-channel toggles, fee-bearer policy (buyer or seller) for both payment and COD fees, a dedicated instruction page with copy-to-clipboard and countdown, and idempotent webhook reconciliation.

**Orders and shipping** — operator-controlled dispatch to Mengantar under a single-flight lease, sequential shipment creation with independent per-order results, pickup address and schedule synchronisation with the provider, receiver RTS scoring, and a shipping lifecycle view separate from pending intake.

**Admin** — 27 pages: dashboard analytics, orders and order detail, product CRUD, landing pages, content workbench with Workers AI drafting, shipping, expeditions, RTS/rate checker, payments, balance reconciliation ledger, ads configuration for Meta and Google, store/warehouse/CRM settings, operator access management, and developer API keys. Navigation and route authorization share one deny-by-default role policy; scoped operators see only the complete workspace their role owns. Bootstrap rotation, JWT/KV/D1 revision validation, dual IP/username login damping, idempotent logout, and malformed-cookie recovery are verified.

**Headless API** — seven `/api/v1/*` routes (storefront descriptor, products list and detail, district lookup, shipping rates, checkout, tracking events) authenticated by API key against `developer_api_keys`. The independently validated Headless origin allowlist is persisted on `stores.headless_allowed_origins` and editable in Developer settings.

**Tracking** — Meta Pixel plus server-side CAPI through a durable outbox with retry and a shared, order-derived `event_id`; Google Tag and Ads conversion configuration with region-scoped Consent Mode v2; TikTok event hooks; and click-id capture for `gclid`/`gbraid`/`wbraid`/`fbclid`/`ttclid`. Hosted and embedded checkout surfaces emit Purchase only after the order can be resolved and verified. Meta events and Google/Meta feeds use the same unpadded positive D1 product IDs.

---

## 4. Data state

17 tables. `stores` is a single row carrying provider keys, tracking ids, fee policy, payment toggles, CRM templates, independent embed and Headless origin policies, AI instructions, and COD province exclusions.

Live catalog: 22 women's handbag products with 110 variants, seeded by `scripts/seed-catalog.sql`.

Known data issues, all tracked:

- The previously provisioned warehouse contact, address, provider-origin, and pickup-address values were scrubbed from local and remote D1 on 2026-08-16. The required warehouse shell and relational structure were retained; both databases returned an empty `PRAGMA foreign_key_check`.
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

System-wide security, correctness, documentation, navigation, and UX audit:

- Hardened admin bootstrap, JWT verification, KV-backed session validation, password rotation invalidation, exact role routing, and deny-by-default API/page access. The built-in default password now fails closed unless a strong bootstrap secret is explicitly configured.
- Converted public order status to token-scoped `POST` JSON; completion routes keep identifiers in same-origin `sessionStorage`, strip query strings before subresources load, and send `Cache-Control: no-store`. Checkout, payment, thanks, Meta browser tracking, and CAPI now share the same order-derived event identity.
- Separated iframe embed origins from Headless API origins. Migration `0035` persists the Headless allowlist; Developer settings validates and saves it; all `/api/v1/*` routes still require an active API key.
- Closed inactive-product exposure, landing-preview cache, custom-HTML preview injection, legacy embed redirect, catalog identity, and public cache-control defects. Removed dead completion-query builders after the safe navigation boundary made them redundant.
- Centralised admin navigation contracts, aligned menu visibility with authorization, repaired nested `<main>` landmarks, and made public/admin skip links target the actual main content.
- Reconciled repository specifications, architecture, installation notes, storefront integration guidance, remaining-gap register, and migration `0034` behaviour with the executable tree.
- Independent final security review found no exploitable finding in the audited trust boundaries. Remaining work below is product/operations debt rather than a known open vulnerability.

Login, product identity, and fresh-install follow-up:

- Scoped product-detail D1 reads to one active product plus only its variants and published content; the headless detail endpoint now reuses one catalog load for related products.
- Aligned live product event and feed identity on raw positive D1 product IDs, removing the former five-digit padding mismatch.
- Repaired the bootstrap rotation contract, moved login damping ahead of lookup, added normalized-username damping beside IP damping, equalised unknown-user and wrong-password failures, made logout recover stale sessions, and made malformed cookies fail closed.
- Refined `/hello` for mobile keyboards, assistive technology, password managers, accurate password-toggle semantics, and announced submitting state.
- Fixed migration `0017` so an empty tenant database does not create orphan variants; a fresh foreign-key-enforced migration smoke and Wrangler local migration both complete through `0035`.

---

## 6. Known issues

| Severity | Issue |
| --- | --- |
| High | Runtime identity and the first-run install wizard remain unimplemented (**G1 → G2**); this deployment is still one configured store, not a self-installing product |
| Medium | There is no automatic schema-upgrade path and the Drizzle journal/schema mirror remains incomplete (**G3**, **G8**) |
| Medium | Fresh-install home content and compile-time theme selection remain coupled to repository defaults (**G5**, **G6**) |
| Medium | Headless key scope/quota, authenticated order-status read, a published OpenAPI contract, and an executable adapter remain open (**H4**, **H6**, **H7**, **H8**) |
| Medium | Workers log emission is enabled, but durable retention, alerting, and an install-visible health surface remain absent (**G7**, `OBSERVABILITY.md`) |
| Blocked | Unpaid-order recovery and several provider edge contracts require an explicitly approved live capture before implementation |
| Data note | The previously provisioned warehouse contact, address, provider-origin, and pickup-address values were scrubbed from local and remote D1 on 2026-08-16. The required warehouse shell and all relational integrity were retained; post-write `PRAGMA foreign_key_check` returned no rows |

---

## 7. Distance to the product goal

AdsBookCMS is intended to install like WordPress: point a domain at it, open the site, fill in a form. What exists is the commerce engine running as one deployed store. The seven open structural gaps are tracked under **G1–G8** in `ARCHITECTURE.md` §10 (**G4** is closed), with constraining decisions recorded in `DECISIONS.md`.
