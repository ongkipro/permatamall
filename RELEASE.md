# Release and Deployment — AdsBookCMS

> Verified against disk: 2026-08-16 @ `0d2e56a`

This document is the single owner of how a change reaches production. It replaces the previous `VERSION.md` runbook and the deleted `AUTO_UPDATE_DEPLOY.md`, which between them described three mutually exclusive release models, none of which matched the one workflow that exists.

---

## 1. The one release path

```
push to main → .github/workflows/deploy.yml → npm ci → npm run check → npm test → npm run build → npx wrangler deploy
```

**Pushing to `main` deploys production.** There is no staging environment, no pull-request gate, and no manual approval step between merge and live traffic. Merging to `main` is the release action and carries the same weight as running a deploy by hand.

The workflow also triggers on `v*` tags and on manual dispatch. No git tag has ever been created in this repository, so the tag path is untested.

The job runs on Node 22 under the `CLOUDFLARE_API_TOKEN` GitHub environment, using secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

### Manual deploy

`npx wrangler deploy` (or `npm run deploy`) is a valid and supported path. It deploys whatever is in the working tree to the same production Worker. Use it only when CI is unavailable and the change has passed the local gates below.

---

## 2. Gates before merging to `main`

Run in this order — it is the order CI runs them, so a failure here is a failure there:

```bash
npm test          # node --test over src/lib/*.test.ts
npm run check     # astro check && tsc --noEmit
npm run build     # astro build
```

Current baseline on `main`: **194 tests passing**, `tsc` clean, `astro check` 0 errors / 0 warnings / 38 hints.

A green build is not proof the storefront works. For any browser-visible change, open the affected page before merging. Neither `tsc` nor `astro check` catches a route that fails to compose — an unterminated `.astro` frontmatter block silently produced a 404 on `/disclaimer` while every static check stayed green.

---

## 3. Database migrations

Migrations are **not** applied by CI. They are a separate, explicitly approved step.

```bash
npm run db:migrate:local    # wrangler d1 migrations apply OMS_DB --local
npm run db:migrate:remote   # wrangler d1 migrations apply OMS_DB --remote  ← production
```

`wrangler d1 migrations apply` reads the `src/db/migrations/` directory, not the Drizzle journal. Rules:

- **Never edit an applied migration in place.** A database that already ran `0017` will never see your edit. Corrections ship as a new forward migration.
- **Write migrations by hand.** The Drizzle journal stops at `0030` while 34 files exist, so `npm run db:generate` would emit a destructive diff. See `DECISIONS.md` ADR-005.
- **Apply the migration before deploying code that depends on it.** Deploy and migration are independent operations against the same live store.
- `migrations/` at the repository root is a stray duplicate outside the configured `migrations_dir` and must not be used.

---

## 4. Version registry

Two registries currently disagree and both are shipped:

| Source | Field | Value |
| --- | --- | --- |
| `src/lib/version.ts` | `version` | `1.2.0` |
| `src/lib/version.ts` | `releaseTag` | `2026.08-hardened` |
| `src/lib/version.ts` | `schemaVersion` | `34` |
| `package.json` | `version` | `1.0.0` |

`src/lib/version.ts` is what the admin sidebar renders and is the value users see. `package.json` has never been bumped. Until they are reconciled, treat `src/lib/version.ts` as the product version and `package.json` as meaningless.

Note that `schemaVersion: 34` counts migration *files* (`0000`–`0033`); there is no migration file named `0034_*`.

### Bumping a release

1. Update `src/lib/version.ts` (`version`, `releaseTag`, `lastUpdated`, and `schemaVersion` if migrations were added).
2. Record the change in `BUILD-LOG.md` as a new entry.
3. Update `STATUS.md` if the system state changed.
4. Merge to `main`, which deploys.

---

## 5. Rollback

There is no automated rollback. Options, in order of preference:

1. **Revert the commit and merge** — goes through the same gates and redeploys the previous behaviour.
2. **Cloudflare dashboard rollback** to a previous Worker version — immediate, but the repository no longer matches production until you also revert in git.

**Migrations do not roll back.** A schema change that must be undone requires a new forward migration written for that purpose. Plan destructive schema changes accordingly.

---

## 6. What deploying does not do

- It does not apply migrations (§3).
- It does not seed or modify catalog data.
- It does not rotate secrets. Worker secrets are set out of band and are never in `wrangler.jsonc`.
- It does not touch provider state at Mengantar or AutoLaris.

---

## 7. Approval boundary

Because `main` is production, these all require explicit approval before they happen:

- merging or pushing to `main`;
- `npx wrangler deploy` / `npm run deploy`;
- `npm run db:migrate:remote` or any `--remote` D1 command;
- creating or deleting Cloudflare resources (D1, KV, R2, custom domains);
- any operation that mutates provider state at Mengantar or AutoLaris.

Read-only local work — tests, typecheck, build, local D1 — needs no approval.
