import { getAdTaxonomy } from "./ad-taxonomy.ts";

export type CatalogProductVariant = {
  id: number | string;
  label: string;
  price: number;
  comparePrice?: number;
  sku?: string;
};

export type CatalogProduct = {
  productId: number | string;
  catalogId?: number | string;
  slug: string;
  productName: string;
  category?: string;
  headline?: string;
  description?: string;
  seoDescription?: string;
  heroImage: string;
  variants: CatalogProductVariant[];
};

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function formatContentId(id: number | string): string {
  const value = String(id).trim();
  if (!/^[1-9]\d*$/.test(value)) {
    throw new Error("Catalog ID must be a positive persisted D1 row ID");
  }
  return value;
}

export function formatCatalogGroupId(productId: number | string): string {
  return formatContentId(productId);
}

export function formatCatalogItemId(
  productId: number | string,
  variantId: number | string,
): { itemId: string; itemGroupId: string } {
  return {
    itemId: formatContentId(variantId),
    itemGroupId: formatCatalogGroupId(productId),
  };
}

type VariantAttribute = {
  name: "color" | "size" | "material" | "pattern";
  value: string;
};

function getVariantAttribute(label: string): VariantAttribute | undefined {
  const match = label.trim().match(/^(warna|color|ukuran|size|bahan|material|motif|pattern)\s*[:\-]?\s*(.+)$/i);
  if (!match?.[2]) return undefined;

  const names: Record<string, VariantAttribute["name"]> = {
    warna: "color",
    color: "color",
    ukuran: "size",
    size: "size",
    bahan: "material",
    material: "material",
    motif: "pattern",
    pattern: "pattern",
  };
  return { name: names[match[1].toLowerCase()], value: match[2].trim() };
}

function getMultipack(label: string): number | undefined {
  const match = label.match(/\b(\d+)\s*(?:pcs?|buah)\b/i);
  const quantity = Number(match?.[1]);
  return Number.isInteger(quantity) && quantity > 1 ? quantity : undefined;
}

function formatVariantMetadata(
  productName: string,
  itemGroupId: string,
  attribute: VariantAttribute | undefined,
  grouped: boolean,
  multipack: number | undefined,
): string {
  let xml = "";
  if (grouped && attribute) {
    xml += `\n      <g:item_group_id>${escapeXml(itemGroupId)}</g:item_group_id>`;
    xml += `\n      <g:item_group_title>${escapeXml(productName)}</g:item_group_title>`;
    xml += `\n      <g:${attribute.name}>${escapeXml(attribute.value)}</g:${attribute.name}>`;
    xml += `\n      <g:variant_option>${escapeXml(`${attribute.name}:${attribute.value}`)}</g:variant_option>`;
  }
  if (multipack) {
    xml += `\n      <g:multipack>${multipack}</g:multipack>`;
  }
  return xml;
}

export function generateGoogleCatalogXml(
  products: CatalogProduct[],
  siteOrigin: string = "https://permatamall.shop",
  title?: string,
  description?: string,
): string {
  const origin = siteOrigin.replace(/\/$/, "");
  const siteTitle = title || "AdsBookCMS Merchant Store";
  const siteDescription = description || "Solusi Produk Berkualitas";

  let itemsXml = "";

  for (const product of products) {
    if (!product.variants || product.variants.length === 0) continue;

    const taxonomy = getAdTaxonomy(product.category, product.productName, product.description || product.headline);
    const productLink = `${origin}/produk/${product.slug}`;
    const imageLink = product.heroImage.startsWith("http") ? product.heroImage : `${origin}${product.heroImage}`;

    const variantAttributes = product.variants.map((variant) => getVariantAttribute(variant.label));
    const groupableVariantCount = variantAttributes.filter(Boolean).length;

    product.variants.forEach((variant, index) => {
      const { itemId, itemGroupId } = formatCatalogItemId(product.productId, variant.id);
      const variantLink = `${productLink}?variant_id=${encodeURIComponent(String(variant.id))}`;
      const titleText = product.variants.length > 1 ? `${product.productName} - ${variant.label}` : product.productName;
      const hasSale = typeof variant.comparePrice === "number" && variant.comparePrice > variant.price;
      const basePriceFormatted = `${hasSale ? variant.comparePrice : variant.price} IDR`;
      const salePriceXml = hasSale
        ? `\n      <g:sale_price>${escapeXml(`${variant.price} IDR`)}</g:sale_price>`
        : "";
      const baseDescription = product.seoDescription || product.description || product.headline || siteDescription;
      const itemDescription =
        product.variants.length > 1 ? `${baseDescription} Varian: ${variant.label}.` : baseDescription;
      const attribute = variantAttributes[index];
      const variantMetadataXml = formatVariantMetadata(
        product.productName,
        itemGroupId,
        attribute,
        groupableVariantCount > 1,
        getMultipack(variant.label),
      );

      itemsXml += `
    <item>
      <g:id>${escapeXml(itemId)}</g:id>${variantMetadataXml}
      <g:title>${escapeXml(titleText)}</g:title>
      <g:description>${escapeXml(itemDescription)}</g:description>
      <g:link>${escapeXml(variantLink)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${escapeXml(basePriceFormatted)}</g:price>${salePriceXml}
      <g:google_product_category>${taxonomy.googleCategoryId}</g:google_product_category>
      <g:product_type>${escapeXml(taxonomy.productType)}</g:product_type>
      <g:brand>${escapeXml(siteTitle)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
    });
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(siteTitle)} - Google Merchant Catalog</title>
    <link>${escapeXml(origin)}</link>
    <description>${escapeXml(siteDescription)}</description>${itemsXml}
  </channel>
</rss>`;
}

export function generateMetaCatalogXml(
  products: CatalogProduct[],
  siteOrigin: string = "https://permatamall.shop",
  title?: string,
  description?: string,
): string {
  const origin = siteOrigin.replace(/\/$/, "");
  const siteTitle = title || "AdsBookCMS Merchant Store";
  const siteDescription = description || "Solusi Produk Berkualitas";

  let itemsXml = "";

  for (const product of products) {
    if (!product.variants || product.variants.length === 0) continue;

    const taxonomy = getAdTaxonomy(product.category, product.productName, product.description || product.headline);
    const productLink = `${origin}/produk/${product.slug}`;
    const imageLink = product.heroImage.startsWith("http") ? product.heroImage : `${origin}${product.heroImage}`;

    const variantAttributes = product.variants.map((variant) => getVariantAttribute(variant.label));
    const groupableVariantCount = variantAttributes.filter(Boolean).length;

    product.variants.forEach((variant, index) => {
      const { itemId, itemGroupId } = formatCatalogItemId(product.productId, variant.id);
      const variantLink = `${productLink}?variant_id=${encodeURIComponent(String(variant.id))}`;
      const titleText = product.variants.length > 1 ? `${product.productName} - ${variant.label}` : product.productName;
      const hasSale = typeof variant.comparePrice === "number" && variant.comparePrice > variant.price;
      const basePriceFormatted = `${hasSale ? variant.comparePrice : variant.price} IDR`;
      const salePriceXml = hasSale
        ? `\n      <g:sale_price>${escapeXml(`${variant.price} IDR`)}</g:sale_price>`
        : "";
      const baseDescription = product.seoDescription || product.description || product.headline || siteDescription;
      const itemDescription =
        product.variants.length > 1 ? `${baseDescription} Varian: ${variant.label}.` : baseDescription;
      const attribute = variantAttributes[index];
      const variantMetadataXml = formatVariantMetadata(
        product.productName,
        itemGroupId,
        attribute,
        groupableVariantCount > 1,
        getMultipack(variant.label),
      );

      itemsXml += `
    <item>
      <g:id>${escapeXml(itemId)}</g:id>${variantMetadataXml}
      <g:title>${escapeXml(titleText)}</g:title>
      <g:description>${escapeXml(itemDescription)}</g:description>
      <g:link>${escapeXml(variantLink)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${escapeXml(basePriceFormatted)}</g:price>${salePriceXml}
      <g:fb_product_category>${escapeXml(taxonomy.metaCategoryName)}</g:fb_product_category>
      <g:google_product_category>${taxonomy.googleCategoryId}</g:google_product_category>
      <g:product_type>${escapeXml(taxonomy.productType)}</g:product_type>
      <g:brand>${escapeXml(siteTitle)}</g:brand>
      <g:condition>new</g:condition>
    </item>`;
    });
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(siteTitle)} - Meta Commerce Catalog</title>
    <link>${escapeXml(origin)}</link>
    <description>${escapeXml(siteDescription)}</description>${itemsXml}
  </channel>
</rss>`;
}
