# Ground-Up Luxury Boutique Storefront Specification (Mobile-First 480px)

## 1. Executive Summary & Brand Identity
Complete ground-up redesign of the Permata Mall public storefront, engineered specifically as a **High-End Luxury Leather Goods & Premium Bag Boutique**.

### Key Aesthetic Requirements:
1. **Zero Rounded Clutter:** Eliminate `rounded-2xl` and `rounded-3xl` cards. Use sharp, precise, architectural lines (`rounded-none` or subtle `rounded-sm`) with 1px hairline borders (`#E5E5E5`).
2. **Boutique Color Palette:**
   - Canvas Base: `#F8F7F4` (Warm Alabaster Silk) & `#FFFFFF` (Pure Studio White)
   - Primary Ink: `#111111` (Deep Ebony Onyx) & `#555555` (Slate Neutral)
   - Accent & Status: `#C5A880` (Champagne Gold) & `#047857` (Deep Emerald Trust)
3. **Typography & Framing:**
   - Font Family: **Inter** with uppercase micro-tracking (`tracking-[0.15em]`, `font-semibold`).
   - Layout Shell: Strictly centered `max-w-[480px]` mobile-first container across viewports.

---

## 2. Page & Component Specification

### A. Simple Minimalist Header & Footer (`SiteHeader.astro`, `SiteFooter.astro`)
- **Header:** Non-sticky, ultra-clean header featuring crisp brand wordmark, micro announcement ticker (`#111111` background, `#C5A880` gold accent text), and 1px thin border divider.
- **Footer:** Ultra-simple minimalist footer with clean copyright, payment/shipping trust notes, and 1px top border.

### B. Single Product Page PDP Gallery (`ProductImageSlider.tsx` & `[slug].astro`)
- **Vertical Left Thumbnails Layout:** Miniature thumbnails (`width 64px` / `h-16`) rendered vertically on the **LEFT** side of the main active image frame.
- Main image positioned to the right of the vertical thumbnail strip.
- Sharp 1px border framing (`border-zinc-200`).

### C. Catalog List Page (`/produk/index.astro`)
- Strictly capped at **maximum 15 items** per view (`products.slice(0, 15)`).
- Clean, high-precision grid with luxury price typography.

### D. Homepage Rebuild (`CompactMarketHome.astro`, `HeroSection.astro`, `ProductsSection.astro`)
- **Hero Showcase:** High-precision headline typography, gold accent pills, and clean slide gallery.
- **Product Grid:** Frameless/sharp border grid items, 3:4 portrait image frame, bold Ebony price tag, strikethrough compare price, gold/emerald discount indicator.
- **Form Integration (`GeoIpResolvedForm.astro`):** Form logic, inputs, validation, and submission handlers REMAIN 100% INTACT AND UNTOUCHED.

---

## 3. Verification Contract
1. `npm test` MUST pass 100% (192/192 tests).
2. `npx tsc --noEmit` and `npx astro check` MUST pass with 0 errors.
3. 0 git push / 0 wrangler deploy (STRICTLY LOCAL).
