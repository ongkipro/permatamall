---
name: CMSAds Compact Market Storefront Tokens
description: Legacy Petani Sejahtera compact-market token profile; not a universal tenant brand
scope: compact-market
colors:
  primary: "#064E3B"          # Deep Emerald 900
  primary-accent: "#047857"   # Emerald 700
  primary-subtle: "#ECFDF5"   # Emerald 50
  ink-heading: "#0F172A"      # Slate 900
  ink-body: "#475569"         # Slate 600
  ink-muted: "#94A3B8"        # Slate 400
  canvas: "#FFFFFF"
  surface-subtle: "#F8FAFC"   # Slate 50
  border-hairline: "#F1F5F9"  # Slate 100
  border-subtle: "#E2E8F0"    # Slate 200
  status-success: "#059669"   # Operational success only
  badge-contrast: "#0F172A"   # Evidence-backed labels only
typography:
  display: "Plus Jakarta Sans, font-extrabold, tracking-tight"
  body: "Inter / Plus Jakarta Sans, font-medium, leading-relaxed"
spacing:
  compact-container-max: "max-w-[480px]"
  section-py: "py-7 (28px)"
  item-gap: "gap-3.5 (14px)"
radius:
  sm: "rounded-md (6px)"
  md: "rounded-xl (12px)"
  lg: "rounded-2xl (16px)"
  pill: "rounded-full (9999px)"
shadows:
  subtle: "shadow-2xs"
  hover: "shadow-md"
---

## Scope

These tokens preserve the legacy `compact-market` Petani Sejahtera presentation. They do not override a tenant's `PUBLIC_SITE_THEME_COLOR`, the responsive `wide-catalog` shell, the canonical admin design system, or operational status semantics.

## Design Rules

1. **Coordinated palette**
   - Use Deep Emerald (`#064E3B`, `#047857`) with Slate neutrals.
   - Avoid unrelated rainbow pills and decorative status colors.
2. **Evidence-backed labels**
   - A comparison discount may render only when the D1 variant supplies `compare_price > price`.
   - Ratings, reviews, sales counts, bestseller labels, guarantees, originality claims, and merchant-verification badges require explicit evidence-backed data.
   - Missing evidence renders no badge; visual consistency is not permission to invent proof.
3. **Header boundary**
   - The compact announcement bar may use the tenant's coordinated dark brand tone.
   - The non-sticky header uses the selected tenant's logo, name, and canonical links.
   - Tenant identity never changes checkout validation, tracking identity, order lifecycle, or admin colors.
4. **Template boundary**
   - `compact-container-max` applies only to the compact-market storefront and checkout shell.
   - `wide-catalog` uses its own responsive container and shared storefront contract from `STOREFRONT_DESIGN_SYSTEM.md`.
