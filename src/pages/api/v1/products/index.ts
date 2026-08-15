import type { APIRoute } from 'astro';
import { handleOptions, headlessError, headlessOk, validateHeadlessRequest } from '../../../../lib/headless-api';
import { getStorefrontProducts } from '../../../../lib/catalog';

export const prerender = false;

const PUBLIC_CACHE_CONTROL =
  'public, max-age=60, s-maxage=300, stale-while-revalidate=600';

export const OPTIONS = handleOptions;

export const GET: APIRoute = async ({ request, locals }) => {
  const validation = await validateHeadlessRequest(request, locals);
  if (!validation.allowed && validation.errorResponse) {
    return validation.errorResponse;
  }

  try {
    const url = new URL(request.url);
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10));
    const search = (url.searchParams.get('q') || url.searchParams.get('search') || '').trim().toLowerCase();
    const category = (url.searchParams.get('category') || '').trim().toLowerCase();

    let products = await getStorefrontProducts(locals);

    if (category) {
      products = products.filter((p) => p.category.toLowerCase().includes(category));
    }

    if (search) {
      products = products.filter(
        (p) =>
          p.productName.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
      );
    }

    const total = products.length;
    const paginated = products.slice(offset, offset + limit);

    return headlessOk(
      {
        total,
        limit,
        offset,
        has_more: offset + limit < total,
        products: paginated.map((product) => ({
          id: product.catalogId,
          content_id: product.productId,
          slug: product.slug,
          name: product.productName,
          category: product.category,
          headline: product.headline,
          subheadline: product.subheadline,
          price: product.price,
          compare_price: product.comparePrice,
          image: product.image,
          hero_image: product.heroImage,
          rating_value: product.ratingValue,
          review_count: product.reviewCount,
          sold_count: product.soldCount,
          variants: product.variants.map((v) => ({
            id: v.catalogId,
            content_id: v.id,
            label: v.label,
            price: v.price,
            compare_price: v.comparePrice ?? v.price,
          })),
          urls: {
            product: `/produk/${product.slug}`,
            checkout_hybrid: `/api/v1/checkout?product_id=${product.catalogId}`,
            form_render: `/form-hybrid?product_id=${product.catalogId}`,
          },
        })),
      },
      200,
      {
        ...validation.corsHeaders,
        'cache-control': PUBLIC_CACHE_CONTROL,
      }
    );
  } catch (error) {
    return headlessError('Gagal memuat katalog produk.', 500, {
      code: 'PRODUCTS_LOAD_ERROR',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
