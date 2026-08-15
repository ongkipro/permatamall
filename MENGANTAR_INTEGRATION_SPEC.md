# Mengantar Integration — Technical Contract and Gap Register

This document is the technical source of truth for CMSAds behavior at the Mengantar boundary. It separates repository-observed transport code, locally verified application behavior, operator-gated live mutations, and provider contracts that remain unknown.

Normative product behavior lives in `PRD.md` (`REQ-13`–`REQ-16`, `REQ-38`, `REQ-41`, and `REQ-74`–`REQ-76`). Current evidence lives in `STATUS.md`; genuine remaining work lives in `UNIMPLEMENTED_SPECS.md`.

## 1. Boundary and Authentication

### Observed repository contract

- Production base URL default: `https://api-public.mengantar.com`.
- API prefix: `/api/public/{API_KEY}`.
- The selected tenant resolves Mengantar API key and HTTP(S) base URL from its D1 store first, then from server environment fallback.
- Public browser code never receives the API key.
- JSON order creation uses `Content-Type: application/json`.
- Pickup address and time mutations use `Content-Type: application/x-www-form-urlencoded`.
- The current client does not send `x-client-source`. Do not add or claim an integrator classification until the applicable provider contract and intended analytics classification are confirmed.

### Security and tenant isolation

- Provider credentials belong to one tenant Worker/D1 environment and must not be copied between tenants.
- Read APIs must not echo raw keys. Admin configuration exposes only configured/source state and masked values.
- Unknown provider responses, unauthenticated callbacks, and unrecognized status values fail closed.
- Live order, pickup, wallet, or payment mutations require exact tenant and side-effect approval.

## 2. Endpoint Status Matrix

| Provider endpoint | Method | Purpose | CMSAds status | Active boundary |
| --- | --- | --- | --- | --- |
| `/address/search?keyword=` | `GET` | Resolve Mengantar area identities | Implemented and locally verified | Public checkout starts with the bundled district index; server/admin flows resolve provider district/subdistrict data before quoting or dispatch. |
| `/address` | `GET` | List seller pickup addresses | Client implemented | `getPickupAddresses()` exists; provider synchronization is not presented as complete. |
| `/address` | `POST` | Create or update pickup address | Client implemented; workflow pending | `createPickupAddress()` exists. Persist provider-confirmed identity only after an accepted response. |
| `/time` | `POST` | Schedule pickup | Client implemented; workflow pending | `schedulePickupTime()` exists. A local D1 schedule is not provider confirmation. |
| `/time?address=` | `GET` | List pickup times | Client implemented | `getPickupTimes()` exists; no complete synchronized admin lifecycle is claimed. |
| `/order/estimate` | `GET` | Quote retail courier services | Implemented and locally verified | Read-only quote used by checkout, order editing, and admin tariff checks; a quote is never a shipment. |
| `/order/allEstimate3PL` | `GET` | Quote base 3PL pricing | Not implemented | No active application method or UI. |
| `/getReceiverScoreByNumberUser` | `GET` | Return receiver history per courier | Implemented and locally verified | CMSAds derives transparent delivery rate/risk from provider counts; it does not fabricate a provider score. |
| `/order` | `POST` | Create provider order/draft and optional waybill | Implemented; live mutation gated | Only explicit eligible Push actions in Order Management may invoke it. Bulk calls run sequentially with per-order outcomes. |
| `/order/pay-unpaid` | `POST` | Recover accepted non-COD unpaid draft | Contract unverified | No recovery method or UI is exposed. |
| Wallet balance | Unknown | Read active Mengantar wallet | Blocked | No canonical endpoint or response schema is verified; do not assume `/user/balance`. |
| Tracking synchronization | Unknown | Reconcile shipment lifecycle | Blocked | No authenticated callback/polling contract, status enum, or retry behavior is verified. |

## 3. Area Search and Quote Resolution

### Public checkout

1. `GET /api/locations?search=<prefix>&level=district` searches the bundled 7,285-district index without exposing provider credentials.
2. The customer selects one district plus city; public checkout does not require village selection.
3. The server resolves a representative Mengantar destination area identity through `/address/search` using the selected district plus city, not the ambiguous district name alone. Exact district representatives rank ahead of village rows.
4. `/api/shipping-options` requests eligible rates from `/order/estimate`.
5. Order submission re-fetches and verifies courier, service, cost, weight, active variant, and destination before persistence.

The local district index improves public search relevance; it is not a replacement for the provider identity required by rates and dispatch.

### Admin warehouse and order editing

- Warehouse origin selection groups provider results by district and then requires a precise subdistrict/village selection before persisting `origin_area_id` and its label.
- Customer checkout remains district-only and never displays kelurahan/desa in its delivery summary; the server still resolves a representative real Mengantar area ID for rates and dispatch.
- The order editor defaults to the same bundled district-plus-city search and resolves the selected pair to one representative provider area identity. An operator may explicitly enable direct provider kelurahan/desa precision when the buyer address needs it. Both modes persist a real `destination_area_id`, then re-quote the actual provider price; neither mode permits free-text or unresolved destination dispatch.

### Rate interpretation

- `unsupported: true` means the courier route is unavailable and must not be offered.
- `unsupported_cod: true` means the route may be available but COD must not be offered.
- CMSAds persists and verifies the selected provider quote; browser-supplied cost is never authoritative.
- `/order/estimate` is a read operation. It does not create, reserve, or prove a shipment.

## 4. Receiver Performance

`GET /getReceiverScoreByNumberUser` returns courier-specific history rather than one canonical 0–100 score. CMSAds parses provider buckets such as total, delivered, RTS, undelivered, and in-progress counts.

CMSAds behavior:

- normalize the customer phone before the request;
- preserve the full courier breakdown and observation timestamp;
- derive delivery rate from completed outcomes using the documented local policy;
- classify operational risk as CMSAds-derived guidance, not a provider-issued score;
- refresh checkout snapshots through Cloudflare `waitUntil()` so customer persistence does not wait on the read-only provider lookup;
- avoid fabricated fallback scores when the provider is unavailable.

## 5. Definitive Order-to-Shipment Lifecycle

### A. Intake

- Every checkout endpoint persists the order, items, and stock transition atomically in D1.
- New orders use `shipping_status = pending` and remain in Order Management.
- COD, an eligible quote, and an authenticated AutoLaris paid transition do not call Mengantar automatically.

### B. Order Management verification

Before confirmation, the operator verifies:

- customer identity and deliverable address;
- resolved destination area identity and label;
- active warehouse and pickup data;
- selected supported courier/service and current public price;
- payment readiness: COD is not payment-gated, while online methods require reconciled paid state.

An explicit Push action in Order Management is the provider boundary. Selection alone is inert. Single and bulk actions call the Order Management API; Shipping does not create provider orders.

### C. Sequential dispatch from Order Management

- The backend validates ownership, pending status, payment eligibility, destination, warehouse, courier/service, and existing provider state again.
- Each `/order` request is awaited before the next begins. Parallel calls and guessed fixed delays are prohibited.
- Every selected order returns an independent `success`, `unpaid`, `skipped`, or `failed` result with an actionable reason.
- Accepted siblings remain committed when another order fails.
- Provider rejection or transport failure clears the dispatch claim, preserves the provider error, and leaves the order `pending` in Order Management for correction and retry.
- A stale dispatch claim becomes retryable after the same bounded lease used by the dispatcher.

### D. Provider-accepted Shipping projection

Only an explicit response with `success: true` may persist provider identity, set `shipping_status = processing`, record confirmation, and make the order visible in Shipping. Shipping owns:

- provider-returned resi visibility;
- shipment lifecycle status after creation;
- pickup selection and scheduling for eligible provider-created rows.

### E. Accepted response semantics

- Persist `provider_order_id`, batch identity, paid state, and `cnote_no` only for the individual accepted response.
- A provider-accepted non-COD draft may have `isPaid: false` and `cnote_no: null`.
- An absent `cnote_no` remains visibly absent; CMSAds never fabricates a waybill or labels an unpaid draft as dispatched.
- `/order/pay-unpaid` recovery remains unavailable until its contract is verified.

## 6. Pickup Synchronization

Observed client fields for `/address` include:

- `PICKUP_NAME`;
- `PICKUP_PIC`;
- `PICKUP_PIC_PHONE`;
- `PICKUP_ADDRESS`;
- `PICKUP_AUTOFILL` provider area identity;
- optional existing address identity for update.

Observed client fields for `/time` include `address_id`, `date` in `MM-DD-YYYY`, and a provider time value. The repository currently documents a minimum 90-minute scheduling constraint from the available integration reference; this must be re-verified against the active provider contract before a live workflow claims acceptance.

Completion requires:

1. focused request/response verification for the active provider account;
2. explicit accepted/rejected/timeout handling;
3. provider identity persisted only after acceptance;
4. retry behavior that cannot duplicate pickup creation;
5. UI language that distinguishes local D1 schedule from provider-confirmed pickup.

## 7. Blocked Contracts

### Tracking synchronization

Required before implementation:

- canonical callback or polling endpoint;
- authentication or signature verification;
- status enum and transition rules;
- retry, duplicate, and ordering behavior;
- mapping for shipped, delivered, returned, and terminal exceptions.

### Live wallet balance

Required before implementation:

- canonical endpoint and method;
- authentication;
- response schema, amount units, and currency;
- error and stale-data semantics.

### Non-COD unpaid recovery

Required before implementation:

- a captured approved real unpaid-draft response;
- canonical `/order/pay-unpaid` request and response;
- authentication and idempotency;
- behavior when payment succeeds but waybill issuance is delayed or absent.

## 8. Sandbox Reference

When an approved sandbox test is performed, preserve the known environment limitations as test preconditions rather than production rules:

1. JNE sandbox origin may require Jakarta mapping.
2. SAP sandbox tests may require non-COD Jakarta-to-Jakarta routing.
3. Sandbox wallet top-up may require the Midtrans sandbox simulator.

Re-check these constraints against the active sandbox documentation before treating a failure as an application regression.

## 9. Verification and Evidence Boundary

Repository-level proof currently covers payload construction, response parsing, eligibility, sequential execution, leases/claims, partial outcomes, persistence rules, local API behavior, and responsive single/bulk Shipping controls. Recent browser audits intentionally did not submit live provider mutations.

Relevant implementation owners include:

- `src/lib/mengantar-client.ts`;
- `src/lib/mengantar-order.ts`;
- `src/lib/mengantar-dispatch.ts`;
- `src/lib/order-dispatch-policy.ts`;
- `src/pages/api/admin/orders/[id].ts`;
- `src/pages/api/admin/shipping.ts`;
- `src/pages/api/locations.ts`;
- `src/pages/api/shipping-options.ts`.

A green unit test or build is not live-provider evidence. Record exact tenant, endpoint, side effect, request class, accepted/rejected outcome, and non-actions whenever a live scenario is explicitly approved.
