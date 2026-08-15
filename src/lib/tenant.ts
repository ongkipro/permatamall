import { getEnvValue } from "./env";
import {
  isStorefrontTemplateId,
  isTenantContentPackId,
  type StorefrontTemplateId,
  type TenantContentPackId,
} from "./tenant-contract";

export interface PublicTenantConfig {
  slug: string;
  name: string;
  siteUrl: string;
  description: string;
  logo: string;
  tagline: string;
  themeColor: string;
  locale: string;
  openGraphLocale: string;
  defaultTitle: string;
  storefrontTemplate: StorefrontTemplateId;
  adminName: string;
}

const defaults = {
  slug: "permatamall",
  name: "Permata Mall",
  siteUrl: "https://permatamall.shop",
  description:
    "Pusat belanja produk pilihan berkualitas. Pengiriman cepat, transaksi aman, dan bayar di tempat (COD) ke seluruh Indonesia.",
  logo: "/images/logo.webp",
  tagline: "Pusat Belanja Online Pilihan",
  themeColor: "#0F172A",
  locale: "id-ID",
  contentPack: "runtime-managed",
  storefrontTemplate: "compact-market",
  adminName: "Permata Mall Ops",
} as const;

function configured(key: string, fallback: string): string {
  return getEnvValue(key) || fallback;
}

function storefrontTemplate(value: string): StorefrontTemplateId {
  if (isStorefrontTemplateId(value)) return value;
  throw new Error(`Unknown storefront template: ${value}`);
}

function siteOrigin(value: string): string {
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash
    ) {
      return url.origin;
    }
  } catch {
    // Fall back to the verified default origin.
  }
  return defaults.siteUrl;
}

function themeColor(value: string): string {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : defaults.themeColor;
}

function locale(value: string): string {
  return /^[a-z]{2}(?:-[A-Z]{2})?$/.test(value) ? value : defaults.locale;
}

const name = configured("PUBLIC_SITE_NAME", defaults.name);
const tagline = configured("PUBLIC_SITE_TAGLINE", defaults.tagline);
const resolvedLocale = locale(
  configured("PUBLIC_SITE_LOCALE", defaults.locale),
);

export const tenantConfig: Readonly<PublicTenantConfig> = Object.freeze({
  slug: defaults.slug,
  name,
  siteUrl: siteOrigin(configured("PUBLIC_SITE_URL", defaults.siteUrl)),
  description: configured("PUBLIC_SITE_DESCRIPTION", defaults.description),
  logo: configured("PUBLIC_SITE_LOGO", defaults.logo),
  tagline,
  themeColor: themeColor(
    configured("PUBLIC_SITE_THEME_COLOR", defaults.themeColor),
  ),
  locale: resolvedLocale,
  openGraphLocale: resolvedLocale.replace("-", "_"),
  defaultTitle: `${name} - ${tagline}`,
  storefrontTemplate: storefrontTemplate(
    configured("PUBLIC_STOREFRONT_TEMPLATE", defaults.storefrontTemplate),
  ),
  adminName: configured("PUBLIC_ADMIN_NAME", defaults.adminName),
});
