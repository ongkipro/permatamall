export interface CarukesiTestimonial {
  id: string;
  name: string;
  age: number;
  city: string;
  occupation: string;
  avatar: string;
  rating: number;
  highlight: string;
  quote: string;
  proofImage: string;
  proofAlt: string;
  tags: string[];
}

export const CARUKESI_MASTER_TESTIMONIALS: CarukesiTestimonial[] = [
  {
    id: "harun",
    name: "Bapak Harun",
    age: 63,
    city: "Solo, Jawa Tengah",
    occupation: "Pensiunan PNS",
    avatar: "/images/landing/carukesi-testimonials/avatar-01-harun.webp",
    rating: 5,
    highlight: "sekarang lutut kokoh banget bisa gendong cucu sambil jalan keliling halaman rumah.",
    quote: "Dulu cucu minta digendong saya selalu sedih nolak karena lutut goyang dan bunyi kletuk-kletuk. Setelah rutin oles Carukesi pagi dan sore, sekarang lutut kokoh banget bisa gendong cucu sambil jalan keliling halaman rumah. Bahagia sekali rasanya.",
    proofImage: "/images/landing/carukesi-testimonials/testi-proof-01-lutut-harun.webp",
    proofAlt: "Bapak Harun Bahagia Bersantai dan Bermain Bersama Cucu Tanpa Lutut Kaku",
    tags: ["lutut", "lansia", "cucu", "sholat", "sendi"]
  },
  {
    id: "yanto",
    name: "Supriadi / Pak Yanto",
    age: 42,
    city: "Bekasi, Jawa Barat",
    occupation: "Mekanik Motor",
    avatar: "/images/landing/carukesi-testimonials/avatar-02-yanto.webp",
    rating: 5,
    highlight: "dioles sedikit langsung panas nyaman otot-otot langsung lemas kembali.",
    quote: "Bongkar pasang mesin seharian di bengkel bikin pundak dan boyok kaku terkunci. Keunggulan gel ini gak lengket di tangan dan gak bikin berminyak, dioles sedikit langsung panas nyaman otot-otot langsung lemas kembali. Teman-teman bengkel ikut beli semua.",
    proofImage: "/images/landing/carukesi-testimonials/testi-proof-02-pinggang-yanto.webp",
    proofAlt: "Pak Yanto Mengoleskan Gel Pereda Kaku Leher dan Pundak di Bengkel",
    tags: ["pinggang", "boyok", "pekerja", "leher", "pundak"]
  },
  {
    id: "mulyono",
    name: "H. Mulyono",
    age: 58,
    city: "Sukoharjo, Jawa Tengah",
    occupation: "Pedagang Pasar",
    avatar: "/images/landing/carukesi-testimonials/avatar-03-mulyono.webp",
    rating: 5,
    highlight: "3 hari rutin bengkak kempes total dan bisa jalan normal lagi.",
    quote: "Jempol kaki kanan sering bengkak merah meradang kalau makan emping atau jeroan, buat napak lantai saja sampai meringis. Begitu dioles Carukesi sensasi dingin-hangatnya langsung redakan denyutan, 3 hari rutin bengkak kempes total dan bisa jalan normal lagi.",
    proofImage: "/images/landing/carukesi-testimonials/testi-proof-03-asam-urat-mulyono.webp",
    proofAlt: "H. Mulyono Mengoleskan Gel pada Sendi Kaki dan Pergelangan",
    tags: ["asam-urat", "bengkak", "kaki", "jempol", "sendi"]
  },
  {
    id: "dimas",
    name: "Dimas Prasetyo",
    age: 32,
    city: "Jakarta Selatan",
    occupation: "UI/UX Designer",
    avatar: "/images/landing/carukesi-testimonials/avatar-04-dimas.webp",
    rating: 5,
    highlight: "dalam 5 menit leher langsung enteng bisa nengok bebas tanpa rasa tertarik.",
    quote: "Kerja 10 jam di depan laptop bikin leher kaku kayak kayu dan pundak tegang sampai migrain. Oles Carukesi di tengkuk leher, aroma mintnya bikin sejuk dan dalam 5 menit leher langsung enteng bisa nengok bebas tanpa rasa tertarik.",
    proofImage: "/images/landing/carukesi-testimonials/testi-proof-04-leher-dimas.webp",
    proofAlt: "Dimas Memijat Tengkuk Leher Menggunakan Gel di Meja Kerja",
    tags: ["leher", "pundak", "kantor", "gadget", "pekerja"]
  },
  {
    id: "nurhasanah",
    name: "Ibu Nurhasanah",
    age: 52,
    city: "Cirebon, Jawa Barat",
    occupation: "Pengrajin Batik & Wiraswasta",
    avatar: "/images/landing/carukesi-testimonials/avatar-05-nurhasanah.webp",
    rating: 5,
    highlight: "aliran darah terasa lancar hangat dan bangun pagi jari-jari lentur bertenaga lagi.",
    quote: "Tangan sering kebas kesemutan mati rasa kalau pegang canting atau masak lama, telapak kaki juga sering baal tebal. Rutin oles Carukesi malam sebelum tidur, aliran darah terasa lancar hangat dan bangun pagi jari-jari lentur bertenaga lagi.",
    proofImage: "/images/landing/carukesi-testimonials/testi-proof-05-kebas-nurhasanah.webp",
    proofAlt: "Ibu Nurhasanah Memijat Jari-Jari Tangan Bebas Kebas dan Kesemutan",
    tags: ["kebas", "kesemutan", "tangan", "jari", "saraf"]
  },
  {
    id: "reza",
    name: "Reza Aditya",
    age: 26,
    city: "Tangerang, Banten",
    occupation: "Pemain Futsal Amatir",
    avatar: "/images/landing/carukesi-testimonials/avatar-06-reza.webp",
    rating: 5,
    highlight: "besok paginya bengkak kempes drastis dan ngilunya hilang total.",
    quote: "Kemarin salah tumpuan saat duel bola di futsal, engkel langsung bengkak dan jalan pincang. Kompres es lalu oles Carukesi ini, besok paginya bengkak kempes drastis dan ngilunya hilang total. Bener-bener wajib selalu ada di tas olahraga!",
    proofImage: "/images/landing/carukesi-testimonials/testi-proof-06-engkel-reza.webp",
    proofAlt: "Reza Mengoleskan Gel pada Engkel Keseleo di Bangku Lapangan",
    tags: ["olahraga", "engkel", "keseleo", "cedera", "otot"]
  },
  {
    id: "siti",
    name: "Ibu Siti Fatimah",
    age: 42,
    city: "Semarang, Jawa Tengah",
    occupation: "Ibu Rumah Tangga",
    avatar: "/images/landing/carukesi-testimonials/avatar-07-siti.webp",
    rating: 5,
    highlight: "alhamdulillah bangun tidur langsung bisa napak lantai dengan nyaman tanpa sakit sama sekali.",
    quote: "Setiap bangun subuh tumit kiri rasanya seperti ditusuk paku, harus jinjit beberapa langkah. Seminggu rutin oles gel Carukesi ini sebelum tidur, alhamdulillah bangun tidur langsung bisa napak lantai dengan nyaman tanpa sakit sama sekali. Kerjaan rumah jadi ringan.",
    proofImage: "/images/landing/carukesi-testimonials/testi-proof-07-tumit-siti.webp",
    proofAlt: "Ibu Siti Fatimah Mengoleskan Gel ke Tumit Kaki di Tepi Tempat Tidur",
    tags: ["irt", "tumit", "plantar-fasciitis", "pegal", "kaki"]
  },
  {
    id: "faridah",
    name: "Ibu Faridah",
    age: 51,
    city: "Surakarta, Jawa Tengah",
    occupation: "Wiraswasta",
    avatar: "/images/landing/carukesi-testimonials/avatar-08-faridah.webp",
    rating: 5,
    highlight: "hangatnya meresap tahan sampai pagi dan tidur nyenyak pulas tanpa sekalipun kebangun lagi.",
    quote: "Sudah 6 bulan tiap malam menderita terbangun jam 2 atau 3 pagi karena lutut cenat-cenut kedinginan kena kipas/AC. Semenjak oles Carukesi sebelum tidur, hangatnya meresap tahan sampai pagi dan tidur nyenyak pulas tanpa sekalipun kebangun lagi. Sangat bersyukur!",
    proofImage: "/images/landing/carukesi-testimonials/testi-proof-08-tidur-faridah.webp",
    proofAlt: "Ibu Faridah Tersenyum Nyaman Bersiap Istirahat Malam Bebas Ngilu",
    tags: ["tidur", "ngilu", "malam", "lutut", "lansia"]
  },
  {
    id: "bambang",
    name: "Bambang Sugianto",
    age: 36,
    city: "Surabaya, Jawa Timur",
    occupation: "Staf Gudang Logistik",
    avatar: "/images/landing/carukesi-testimonials/avatar-09-bambang.webp",
    rating: 5,
    highlight: "hangatnya meresap dalam banget dan bangun pagi badan langsung enteng bertenaga lagi.",
    quote: "Sehari angkat ratusan kardus berat di gudang, boyok rasanya mau patah dan otot paha kaku sekali. Oles gel Carukesi ini sebelum tidur, hangatnya meresap dalam banget dan bangun pagi badan langsung enteng bertenaga lagi. Mantap pol!",
    proofImage: "/images/landing/carukesi-testimonials/testi-proof-09-punggung-bambang.webp",
    proofAlt: "Bambang Sugianto Rileks Memegang Punggung Bawah di Gudang",
    tags: ["pekerja", "punggung", "boyok", "logistik", "otot"]
  }
];

export function getTestimonialsForLanding(ids: string[]): CarukesiTestimonial[] {
  return ids
    .map((id) => CARUKESI_MASTER_TESTIMONIALS.find((t) => t.id === id))
    .filter((t): t is CarukesiTestimonial => Boolean(t));
}
