/**
 * The register of native Astro landing pages.
 *
 * A native landing page is a real route file — `src/pages/<slug>.astro` — built
 * and deployed with the Worker. Adding an entry here is what makes the CMS
 * aware of it: the admin can see it, copy its link, and hand it a product page.
 * Without an entry the route still answers on its URL, but the operator has no
 * way to know it exists.
 *
 * **This is a manifest, not discovery.** Cloudflare Workers bundles routes and
 * cannot enumerate `src/pages/` at runtime, so the list is written down and
 * compiled in. `validateNativeLandingPages` fails the build on a duplicate or
 * an incomplete entry rather than shipping a register that misrepresents the
 * site.
 *
 * To add one:
 *   1. create `src/pages/<slug>.astro` (see `docs/LANDING-PAGES.md`);
 *   2. add its entry below, with `slug` matching the filename exactly;
 *   3. deploy. The CMS picks it up on the next landing-page list load.
 *
 * To remove one: delete both. Removing only the file leaves a register entry
 * pointing at a 404; removing only the entry leaves an unlisted live URL.
 */
export type NativeLandingPage = {
  /** Must equal the route filename, and is the public path: `/<slug>`. */
  slug: string;
  /** Shown in the CMS list. */
  title: string;
  /** The product this page sells, by product slug. */
  productSlug: string;
  /** Shown in the CMS list beneath the title. */
  description: string;
  /** A page can be registered before it is ready to be linked. */
  isActive?: boolean;
};

export const nativeLandingPages: NativeLandingPage[] = [
  {
    slug: 'ken-total',
    title: 'Ken+total Minuman Serbuk Khusus Pria Dewasa',
    productSlug: 'ken-total-minuman-serbuk-khusus-pria-dewasa',
    description: 'Landing page konversi untuk kampanye Ken+total Minuman Serbuk Stamina & Vitalitas Pria Dewasa.',
    isActive: true,
  },
  {
    slug: 'carukesi-nyeri-sendi-lutut',
    title: 'Carukési Relaxing Gel — Solusi Nyeri Sendi Lutut & Sholat Lancar',
    productSlug: 'soothing-gristle-gel-cream-perawatan-cream-pijat-otot-sendi',
    description: 'Landing page konversi untuk Carukési Relaxing Gel angle Nyeri Sendi Lutut, kaku ditekuk saat sholat & gemetar naik tangga.',
    isActive: true,
  },
  {
    slug: 'carukesi-sakit-pinggang-boyok',
    title: 'Carukési Relaxing Gel — Solusi Sakit Pinggang, Boyok & Saraf Kejepit',
    productSlug: 'soothing-gristle-gel-cream-perawatan-cream-pijat-otot-sendi',
    description: 'Landing page konversi untuk Carukési Relaxing Gel angle Sakit Pinggang, Boyok Mau Patah & Saraf Kejepit Lumbar.',
    isActive: true,
  },
  {
    slug: 'carukesi-asam-urat-bengkak',
    title: 'Carukési Relaxing Gel — Solusi Asam Urat Kumat & Sendi Bengkak',
    productSlug: 'soothing-gristle-gel-cream-perawatan-cream-pijat-otot-sendi',
    description: 'Landing page konversi untuk Carukési Relaxing Gel angle Asam Urat Kumat, Sendi Menusuk & Jempol Kaki Bengkak Cenat-Cenut.',
    isActive: true,
  },
  {
    slug: 'carukesi-leher-kaku-pundak',
    title: 'Carukési Relaxing Gel — Solusi Leher Kaku, Pundak Tegang & Pegal Kerja',
    productSlug: 'soothing-gristle-gel-cream-perawatan-cream-pijat-otot-sendi',
    description: 'Landing page konversi untuk Carukési Relaxing Gel angle Leher Kaku (Tech Neck), Pundak Tegang & Capek Kerja di Depan Layar.',
    isActive: true,
  },
  {
    slug: 'carukesi-kebas-kesemutan',
    title: 'Carukési Relaxing Gel — Solusi Rematik, Kebas & Kesemutan Menahun',
    productSlug: 'soothing-gristle-gel-cream-perawatan-cream-pijat-otot-sendi',
    description: 'Landing page konversi untuk Carukési Relaxing Gel angle Rematik, Tangan & Kaki Kebas, Kesemutan Dingin Angin Malam & Jari Kaku.',
    isActive: true,
  },
  {
    slug: 'carukesi-lansia-gendong-cucu',
    title: 'Carukési Relaxing Gel — Solusi Sendi Lansia Bebas Jalan & Gendong Cucu',
    productSlug: 'soothing-gristle-gel-cream-perawatan-cream-pijat-otot-sendi',
    description: 'Landing page konversi untuk Carukési Relaxing Gel angle Lansia Aktif Bebas Jalan, Bahagia Gendong Cucu & Hadiah Berbakti.',
    isActive: true,
  },
  {
    slug: 'carukesi-pekerja-keras-badan-remuk',
    title: 'Carukési Relaxing Gel — Solusi Badan Remuk & Pegal Kuli Pekerja Keras',
    productSlug: 'soothing-gristle-gel-cream-perawatan-cream-pijat-otot-sendi',
    description: 'Landing page konversi untuk Carukési Relaxing Gel angle Pekerja Keras Lapangan, Buruh Pabrik, Kuli Logistik & Mekanik Bengkel.',
    isActive: true,
  },
  {
    slug: 'carukesi-olahraga-keseleo-engkel',
    title: 'Carukési Relaxing Gel — Solusi Cedera Olahraga, Keseleo & Kram Otot',
    productSlug: 'soothing-gristle-gel-cream-perawatan-cream-pijat-otot-sendi',
    description: 'Landing page konversi untuk Carukési Relaxing Gel angle Cedera Olahraga, Keseleo Engkel, Hamstring Ketarik & Pegal Futsal/Gowes.',
    isActive: true,
  },
  {
    slug: 'carukesi-ibu-rumah-tangga-pegal',
    title: 'Carukési Relaxing Gel — Solusi Tumit Menusuk & Betis Pegal Ibu Rumah Tangga',
    productSlug: 'soothing-gristle-gel-cream-perawatan-cream-pijat-otot-sendi',
    description: 'Landing page konversi untuk Carukési Relaxing Gel angle Nyeri Tumit Menusuk Bangun Tidur, Betis Pegal Seharian di Dapur & Boyok Ngepel.',
    isActive: true,
  },
  {
    slug: 'carukesi-tidur-nyenyak-bebas-ngilu',
    title: 'Carukési Relaxing Gel — Solusi Nyeri Sendi Tengah Malam & Tidur Pulas',
    productSlug: 'soothing-gristle-gel-cream-perawatan-cream-pijat-otot-sendi',
    description: 'Landing page konversi untuk Carukési Relaxing Gel angle Nyeri Sendi Nyut-Nyutan Tengah Malam, Insomnia Nyeri & Tidur Pulas.',
    isActive: true,
  },
  {
    slug: 'carukesi-momen-intim-pasangan',
    title: 'Carukési Relaxing Gel — Relaksasi Pinggang, Paha & Lutut Momen Pasangan',
    productSlug: 'soothing-gristle-gel-cream-perawatan-cream-pijat-otot-sendi',
    description: 'Landing page konversi untuk Carukési Relaxing Gel angle Momen Intim Pasangan, relaksasi pinggang cepat lelah, paha tegang & lutut kaku setelah aktivitas.',
    isActive: true,
  },
];
