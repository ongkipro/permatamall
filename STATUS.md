# STATUS — AdsBookCMS

> Verified against disk: 2026-08-16 @ `c967faa` · branch `chore/adsbookcms-foundation` · clean tree
>
> The baseline moved from `0d2e56a` through seven commits that re-founded the
> repo as AdsBookCMS. Gates were re-run against the tree that became `c967faa`
> rather than inherited from the previous baseline: `npm run check` 304 files /
> 0 errors / 0 warnings / 0 hints · `npm test` 227 / 227 · `npm run build`
> Cloudflare server bundle complete. `diff-risk` classified that change set R3
> (auth, payment, and schema paths all touched), and it passed independent
> review before it landed.
>
> Other contract documents in this repository still carry `0d2e56a` in their own
> "verified against disk" headers. Those hashes have deliberately **not** been
> bumped here: re-stating a verification date without re-reading the document
> against the tree is the exact drift ADR-010 exists to prevent.

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
| Schema | 37 migration files, `0000`–`0036` |
| Environments | one — no staging, no `env.*` blocks |
| CI | push to `main` → check → test → build → `wrangler deploy` |

Live check on 2026-08-17: `/` and `/produk/daira-tas-selempang-bahu-kanvas` rendered from the deployed Worker; the product page loaded its middle-form island with no browser console errors.

---

## 2. Verification baseline

| Gate | Result |
| --- | --- |
| `npm test` | **231 / 231 passing** |
| `npm run check` | 305 files · 0 errors · 0 warnings · 0 hints |
| `npm run build` | Cloudflare server bundle complete |
| Browser smoke | Production storefront and product form render from Worker `ae952a0b-92ee-4614-a7f3-07779f2700a0`; the deployed middle-form asset loaded with no console errors, and a non-writing invalid-phone probe returned the expected HTTP 422 contract. Authenticated local flows separately proved warehouse save/reload under provider failure and abandoned-lead capture → same-row checkout promotion → `/thanks` → invoice detail with product and form-source context |

Latest deployed catalog verification (2026-08-17, commit `20e5559`, Worker `9461efb3-5d96-47d0-a685-0a87909c2e10`): `npm test` 225/225, `npm run check` 304 files with no diagnostics, and `npm run build` completed. Production Google and Meta feeds each returned HTTP 200 with exactly 22/22 unique product IDs in identical sets (`22` through `1`), no `item_group_id`, and no variant ID `106`. Product IDs are the variable-length canonical decimal `products.id` values: product `22` is emitted as `"22"`, never five-digit-padded `"00022"` or synthetic `"10022"`. The live product page retained selected variant `106` while Meta `ViewContent` and Google `view_item` both emitted product ID `22`; live `AddToCart`/`InitiateCheckout`, CAPI payloads, and Google `add_to_cart`/`begin_checkout` also emitted product ID `22`, with variant `106` retained only as Google `item_variant`; horizontal overflow was zero in Chromium.

Latest warehouse verification (2026-08-17, deployed): the warehouse settings route commits the complete local row before attempting Mengantar reconciliation. A failed provider call preserves the operator's input and returns an explicit pending-sync contract instead of a 502 that discards the save. Focused tests passed 3/3; the full suite passed 228/228; `npm run check` reported 305 files with no diagnostics; `npm run build` completed; and a real local browser save/reload retained name, PIC, normalized phone, origin ID/label, address, city, province, and manual pickup ID. Temporary local credentials and warehouse test values were removed after verification. Commit `910169c` was deployed as Worker `ae952a0b-92ee-4614-a7f3-07779f2700a0`.

Latest checkout-lifecycle verification (2026-08-17, deployed): middle and hybrid forms preserve one lead token, selected variant, and form/path context through final submission. Lead capture derives product identity and price from D1, writes one abandoned line item, and upserts only the matching recent token; checkout promotes that row without duplication. Focused lifecycle tests passed 11/11; the full suite passed 228/228; `npm run check` reported 305 files with no diagnostics; `npm run build` completed; and Drizzle reported no pending schema changes. A real local browser flow returned HTTP 200 for lead capture and checkout, reached `/thanks`, and rendered the authoritative product plus `middle` and `/middle-form` on the authenticated invoice. Temporary local data was removed afterward. Remote migration `0036_order_source_context.sql` succeeded before commit `910169c` was deployed as Worker `ae952a0b-92ee-4614-a7f3-07779f2700a0`; a read-only D1 query confirmed both source columns.

Latest product-media verification (2026-08-18, deployed): all 22 catalog products can derive their existing seven-image media set without changing D1-owned product IDs, variants, or prices. The compact page uses stored category/variant facts, passes the incoming `variant_id` into the canonical order form, and hides the mobile sticky CTA over both the primary CTA and order form. Focused gallery/media tests passed 7/7; the full suite passed 230/230; `npm run check` reported 305 files with no diagnostics; and `npm run build` completed. Commit `efa9a3d` was pushed and deployed as Worker `8524e190-78a6-438d-a010-c16a9430a9fe`. Production Chromium at 390px and 1280px proved zero horizontal overflow, seven gallery controls, selected-variant initialization, preserved `utm_source`/`fbclid`, 24px breadcrumb targets, correct mobile sticky-CTA pointer states, and the 480px desktop content contract. Two production Meta `ViewContent` requests returned HTTP 200 with no console or page errors. The selector interaction introduced by that release was superseded by the in-form correction recorded below.

Latest variant-selector correction (2026-08-18, deployed): the product-detail variant selector is again inside the canonical middle/hybrid order form. The upper URL-navigation matrix and duplicate selected-variant card were removed; incoming `variant_id` still initializes the matching radio, while pointer and keyboard changes update the form summary and total in place without navigation or query loss. Focused form-config tests passed 4/4; full `npm test` passed 231/231; `npm run check` reported 305 files with no diagnostics; and `npm run build` completed. Commit `b1de9a2` was pushed and deployed as Worker `9f40132f-125b-46bf-8eef-f71b84c3673b`. Production Chromium at 390px and 1280px proved five 65px choices, visible keyboard focus, zero horizontal overflow, variant `65` initialization, pointer selection of variant `62`, keyboard selection of variant `64`, synchronized labels/totals, unchanged URLs, no upper matrix, and no console errors. No order or remote database write was performed.

Latest catalog-content verification (2026-08-18, deployed): every seeded catalog ID from `1` through `22` has distinct factual editorial content layered over the authoritative D1 product, variant, and pricing rows. Home and `/produk` cards expose restrained two-line summaries; product detail exposes the matching SEO metadata, long description, benefits, key points, and ideal-use facts without changing its five sellable variants or canonical in-form selector. A pre-release review caught and corrected the initial catalog-ID/content misalignment; the regression now asserts the expected product brand for every ID. Focused catalog-data tests passed 5/5; full `npm test` passed 231/231; `npm run check` reported 305 files with no diagnostics; and `npm run build` completed. Commit `f67f903` was pushed and deployed as Worker `a5acff15-049e-49b6-9669-31f7a9c43821`. Production Chromium at 390px and 1280px rendered all 22 distinct summaries with zero horizontal overflow and all expected product identities. The HALONA detail rendered matching SEO/decision content, five variant choices, selected variant `65` synchronized with the canonical form, and preserved acquisition parameters. Two Meta event requests returned HTTP 200 with no console or page errors.

---

## 3. What is implemented

**Storefront** — SSR home with two selectable templates, product listing with progressive load-more, product detail with variant selection and sticky mobile CTA, custom 404 with related products, hand-authored `sitemap.xml`, Google and Meta catalog feeds, JSON-LD (Organization, WebSite, Product, ItemList, Breadcrumb).

**Landing pages** — D1-backed builder with ordered `html` and `form` sections, drag reorder, shortcode pills, 480px mobile canvas preview, rendered through the `/[slug]` catch-all with admin-gated `?preview=1`.

**Checkout** — three form modes (hybrid, middle, full) plus a geo-resolved variant and a cross-origin embed. Province-based COD gating from trusted Cloudflare geo, district autocomplete over a 7,285-district index, live Mengantar rate quotes, honeypot and rate-limit guards, `submit_token` idempotency, atomic order + items + stock reservation, and token-scoped abandoned-lead promotion that preserves the authoritative product and form-source context.

**Payments** — COD, manual bank transfer with seller bank accounts, and AutoLaris QRIS/VA with per-channel toggles, fee-bearer policy (buyer or seller) for both payment and COD fees, a dedicated instruction page with copy-to-clipboard and countdown, and idempotent webhook reconciliation.

**Orders and shipping** — operator-controlled dispatch to Mengantar under a single-flight lease, sequential shipment creation with independent per-order results, pickup address and schedule synchronisation with the provider, receiver RTS scoring, and a shipping lifecycle view separate from pending intake.

**Admin** — 27 pages: dashboard analytics, orders and order detail, product CRUD, landing pages, content workbench with Workers AI drafting, shipping, expeditions, RTS/rate checker, payments, balance reconciliation ledger, ads configuration for Meta and Google, store/warehouse/CRM settings, operator access management, and developer API keys. Navigation and route authorization share one deny-by-default role policy; scoped operators see only the complete workspace their role owns.

**Headless API** — seven `/api/v1/*` routes (storefront descriptor, products list and detail, district lookup, shipping rates, checkout, tracking events) authenticated by API key against `developer_api_keys`. The independently validated Headless origin allowlist is persisted on `stores.headless_allowed_origins` and editable in Developer settings.

**Tracking** — Meta Pixel plus server-side CAPI through a durable outbox with retry and a shared, order-derived `event_id`; Google Tag and Ads conversion configuration with region-scoped Consent Mode v2; TikTok event hooks; and click-id capture for `gclid`/`gbraid`/`wbraid`/`fbclid`/`ttclid`. Hosted and embedded checkout surfaces emit Purchase only after the order can be resolved and verified. Google/Meta catalog feeds and all Meta/GTM commerce events use the exact decimal `products.id` as item/content ID; variant IDs remain order-selection and optional Google `item_variant` metadata only.

---

## 4. Data state

17 tables. `stores` is a single row carrying provider keys, tracking ids, fee policy, payment toggles, CRM templates, independent embed and Headless origin policies, AI instructions, and COD province exclusions.

Live catalog: 22 women's handbag products with 110 variants, seeded by `scripts/seed-catalog.sql`.

Known data issues, all tracked:

- The demo seed is `scripts/seed-catalog.sql`, run with `npm run db:reset:demo:local`. It is **destructive to the catalog** by design — a demo seed's job is a known state — but its deletes are guarded so they never touch order history. The former `src/db/seed.sql`, which held two previous merchants' catalogs plus genuine-looking provider ids, a real address and a real phone number, was deleted on 2026-08-16.
- `schema.ts` and the Drizzle snapshot now cover the three formerly missing columns through migration `0036`; two migration-created tables remain outside the Drizzle declarations.

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

---

## 6. Known issues

| Severity | Issue |
| --- | --- |
| High | Runtime identity and the first-run install wizard remain unimplemented (**G1 → G2**); this deployment is still one configured store, not a self-installing product |
| Medium | There is no automatic schema-upgrade path and the Drizzle journal/schema mirror remains incomplete (**G3**, **G8**) |
| Medium | Fresh-install home content and compile-time theme selection remain coupled to repository defaults (**G5**, **G6**) |
| Medium | Headless key scope/quota, authenticated order-status read, a published OpenAPI contract, and an executable adapter remain open (**H4**, **H6**, **H7**, **H8**) |
| Medium | Workers observability, alerting, and an install-visible health surface remain absent (**G7**, `OBSERVABILITY.md`) |
| Blocked | Unpaid-order recovery and several provider edge contracts require an explicitly approved live capture before implementation |
| Data note | The previously provisioned warehouse contact, address, provider-origin, and pickup-address values were scrubbed from local and remote D1 on 2026-08-16. The required warehouse shell and all relational integrity were retained; post-write `PRAGMA foreign_key_check` returned no rows |

---

## 7. Distance to the product goal

AdsBookCMS is intended to install like WordPress: point a domain at it, open the site, fill in a form. What exists is the commerce engine running as one deployed store. The seven open structural gaps are tracked under **G1–G8** in `ARCHITECTURE.md` §10 (**G4** is closed), with constraining decisions recorded in `DECISIONS.md`.
