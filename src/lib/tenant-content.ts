import { getRuntimeEnv } from "./env";
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

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    title: "Pusat Solusi Praktis & Pilihan Produk Berkualitas",
    description:
      "Temukan produk pilihan sesuai kebutuhan Anda. Mulai dari nutrisi tanaman, perkakas dapur, rumah tangga, hingga produk kesehatan herbal dengan harga terbaik.",
    ratingLabel: "Kepuasan Pelanggan Terjamin",
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
    return {
      ...DEFAULT_HOME_CONTENT,
      solutions: combinedSolutions,
    };
  }

  const content = await loadPublishedHomeContent(database as D1Database);
  if (!content) {
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
