# AGENTS.md — Working Agreement for AdsBookCMS

> Verified against disk: 2026-08-16 @ `0d2e56a`

This file is the contract for any AI coding agent or contributor working in this repository. Read it before the first edit.

**The product is AdsBookCMS (single):** a direct-response commerce CMS installed onto Cloudflare Workers, where **1 installer = 1 Worker = 1 store**. `permatamall.shop` is the reference instance, not the product name.

---

## 1. First principles

1. **The code wins.** When documentation and the tree disagree, the tree is right and the document is a bug to be fixed. This repository was forked from an upstream engine and its documentation described that other repository for months; assume nothing you have not verified.
2. **Never claim something works without running it.** `npm test`, `npm run check`, `npm run build`. For anything browser-visible, open the page — an unterminated `.astro` frontmatter block once produced a live 404 while every static check stayed green.
3. **State what you did not do.** Skipped verification, deferred scope, and unproven assumptions get named explicitly.
4. **Merging to `main` deploys production.** There is no staging. Treat a merge as a deploy.

---

## 2. Document ownership

Exactly one document owns each subject. Do not restate another document's truth; link to it.

| Document | Owns |
| --- | --- |
| `ARCHITECTURE.md` | System structure, data layer, config resolution, gap register §10 |
| `DECISIONS.md` | Architecture decisions (ADR). Append-only |
| `RELEASE.md` | Deploy, migrations, versioning, rollback, approval boundary |
| `OBSERVABILITY.md` | Logging, failure visibility, what to enable |
| `INSTALLATION.md` | Standing up a new install |
| `STATUS.md` | Current state of the running system |
| `UNIMPLEMENTED_SPECS.md` | Remaining work and external blockers |
| `PRD.md` | Product requirements |
| `TASKS.md` | Execution log |
| `BUILD-LOG.md` | Chronological history. Append-only |
| `DESIGN-SYSTEM.md` | Visual contract |
| `STOREFRONT_INTEGRATION.md` | Headless `/api/v1/*` contract |
| `MENGANTAR_INTEGRATION_SPEC.md` | Courier provider boundary |
| `TRACKING_SPECS.md` | Ad signal contract |
| `docs/GOOGLE_ADS_SETUP.md` | Google Ads / Merchant Center setup |

Every document carries a `> Verified against disk: <date> @ <sha>` line. If you change what a document describes, update that line or the document is lying about its own freshness.

---

## 3. Invariants — do not break these

**Commerce**
- Checkout never dispatches to a courier. Orders land as `pending`; an operator releases them explicitly from `/admin/orders`.
- Paid status changes dispatch *eligibility*, never dispatch itself.
- Price, stock, weight, and identity come from D1. Browser state is never pricing authority.
- Stock non-negativity is enforced by a database trigger, not application code. Do not work around it.

**Config**
- Binding names are fixed: `OMS_DB`, `SESSION`, `ASSET_BUCKET`, `AI`, `ASSETS`.
- Provider credentials are D1-first, env-fallback. Never echo a stored credential back through a browser API.
- Meta CAPI tokens are server-only. Browser and server Purchase share one per-order `event_id`.

**Content**
- Product presentation fails closed: no published row means the product is omitted, never substituted with compiled copy.
- No merchant's content, brand, contact details, or media may ship for a different merchant. This has gone wrong before and reached production.

**Data**
- `src/db/migrations/` is the schema truth, not `schema.ts`.
- Never edit an applied migration in place. Corrections are new forward migrations.
- Write migrations by hand; `db:generate` would emit a destructive diff.

---

## 4. Verification

```bash
npm test          # 194 tests, node --test over src/lib/*.test.ts
npm run check     # astro check && tsc --noEmit
npm run build     # astro build
```

Baseline on `main`: 194 passing, 0 type errors, `astro check` 0 errors / 0 warnings / 38 hints. A change that reduces this baseline is not done.

New non-trivial logic — a branch, a parser, a money or auth path — leaves one runnable check behind. Trivial one-liners do not need a test.

`src/lib/auth.ts` has no test coverage and carries the entire session and role policy. Adding coverage there is high value; changing it without coverage is high risk.

---

## 5. Approval gates

Ask before: pushing or merging to `main`; `wrangler deploy`; any `--remote` D1 command; creating or deleting Cloudflare resources; anything that mutates provider state at Mengantar or AutoLaris; reading or printing secrets; deleting data.

Local work — tests, typecheck, build, local D1, reading code — needs no approval.

A permitted command is not an approved one. The tooling here runs with broad permissions; the boundary is behavioural.

---

## 6. Code discipline

Smallest change that is correct. Reuse what exists before adding; the codebase already has 68 lib modules and duplicating one is the most common failure mode.

Before adding a dependency, check whether the platform already provides it. Two headless UI libraries already ship side by side (`radix-ui` and `@base-ui/react`) — do not add a third.

Fix root causes, not symptoms. Grep every caller before editing a shared function: one guard in the shared path is a smaller diff than one guard per call site, and patching only the path in front of you leaves siblings broken.

Deliberate corner-cuts get a `// lazy:` comment naming the ceiling and the upgrade path.

---

## 7. Things that are wrong on purpose right now

Do not "fix" these silently or treat them as bugs to be surprised by — they are known, tracked, and have decisions attached:

- Identity is build-time (`G1`, ADR-003). `stores.name` and the storefront name are different values.
- There is no install wizard (`G2`, ADR-004).
- Migration `0017` seeds a foreign sample product that admin refuses to delete (`G4`, ADR-006).
- Home content falls back to compiled copy instead of failing closed (`G5`, ADR-007).
- The Drizzle journal is broken (ADR-005).
- The first-party click cookie is named `zanoby_click_ids` — a legacy brand. Renaming it breaks existing attribution, so it is a deliberate deferral, not an oversight.
- `pnpm-lock.yaml` and `pnpm-workspace.yaml` are stale artifacts pending deletion (ADR-009).

---

## 8. Language

Repository artifacts — documentation, code comments, commit messages — are written in **English**. User-facing product copy is Indonesian. Do not translate quoted UI strings or third-party interface labels.
