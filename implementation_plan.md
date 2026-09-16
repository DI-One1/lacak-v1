# Rencana Implementasi: Upgrade Halaman Publik LACAK

Dokumen ini merinci langkah-langkah implementasi peningkatan halaman publik `lacak-v1` berdasarkan desain `lacak-public-page-example`, dengan mempertahankan logo asli LACAK, menjaga halaman petugas tetap utuh, mengamankan interaksi WhatsApp via autentikasi Clerk, serta menambahkan fitur Beri Saran terhubung ke Gmail.

---

## 1. Lingkup Pekerjaan & Keputusan Desain

1. **Halaman Publik (`/`)**:
   - Mengadopsi tata letak dari `lacak-public-page-example`:
     - **Navbar Publik**: Logo LACAK orisinal, Search Bar publik, Filter Bar horizontal (Urutkan, Kategori, Warna, Merek, Lokasi, Reset), dan Menu Dropdown (Masuk/Profil, Tentang Kami, Beri Saran).
     - **Barang Temuan Terbaru (Ticker)**: Animasi marquee/slider otomatis kartu highlight temuan terbaru.
     - **Kategori Carousel**: Tombol geser kategori yang memfilter katalog secara instan saat diklik.
     - **Semua Barang Temuan (Katalog Grid)**: Grid kartu barang yang responsif, badge status & kategori, deskripsi ringkas, lokasi, tanggal, serta pagination.
     - **Modal Detail Barang**: Popup lengkap dengan foto, metadata (merek, warna, lokasi, tanggal), catatan privasi, dan tombol aksi WhatsApp.
2. **Proteksi Akses (Auth Guard)**:
   - **Tamu / Pengunjung Tanpa Login**: Bebas mencari barang, menyaring kategori, dan melihat detail barang (Read-Only).
   - **Tombol WhatsApp (Chat Admin)**: Wajib login terlebih dahulu. Jika belum login, dialihkan untuk login ke Clerk. Setelah login, pesan WhatsApp otomatis terisi identitas pengguna (*pre-filled* nama, email, dan detail barang) untuk mencegah spam / DDoS.
   - **Halaman Beri Saran (`/beri-saran`)**: Wajib login agar saran yang masuk memiliki identitas jelas.
3. **Halaman Petugas (Internal)**:
   - Halaman `/dashboard`, `/taruh`, `/lapor`, `/ambil`, `/data-warga`, dan `/riwayat` **tidak diubah** fungsinya maupun alurnya. Navbar petugas tetap memakai navigasi operasional yang ada.
4. **Halaman Tentang Kami (`/tentang-kami`)**:
   - Konten cerita, tim, visi, dan alur proses dipertahankan sepenuhnya.
   - Navbar dan footer diselaraskan agar seragam dengan halaman publik utama.
5. **Pengiriman Saran ke Gmail**:
   - Terdapat 2 opsi:
     - **Opsi A (Direct Gmail Web - Mirip WA)**: Membuka compose Gmail dengan draft terisi otomatis ke `lacak.smktibazma@gmail.com` tanpa pihak ketiga.
     - **Opsi B (Form Otomatis via API)**: Pengguna mengisi form di website, sistem mengirim email ke `lacak.smktibazma@gmail.com` via Nodemailer / Resend dan/atau menyimpan ke database.

---

## 2. Proposed Changes

### Komponen Shared & Navigasi

#### [MODIFY] [Navbar.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/MAPEL/SAAS/Kelas%2012/Praktik/lacak-project/lacak-v1/src/components/shared/Navbar.tsx)
- Memisahkan tampilan untuk rute publik (`/`, `/tentang-kami`, `/beri-saran`):
  - Menggunakan logo teks orisinal LACAK.
  - Menyediakan search bar dan menu burger responsif (Masuk/User Profile, Tentang Kami, Beri Saran).
  - Khusus halaman beranda (`/`), menampilkan bar filter horizontal (Urutkan, Kategori, Warna, Merek, Lokasi, Reset) yang terhubung ke state katalog.
- Mempertahankan tampilan navbar petugas untuk rute internal (`/dashboard`, dll.) tanpa perubahan.

---

### Halaman Beranda Publik (`/`)

#### [MODIFY] [page.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/MAPEL/SAAS/Kelas%2012/Praktik/lacak-project/lacak-v1/src/app/page.tsx)
- Server component yang mengambil data dari database:
  - `FoundItem` (status `FOUND`, relasi ke `jenis`, `warna`, `merek`, `lokasi`).
  - Master data untuk filter: daftar jenis (`CategoryItem`), warna (`ColorItem`), merek (`BrandItem`), dan lokasi (`LocationItem`).
- Meneruskan data ke client container `PublicPortal`.

#### [NEW] `src/components/public/PublicPortal.tsx`
- Mengelola state pencarian, filter, pemilihan kategori, paginasi, dan item yang sedang dibuka di modal detail.
- Menghubungkan filter bar di navbar dengan katalog.

#### [NEW] `src/components/public/LatestItemsTicker.tsx`
- Menampilkan section *"Barang Temuan Terbaru"* dengan slider/marquee kartu highlight beranimasi halus dan jeda saat hover.

#### [NEW] `src/components/public/CategoryCarousel.tsx`
- Menampilkan daftar tombol kategori dengan ikon, tombol navigasi geser kiri/kanan, dan status aktif.

#### [NEW] `src/components/public/CatalogGrid.tsx`
- Menampilkan grid kartu barang temuan, indikator hasil, empty state jika pencarian nihil, dan navigasi halaman (pagination).

#### [NEW] `src/components/public/ItemDetailModal.tsx`
- Modal dialog detail barang temuan.
- Dilengkapi tombol *"Chat Admin untuk Pengambilan"*:
  - Cek status login Clerk.
  - Jika belum login: memunculkan dialog/ajakan login.
  - Jika sudah login: membuka link `https://wa.me/...` dengan teks identitas terisi otomatis.

---

### Halaman Beri Saran (`/beri-saran`)

#### [NEW] `src/app/beri-saran/page.tsx`
- Halaman formulir masukan/saran publik.
- Memeriksa status login (jika belum login, tampilkan banner ajakan masuk dengan tombol Login Clerk).
- Menyediakan pengiriman saran ke Gmail admin.

---

### Penyelarasan Halaman Tentang Kami (`/tentang-kami`)

#### [MODIFY] [tentang-kami/page.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/MAPEL/SAAS/Kelas%2012/Praktik/lacak-project/lacak-v1/src/app/tentang-kami/page.tsx)
- Menyelaraskan footer dan padding atas agar pas dengan navbar publik baru.

---

## 3. Rencana Verifikasi

### Manual Verification
1. **Navigasi Publik vs Petugas**:
   - Buka `/` dan `/tentang-kami` sebagai tamu -> pastikan navbar publik muncul dengan logo LACAK, search bar, dropdown menu, dan filter.
   - Buka `/dashboard` sebagai akun admin (`lacak.smktibazma@gmail.com`) -> pastikan navigasi petugas, form lapor, taruh, ambil, dan riwayat berjalan normal tanpa gangguan.
2. **Filter & Pencarian Real-Time**:
   - Ketik kata kunci di kolom cari -> pastikan barang langsung terfilter.
   - Klik salah satu kategori (misal: "Jaket" atau "Elektronik") -> pastikan grid barang tersaring sesuai kategori.
   - Pilih filter warna/lokasi/merek -> pastikan kombinasi filter bekerja.
   - Klik tombol "Reset Filter" -> kembali ke kondisi awal.
3. **Pengujian Modal & Proteksi WhatsApp**:
   - Klik kartu barang tanpa login -> modal terbuka -> klik tombol "Chat Admin" -> muncul ajakan login.
   - Login dengan akun biasa -> klik tombol "Chat Admin" -> WhatsApp terbuka dengan format pesan berisi identitas user dan ID barang.
4. **Pengujian Halaman Beri Saran**:
   - Buka `/beri-saran` -> coba kirim saran ke Gmail admin.
