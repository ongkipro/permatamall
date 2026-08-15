# Storefront UI/UX Specification: Luxury, Modern, Minimalist Design System

## 1. Executive Summary & Design Vision

This specification defines the complete UI/UX overhaul for the public storefront of **Permata Mall**. The visual direction pivots from standard ecommerce density to a **Luxury, Modern, Minimalist** aesthetic inspired by high-fashion storefronts and contemporary direct-to-consumer flagship brands.

### Core Visual Pillars
1. **Studio Canvas & Layered Neutrals:** Warm, off-white background canvases (`#FBFBFB` / `#FAFAFA`) paired with deep onyx typography (`#09090B`), eliminating stark contrast clutter while accentuating merchant media.
2. **Hairline Geometry & Crisp Borders:** 1px hairline dividers (`#E4E4E7` Zinc 200) and soft rounded corners (`rounded-2xl` 16px & `rounded-3xl` 24px) creating structured, airy card surfaces.
3. **Refined Typography & Micro-Interactions:** Dual-tone headline hierarchy featuring tight geometric sans tracking (`tracking-[-0.03em]`) balanced with wide uppercase category labels (`tracking-[0.15em]`). Smooth 300ms cubic-bezier state transitions on touch and hover.
4. **High-Conversion Clarity:** Zero-friction visual hierarchy across Product Detail Pages (PDP), Product Listing Pages (PLP), and Order Checkout Forms while maintaining 100% functional state integrity.

---

## 2. Design Tokens & Palette Hierarchy

### A. Color Palette
| Token Name | Hex / Class | Application |
|---|---|---|
| **Canvas Background** | `#FBFBFB` (`bg-[#FBFBFB]`) | Main body canvas, background surface |
| **Card Surface** | `#FFFFFF` (`bg-white`) | Product cards, form containers, elevated panels |
| **Subtle Surface** | `#F4F4F5` (`bg-zinc-100`) | Input backgrounds, inactive badges, thumbnail borders |
| **Onyx Ink (Primary)** | `#09090B` (`text-zinc-950`) | Primary titles, price tags, active buttons |
| **Muted Ink (Secondary)** | `#52525B` (`text-zinc-600`) | Descriptions, metadata, reviews, breadcrumbs |
| **Hairline Border** | `#E4E4E7` (`border-zinc-200`) | Card outlines, section dividers, input borders |
| **Emerald Accent (Primary)**| `#047857` (`bg-emerald-700` / `#047857`) | CTA buttons, active variant borders, price highlights |
| **Emerald Soft Tint** | `#ECFDF5` (`bg-emerald-50`) | Selected option background, discount pills |
| **Gold / Luxury Accent** | `#D97706` (`text-amber-600`) | Star ratings, highlight badges, promo tags |

### B. Typography & Spacing Rhythm
- **Font Stack:** System Sans / `Plus Jakarta Sans` / `Inter`
- **Headings:** Bold, `tracking-[-0.03em]`, `leading-snug`
- **Category Badges:** Semi-bold, `text-[11px]`, `uppercase`, `tracking-[0.12em]`
- **Price Tags:** Ultra-bold, `text-[26px]` to `text-[32px]`, `tracking-[-0.03em]`
- **Section Spacing:** Generous vertical padding (`py-8` to `py-14` on desktop, `py-6` to `py-10` on mobile)

---

## 3. Homepage (Storefront Index) Architecture

### A. Announcement Ticker & Header Navigation
- **Announcement Bar:** Dark Onyx (`bg-zinc-950 text-zinc-300 py-2.5 text-xs font-medium tracking-wide flex justify-center items-center gap-2`), featuring active promo announcements (e.g. "Gratis Ongkir COD Seluruh Indonesia • Garansi 100% Original").
- **Header Shell:** Sticky blur backdrop (`sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-100`), brand logo with refined weight, category navigation, search trigger, and customer care contact link.

### B. Hero Showcase Section
- **Visual Design:** Full-width responsive hero panel with layered neutral background, high-resolution product showcase image, editorial headline, subheadline, and instant CTA button ("Jelajahi Koleksi").

### C. Category Filter & Featured Grid
- **Category Filter Pills:** Horizontal scroll bar with pill-shaped buttons (`rounded-full px-4 py-2 text-xs font-semibold border transition-all`). Active category uses `bg-zinc-950 text-white border-zinc-950`, inactive uses `bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400`.
- **Product Card Architecture:**
  - `rounded-2xl overflow-hidden bg-white border border-zinc-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300`
  - Image container with aspect ratio `aspect-[4/5]` or `aspect-square`, subtle zoom on hover (`group-hover:scale-105 transition-transform duration-500`).
  - Overlay badges for discount percentage (`bg-zinc-950/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-bold`).
  - Card Body: Clean category label, title (`text-sm font-bold text-zinc-950 line-clamp-2`), price tag (`text-base font-bold text-emerald-700`), compare price strikethrough, rating summary.

### D. Value Proposition & Trust Ribbon
- 4-column desktop / 2-column mobile trust grid:
  1. **Garansi 100% Original** (Originality verification)
  2. **Bisa Bayar Di Tempat (COD)** (Risk-free ordering)
  3. **Pengiriman Cepat & Rapi** (Inspected packaging)
  4. **Layanan Customer Support 24/7** (Direct WhatsApp assistance)

---

## 4. Product Detail Page (PDP) Architecture

### A. Media Gallery (`ProductImageSlider.tsx`)
- **Main Viewport:** High-contrast container (`bg-zinc-50 border border-zinc-200/80 rounded-2xl overflow-hidden relative min-h-[340px] max-h-[560px] flex items-center justify-center cursor-zoom-in`).
- **Interactive Features:**
  - Responsive thumbnail gallery strip (`flex gap-2.5 overflow-x-auto p-2 bg-white border-t border-zinc-100`).
  - Active thumbnail indicator (`border-2 border-emerald-600 scale-105 shadow-sm`).
  - Next/Previous floating arrow navigation buttons (`bg-white/90 backdrop-blur-xs shadow-md rounded-full`).
  - Lightbox Fullscreen zoom modal on click.

### B. Product Details & Purchase Controls
- **Breadcrumbs:** Minimalist inline breadcrumb bar (`Beranda / Produk / [Category] / [Product Name]`).
- **Header Info:** Category badge, title in `text-2xl lg:text-3xl font-extrabold text-zinc-950`, ratings & sales counter badge (`⭐ 4.9 (128 ulasan) • 485+ terjual`).
- **Pricing Box:** Clean price display with discount savings badge.
- **Variant Selector:** Interactive variant cards with instant active state styling (`border-2 border-emerald-600 bg-emerald-50/40 text-emerald-950`).
- **Product Benefits Accordion / Spec Grid:** Highlighting key points, benefits, and materials with clean icons.

### C. Sticky Mobile Bottom Purchase Bar
- Fixed bottom bar on mobile screens (`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 px-4 py-3 flex items-center justify-between shadow-2xl`).
- Left side: Price preview (`text-xs text-zinc-500` + `text-lg font-bold text-emerald-700`).
- Right side: Direct "Pesan Sekarang" CTA button with smooth scroll to order form.

---

## 5. Order Form & Checkout Component (Visual Refinement)

### A. Styling & Color Alignment
- Preserving all functional form logic (`form-hybrid.ts`, `GeoIpResolvedForm.astro`, location autocomplete, price calculation).
- Visual Updates:
  - Form container card with hairline border (`border border-zinc-200/90 rounded-2xl shadow-sm bg-white p-5 lg:p-7`).
  - Inputs with subtle background (`bg-zinc-50/70 border border-zinc-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all`).
  - Package selection option cards with soft emerald highlight when selected (`border-2 border-emerald-600 bg-emerald-50/50`).
  - Summary card with clean dividers and high-contrast total price highlight (`bg-zinc-900 text-white rounded-xl p-5 shadow-md`).

---

## 6. Implementation Plan & Development Tasks

| Task ID | Component / Area | Objective |
|---|---|---|
| **T275** | Storefront Theme & Base Layout | Update `BaseLayout.astro`, `SiteHeader.astro`, `SiteFooter.astro` to Luxury Minimalist aesthetic with Onyx/Off-white design tokens. |
| **T276** | Storefront Templates (Wide & Compact) | Refactor `WideCatalogHome.astro` & `CompactMarketHome.astro` with luxury hero slider, category pills, product grid cards, and trust ribbon. |
| **T277** | Product Detail Page (PDP) | Overhaul `/produk/[slug].astro` layout, integrated `ProductImageSlider`, sticky mobile purchase bar, and luxury accordion specs. |
| **T278** | Order Form & Checkout Refinement | Apply minimalist visual color & container refinement to `GeoIpResolvedForm.astro` and form styles while preserving all underlying logic. |
| **T279** | Verification & Deployment | Run test suite (`npm test`), TypeScript compile (`npx tsc --noEmit`), Astro check (`npx astro check`), build & deploy live to `https://permatamall.shop/`. |
