export type SolutionEntry = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  href?: string;
  category: string;
  isAvailable?: boolean;
  statusLabel?: string;
};

export type TestimonialEntry = {
  name: string;
  location: string;
  story: string;
  image: string;
  crop: string;
};

export const solutionEntries: SolutionEntry[] = [];

export const testimonialEntries: TestimonialEntry[] = [];

export const aboutProfile = {
  title: "Tentang Permata Mall",
  intro:
    "Permata Mall adalah toko online terpercaya yang menyediakan berbagai produk berkualitas dengan sistem pembayaran Bayar di Tempat (COD).",
  story: [
    "Kami menghadirkan berbagai produk berkualitas tinggi untuk mempermudah kehidupan Anda sehari-hari.",
  ],
  highlights: [
    "100% Garansi Produk Original",
    "Layanan Bayar di Tempat (COD) Ke Seluruh Indonesia",
    "Pengiriman Cepat & Pengemasan Aman",
  ],
};
