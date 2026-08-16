import type { APIRoute } from "astro";
import { getStorefrontProducts } from "../../lib/catalog";
import { tenantConfig } from "../../lib/tenant";
import { generateGoogleCatalogXml } from "../../lib/catalog-feed";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const origin = tenantConfig.siteUrl.replace(/\/$/, "");
  const siteTitle = tenantConfig.name || "AdsBookCMS Merchant Store";
  const siteDescription = tenantConfig.description || tenantConfig.tagline || "Solusi Produk Berkualitas";

  try {
    const products = await getStorefrontProducts(locals);
    const xml = generateGoogleCatalogXml(products, origin, siteTitle, siteDescription);

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("google-catalog-xml-error", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title></channel></rss>`,
      {
        status: 500,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      },
    );
  }
};
