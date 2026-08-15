# Master Remaining Work and Blockers

This document owns only genuine remaining work, external-contract blockers, merchant inputs, and operator-gated production actions. Implemented behavior belongs in `STATUS.md`; historical work belongs in `BUILD-LOG.md`; accepted behavior belongs in `PRD.md`.

Code, migrations, runtime configuration, and executed evidence take precedence over this ledger. A missing provider contract is not permission to infer an endpoint, payload, authentication method, retry policy, or status enum.

## 1. Current Gap Matrix

| Subsystem | Remaining work | Status | Verified boundary |
| --- | --- | --- | --- |
| Mengantar pickup | Synchronize pickup address and pickup schedule with `/address` and `/time` before presenting provider-confirmed state | Pending | Client transport methods exist. Current admin warehouse/pickup rows are local D1 state unless a provider response is explicitly persisted. |
| Mengantar unpaid draft | Recover an accepted non-COD unpaid draft through `/order/pay-unpaid` | Contract unverified | Sequential shipment creation can preserve `isPaid: false` and an absent `cnote_no`; no recovery action is exposed. |
| Mengantar tracking | Synchronize shipped/delivered/returned state | Blocked | No canonical authenticated callback or polling contract, retry semantics, or status mapping is available to this repository. |
| Mengantar wallet | Display live provider balance | Blocked | No canonical balance endpoint and response schema is verified. `/admin/balance` remains an AutoLaris D1 reconciliation ledger. |
| AutoLaris callback | Replace the configured shared-secret callback contract with the provider's official authentication/signature contract | Blocked | Payment creation, persistence, instructions, and idempotent paid reconciliation work locally; the official signature/header contract is unavailable. |
| Legacy Petani content | Publish reviewed runtime content and R2 media for every active legacy route, then remove the explicit compiled migration fallback | Merchant input and operator action required | Runtime-managed tenants already fail closed. The legacy `petanisejahtera` content pack remains an intentional compatibility boundary. |
| Live provider proof | Exercise explicitly approved Mengantar and AutoLaris side effects against the selected tenant | Operator-gated | Recent order/shipping audits deliberately avoided provider, payment, pickup, publish, and order mutations. |
| Future Cloudflare release | Apply any later required remote migration and deploy one exact selected Worker revision | Operator-gated | Historical releases do not authorize a future migration, deployment, DNS change, or production `petanisejahtera.com` release. |
| Portable new-account proof | Exercise approved isolated provisioning in a different Cloudflare account without importing tenant data | Operator-gated | The installer and no-side-effect plan are implemented; this documentation change did not authenticate, provision, migrate, or deploy. |
| Public storefront bootstrap | Return reviewed non-secret tenant identity and browser tracking configuration | Planned | CMSAds-rendered routes resolve configuration server-side; no committed cross-storefront bootstrap endpoint exists. |
| Public catalog/product read | Supply canonical active D1 product/variant facts to dynamic external storefronts | Planned | Its absence blocks a new dynamic catalog; static or fake fallback is not an acceptable implementation. |
| Selected headless gateway proof | Delegate the canonical form routes and any promised compatibility paths through a selected private storefront gateway | Planned per gateway | Canonical routes and query-preserving `/form-*` compatibility redirects are implemented in CMSAds; no active reference gateway currently proves private delegation. |
| Executable storefront adapter | Preserve product, campaign, click, event, attribution, confirmation, error, and focus context without forking commerce logic | Planned | The reusable framework-neutral AI prompt is documented, but no executable adapter package or fully proven reference handoff is committed. |
| Cross-storefront consent | Define tenant-applicable consent behavior and propagate it through optional tag/form handoff | Blocked on merchant/legal decision; implementation planned | Tracking validation/components exist, but no completed consent/bootstrap adapter exists. |

## 2. Implemented and Removed from the Backlog

### A. Explicit order dispatch and sequential shipment creation

- Every checkout order remains in Order Management as `pending`; checkout and paid reconciliation do not dispatch automatically.
- The order editor resolves district/subdistrict destination data, re-quotes actual public rates, and blocks an incomplete provider Push.
- Order Management owns explicit single-order and checklist-based bulk Push actions.
- Mengantar `/order` requests run sequentially and return independent success, unpaid, skipped, or failed results.
- Only accepted provider responses transition orders to `processing` and expose them in Shipping. Provider failure remains pending, actionable, and retryable.

This replaces the former local-confirmation and Shipping-owned dispatch flow. Historical direct-checkout, confirmation, and paid-callback dispatch entries remain in `BUILD-LOG.md` as superseded implementation history.

### B. First-party runtime content workbench

- `/admin/content` is committed inside the canonical admin shell.
- The workbench lists instruction readiness and draft/published state by content key.
- Authenticated APIs support instruction save, manual draft save, Workers AI generation, explicit publish, and tenant-R2 media upload.
- Read responses never echo stored instructions, and collaborators remain limited to content/media plus their own profile/logout boundary.

### C. Runtime-managed public content

- Shared Git code owns schemas, renderers, checkout logic, and operational behavior.
- Tenant instructions, draft JSON, and published JSON belong to that Worker's D1; uploaded media belongs to its R2 bucket.
- AI generation receives operational D1 product facts, validates structured output, saves a draft, and never publishes automatically.
- Runtime-managed tenants do not inherit another merchant's compiled copy. Missing content renders an honest setup/empty state.
- Operational IDs, price, stock, payment, logistics, ads configuration, credentials, and orders cannot be overwritten by content JSON.

### D. Current isolated merchant environment

The deployable registry currently contains one validated environment:

- `petanisejahtera-preview` → `cmsads-petanisejahtera-preview` → `custom-domain` at `preview.petanisejahtera.com`.

The standalone `petanisejahtera` Worker owns `petanisejahtera.com`; the former CMSAds production Worker and its isolated storage are preserved outside the deployable registry. Headless deployment remains an accepted architecture, not proof that public bootstrap/catalog, selected-gateway form delegation, executable adapter, or consent contracts are implemented.

Historical removed-tenant topology and cleanup evidence remains available in immutable Git history. It is not current inventory and MUST NOT be reused as a resource identifier.

### E. Provider configuration and payment ledger

- `/admin/profile` replaces masked Mengantar and AutoLaris API keys/base URLs in the selected tenant's D1; blank keys preserve active values.
- AutoLaris webhook secrets remain server-managed and are never returned through the browser API.
- Checkout persists one AutoLaris transaction per eligible online order and renders only recorded instructions and amounts.
- Paid reconciliation updates payment/order eligibility idempotently. It does not bypass Order Management confirmation or Shipping release.
- `/admin/balance` reports recorded D1 transactions and is not a live provider wallet or withdrawal surface.

### F. Same-revision fleet delivery

- `tenant:list --json` derives targets from the validated registry used by local lifecycle commands.
- Pull requests validate and dry-run each target without publishing.
- A release selects one exact tenant through a manual guarded path; a push to `main` does not deploy a Worker.
- D1 migrations remain separate, exact-tenant, operator-approved operations.

## 3. Planned Headless Storefront Completion

1. Implement the non-secret public bootstrap contract in T174 without exposing server credentials.
2. Implement the canonical active catalog/product read contract in T175.
3. Add and test locked middle/full/hybrid service-binding routes in each selected headless gateway under T176.
4. Complete the framework-neutral handoff/adapter proof in T177 without duplicating form state or product identity.
5. Prove the Meta browser/CAPI event map and deduplication boundary in T178.
6. Obtain the tenant's applicable consent decision, then implement and prove T179.

These are accepted planned contracts in REQ-92–REQ-95. Historical headless evidence does not complete these adapters.

## 4. Provider Work That Must Remain Bounded

### A. Pickup address and schedule synchronization

1. Obtain or re-verify the canonical `/address` and `/time` request/response schemas.
2. Send the provider request sequentially through the existing client boundary.
3. Persist provider identifiers and confirmed state only after an accepted response.
4. Preserve an actionable local failure without presenting an unsynchronized D1 row as provider-confirmed.
5. Cover the accepted, rejected, timeout, and retry paths without duplicating pickup creation.

### B. Non-COD unpaid recovery

1. Capture an explicitly approved real insufficient-wallet response with `isPaid: false` and no `cnote_no`.
2. Verify `/order/pay-unpaid` authentication, request, response, idempotency, and failure semantics.
3. Add a recovery action only for the verified state.
4. Persist returned payment and waybill fields only after provider acceptance.

### C. Blocked contracts

- Tracking synchronization requires an official authenticated callback or polling endpoint, status enum, retry behavior, and reconciliation rules.
- Live wallet display requires an official balance endpoint, authentication contract, units, and response schema.
- AutoLaris callback hardening requires the provider's canonical signature/header specification and replay rules.

Unknown or unauthenticated events MUST fail closed.

## 5. Runtime Content and Media Completion

Repository implementation is complete; tenant publication is runtime work:

1. Store a non-secret tenant instruction in the selected Worker's D1.
2. Generate or save a draft through `/admin/content`.
3. Review every factual claim, product reference, route, and media reference.
4. Upload merchant-owned media to the selected tenant's R2 bucket.
5. Publish each validated home/product record explicitly.
6. Exercise the selected storefront and metadata in a browser.
7. For legacy Petani only, remove the compiled migration fallback after every required route has a verified runtime replacement.

Do not seed production merchant instructions, credentials, claims, testimonials, ratings, or customer data in Git.

## 6. Execution Order

1. Complete T174–T179 and T185 in dependency order for the selected headless storefront and approved tenant; do not expose secrets, invent catalog data, treat the reusable prompt as an executable adapter, or report local route proof as deployment.
2. Obtain merchant-owned content/media required for the selected tenant.
3. Complete reviewed runtime publication without changing operational commerce state.
4. Finish legacy Petani runtime-only cutover after route-by-route parity is proven.
5. Synchronize pickup addresses and schedules from verified Mengantar contracts.
6. Implement non-COD unpaid recovery only after capturing the real provider state and contract.
7. Resolve tracking, wallet, and AutoLaris signature blockers only from canonical provider documentation.
8. Run live provider scenarios only with exact side-effect approval and a rollback/reconciliation plan.
9. Apply remote migrations and deploy only the selected tenant with separate explicit approvals.

## 7. Completion Rules

A blocker is complete only when its contract, implementation, executable proof, failure behavior, and owning canonical document are updated. A local build is not live-provider evidence. A Worker deployment is not D1 migration evidence. A Custom Domain is not data isolation by itself. A deleted Worker does not authorize deletion of its D1, KV, R2, DNS, or secrets.
