# Laporan Audit & Analisis Komprehensif: Project `lacak-v1`

Laporan ini menyajikan analisis mendalam terhadap struktur folder, styling, sistem data, keamanan, dan kualitas kode dari project **LACAK** (`lacak-v1`). Analisis ini membandingkan pola yang diterapkan pada project ini dengan standar industri untuk aplikasi tingkat produksi (*production-grade*) dan website besar berskala mature.

---

## DAFTAR ISI
1. [Bagian 1 — Frontend Architecture](#bagian-1--frontend-architecture)
2. [Bagian 2 — CSS / Styling Architecture](#bagian-2--css--styling-architecture)
3. [Bagian 3 — Design System](#bagian-3--design-system)
4. [Bagian 4 — Component Reusability](#bagian-4--component-reusability)
5. [Bagian 5 — Naming dan Semantic Structure](#bagian-5--naming-dan-semantic-structure)
6. [Bagian 6 — Responsive Architecture](#bagian-6--responsive-architecture)
7. [Bagian 7 — Stacking, Layering, dan Overflow](#bagian-7--stacking-layering-dan-overflow)
8. [Bagian 8 — State Management](#bagian-8--state-management)
9. [Bagian 9 — Data Fetching dan Backend Interaction](#bagian-9--data-fetching-dan-backend-interaction)
10. [Bagian 10 — Type Safety](#bagian-10--type-safety)
11. [Bagian 11 — Accessibility (a11y)](#bagian-11--accessibility-a11y)
12. [Bagian 12 — Performance](#bagian-12--performance)
13. [Bagian 13 — Error Handling](#bagian-13--error-handling)
14. [Bagian 14 — Security Architecture](#bagian-14--security-architecture)
15. [Bagian 15 — Database dan Data Model](#bagian-15--database-dan-data-model)
16. [Bagian 16 — Maintainability & Technical Debt](#bagian-16--maintainability--technical-debt)
17. [Bagian 17 — Perbandingan Konseptual dengan Website Besar](#bagian-17--perbandingan-konseptual-dengan-website-besar)
18. [Bagian 18 — Inventarisasi Metode & Pattern di LACAK](#bagian-18--inventarisasi-metode--pattern-di-lacak)
19. [Bagian 19 — Daftar Kekurangan & Kerentanan (Severity Grid)](#bagian-19--daftar-kekurangan--kerentanan-severity-grid)
20. [Bagian 20 — Aspek Positif & Hal yang Sudah Bagus](#bagian-20--aspek-positif--hal-yang-sudah-bagus)
21. [Bagian 21 — Kesimpulan Akhir & Jawaban Pertanyaan Utama](#bagian-21--kesimpulan-akhir--jawaban-pertanyaan-utama)

---

## Bagian 1 — Frontend Architecture

### Pola Arsitektur Saat Ini
Project `lacak-v1` menggunakan framework **Next.js (App Router)** dengan integrasi Prisma ORM untuk database PostgreSQL dan Supabase Realtime untuk pembaruan instan pada client-side.
- **Separation of Concerns (SoC) Server/Client**: Project ini memisahkan component menggunakan arahan `"use client"` secara eksplisit pada form dan halaman dinamis (seperti [LaporForm.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/lapor/LaporForm.tsx) dan [WargaClient.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/data-warga/WargaClient.tsx)). Server component bertindak sebagai data-fetcher utama (misal pada [data-warga/page.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/data-warga/page.tsx) yang menarik data melalui Prisma lalu mengopernya ke client component).

### Temuan & Masalah Struktural
1. **Business Logic Bercampur di Server Actions**: Pada file seperti [lost-report.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/lib/actions/lost-report.ts) dan [claim.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/lib/actions/claim.ts), logika transaksi database bercampur langsung dengan redirect halaman, trigger revalidasi cache Next.js (`revalidatePath`), dan pembersihan notifikasi. Pola ini menyulitkan unit testing karena logika bisnis (*core domains*) terikat langsung ke API runtime Next.js.
2. **Ketergantungan Komponen terhadap State Induk yang Tinggi**: Beberapa sub-component seperti `StepDetailBarang.tsx` menerima terlalu banyak props callback (`onJenisChange`, `onWarnaChange`, `onMerekChange`, `onLokasiChange`, dll.) dari induknya [LaporForm.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/lapor/LaporForm.tsx). Ini menunjukkan tidak adanya abstraction state lokal untuk form besar.
3. **Komponen Pengelola State Terlalu Besar (Fat Components)**: Komponen [WargaClient.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/data-warga/WargaClient.tsx) mengelola state untuk penambahan warga, penghapusan warga, sinkronisasi realtime, pemfilteran pencarian, visualisasi riwayat aksi, dan mengontrol dua modal berbeda. Tanggung jawabnya terlalu banyak (*violates Single Responsibility Principle*).

---

## Bagian 2 — CSS / Styling Architecture

### Pola Styling di LACAK
LACAK menggunakan pendekatan **Utility-First** melalui Tailwind CSS v4. Struktur styling diatur langsung secara inline di dalam file TSX (JSX ClassName). 

### Perbandingan Konseptual
- **Utility-First (Inline JSX)**: Menulis class langsung di JSX (seperti `className="max-h-80 overflow-y-auto divide-y divide-gray-50"`).
- **Semantic Class / BEM**: Memisahkan style ke kelas deskriptif (misal `c-card__wrapper-link`) dan merinci visual di file CSS terpisah.
- **Tailwind Component Layer / CSS Modules / Hybrid**: Mendefinisikan class global utilitas tetapi membungkus class yang berulang dalam directive `@apply` atau modular scope.

### Kelebihan & Kekurangan Pendekatan Inline Utility di LACAK
| Parameter | Utility-First Inline (LACAK) | Semantic / BEM (Gmail/Harvard) |
| :--- | :--- | :--- |
| **Kecepatan Dev** | Sangat cepat untuk iterasi awal. | Butuh waktu menulis dokumentasi CSS. |
| **Keterbacaan JSX** | Buruk. Markup HTML tenggelam oleh untaian class. | Sangat baik. Struktur HTML terlihat bersih. |
| **Perubahan Global**| Sulit. Harus mengganti string class di setiap file satu persatu. | Sangat mudah. Cukup ganti di satu selektor CSS. |
| **Duplikasi Kode** | Sangat tinggi (styling list, card, button ditulis ulang). | Rendah. Semua elemen serupa merujuk ke satu selector. |

### Masalah Nyata styling di LACAK
Ditemukan banyak *repeated classNames* untuk elemen visual yang identik. Sebagai contoh, styling select box ditulis berulang-ulang di [StepDetailBarang.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/lapor/StepDetailBarang.tsx):
```tsx
className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3dbd84] bg-white transition-all"
```
Nilai ini diduplikasi 4 kali untuk dropdown Jenis, Warna, Merek, dan Lokasi. Jika di masa depan tim ingin mengubah radius border menjadi `rounded-lg`, developer harus memperbarui setiap elemen secara ad-hoc.

---

## Bagian 3 — Design System

### Status Design System di LACAK: Partial Design System
Project ini dikonfigurasi menggunakan Tailwind v4 `@theme` di [globals.css](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/globals.css) yang menentukan token warna utama:
```css
@theme {
  --color-green-dark: #0d3b2e;
  --color-green-mid: #1a5c44;
  --color-green-accent: #3dbd84;
  --color-cream: #faf9f6;
  --font-poppins: 'Poppins', sans-serif;
}
```

### Masalah Penggunaan Token (Ad-hoc Values)
Meskipun token warna di atas sudah dideklarasikan di theme global, codebase **tidak menggunakan token tersebut** di sebagian besar file TSX. Developer justru menulis hardcoded hex value secara manual di dalam JSX:
- `text-[#0d3b2e]` dan `bg-[#0d3b2e]` digunakan berkali-kali (misal di `Notification.tsx:101`, `StepDetailBarang.tsx:54`, `LaporForm.tsx:210`).
- `text-[#3dbd84]` dan `bg-[#3dbd84]` (misal di `Notification.tsx:113`, `UserProfile.tsx:24`, `Navbar.tsx:32`).
- `hover:text-[#1a5c44]` dan `bg-[#1a5c44]` (misal di `Notification.tsx:113`, `LaporForm.tsx:209`).

Hal ini membuktikan adanya inkonsistensi. Konsep design system sudah disiapkan setengah jalan (*partial*), tetapi dalam eksekusi sehari-hari developer tetap menulis style secara ad-hoc tanpa merujuk ke token (seharusnya `text-green-dark`, `bg-green-dark`, dll.).

---

## Bagian 4 — Component Reusability

### Komponen Reusable
1. **[WargaVerificationCard.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/warga/WargaVerificationCard.tsx)**: Komponen ini berhasil dirancang secara reusable dan digunakan di halaman Lapor Kehilangan dan halaman Pengambilan Barang dengan props parameterizable (`roleLabel`, `onSelectWarga`).
2. **[SearchableFoundItem.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/SearchableFoundItem.tsx)**: Reusable untuk melakukan inline search barang temuan.

### Duplikasi & Near-Duplication Komponen
Terdapat redundansi pada table row layout. Pengembang membuat file individual untuk setiap halaman riwayat:
- `WargaRow.tsx` (untuk data warga)
- `LaporanRow.tsx` (untuk data lost reports)
- `TemuanRow.tsx` (untuk data found items)
- `PengambilanRow.tsx` (untuk data claim transactions)

Struktur tabel diatur secara manual di dalam masing-masing client page dengan duplikasi layout pembungkus table element. Project belum memiliki komponen generic reusable seperti `<Table />`, `<Card />`, atau `<Button />`.

---

## Bagian 5 — Naming dan Semantic Structure

### Metode Naming saat Ini
Aplikasi `lacak-v1` menggunakan penamaan standard React/Next.js:
- **File & Komponen**: Menggunakan `PascalCase` untuk komponen (misal `WargaVerificationCard.tsx`) dan `kebab-case` untuk folder route (misal `data-warga`) dan files actions (`found-item.ts`).
- **Semantic Identity**: Tidak menggunakan semantic prefix dalam class name CSS. Identitas styling murni bergantung pada tumpukan kelas utilitas inline Tailwind CSS.

---

## Bagian 6 — Responsive Architecture

### Breakpoints & Responsive Behavior
Project ini menggunakan modifier breakpoint Tailwind (`sm`, `md`, `lg`) untuk menyesuaikan tata letak.

### Temuan & Masalah Responsive (Mobile Friendliness)
1. **Desain Tabel Kaku di Mobile**: Pada halaman riwayat dan data warga, tabel ditangani dengan pembungkus `overflow-x-auto` dan lebar minimal `min-w-[700px]`. Ini hanya jalan pintas agar tabel tidak pecah, namun merusak kenyamanan pengguna mobile karena mereka dipaksa melakukan horizontal scroll untuk membaca informasi dasar.
2. **Layout Header Sempit di Mobile**: Di [Navbar.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/navbar/Navbar.tsx):
   ```tsx
   <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[120px_1fr_auto] gap-4 md:gap-10 items-center">
   ```
   Pada layar kecil, grid ini memaksa search bar (`1fr`) berada satu baris dengan logo dan ikon profil/notifikasi. Akibatnya, pada viewport layar handphone kecil (di bawah 360px), search bar menjadi sangat sempit dan rentan tumpang tindih.
3. **Dropdown NavTabs di Layar Kecil**: Halaman dropdown riwayat di [NavTabs.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/navbar/NavTabs.tsx) diposisikan absolute di bawah tab, namun pembungkus luarnya menggunakan `flex-wrap`. Jika menu terbungkus menjadi baris baru pada perangkat mobile, posisi dropdown absolute tidak presisi lagi.

---

## Bagian 7 — Stacking, Layering, dan Overflow

### Masalah Z-Index (Stacking Layering)
Codebase menunjukkan tidak adanya skema koordinasi layering terpusat. Hal ini terlihat dari nilai `z-index` yang dipasang acak di berbagai komponen:
- `z-[1050]` untuk dropdown riwayat (`NavTabs.tsx:71`)
- `z-[1050]` untuk dropdown notifikasi (`Notification.tsx:99`)
- `z-[1030]` untuk header menu (`Navbar.tsx:20` & `Navbar.tsx:57`)
- `z-[1020]` untuk row kedua tab navigasi (`Navbar.tsx:82`)
- `z-[1100]` untuk modal rincian barang temuan (`SearchableFoundItem.tsx:195`)
- `z-50` untuk modal tambah data warga (`WargaClient.tsx:261`)
- `z-40` untuk tombol floating action (`WargaClient.tsx:220`)

### Bug Stacking yang Terjadi
Karena modal tambah data warga hanya menggunakan `z-50` sedangkan header navigasi menggunakan `z-[1030]`, saat pengguna membuka modal Tambah Warga lalu melakukan scroll pada layar di belakangnya, **Navbar/Header akan menutupi dan berada di atas modal**. Ini adalah kesalahan visual hierarki z-index yang fatal.

### Analisis Dropdown Terpotong Tabel
- **Masalah Asal**: Elemen tabel sering kali dibungkus oleh container dengan properti `overflow: auto` atau `overflow: hidden` untuk penanganan responsif. Jika menu aksi diletakkan di dalam sel tabel menggunakan `position: absolute`, menu tersebut akan terpotong oleh batas overflow container tabel.
- **Root Cause & Solusi di LACAK**: Pada [WargaRow.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/data-warga/WargaRow.tsx), pengembang telah mengidentifikasi masalah ini. Solusi yang digunakan adalah memindahkan dropdown keluar dari hierarki tabel dengan **React Portal** (`createPortal(<div />, document.body)`) dan menghitung koordinat pixel tombol secara dinamis via JavaScript (`getBoundingClientRect`) pada event resize dan scroll. Ini menyelesaikan masalah truncation tabel, namun menambah kompleksitas runtime scripting.

---

## Bagian 8 — State Management

### Metode State Management
LACAK mengandalkan local state (`useState`) dan sync data via hook React standar (`useEffect`, `useRef`). Halaman dinamis seperti Data Warga juga membaca URL state (`useSearchParams`) untuk live filter.

### Sinkronisasi State Konflik (Optimistic UI vs Realtime Sync)
Pada komponen [WargaClient.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/data-warga/WargaClient.tsx), terdapat bug sinkronisasi state:
1. Ketika user meng-submit data warga baru, handler `handleTambahSubmit` membuat objek data sementara (`newTempWarga`) dengan id `temp-[timestamp]` dan menambahkannya secara optimistik ke state lokal `dataWarga`.
2. Kemudian, Server Action `tambahWarga(formData)` dipanggil.
3. Server Action menyimpan data di database PostgreSQL, yang otomatis memicu webhook PostgreSQL untuk menerbitkan event `INSERT` melalui Supabase Realtime.
4. Komponen `WargaClient` menerima payload `INSERT` realtime tersebut dan memasukkan data asli (dengan ID yang di-generate server, misal `2425027`) ke dalam state local `dataWarga`.
5. **Masalah**: Data sementara (`temp-[timestamp]`) tidak pernah dihapus dari state lokal jika operasi server berhasil (penghapusan hanya ada di blok `catch` untuk skenario gagal). Akibatnya, baris data baru akan muncul ganda di UI (satu baris bertuliskan "Generating..." dan satu baris data asli hasil sync realtime).

---

## Bagian 9 — Data Fetching dan Backend Interaction

### Model Interaksi Backend
Aplikasi berinteraksi dengan PostgreSQL database menggunakan Prisma Client melalui dua cara:
1. **Direct Queries di Server Components**: Digunakan saat rendering awal halaman (seperti `DataWargaPage` dan `LaporKehilanganPage`).
2. **Next.js Server Actions**: Digunakan untuk mutasi (insert/update/delete) di client-side.

### Temuan Arsitektural & Masalah
1. **Lazy Database Operations di Jalur Query Read**: Sistem pelacakan kedaluwarsa barang (`checkAndExpireItems`) dieksekusi secara lazy *inline* di hampir seluruh fungsi baca dan tulis barang temuan (misalnya pada `findMatchesForFoundItem`, `findMatchesForLostReport`, `claim.ts`, dll.). Setiap kali user mencari barang atau mencocokkan laporan, sistem mengirimkan query write `updateMany` ke database. Ini adalah pemborosan resource database yang tidak terukur dan membebani performa query read biasa.
2. **Presentation Layer Mengetahui Struktur Database**: Payload relasi dari Prisma disalurkan langsung ke client components tanpa deserialization yang ketat atau DTO (*Data Transfer Object*).

---

## Bagian 10 — Type Safety

### Kelemahan Penerapan TypeScript (Type Safety Bypass)
Meskipun pengembang telah mendefinisikan interface yang rapi di [src/types/models.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/types/models.ts) (seperti `LostReportItem`, `FoundItemData`, dan `ClaimTransactionData`), tipe data tersebut tidak dimanfaatkan secara konsisten.
- Banyak parameter props baris tabel diatur menggunakan tipe data `any` atau `any[]` (misal di `LaporanRow.tsx:7`, `TemuanRow.tsx:7`, `PengambilanRow.tsx:7`, `LaporanClient.tsx:8`).
- Penggunaan `any` menghilangkan perlindungan tipe data statis TypeScript (*type-safety bypass*), membuat developer rentan mengalami error runtime `undefined` jika ada perubahan properti data dari database (misal penamaan snake_case vs camelCase).

---

## Bagian 11 — Accessibility (a11y)

### Evaluasi Aksesibilitas
Aplikasi ini melupakan beberapa standar dasar aksesibilitas:
1. **Navigasi Keyboard Dropdown Terbatas**: Dropdown notifikasi [Notification.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/navbar/Notification.tsx) dan dropdown menu navigasi [NavTabs.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/navbar/NavTabs.tsx) tidak dapat ditutup menggunakan tombol keyboard `Escape`.
2. **Hilangnya Fokus Focus Trap**: Saat modal (seperti modal detail rincian barang temuan atau modal Tambah Warga) terbuka, fokus keyboard tidak terperangkap (*focus trap*) di dalam modal. Pengguna masih bisa menekan tombol `Tab` dan memindahkan fokus navigasi ke elemen-elemen di luar modal yang tertutup layar.
3. **Absennya Atribut ARIA**: Tidak ditemukan penanda dinamis seperti `aria-expanded` pada dropdown lonceng notifikasi untuk memberi tahu screen reader apakah menu sedang terbuka atau tertutup.

---

## Bagian 12 — Performance

### Temuan Bottleneck Performa
1. **Live Search Tanpa Debounce (Excessive Next.js Router Updates)**: Input pencarian global pada [SearchBar.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/navbar/SearchBar.tsx) mengeksekusi `router.replace` pada event `onChange` **di setiap ketukan tombol keyboard**:
   ```tsx
   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const val = e.target.value;
     // ...
     router.replace(`${pathname}?${params.toString()}`);
   };
   ```
   Mengetik kata kunci sepanjang 10 karakter akan memaksa Next.js melakukan router navigation cycle sebanyak 10 kali secara beruntun. Ini menyebabkan lag pada input teks dan memaksa render ulang component induk berkali-kali.
2. **Query Database Tambahan dari Lazy Expiration**: Menjalankan operasi database write `updateMany` secara *inline* di dalam server actions data fetching (seperti pencarian kecocokan barang) menambah latency request.

---

## Bagian 13 — Error Handling

### Kelemahan Penanganan Kesalahan (Error Handling)
1. **Server Actions Tanpa Proteksi Catch-All**: Server Action seperti `processClaimItem` di [claim.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/lib/actions/claim.ts) dan `createLostReport` di [lost-report.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/lib/actions/lost-report.ts) melakukan transaksi database kompleks tanpa blok `try/catch` pembungkus. 
2. **Dampak Runtime Crash**: Jika terjadi kegagalan integritas data, error foreign key constraint, atau unique code constraint di Prisma, server action akan langsung melemparkan raw exception ke runtime Next.js. Bagi pengguna akhir, ini akan memicu crash halaman (halaman 500 error bawaan browser/Next.js) daripada memunculkan pesan validasi error yang bersahabat di UI.

---

## Bagian 14 — Security Architecture

### Kerentanan Keamanan Fatal: Bypass Authentication
Analisis terhadap berkas middleware menemukan masalah keamanan paling krusial:
- Berkas logika validasi Clerk Auth dan pemeriksaan hak akses email admin (`lacak.smktibazma@gmail.com`) diletakkan di file bernama [src/proxy.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/proxy.ts).
- Namun, **tidak ditemukan berkas `middleware.ts` atau `middleware.js`** baik di folder root project maupun di dalam folder `/src`.
- **Dampak**: Next.js hanya mengenali fungsi middleware jika dideklarasikan di file bernama `middleware.ts`. Karena dinamakan `proxy.ts`, file tersebut diabaikan total oleh Next.js. **Seluruh rute internal aplikasi (seperti `/dashboard`, `/taruh`, `/ambil`, `/data-warga`) tidak memiliki proteksi login sama sekali dan dapat diakses bebas secara publik oleh siapa saja tanpa autentikasi Clerk.**

### Unused Authentication Syncing Code
Fungsi `syncUserToDatabase` di [sync-user.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/lib/sync-user.ts) didesain untuk mensinkronisasi data profil pengguna Clerk ke tabel `users` database PostgreSQL. Namun, fungsi ini **tidak pernah diimpor atau dipanggil** di bagian aplikasi mana pun. Akibatnya, tabel `users` di database akan selalu kosong.

---

## Bagian 15 — Database dan Data Model

### Batasan Logika Bisnis Hardcoded (Magic Sequence)
Pada berkas pembuat NIS warga otomatis [nisGenerator.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/lib/utils/nisGenerator.ts):
```tsx
if (sequencePart < 26) {
  const nextSeq = String(sequencePart + 1).padStart(3, "0");
  return `${yearPart}${nextSeq}`;
} else {
  // Sudah mencapai 26, pindah ke tahun ajaran berikutnya
  // ...
}
```
Aturan ini membatasi jumlah data warga baru sebanyak **maksimal 26 entri** untuk setiap prefix tahun ajaran. Jika data warga ke-27 didaftarkan, sistem akan melompat secara paksa ke tahun ajaran berikutnya (misal dari `2425` ke `2526001`), meskipun pendaftaran terjadi di tahun ajaran yang sama. Ini adalah aturan bisnis kaku (*brittle business rule*) yang tertulis langsung di level utility generator.

### Concurrency Race Condition (Kerentanan Data Ganda)
Kedua generator kode otomatis (`codeGenerator.ts` untuk barang temuan dan `nisGenerator.ts` untuk warga) mengandalkan perhitungan record database yang ada saat itu (`count()` atau `findFirst()`) kemudian menambahkan nilai `+1`. 
Jika dua pengguna menekan tombol simpan secara bersamaan (konkurensi tinggi), kedua transaksi akan menghasilkan kode unik/ID yang sama. Hal ini akan menyebabkan salah satu transaksi gagal disimpan karena melanggar aturan unique database constraint.

---

## Bagian 16 — Maintainability & Technical Debt

### Potensi Hambatan Saat Project Berkembang (Bottlenecks)
Jika project ini berkembang menjadi puluhan halaman dengan tim developer yang bertambah, beberapa hal berikut akan menjadi hambatan besar:
1. **Kesulitan Perubahan Gaya (Design Changes)**: Karena styling warna utama (`#0d3b2e`) didistribusikan secara manual di puluhan file inline JSX daripada menggunakan token Tailwind, re-branding aplikasi di masa depan akan memerlukan pengerjaan penggantian manual yang melelahkan.
2. **Ketiadaan Test Suite**: Tidak ditemukan adanya file pengujian (`jest`, `playwright`, atau `vitest`). Mengubah alur matching yang kompleks tanpa jaminan unit test otomatis sangat berisiko merusak fungsionalitas sistem.
3. **Dead Code (Kode Mati)**: Menimbun file yang tidak aktif seperti [src/proxy.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/proxy.ts) dan `sync-user.ts` membebani pemeliharaan kode baru bagi developer lain.

---

## Bagian 17 — Perbandingan Konseptual dengan Website Besar

| Aspek Arsitektur | Pendekatan Gmail / Harvard / Enterprise | Status & Kondisi di Project LACAK |
| :--- | :--- | :--- |
| **Design System** | Token warna dan layout terpusat yang dikonsumsi secara konsisten. | Menggunakan partial design tokens, namun dibypass oleh ad-hoc hex values di JSX. |
| **Separation of Concern** | Logika data dipisah melalui Repositories atau Services. | Logika database Prisma bercampur langsung di Presentation Layer. |
| **Observability & Logs**| AuditLog mencatat aktivitas sensitif secara komprehensif. | Ada model `AuditLog` di Prisma schema, namun belum diimplementasikan di codebase logic. |
| **Observability / Observasi**| Logging terpusat dan penanganan eror di level global middleware. | Penanganan eror minim, tidak ada tracking error log eksternal. |
| **Security Layer** | Multi-level Auth & Authorization Guard di level Router & Server. | Middleware autentikasi dinonaktifkan secara tidak sengaja karena kesalahan nama file. |
| **Lifecycle Cleanups** | Pembersihan data berkala dijalankan via Scheduled Cron Job. | Pembersihan data (`checkAndExpireItems`) dijalankan secara lazy di alur request pengguna. |
| **Search Input** | Debounce event handler untuk mereduksi beban server/router. | Update router Next.js terjadi instan pada setiap ketukan tombol. |

---

## Bagian 18 — Inventarisasi Metode & Pattern di LACAK

### 1. Utility-First CSS
- **Status di LACAK**: Aktif (Dominan).
- **Lokasi**: Hampir di seluruh file komponen UI (seperti `Notification.tsx`, `StepDetailBarang.tsx`, `WargaClient.tsx`).
- **Contoh**: `className="absolute right-0 mt-2 w-80 ..."`
- **Kelebihan**: Cepat ditulis saat membuat purwarupa komponen.
- **Kekurangan**: Menimbun string visual panjang di dalam kode UI, duplikasi tinggi.
- **Dampak Jangka Panjang**: Menyulitkan perubahan visual terstandarisasi.

### 2. Client Components dengan Server Actions
- **Status di LACAK**: Aktif.
- **Lokasi**: Folder [src/app/lapor/](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/lapor), [src/app/ambil/](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/ambil), dan [src/app/data-warga/](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/data-warga).
- **Contoh**: Form submit memanggil fungsi async `tambahWarga` atau `createLostReport` yang ditandai `"use server"`.
- **Kelebihan**: Integrasi client-to-server mulus tanpa memerlukan REST API endpoint manual.
- **Kekurangan**: State loading dan error boundaries harus ditangani secara manual per halaman.
- **Dampak Jangka Panjang**: Standard arsitektur modern Next.js yang mempermudah pemeliharaan API.

### 3. React Portal untuk Dropdown Aksi
- **Status di LACAK**: Aktif (Spesifik).
- **Lokasi**: [WargaRow.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/data-warga/WargaRow.tsx) lines 150-239.
- **Contoh**: `createPortal(<div style={{ position: "fixed", ... }}>...</div>, document.body)`
- **Kelebihan**: Berhasil mencegah dropdown menu terpotong oleh layout tabel yang memiliki `overflow-hidden`.
- **Kekurangan**: Perlu menulis dynamic listener resize & scroll via JavaScript untuk mengkalkulasi posisi pixel.
- **Dampak Jangka Panjang**: Kompleksitas rendering bertambah.

---

## Bagian 19 — Daftar Kekurangan & Kerentanan (Severity Grid)

### 🔴 CRITICAL (Harus Segera Ditangani)

1. **Authentication Middleware Bypass**
   - **Lokasi**: `src/proxy.ts` (Seharusnya [src/middleware.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/middleware.ts) atau [middleware.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/middleware.ts) di root).
   - **Bukti Codebase**: File middleware Clerk dinamakan `proxy.ts`, yang tidak dikenali oleh Next.js runtime. 
   - **Dampak**: Halaman internal dashboard, input warga, input laporan, dan pengambilan barang terbuka secara bebas tanpa proteksi login. Publik dapat memanipulasi data tanpa autentikasi.
   - **Pentingnya Sustainability**: Merupakan celah keamanan fatal (*security breach*) yang melanggar standard keamanan web enterprise.

2. **Dangling Sync User & Empty Users Table**
   - **Lokasi**: [src/lib/sync-user.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/lib/sync-user.ts).
   - **Bukti Codebase**: Fungsi `syncUserToDatabase()` tidak pernah diimpor atau dipanggil oleh modul login/routing mana pun di aplikasi.
   - **Dampak**: Tabel `users` di database PostgreSQL akan selalu kosong. Pengecekan autentikasi email admin di `proxy.ts` (jika nanti diaktifkan) menjadi tidak sinkron dengan data internal model user.
   - **Pentingnya Sustainability**: Menimbulkan dead code yang membingungkan alur sinkronisasi relasi pengguna.

---

### 🟠 HIGH (Berisiko Tinggi Mengganggu Performa/Stabilitas)

1. **Next.js Router Navigation Flooding (Pencarian Tanpa Debounce)**
   - **Lokasi**: [src/components/navbar/SearchBar.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/navbar/SearchBar.tsx) line 32.
   - **Bukti Codebase**: `router.replace` dijalankan secara langsung pada event handler `handleSearchChange` di setiap input karakter.
   - **Dampak**: Mengetik kata kunci memicu puluhan update router secara instan. Ini memicu overhead rendering, berpotensi menurunkan responsivitas penulisan teks (*keyboard lag*), dan menghabiskan resource client browser.
   - **Pentingnya Sustainability**: Performa pencarian akan memburuk seiring bertambahnya volume data halaman.

2. **Absennya Try/Catch pada Transaksi Server Actions**
   - **Lokasi**: [src/lib/actions/claim.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/lib/actions/claim.ts) (`processClaimItem`) dan [src/lib/actions/lost-report.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/lib/actions/lost-report.ts) (`createLostReport`).
   - **Bukti Codebase**: Transaksi Prisma dijalankan secara langsung tanpa penangkap error `try {} catch (error) {}`.
   - **Dampak**: Jika database PostgreSQL melempar error (seperti konflik ID ganda atau kegagalan constraint), aplikasi akan mengalami crash runtime server dan memicu tampilan 500 error mentah kepada user.
   - **Pentingnya Sustainability**: Merusak keandalan aplikasi di production.

3. **Batasan Bisnis Kaku Generator NIS**
   - **Lokasi**: [src/lib/utils/nisGenerator.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/lib/utils/nisGenerator.ts) line 21.
   - **Bukti Codebase**: Pengecekan hardcoded `if (sequencePart < 26)`.
   - **Dampak**: Membatasi entri data pendaftaran warga hanya sebanyak 26 orang per tahun ajaran. Siswa ke-27 akan memaksa sistem berganti prefix tahun ajaran baru secara prematur.
   - **Pentingnya Sustainability**: Logika ini tidak scalable untuk institusi dengan jumlah siswa lebih dari 26 orang.

---

### 🟡 MEDIUM (Menurunkan Kualitas Pemeliharaan & Standard Desain)

1. **Bypass Token Design System**
   - **Lokasi**: Hampir di semua komponen JSX (misal `Notification.tsx`, `StepDetailBarang.tsx`, `WargaClient.tsx`).
   - **Bukti Codebase**: Penggunaan nilai warna ad-hoc seperti `[#0d3b2e]` dan `[#3dbd84]` langsung di class name, alih-alih menggunakan token CSS terkonfigurasi.
   - **Dampak**: Re-branding warna aplikasi akan membutuhkan proses modifikasi manual di puluhan lokasi file.
   - **Pentingnya Sustainability**: Merusak konsistensi visual jangka panjang dan memperlambat pengerjaan frontend oleh developer lain.

2. **Gumpalan State Duplikasi Warga Tambah Baru**
   - **Lokasi**: [src/app/data-warga/WargaClient.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/data-warga/WargaClient.tsx) line 125.
   - **Bukti Codebase**: Logika pendaftaran warga memasukkan data optimis `newTempWarga` ke state lokal, namun tidak menghapusnya saat server action sukses. Data asli kemudian di-insert kembali via realtime listener.
   - **Dampak**: Muncul baris data ganda (duplikat sementara) di layar saat pendaftaran data warga baru berhasil dilakukan.

3. **Kesalahan Visual Hierarki Z-Index (Navbar Overlaps Modal)**
   - **Lokasi**: `Navbar.tsx` (`z-[1030]`) vs `WargaClient.tsx` (`z-50`).
   - **Bukti Codebase**: Header menggunakan z-index yang jauh lebih tinggi daripada modal dialog.
   - **Dampak**: Saat modal tambah warga terbuka dan layar di-scroll, Navbar/Header akan melayang di atas modal, merusak susunan antarmuka.

4. **Lazy Database Write pada Operasi Read**
   - **Lokasi**: Fungsi `checkAndExpireItems` dipanggil secara inline di alur data fetching barang temuan.
   - **Bukti Codebase**: Pemanggilan `await checkAndExpireItems()` di `matching.ts` dan `claim.ts`.
   - **Dampak**: Setiap operasi pencarian barang membebani database PostgreSQL dengan query write `updateMany`.

---

### 🟢 LOW (Minor Polishing & Aksesibilitas)

1. **Tipe Data Longgar (Bypass TypeScript Static Checker)**
   - **Lokasi**: File client-side riwayat (`LaporanRow.tsx:7`, `TemuanRow.tsx:7`, dll.).
   - **Bukti Codebase**: Deklarasi properti `item: any`.
   - **Dampak**: Kehilangan deteksi error ketidakcocokan tipe data saat build-time.
   - **Pentingnya Sustainability**: Menurunkan tingkat keandalan kode TSX.

2. **Ketiadaan Aksesibilitas Keyboard Dropdown**
   - **Lokasi**: `Notification.tsx` dan `NavTabs.tsx`.
   - **Bukti Codebase**: Penutupan dropdown hanya dipasang untuk event `mousedown` klik luar, tidak ada bind untuk tombol keyboard `Escape`.
   - **Dampak**: Menyulitkan navigasi bagi pengguna dengan keterbatasan motorik atau pengguna screen reader.

---

## Bagian 20 — Aspek Positif & Hal yang Sudah Bagus

Tidak semua pola di project LACAK dinilai buruk. Terdapat beberapa implementasi arsitektur yang sudah dirancang dengan baik:
1. **Pemilihan Next.js Server Components**: Alur pemuatan data (data fetching) awal menggunakan Prisma di server component sudah sangat tepat. Hal ini mengurangi beban kerja JavaScript pada browser client dan mempercepat *First Contentful Paint* (FCP).
2. **Pola Modularisasi Komponen**: Komponen-komponen dinamis yang terisolasi dari form besar (seperti `WargaVerificationCard` dan `StepDetailBarang`) sudah dipecah ke dalam folder terpisah, membuat struktur codebase tidak terlalu berantakan.
3. **Penyelesaian Masalah Dropdown Terpotong**: Penggunaan React Portal untuk memindahkan stacking context elemen dropdown aksi di `WargaRow.tsx` langsung ke root document body adalah teknik yang sangat bagus dan berhasil memecahkan batasan layout tabel `overflow-hidden`.
4. **Clean Schema Database**: Struktur relasi skema database di `schema.prisma` sudah tersusun secara normalisasi dengan baik (menggunakan tabel master data untuk Kategori, Warna, Merek, dan Lokasi).

---

## Bagian 21 — Kesimpulan Akhir & Jawaban Pertanyaan Utama

### 1. Seberapa sehat arsitektur LACAK saat ini?
Arsitektur LACAK saat ini cukup sehat untuk skala project kecil atau MVP (*Minimum Viable Product*). Namun, project ini memiliki beberapa **bom waktu arsitektur** (seperti autentikasi yang tidak sengaja terbuka, race condition pada kode unik, dan sync ganda state realtime) yang harus segera dibenahi sebelum dirilis ke lingkungan production.

### 2. Apa masalah arsitektur terbesar?
Masalah terbesar adalah **absennya file `middleware.ts`**. Logika pengamanan rute internal hanya tertulis di file proxy mati (`src/proxy.ts`), menyebabkan seluruh data sensitif (data warga, riwayat klaim) terekspos secara publik.

### 3. Apa technical debt terbesar?
- Penulisan style inline ad-hoc yang mengabaikan sistem design tokens.
- Eksekusi lazy data cleanup database (`checkAndExpireItems`) yang menumpang secara inline pada query pencarian data biasa.

### 4. Apakah styling architecture sudah sustainable?
**Belum sustainable**. Ketiadaan standarisasi class component (misal menyatukan style select box atau input card yang seragam) akan menyulitkan pemeliharaan frontend ketika jumlah halaman bertambah dari 5 menjadi 50 halaman.

### 5. Apakah component architecture sudah sustainable?
**Cukup sustainable di level pembagian file**, namun masih perlu dibuatkan komponen-komponen visual primitif reusable (seperti komponen `<Table />` atau `<Button />`) untuk menggantikan duplikasi layout tabel riwayat saat ini.

### 6. Apakah project siap berkembang dengan developer tambahan?
**Siap secara struktur folder standar Next.js**, namun developer baru akan menghadapi kebingungan akibat banyaknya kode mati (seperti `sync-user.ts` yang tidak pernah dipanggil), penggunaan tipe data `any`, serta tidak adanya jaminan unit test untuk memverifikasi fungsionalitas logika pencocokan barang temuan.

### 7. Bagian mana yang paling berisiko jika project menjadi jauh lebih besar?
- **Sistem Matcher / Expiration**: Skema lazy expiration `checkAndExpireItems` yang dipanggil di setiap query akan membebani server database PostgreSQL seiring meningkatnya volume pencarian barang.
- **Race Condition Generator NIS/Business Code**: Pendaftaran warga atau barang secara konkuren akan memicu crash database akibat tumpang tindihnya ID unik yang dihitung manual via `count() + 1`.

---
*Laporan ini murni berupa analisis arsitektur kode saat ini tanpa mengubah, menghapus, atau menambahkan fungsionalitas kode pada codebase `lacak-v1`.*
