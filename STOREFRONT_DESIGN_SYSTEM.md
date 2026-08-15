# CMSAds Engine — Direct-Response Storefront UI/UX Design System Specification

## Scope

This document owns the shared storefront interaction and presentation contract. The `compact-market` template retains the centered 480px direct-response shell and the checkout form rules below. The `wide-catalog` template owns a responsive catalog/product shell while reusing the same checkout, accessibility, trust-signal, tenant, tracking, and API boundaries.

Tenant theme variables may change brand color, logo, typography treatment, and public chrome. They must not change operational pricing, checkout validation, order lifecycle, accessibility, or admin presentation.

## 1. Core Visual Principles & Color Tokens

### A. Principles
- **Template-aware width:** `compact-market` uses a centered `max-w-[480px]` shell. `wide-catalog` uses its responsive repository layout and shared page gutters; it must not be constrained to 480px.
- **Restrained color:** coordinated brand color plus layered neutrals; no unrelated rainbow badges or status colors.
- **Accurate media semantics:** merchant photographs may be described as product photos. Repository illustrations and generated artwork must be labelled as images or illustrations rather than photographs.
- **Evidence-only trust:** ratings, reviews, sales counts, bestseller labels, guarantees, originality claims, and discount badges render only from verified operational/manual data. Absence is preferable to synthetic proof.

### B. Color Tokens
| Semantic Role | Token / Hex | Usage |
| --- | --- | --- |
| **Primary Text** | `#0f172a` (Slate 900) | Form input typed text, package titles, section headers |
| **Secondary Text** | `#475569` / `#64748b` (Slate 500/600) | Secondary labels, un-typed default labels, floating top labels, help text |
| **Primary Brand** | `#047857` (Emerald 700) | Accent buttons, primary price tags, active badge badges |
| **Soft Green Tint** | `#f0fdf4` (Emerald 50) | Filled/typed input background indicator, dropdown hover item background |
| **Clean Border** | `#cbd5e1` (Slate 300) | Input borders, dropdown container borders, summary card dividers |
| **Light Card Border** | `#e2e8f0` (Slate 200) | Variant option cards, summary card outer border |
| **Error State** | `#dc2626` (Red 600) | Invalid input border, field feedback text |

---

## 2. Form Layout & Block Hierarchy

Checkout forms follow a 3-block vertical rhythm:

```
+-------------------------------------------------------+
| [Section 1] Pilih Paket & Ukuran                      |  <-- form-block form-block-first
|   - Card Option 1 (1 Botol)                           |
|   - Card Option 2 (2 Botol - Paling Laris)            |
|   - Card Option 3 (3 Botol - Lebih Hemat)             |
+-------------------------------------------------------+
| [Section 2] Data penerima                             |  <-- form-block
|   - Nama lengkap (input: 2.6rem height)               |
|   - Nomor WhatsApp (input: 2.6rem height)             |
|   - Alamat lengkap & patokan (textarea)              |
|   - Kecamatan / Kota (autocomplete search)           |
|   - [District Dropdown List] (positioned below input) |
|   - [District Picked Card] (positioned below input)   |
+-------------------------------------------------------+
| [Section 3] Ringkasan Pemesanan                       |  <-- form-block summary-block
|   - Summary Card (Produk, Harga Coret, Diskon)        |
|   - Total Box (Total Pembayaran: #047857)            |
|   - Submit Button (Fast COD / Place Order CTA)        |
+-------------------------------------------------------+
```

---

## 3. Input Field & Floating Label Micro-Interactions

### A. Input Box Dimensions & Border
- **Height**: `min-height: 2.6rem` (~41.6px) — sleek, compact, natural mobile height.
- **Padding**: `padding: 1.02rem 0.8rem 0.28rem 0.8rem`.
- **Border**: `1px solid #cbd5e1` (Clean 1px Slate 300 border line).
- **Corner Radius**: `border-radius: 0.6rem`.
- **User-Typed Text**: `font-weight: 600` (Semibold Slate 900 `#0f172a`), `font-size: 0.85rem` (~13.6px).

### B. Floating Label States
1. **Un-Typed Default State**:
   - `position: absolute; left: 0.8rem; top: 1.3rem; transform: translateY(-50%);`
   - `font-size: 0.82rem; font-weight: 700; color: #475569;`
   - Sits in the exact mathematical vertical center of the 41.6px input box container.
2. **Floated Top State (`:focus` or `:not(:placeholder-shown)`)**:
   - `top: 0.28rem; transform: translateY(0);`
   - `font-size: 0.65rem; font-weight: 500; color: #64748b;`
   - Thin, soft gray label anchored comfortably near the top border.

### C. Completed / Filled Input Indicator
- When an input contains typed text (`:not(:placeholder-shown)` or `.field-valid`):
  - `background: #f0fdf4 !important` (Soft light green pastel background tint).
  - `border: 1px solid #cbd5e1` (Retains clean 1px gray border line).

---

## 4. Variant Package Selection Cards (`.simple-variant-copy`)

### A. Card Dimensions & Spacing
- **Card Padding**: `padding: 0.65rem 0.85rem` (~10.4px top/bottom, 13.6px left/right).
- **Card Border**: `1px solid #e2e8f0`, `border-radius: 0.65rem`.
- **Card Gap**: `gap: 0.5rem` between package cards in list.

### B. Internal Component Alignment
- **Radio Button (`.variant-radio`)**: `width: 1.1rem; height: 1.1rem; margin-top: 0.12rem;` (Vertically centered with single-line package title).
- **Package Label (`.variant-label`)**: `font-size: 0.82rem; font-weight: 800; color: #0f172a;`.
- **Price Display (`.variant-price`)**: `font-size: 0.95rem; font-weight: 800; color: #047857;`.
- **Compare Price (`.variant-compare`)**: `font-size: 0.72rem; color: #94a3b8; text-decoration: line-through;`.

---

## 5. District Autocomplete Dropdown & Selected Card

### A. Autocomplete Search Dropdown (`.district-list`)
- **Position & Margin**: Rendered **below** the input box with `margin-top: 0.55rem`.
- **Dimensions & Scroll**: `max-height: 16rem; overflow-y: auto;`.
- **Border & Shadow**: `border: 1px solid #cbd5e1; border-radius: 0.65rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);`.
- **Item Padding**: `padding: 0.55rem 0.85rem` (~8.8px top/bottom, 13.6px left/right).
- **Item Hover/Focus State**: `background: #f0fdf4` (Soft light green background tint).
- **Item Typography**:
  - `strong`: `font-size: 0.82rem; font-weight: 700; color: #0f172a;` (Kelurahan / Kecamatan primary line).
  - `small`: `font-size: 0.68rem; font-weight: 500; color: #64748b;` (Kabupaten & Provinsi sub-location detail).

### B. Selected District Card (`#district-picked`)
- Rendered **below** `#district-search-container` and `#district-list`.
- **Margin**: `margin-top: 0.55rem`.
- **Padding & Border**: `padding: 0.82rem 1rem; border: 1px solid #8bc58f; border-radius: 0.65rem; background: #f7fbf5;`.
- **Help Text (`#district-help`)**: Positioned below `#district-picked` with `margin-top: 0.35rem; font-size: 0.72rem; font-weight: 500; color: #64748b;`.

---

## 6. Order Summary Box (`.summary-card`)

### A. Dimensions & Layout
- **Outer Card**: `border: 1px solid #e2e8f0; border-radius: 0.65rem; background: #ffffff;`.
- **Summary Rows (`.summary-row`)**: `padding: 0.62rem 0.85rem; border-bottom: 1px solid #f1f5f9;`.
- **Row Typography**:
  - Label (`span`): `font-size: 0.78rem; font-weight: 600; color: #64748b;`.
  - Value (`strong`): `font-size: 0.82rem; font-weight: 700; color: #0f172a;`.

### B. Total Payment Box (`.total-box`)
- **Padding & Background**: `padding: 0.75rem 0.85rem; background: #f8fafc; border-top: 1px dashed #cbd5e1;`.
- **Total Price**: `font-size: 1.15rem; font-weight: 800; color: #047857;` (Crisp, sharp, bold emerald).

---

## 7. Verification Contract

Every affected storefront change MUST use the smallest executable proof:

1. Run `npm test` when the change affects a tested domain contract.
2. Run `npm run check` and require zero diagnostics.
3. Run the selected tenant build and `tenant:dry-run` when template, tenant, or Worker configuration changes.
4. Exercise browser-visible changes in the selected tenant at the affected desktop and mobile widths; inspect interaction, focus, console/network failure, and horizontal overflow.
5. Confirm that missing evidence suppresses trust/discount claims and that tenant content/media never falls back to another merchant.

Do not hard-code historical test counts or file counts as a permanent requirement. Record the exact observed counts and commands in `STATUS.md` and `BUILD-LOG.md`.
