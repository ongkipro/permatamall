# Audit — agritani.shop: dashboard orders vs Meta Purchase, 2026-11-10

> Verified against disk: 2026-11-10 @ `ab9804f` (agritani-shop `install/agritani-shop`, product 1.9.2 at `a913fcb`)

A point-in-time report, not a source of truth. Findings only: the tracking
contract is [`TRACKING_SPECS.md`](../TRACKING_SPECS.md) (§6, §13, §16.2), the
dashboard metrics are `src/lib/order-metrics.ts` and `src/lib/insights.ts`.
Each finding is tagged **[data]** (read-only query against the production D1
`agritani-shop-d1`), **[read]** (code reading) or **[open]** (not measured).

Owner report: "the lead count in the AdsBook dashboard and the Purchase count in
Meta do not match; `/thanks` should trigger the Purchase."

## 1. Method

- Read-only `wrangler d1 execute agritani-shop-d1 --remote --command "<SELECT>"`.
  `--file` fails with `Authentication error [code: 10000]`: it uses the D1
  import API, which this token may not call. `--command` works.
- Window: last 30 days, `orders` LEFT JOIN `capi_event_outbox`
  (`event_name = 'Purchase' AND event_id = order_number`), TRACKING_SPECS §16.2.
- Only aggregates and internal order numbers were printed. No customer data,
  no CAPI token. Meta itself (Events Manager, Dataset Quality API §16.3) was not
  queried; that needs the store token and the owner's approval.

## 2. Result in one table [data]

| Row kind (30 days) | Rows | CAPI Purchase `sent` | No Purchase |
| --- | ---: | ---: | ---: |
| `INV-` COD, `pending`/`unpaid` | 732 | 727 | **5** |
| `INV-` `manual_transfer`, `pending` | 55 | 0 | **55** |
| `ABN-` abandoned lead | 98 | 0 | 98 (correct) |

- The AdsBook "Orders" metric counts **787** (`orderRowSql`: every row that is not
  `abandoned`). The server sent **727** Purchases. Gap: **60 = 55 manual
  transfer + 5 COD**.
- Delivery quality of the 727: all `sent`, 0 `failed`, 0 `pending`. fbc 725,
  fbp 726, IP 727, value > 0 on 727. Purchase value sum Rp 162.058.000 against
  Rp 163.183.000 of COD goods in D1; the difference is the 5 missing orders.
- Enqueue lag from order creation: mean 111 s, max 18 min.
- Daily Purchase rows equal daily `INV-` COD rows on every day of the last 14,
  except one missing row on 5 of those days.

**Conclusion:** the CAPI leg works. The mismatch is (a) orders that never
became a Purchase by design or by a missing path, and (b) how the dashboard
counts, not a delivery failure.

## 3. Findings

### F-1 COD Purchase depends on the buyer reaching `/thanks` (5 orders lost) [data][read]

Both legs fire only from `MetaThanksTracker` on `/thanks`; `submit-order` and
`submit-middle-order` enqueue nothing (`form-hybrid.ts` ~2133 says so). The five
`INV-` COD orders without a Purchase (`INV-10208`, `INV-10212`, `INV-10337`,
`INV-10583`, `INV-10817`) all have `meta_request_context` and `ad_click_ids`;
four of five carry an `FBAN`/`FB_IAB` user agent (Facebook in-app browser).
For four of them no `/thanks` PageView with the same fbp exists in the outbox,
so the buyer never ran the `/thanks` script (tab closed, in-app browser killed
during navigation). `INV-10337` is a repeat buyer whose three other orders all
sent a Purchase; why this one did not is **[open]**.

Recommendation: a server fallback that never depends on the browser. Preferred
shape, the hourly cron (`src/worker.ts` already runs `7 * * * *`): select `INV-`
COD orders older than about 15 minutes and younger than 48 hours with no
Purchase outbox row and `isMetaPurchaseOrderEligible`, then call
`enqueuePurchaseForPaidOrder`'s COD twin (it currently refuses unpaid rows).
`event_id` is the order number on both legs and the outbox is unique on
`(event_name, event_id)`, so a late `/thanks` is a no-op and Meta deduplicates
a later browser leg inside 48 h. Keep `/thanks` as the primary path; the sweep
only catches misses. Acceptance: a test order whose `/thanks` never loads gets
exactly one `sent` Purchase within the next cron run; a normal order still gets
exactly one.

### F-2 Manual transfer: 55 orders, none confirmed, none reached Meta [data]

All 55 `manual_transfer` orders since 2026-10-17 are `payment_status =
'pending'`. The 1.7.13 "Transfer Diterima" button (TRACKING_SPECS §13) has
never been pressed on this store, so by contract no Purchase was sent. The
dashboard still counts them as orders and as revenue.

Recommendation, product: surface the unconfirmed transfers (an attention item
on the order list / notification, e.g. "N transfer belum dikonfirmasi lebih
dari 24 jam") so the operator action that fires the Purchase actually happens.
Operational, this store: confirm the transfers that were paid; the server
Purchase then goes out with `event_time` at confirmation. Note Meta accepts
`event_time` up to 7 days back only, so older confirmations may be rejected:
measure, do not assume.

### F-3 The dashboard "Orders" is not Meta's "Purchase" [read]

`orderRowSql` = `shipping_status <> 'abandoned'`: unpaid manual transfer,
unpaid QRIS/VA and released orders are all "Orders". Meta only ever receives
COD-at-submit and paid prepaid. An operator comparing the two numbers will
always see a gap and cannot tell which part is real.

Recommendation: add a "Purchase terkirim ke Meta" figure (count of `sent`
Purchase outbox rows in the period, Jakarta day) next to Orders, with the
breakdown "belum bayar / transfer belum dikonfirmasi / tidak terkirim". This is
the number to reconcile against Events Manager. Ads Manager will still be
lower: it reports attributed conversions only (§16.2 step 4).

### F-4 Leads older than 7 days disappear from the dashboard [data][read]

`ABN-` rows exist only from 2026-11-03 onward; every earlier day reads 0 leads.
`purgeExpiredAbandonedOrders` deletes unpaid abandoned rows after
`ABANDONED_RETENTION_DAYS = 7`. Any Insights period longer than 7 days therefore
under-counts Leads and over-states the closing rate (`orders / (orders +
leads)`). This is a likely source of "the lead number is not precise".

Recommendation: keep a per-day lead aggregate (or keep the row minus personal
data) before purge, or label the Leads metric "last 7 days only" and drop it
from longer periods. Decide in `DECISIONS.md`; retention is a privacy choice.

### F-5 A lead converted by CS never becomes a Purchase, and has no identity to send [read][data]

`convertAbandonedLead` (`/api/admin/abandoned-orders` POST) turns `ABN-` into a
pending COD `INV-` but calls no Purchase path, against the §13 rule ("a path
that makes an order … outside `/thanks` must call `enqueuePurchaseForPaidOrder`").
Also 0 of 98 `ABN-` rows carry `meta_request_context` or click IDs, so even a
Purchase sent there would match on phone and name only. On this store 0 leads
were converted in the window, so impact today is nil; on a store whose CS
closes leads it is a silent gap.

Recommendation: store `meta_request_context` and click IDs when the lead is
recorded (`record-abandoned-order`), and enqueue the Purchase after a
successful conversion (same COD helper as F-1). Whether a CS-closed sale should
be reported to Meta at all is an owner decision: it optimises the campaign
toward buyers who needed a follow-up.

### F-6 Not measured [open]

- Events Manager received / deduplicated counts for the same window, and EMQ
  (Dataset Quality API, §16.3). Needs the store CAPI token: owner approval.
- Whether another sender shares pixel `…57874` (TRACKING_SPECS §16.3 notes the
  same suspicion on revenleather).
- The Meta ad account's time zone vs the dashboard's Asia/Jakarta day.
- Browser Pixel leg: the outbox shows only the server leg.

### F-7 `/thanks` trace: why the browser-only trigger was fragile [read][data]

On the old path every step had to succeed in the buyer's browser, in order:

1. `sessionStorage.thanks_state` (or the `#o=&t=` fragment) must exist, or
   the page `location.replace`s to `/produk` before any tracking runs.
2. `MetaThanksTracker` then awaits `/api/order-status`, hashes eight keys, and
   only at the very end posts the server leg to `/api/meta-event`.
3. agritani has `thanks_whatsapp_redirect = 1`: the page leaves for WhatsApp
   1.5-5 s after load. The CAPI post uses `keepalive`, but the order-status
   fetch and hashing before it are not protected, and an in-app browser that
   hands `wa.me` to the WhatsApp app may freeze or kill the tab.
4. Four of the five missing orders came from the Facebook in-app browser and
   never even sent a `/thanks` PageView, i.e. step 1 never ran.

Rate limits were checked and are not a cause (`public-meta-event` peak 4 per
minute per IP against a limit of 60). The fix removes the dependency instead
of hardening each step: checkout itself enqueues the Purchase.

### F-8 Review of an outside recommendation list (2026-11-10)

A second analysis proposed four changes. Each was checked against the tree and
Meta's own code before acting:

| # | Proposal | Verdict |
| --- | --- | --- |
| 1 | Send the COD Purchase from the server at submit | **Correct and done** (F-1): `scheduleCodPurchase`, through the existing `enqueuePurchaseForPaidOrder`, not a hand-rolled enqueue+deliver |
| 2a | Request fbevents before the `/api/order-status` fetch on `/thanks` | **Correct and done**: one `__PS_LOAD_META_PIXEL__?.()` at the top of `fire()`; the later call was removed and a test pins the order |
| 2b | Raise `afterPixelMs` 800 → 1800-2000 ms | **Partly**: raised to 1500 ms; `maxMs` stays 5 s so a buyer is never held longer. The server leg no longer depends on this timer at all |
| 3a | `_fbp` fallback must carry an 18-19 digit random part | **Rejected, unsupported**: Meta's documented example is `fb.1.1596403881668.1116446470` (10 digits) and `SignalsFBEventsPixelCookie.unpack` in the live fbevents.js checks only part count, the `fb` prefix and numeric index/time. The current 10-digit value is accepted and kept by fbevents |
| 3b | Remove the "double" `drainCapiOutbox` after `deliverCapiEvent` | **Rejected**: not a double send. `deliverCapiEvent` claims one row; the drain retries *other* due rows under the same lease and skips the row just sent. Removing it would leave failures waiting for the hourly cron |
| 4 | Ad sets on 7d_click + 1d_view | **Out of code scope**: an Ads Manager setting the owner applies. It changes what Ads Manager reports, not what reaches Events Manager; compare like with like before and after |

### F-9 Prevention: a gap like this now raises an alarm [read][run]

The five lost orders were invisible because both health signals watch the
*queue*, and an event that was never enqueued is in no queue. New signal
`meta-purchase-coverage` (`operational-health.ts`): COD orders 2-48 h old with
no Purchase in the outbox. It is `degraded` at the first missing order, shows
on `/admin/status` as "N dari M order COD tanpa Purchase", and fires the
`OPS_ALERT_WEBHOOK_URL` alert like the two outbox signals. A store without
Meta configured reads `unknown`, not red. Tested on the real migration chain.

## 4. Status of each finding on branch `fix/meta-purchase-gap`

| Finding | State |
| --- | --- |
| F-1 | Fixed twice over: the COD Purchase is now sent by the server at checkout (`scheduleCodPurchase` in `submit-order`, `submit-middle-order`, `/api/v1/checkout`), and the hourly `sweepMissedCodPurchases` catches anything still missing. Proven end to end on `dev:local`: a middle-form COD order enqueued its Purchase with fbc and value without `/thanks` being opened |
| F-2 | Surfaced: "Transfer belum dikonfirmasi" attention item. Confirming the 55 on agritani is an operator action |
| F-3 | Fixed: Analitik → Tren metric "Purchase ke Meta" and a daily column |
| F-4 | Done (ADR-035): retention 7 → 14 days (owner), and a lead can no longer be deleted by hand through the order delete route. Periods over 14 days still under-count leads |
| F-5 | Done (owner 2026-11-10): a lead stores `meta_request_context` and click ids at capture, and CS conversion sends its Purchase with that identity |
| F-6 | Open |
| F-7 | Root cause removed by F-1; `/thanks` also requests fbevents earlier and waits 1500 ms before WhatsApp |
| F-8 | Reviewed; 1, 2a done, 2b partly, 3a/3b rejected with evidence, 4 is the owner's |
| F-9 | Done: `meta-purchase-coverage` health signal and webhook alert |

## 5. Suggested order of work (as first written)

1. F-3 Meta-delivered figure on the dashboard: makes every later check visible.
2. F-1 cron fallback for COD Purchase.
3. F-2 unconfirmed-transfer attention item.
4. F-4 lead retention vs metric (needs a decision).
5. F-5 lead identity + CS-conversion Purchase (needs a decision).

Re-run §2 after each deploy; the target is `INV-` COD with no Purchase = 0
outside the last cron interval, and Orders − Purchase fully explained by the
breakdown in F-3.
