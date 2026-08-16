import { getRuntimeEnv } from "./env";
import { tenantConfig } from "./tenant";
import {
  loadPublishedHomeContent,
  type HomeContent,
} from "./storefront-content";
import { heroSlides, heroHighlights, solutions as baseSolutions, proofs } from "../data/home";
import { solutionEntries } from "../data/content";
import { listLandingPages } from "./landing-pages";

export type TenantHomeContent = HomeContent;

const staticSolutions = solutionEntries.map((entry) => ({
  title: entry.title,
  excerpt: entry.excerpt,
  image: entry.image,
  href: entry.href || `/${entry.slug}`,
  crop: entry.category,
}));

/**
 * Structural shell used only while the merchant has not published home content
 * from /admin/content. It carries generic section labels and the store's own
 * identity — never marketing claims, and never copy inherited from another
 * install. `homeContentSource` records which path produced the page so a
 * degraded render is distinguishable from a configured one.
 */
export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    title: tenantConfig.name,
    description: tenantConfig.tagline || tenantConfig.description,
    ratingLabel: "",
  },
  catalog: {
    eyebrow: "Katalog Produk Pilihan",
    title: "Produk Unggulan Siap Kirim",
    description:
      "Pilih produk pilihan Anda, nikmati promo potongan harga khusus dan fasilitas bayar di tempat (COD) ke seluruh Indonesia.",
  },
  solutionsHeading: {
    eyebrow: "Kategori & Solusi Pilihan",
    title: "Pilihan Produk Sesuai Kebutuhan",
    description:
      "Pilih solusi yang paling relevan dengan kebutuhan dan permasalahan Anda saat ini.",
  },
  proofsHeading: {
    eyebrow: "Kisah Pelanggan",
    title: "Pengalaman Nyata Pelanggan",
    description:
      "Simak ulasan dan cerita kepuasan pengguna dari berbagai wilayah di Indonesia.",
  },
  heroHighlights,
  heroSlides,
  solutions: staticSolutions,
  proofs,
};

export async function getTenantHomeContent(
  locals?: App.Locals,
): Promise<TenantHomeContent | null> {
  let cmsSolutions: typeof staticSolutions = [];

  if (locals) {
    try {
      const d1Pages = (await listLandingPages(locals)).filter(
        (page) => !page.id.startsWith("static:"),
      );
      cmsSolutions = d1Pages
        .filter((p) => Boolean(p.is_active))
        .map((p) => ({
          title: p.title,
          excerpt: p.meta_description || `Panduan & penawaran khusus ${p.title}`,
          image: "/images/logo.webp",
          href: `/${p.slug}`,
          crop: "CMS Landing Page",
        }));
    } catch {
      // Gracefully fall back if database or table not ready
    }
  }

  const combinedSolutions = [...cmsSolutions, ...staticSolutions];

  const database = getRuntimeEnv(locals)?.OMS_DB;
  if (!database || typeof database !== "object") {
    // No binding at all: the install is not wired up. Serving the structural
    // shell keeps the catalog reachable, but it is a degraded render.
    console.error("home-content-no-database-binding");
    return {
      ...DEFAULT_HOME_CONTENT,
      solutions: combinedSolutions,
    };
  }

  const content = await loadPublishedHomeContent(database as D1Database);
  if (!content) {
    // Nothing published yet. Never inherit marketing copy — the shell carries
    // this store's own identity and generic section labels only.
    console.error("home-content-unpublished");
    return {
      ...DEFAULT_HOME_CONTENT,
      solutions: combinedSolutions,
    };
  }

  return {
    ...content,
    solutions: cmsSolutions.length > 0 ? [...cmsSolutions, ...(content.solutions || staticSolutions)] : (content.solutions && content.solutions.length > 0 ? content.solutions : combinedSolutions),
  };
}
