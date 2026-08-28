# Native Direct-Response (DR) Landing Page Standard & Pattern

> Verified against disk: 2026-08-28 @ `e2440a2`

This document defines the production standard and canonical component pattern for native Astro direct-response (DR) product landing pages within AdsBookCMS / Permata Mall. `docs/LANDING-PAGES.md` remains the authoritative guide for routing, registry, product-page takeover, and canonical-URL contracts.

---

## 1. Scope & Core Principles

A native landing page sells one active D1 product with high-converting direct-response layout and copy. It lives at `src/pages/<slug>.astro`, registers in `src/data/native-landing-pages.ts`, and executes client-side interactions with vanilla JavaScript (no React hydration overhead).

### Core Architectural Invariants:
1. **Local-First & Production-Ready**: Validates with `npm test && npm run check && npm run build` and runs natively on Cloudflare Workers edge.
2. **Mobile-First Width**: Max width `480px` (`max-w-[480px] mx-auto bg-white`), with zero horizontal overflow across 320px–480px devices.
3. **Pure Astro Lucide Icons (Zero Unicode Emojis)**: 100% of icons use `<Icon name="..." />` from `src/components/storefront/shared/Icon.astro`. All unicode emojis/emoticons (🔥, 🚚, 🔒, ⭐, 👉, 💬, ⚠️, ❌, ✅, etc.) are strictly avoided to eliminate AI-slop visual artifacts.
4. **Clean Flat Design**: Clean white `#FFFFFF` and neutral `slate-50` background, thin borders (`border border-slate-200`), minimal rounded corners (`rounded` / `rounded-md`), and zero heavy card-in-card nesting or gratuitous glowing gradients.
5. **Punchy Direct-Response Copy**: Natural, persuasive, point-to-point adult copy focusing on instant results, stamina/durasi, safety certifications (BPOM), and Cash on Delivery (COD).

---

## 2. Canonical Funnel Section Sequence

Every high-converting DR landing page follows this optimized sequence:

```
┌─────────────────────────────────────────────────────────┐
│ 1. Urgency Top Strip (Promo 50% | Bisa Bayar di Tempat) │
├─────────────────────────────────────────────────────────┤
│ 2. Hero Section (Center Hook + Full-Width Hero Image)  │
│    - Center Badges (BPOM & 100% Herbal)                 │
│    - Centered Headline (Punchy, High-Converting)       │
│    - Short Centered Subheadline                         │
│    - Edge-to-Edge Hero Image (16:9 aspect-ratio)        │
│    - Point-to-Point Benefits (Lucide Check Icons)       │
│    - 3-Column Trust Bar (Bisa COD, Privasi, BPOM)       │
│    - (No early CTA button — uninterrupted narrative)    │
├─────────────────────────────────────────────────────────┤
│ 3. Problem & Warning Section (Point-to-Point)           │
│    - Triangle-alert warning cards                       │
├─────────────────────────────────────────────────────────┤
│ 4. Solution & Ingredients (Point-to-Point + Banners)    │
│    - Active herbal extracts & health benefits           │
│    - Full-width compact visual banners                  │
├─────────────────────────────────────────────────────────┤
│ 5. Real Comparison: Sebelum vs Sesudah (Flat Pattern)   │
│    - Full-width infographic comparison banner           │
│    - Flat 2-Column Grid with text highlights & underline│
├─────────────────────────────────────────────────────────┤
│ 6. 100% Real Picture Unboxing Gallery                   │
│    - 2x2 Grid (Box, Sachet, Seal, Batch Number)         │
│    - Official BPOM & Manufacturer Verification Badge    │
├─────────────────────────────────────────────────────────┤
│ 7. Real WhatsApp Chat Proof (5-Second Auto-Slider)      │
│    - Swipeable track with dynamic progress bar          │
│    - Prev/Next arrows + synchronized dot indicators     │
├─────────────────────────────────────────────────────────┤
│ 8. Verified Customer Testimonials (Accurate Photos)     │
│    - Natural smartphone review photos holding product   │
│    - 5-Star Filled Golden Ratings (<svg> filled stars)  │
│    - Verified Buyer Badges                              │
├─────────────────────────────────────────────────────────┤
│ 9. Privacy & Safe Shopping Guarantee                    │
│    - 100% Plain packaging, Cash on Delivery, Original   │
├─────────────────────────────────────────────────────────┤
│ 10. Full-Width Flat Offering & Urgency Strip            │
│     - 15-Minute Countdown Timer (MM : SS)               │
│     - Flat Price Hierarchy (Strike-through -> Promo)    │
│     - Upsell Discount Hook (Beli 2 Box Lebih Hemat)     │
│     - Live Discount Quota / Stock Urgency Progress Line │
├─────────────────────────────────────────────────────────┤
│ 11. Canonical Checkout Form (Product-Page Locked)       │
│     - Locked section: <section id="form-pemesanan">     │
│     - Standard product page padding: p-2 (8px)          │
│     - GeoIpResolvedForm (Hybrid/Full COD form)          │
├─────────────────────────────────────────────────────────┤
│ 12. Floating Sticky Purchase Bar                        │
│     - Promo price + Pesan Sekarang CTA                  │
│     - Auto-hides over Hero and Form via Observer        │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Implementation Patterns

### A. Flat Visual Text Pattern (Sebelum vs Sesudah)
Uses high-contrast typographic styling, marker-like background highlights, and bold underline accents without heavy cards:
```html
<!-- SEBELUM: Flat Red Tint -->
<div class="rounded border border-red-200 bg-white p-2.5 text-left">
  <span class="inline-block bg-red-100 text-red-900 text-[10.5px] font-black px-1.5 py-0.5 rounded uppercase">SEBELUM</span>
  <ul class="space-y-2 text-[12px] text-slate-700 mt-2">
    <li><strong class="bg-red-50 text-red-950 px-1 rounded-sm">Baru 2–3 menit</strong> cepat keluar</li>
    <li><strong class="bg-red-50 text-red-950 px-1 rounded-sm">Senjata lembek</strong> &amp; mudah kendor</li>
  </ul>
</div>

<!-- SESUDAH: Flat Emerald Accent -->
<div class="rounded border border-emerald-300 bg-emerald-50/70 p-2.5 text-left">
  <span class="inline-block bg-emerald-600 text-white text-[10.5px] font-black px-1.5 py-0.5 rounded uppercase">SESUDAH</span>
  <ul class="space-y-2 text-[12px] text-slate-900 mt-2">
    <li><strong class="bg-emerald-200/80 text-emerald-950 font-black px-1 rounded-sm">Durasi 30–45 menit</strong> <span class="font-extrabold text-emerald-900 underline decoration-emerald-500 decoration-2 underline-offset-2">full power</span></li>
    <li><strong class="bg-emerald-200/80 text-emerald-950 font-black px-1 rounded-sm">Ereksi keras maksimal</strong> &amp; kokoh</li>
    <li><strong class="bg-amber-200 text-slate-950 font-black px-1 rounded-sm">Istri puas, tersenyum</strong> <span class="font-black text-emerald-900 underline decoration-amber-400 decoration-2 underline-offset-2">&amp; nempel</span></li>
  </ul>
</div>
```

### B. Accurate Customer Review Photos & Fill Star Ratings
When generating customer testimonial photos:
1. Always analyze real factory reference photos (box shape, sachet shape, logo, color stripes, product text).
2. Pass real photo paths via `ImagePaths` in `generate_image` so the AI reproduces the exact packaging.
3. Prompt for authentic Indonesian everyday users (home/casual environment, smartphone camera lighting, candid thumbs-up), not studio fashion models.
4. Render 5-star filled golden rating icons using SVG:
```html
<div class="flex items-center gap-0.5 text-amber-400" aria-label="Rating 5 dari 5 bintang">
  <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
  <!-- repeat 5x for filled golden stars -->
</div>
```

### C. Full-Width Flat Offering Strip (Countdown + Price + Stock)
Zero card-in-card nesting, spanning edge-to-edge with balanced vertical breathing room (`py-4 px-4`):
```html
<section class="bg-white pt-0 pb-0">
  <div class="w-full border-y border-red-300 bg-red-50/90 px-4 py-4 text-center">
    <!-- 15-Minute Countdown -->
    <div class="flex items-center justify-between border-b border-red-200 pb-2.5 mb-1">
      <div class="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-red-900">
        <Icon name="clock" class="h-3.5 w-3.5 text-red-600 shrink-0" />
        <span>Promo Berakhir Dalam:</span>
      </div>
      <div class="flex items-center gap-1 font-mono font-black text-[13px] text-white">
        <span id="countdown-minutes" class="bg-red-700 px-1.5 py-0.5 rounded-xs min-w-[24px]">14</span>
        <span class="text-red-700 font-bold">:</span>
        <span id="countdown-seconds" class="bg-red-700 px-1.5 py-0.5 rounded-xs min-w-[24px]">59</span>
      </div>
    </div>

    <!-- Price Hierarchy -->
    <div class="py-3">
      <div class="inline-block bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs mb-1.5">DISKON 50% HARI INI</div>
      <div class="flex items-baseline justify-center gap-2">
        <span class="text-[13.5px] font-semibold text-slate-400 line-through">Rp199.000</span>
        <span class="text-[28px] font-black text-red-700 leading-none tracking-tight">Rp98.500</span>
      </div>
      <p class="mt-2 text-[11.5px] font-extrabold text-amber-950">
        <span class="bg-amber-200/90 px-2 py-0.5 rounded-xs">Beli 2 Box Lebih Hemat Hanya Rp 148.500!</span>
      </p>
    </div>

    <!-- Stock Urgency -->
    <div class="border-t border-red-200 pt-2.5 mt-1">
      <div class="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1.5">
        <span class="flex items-center gap-1 text-red-800">
          <span class="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
          <span>Sisa Kuota Diskon Hari Ini:</span>
        </span>
        <span class="font-extrabold text-red-800 font-mono">Tersisa 7 Box Lagi</span>
      </div>
      <div class="w-full bg-red-200/70 h-1.5 rounded-full overflow-hidden">
        <div class="bg-red-600 h-full rounded-full w-[82%]"></div>
      </div>
    </div>
  </div>
</section>
```

### D. Canonical Form Container Lock (Default Product Page Pattern)
The order form container is locked as its own dedicated section with canonical padding `p-2` (8px), matching `/produk/[slug].astro`:
```html
<section id="form-pemesanan" class="mt-2 scroll-mt-6 overflow-hidden rounded-none bg-white p-2">
  <div class="px-2 pt-4 pb-2 text-center">
    <div class="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide text-red-700 mb-1">
      <Icon name="package" class="h-3.5 w-3.5" />
      <span>Formulir Pemesanan Resmi</span>
    </div>
    <h2 class="text-[20px] font-black tracking-tight text-slate-950">Lengkapi Data Pengiriman</h2>
    <p class="text-[12px] text-slate-600 mt-1 max-w-[360px] mx-auto leading-relaxed">Pilih paket promo di bawah dan isi alamat tujuan. Bayar saat barang tiba di rumah (COD).</p>
  </div>

  <GeoIpResolvedForm
    mode={formContext.mode}
    province={formContext.province}
    productSlug={product.slug}
    embedded={true}
  />
</section>
```

---

## 4. Performance & Core Web Vitals Checklist

1. **LCP $\le$ 1.2s**:
   - Hero banner image preloaded in `<head>` via `preloadImages` prop in `BaseLayout`.
   - `fetchpriority="high"`, `loading="eager"`, `decoding="async"`.
2. **CLS = 0**:
   - All `<img>` tags declare exact `width` and `height` attributes and aspect-ratio styling.
3. **INP & FID $\le$ 50ms**:
   - All scripts (`initStickyBarObserver`, `initWaProofSlider`, `initCountdownTimer`) execute vanilla JS without third-party runtime weight.
4. **Asset Compression**:
   - All images converted to WebP format, uploaded to Cloudflare R2 bucket with `cache-control: public, max-age=31536000, immutable`.
5. **Client-Side Social Proof**:
   - Shuffled client-side array, deferred 2s after page load, automatically hidden while viewport intersects `#landing-hero` or `#form-pemesanan`.
