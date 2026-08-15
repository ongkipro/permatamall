# Riset UI/UX Halaman Pembayaran (Indonesian Commerce & DR Market)

**Penulis:** AI Coding Assistant (Antigravity)  
**Tanggal:** 12 Agustus 2026  
**Target Platform:** CMSAds Engine (Astro 7 + Tailwind CSS v4)  

---

## 1. Executive Summary & Behavioral Context

Di pasar e-commerce dan Direct-Response (DR) Indonesia, halaman pembayaran (`/payment`) merupakan titik krusial dalam menentukan *Conversion Rate* dan *Paid Completion Rate*. Pembeli di Indonesia memiliki karakteristik khusus:
1. **Visual Recognition First:** Pembeli mengenali identitas visual bank/e-wallet (logo warna khas BCA, Mandiri, BNI, BRI, QRIS) jauh lebih cepat daripada membaca teks singkatan seperti "VABCA" atau "VAMANDIRI".
2. **Kecemasan Transaksi (Transaction Anxiety):** Pembeli sering ragu apakah uang mereka aman, apakah nomor VA benar, dan apakah sistem mencatat pembayaran secara otomatis.
3. **Kemudahan Salin Data (1-Tap Copying):** Menyalin nomor Virtual Account atau total nominal rupiah harus dapat dilakukan dalam 1 kali ketuk dengan feedback visual yang sangat jelas ("Tersalin!").
4. **Instruksi Spesifik Kanal:** Setiap bank memiliki nama menu m-banking yang berbeda (misal: Livin' Mandiri pilih *Bayar/Multipayment*, BCA Mobile pilih *m-Transfer > BCA Virtual Account*, BRImo pilih *BRIVA*).

---

## 2. Landscape Metode Pembayaran Indonesia

### A. QRIS (Quick Response Code Indonesian Standard)
- **Karakteristik:** Standar nasional Bank Indonesia. Sangat populer karena bisa di-scan dari *semua* m-banking (BCA, Livin', BRImo, Octo, dll) dan e-wallet (GoPay, OVO, ShopeePay, DANA, LinkAja).
- **UX Requirement:**
  - Tampilkan **Logo QRIS Resmi** yang jelas di bagian atas card.
  - QR Code dirender bersih (minimal 260px x 260px) di atas canvas/SVG.
  - Tambahkan tombol "Unduh QR Code" atau "Petunjuk Scan QRIS".
  - Berikan indikator visual animasi *pulsing ring* atau *auto-check badge* ("Memeriksa pembayaran secara otomatis...").

### B. Virtual Account (VA) Bank Utama
1. **BCA (Bank Central Asia) — `#005CAA`**
   - M-Banking: *BCA Mobile* $\rightarrow$ *m-Transfer* $\rightarrow$ *BCA Virtual Account*.
   - Karakteristik: Pengguna BCA sangat banyak di segmen e-commerce Indonesia; butuh penyalinan cepat 16-digit VA.
2. **Bank Mandiri — `#003D79` & `#F2A900`**
   - M-Banking: *Livin' by Mandiri* $\rightarrow$ *Bayar* $\rightarrow$ *Cari penyedia jasa / Virtual Account*.
3. **BRI (Bank Rakyat Indonesia) — `#00529C`**
   - M-Banking: *BRImo* $\rightarrow$ *Pembayaran* $\rightarrow$ *BRIVA*.
4. **BNI (Bank Negara Indonesia) — `#F15A24` (Orange BNI)**
   - M-Banking: *BNI Mobile Banking* $\rightarrow$ *Transfer* $\rightarrow$ *Virtual Account Billing*.
5. **Bank Permata / BSI / CIMB Niaga / Danamon**
   - M-Banking: Menu *Virtual Account* masing-masing bank.

---

## 3. Prinsip Desain UI/UX Halaman Pembayaran

### A. Hierarki Visual (Top to Bottom)
1. **Header Reassurance:** Nama toko/brand + Status Tag ("Menunggu Pembayaran").
2. **Total Tagihan & Timer Expiry:** Nominal dalam font besar (e.g. `text-3xl font-bold`), lengkap dengan countdown timer mundur (*Countdown Clock* yang menciptakan *urgency* sehat).
3. **Visual Brand Identity (Logo Bank/QRIS):** Logo SVG/PNG resmi dengan warna khas bank yang presisi.
4. **Action Area (Salin Nomor VA / Display QR Code):**
   - Font monospaced besar untuk Nomor VA (`font-mono text-xl tracking-wider`).
   - Tombol "Salin" dengan feedback toast/check icon ("Tersalin").
5. **Panduan Cara Bayar (Collapsible Step-by-Step Guide):**
   - Tab / Accordion untuk *m-Banking*, *ATM*, dan *Internet Banking* sesuai bank yang dipilih.
6. **Footer Keamanan & Trust Badge:**
   - Indikator "Status diperiksa otomatis setiap 5 detik".
   - Bantuan CS WhatsApp jikalau ada kendala pembayaran.

---

## 4. Spesifikasi Komponen Logo Bank (SVG Vectors)

Untuk performa maksimal tanpa request HTTP eksternal, logo bank diimplementasikan sebagai komponen SVG inline yang ringan (`PaymentLogo.astro`):

| Kode Kanal | Label Bank | Elemen Visual SVG | Warna Khas |
| :--- | :--- | :--- | :--- |
| `qris` | QRIS (National QR) | Badge QRIS Resmi (Segitiga Merah-Hitam + QR) | Merah `#ED1C24` & Hitam `#000000` |
| `vabca` | Bank BCA | Logo BCA Typo + Wave Icon | Biru BCA `#005CAA` |
| `vamandiri` | Bank Mandiri | Logo Mandiri Typo + Pita Kuning Embas | Biru `#003D79` & Gold `#F2A900` |
| `vabri` | Bank BRI | Logo BRI Typo + Emblem 4 Garis | Biru BRI `#00529C` |
| `vabni` | Bank BNI | Logo BNI Typo 46 Orange | Orange `#F15A24` & Teal `#006666` |
| `vapermata` | Permata Bank | Permata Diamond Icon + Typo | Hijau Emerald `#008A4B` |
| `vabsi` | Bank Syariah Indonesia | BSI Typo + Bintang Emas | Teal `#00A39D` & Gold `#F4A261` |
| `vacimb` | CIMB Niaga | CIMB Octo / Red Square Logo | Merah `#ED1C24` |
| `vadanamon` | Bank Danamon | Danamon Sunburst / Blue-Orange Typo | Orange `#F37021` & Biru `#0054A6` |
| `cod` | Bayar di Tempat (COD) | Hand Truck / Cash Icon Badge | Hijau Emerald `#059669` |

---

## 5. Rencana Refactoring UI/UX Halaman Pembayaran (`/payment` & Checkout)

### Langkah 1: Buat Komponen `PaymentLogo.astro`
- Menampilkan SVG vector presisi untuk 10 metode pembayaran (QRIS, BCA, Mandiri, BNI, BRI, Permata, BSI, CIMB, Danamon, COD).
- Mendukung opsi ukuran (`sm`, `md`, `lg`) & kemudahan digunakan di checkout form maupun di halaman `/payment`.

### Langkah 2: Sempurnakan Halaman Pembayaran (`src/pages/payment.astro`)
1. **Header & Card Design:**
   - Gunakan layout card modern dengan border halus, shadow lembut, dan badge logo bank yang menonjol di bagian header pembayaran.
2. **Peningkatan QRIS Display:**
   - Tampilkan badge resmi QRIS di atas QR Canvas.
   - Berikan tombol "Unduh QR" (menyiapkan image dari canvas) & tombol "Buka Aplikasi Pembayaran" jika ada `payment_url`.
3. **Peningkatan Virtual Account Display:**
   - Tampilkan Logo Bank SVG ukuran besar di samping Nomor VA.
   - Tambahkan animasi feedback saat tombol "Salin" diklik ("Tersalin ✓").
4. **Countdown Expiry Timer:**
   - Hitung mundur waktu tersisa (misal: `00:59:45`) dengan warna indikator amber/red jika mendekati kadaluarsa.
5. **Panduan Transfer Spesifik Bank (Accordion):**
   - Petunjuk langkah demi langkah yang sesuai untuk m-Banking & ATM bank bersangkutan (BCA, Mandiri, BNI, BRI, dll).
6. **Integrasi di Checkout Selectors (`FormMiddleContent` & `FormHybridContent`):**
   - Tambahkan logo SVG bank pada pilihan Virtual Account dan QRIS saat pembeli memilih metode pembayaran di form checkout.

---
*Riset ini menjadi acuan pengembangan UI/UX halaman pembayaran CMSAds Engine.*
