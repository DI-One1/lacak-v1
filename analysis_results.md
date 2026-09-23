# 🔍 Analisis Komprehensif Project LACAK v1

> **Stack**: Next.js 16 (App Router) + Clerk Auth + Prisma + Supabase/PostgreSQL + Tailwind v4
> **Tipe Aplikasi**: Sistem Lost & Found Terintegrasi untuk sekolah (SMK TI Bazma)

---

## 1. Kekurangan Project

### 🔴 Kritis (Harus Diperbaiki)

| # | Masalah | Detail | File |
|---|---------|--------|------|
| 1 | **Tidak ada `error.tsx` boundary** | Tidak ada satupun file `error.tsx` di seluruh project. Jika ada crash (DB timeout, Clerk error), user melihat halaman putih atau error Next.js default yang jelek. | Seluruh `src/app/` |
| 2 | **Tidak ada `not-found.tsx`** | Akses URL random seperti `/xyz` akan menampilkan halaman 404 default Next.js. Seharusnya ada custom 404 page yang konsisten dengan brand LACAK. | `src/app/` |
| 3 | **Tidak ada `loading.tsx`** | Zero loading states di level route. Saat navigasi antar halaman, user tidak mendapat feedback visual apapun (blank screen sampai data selesai difetch). | Seluruh `src/app/` |
| 4 | **`syncUserToDatabase()` di RootLayout** | Setiap request ke halaman manapun (termasuk halaman publik yang tidak butuh auth) memicu panggilan `currentUser()` ke Clerk + `prisma.upsert`. Ini sangat mahal dan tidak perlu untuk visitor anonim. | [layout.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/MAPEL/SAAS/Kelas%2012/Praktik/lacak-project/lacak-v1/src/app/layout.tsx#L29-L31) |
| 5 | **Duplikasi CSS file** | Ada 2 file `globals.css`: satu di `src/app/globals.css` (345 baris) dan satu di `src/styles/globals.css` (94 baris). File kedua adalah subset identik dari yang pertama — redundan dan membingungkan. | [app/globals.css](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/MAPEL/SAAS/Kelas%2012/Praktik/lacak-project/lacak-v1/src/app/globals.css), [styles/globals.css](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/MAPEL/SAAS/Kelas%2012/Praktik/lacak-project/lacak-v1/src/styles/globals.css) |
| 6 | **Middleware naming — `proxy.ts` bukan `middleware.ts`** | Next.js mendeteksi middleware dari file bernama `middleware.ts` di root `src/`. File kamu bernama `proxy.ts` — ini **tidak akan dijalankan** sebagai middleware oleh Next.js kecuali ada konfigurasi khusus. | [proxy.ts](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/MAPEL/SAAS/Kelas%2012/Praktik/lacak-project/lacak-v1/src/proxy.ts) |
| 7 | **Hard-coded admin email** | Email `lacak.smktibazma@gmail.com` di-hardcode di **3 tempat berbeda** (proxy.ts, sync-user.ts, Navbar.tsx, PublicNavbar.tsx). Jika email berubah, harus update manual di 3+ file. | Lihat bawah |

### 🟡 Signifikan (Sebaiknya Diperbaiki)

| # | Masalah | Detail |
|---|---------|--------|
| 8 | **`force-dynamic` di 9 halaman** | Semua halaman database-driven menggunakan `force-dynamic`, artinya zero caching. Untuk master data (categories, colors, brands, locations) yang jarang berubah, ini sangat boros. |
| 9 | **Master data di-fetch 2x per request** | `getMasterData()` di-call di `RootLayout` DAN `getPublicData()` di landing page. Dua query identik. React `cache()` hanya de-dupe dalam satu render tree — tetapi karena dipanggil dari tempat berbeda, bisa jadi belum optimal. |
| 10 | **Tidak ada form validation library** | Form `createFoundItem`, `createLostReport` menggunakan raw `FormData` tanpa schema validation (Zod, dsb). Mudah error kalau ada field kosong yang lolos. |
| 11 | **Semua gambar dari Unsplash tanpa fallback lokal** | Jika koneksi lambat atau Unsplash down, semua card akan kosong/broken. Folder `public/` benar-benar kosong (0 file). |
| 12 | **Favicon berukuran 344KB** | File `favicon.ico` sebesar 352KB — sangat besar untuk favicon. Standar favicon biasanya < 10KB. |

---

## 2. Performa: Fungsi yang Harus Dimaksimalkan untuk Rendering DOM Lebih Cepat

### 🚀 Next.js Streaming & Suspense

```
Saat ini: layout.tsx → await getMasterData() → BLOCKING seluruh halaman
Seharusnya: Gunakan Streaming SSR + Suspense boundary per-section
```

**Masalah utama:** `RootLayout` melakukan `await getMasterData()` secara sinkron. Ini memblokir seluruh HTML response sampai query database selesai. Semua child route harus menunggu.

**Solusi:**

| Optimisasi | Dampak | Detail |
|-----------|--------|--------|
| **Hapus `await` blocking di layout** | ⚡ Tinggi | Pindahkan `getMasterData()` ke masing-masing route/component yang butuh, bungkus dengan `<Suspense>` |
| **Tambahkan `loading.tsx` per route** | ⚡ Tinggi | Next.js otomatis membungkus page dengan Suspense boundary — user melihat skeleton UI langsung |
| **Gunakan `React.cache()` + `unstable_cache`** | ⚡ Tinggi | Master data (kategori, warna, merek, lokasi) sangat jarang berubah. Gunakan `unstable_cache` dengan revalidation time 5-10 menit |
| **Hapus `syncUserToDatabase()` dari layout** | ⚡ Tinggi | Pindahkan ke middleware atau API route yang hanya diakses setelah login. Saat ini setiap request (termasuk visitor anonim) memicu Clerk API + DB write |
| **Hilangkan `force-dynamic` pada halaman read-only** | ⚡ Sedang | Landing page & pencarian bisa menggunakan ISR (`revalidate = 60`) alih-alih `force-dynamic` |
| **Next.js Image Component** | ⚡ Sedang | Semua gambar menggunakan `<img>` biasa. `next/image` memberikan lazy loading, responsive sizing, dan format otomatis (WebP/AVIF) |
| **Prefetch link yang sudah ada** | ✅ Baik | [PrefetchLink.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/MAPEL/SAAS/Kelas%2012/Praktik/lacak-project/lacak-v1/src/components/ui/PrefetchLink.tsx) sudah bagus, tapi hanya dipakai di dashboard — seharusnya dipakai di semua navigasi |

### Ilustrasi Waterfall Saat Ini

```
Browser Request
  └─ Server: RootLayout
       ├─ syncUserToDatabase()     ← ❌ Clerk API + DB write (200-500ms)
       ├─ await getMasterData()    ← ❌ 4 DB queries (100-300ms)
       └─ Render children
            └─ page.tsx: await getPublicData()  ← ❌ 5 DB queries lagi (200-400ms)
                 └─ HTML dikirim ke browser   ← Total: 500ms - 1.2s delay!
```

### Seharusnya

```
Browser Request
  └─ Server: RootLayout (NO AWAIT, langsung kirim shell HTML)
       ├─ <Suspense fallback={<NavSkeleton />}>
       │     └─ <RouteChrome /> (fetch master data sendiri)
       ├─ <main>{children}</main>
       └─ <footer />
            
  ← HTML shell terkirim dalam < 50ms
  ← Streaming: NavBar data masuk 100-200ms kemudian
  ← Streaming: Page content masuk 200-300ms kemudian
```

---

## 3. Inkonsistensi UI

### 🎨 Warna yang Tidak Konsisten

| Elemen | Warna yang Dipakai | Seharusnya |
|--------|-------------------|------------|
| **Body background** di CSS theme | `#faf9f6` (cream) | — |
| **Body background** di `layout.tsx` | `bg-[#fdfdfd]` (putih-abu) | ❌ Tidak sama |
| **Landing page background** | `bg-[#fafcfb]` | ❌ Warna ketiga |
| **Dashboard background** | `bg-[#fafcfb]` | ❌ Duplikat tapi beda dari CSS theme |
| **Public portal background** | `#fff` (putih) via CSS `.public-portal` | ❌ Warna keempat |

> **Kesimpulan:** Background utama menggunakan **4 warna berbeda** di tempat berbeda. Seharusnya satu variabel CSS (`--color-cream` atau `--bg-main`).

### 🔤 Typography yang Tidak Konsisten

| Elemen | Font | File |
|--------|------|------|
| Layout `<body>` | `Inter` (Google Fonts) | `layout.tsx` line 11 |
| CSS body | `Poppins` via `--font-poppins` | `globals.css` line 14 |
| Public heading | `Georgia, "Times New Roman", serif` | `globals.css` line 276 |
| Modal heading | `Georgia, "Times New Roman", serif` | `globals.css` line 316 |

> **Kesimpulan:** Ada **3 font family** yang bertabrakan — `Inter` di-load via next/font tapi `Poppins` dideklarasikan di CSS. Font `Inter` yang di-load kemungkinan di-override oleh `Poppins` di body CSS. Dan font `Georgia` dipakai di headings publik. **Poppins bahkan tidak pernah di-load** (tidak ada `<link>` atau `import` Google Fonts untuk Poppins).

### 🧩 Komponen Navbar Ganda

| Kondisi | Navbar yang Render | Style |
|---------|-------------------|-------|
| Halaman `/`, `/pencarian` | `PublicNavbar` | Background putih, sticky, border bottom |
| Halaman `/tentang-kami`, `/beri-saran` | Bagian publik `Navbar` | Background `#0d3b2e` gelap, sticky |
| Halaman dashboard/admin | Bagian admin `Navbar` | Background `#0d3b2e` gelap, sticky |

> **Masalah:** 
> - Ada **2 komponen navbar terpisah** (`PublicNavbar` 600 baris dan `Navbar` 172 baris) dengan logika duplikat (cek email petugas, mobile menu, dsb)
> - Tapi `RouteChrome.tsx` mengembalikan `null` untuk `/tentang-kami` dan `/beri-saran`, sementara `Navbar.tsx` sendiri juga punya logika `isPublicPage` yang render header hijau untuk path tersebut — sehingga halaman itu **tidak akan punya navbar sama sekali**.

### 🔘 Button Inconsistency

| Tempat | Style Pattern |
|--------|--------------|
| `<Button>` component | `rounded-xl`, variant system, Tailwind classes |
| Dashboard module cards | Inline `className` dengan `bg-[#0d7565] rounded-xl` — **tidak menggunakan `<Button>`** |
| Public portal CTA | Inline `rounded-[7px] bg-[#087666]` — **tidak menggunakan `<Button>`, bahkan beda border-radius dan warna** |
| Filter reset button | Vanilla CSS class `.public-reset` — beda styling system |

> **Kesimpulan:** Kamu sudah punya `<Button>` component yang bagus dengan 5 variant, tapi di banyak tempat menggunakan inline styles secara manual. Warna hijau primary saja ada **3 varian** yang dipakai: `#0d3b2e`, `#0d7565`, `#087666`.

### 📏 Spacing & Container Inconsistency

| Halaman | Container Pattern |
|---------|------------------|
| Dashboard | `container mx-auto px-4 md:px-8` |
| Lapor | `container mx-auto px-4 md:px-8 max-w-4xl` |
| Public Portal | `max-width: 1230px` (CSS) |
| Public Navbar | `max-width: 1230px` (CSS) |
| Shared Navbar | `max-w-[1240px]` (Tailwind) |
| Footer | `max-w-[1240px]` (Tailwind) |

> Container width berbeda: `1230px` vs `1240px` — subtle tapi inkonsisten.

---

## 4. Struktur Folder & File

### Peta Struktur Saat Ini

```
src/
├── app/                      # Next.js App Router pages
│   ├── access-denied/
│   ├── ambil/
│   ├── api/public/
│   ├── beri-saran/
│   ├── dashboard/
│   ├── data-warga/
│   ├── lapor/
│   ├── pencarian/
│   ├── riwayat/              # Sub-routes: temuan, laporan, pengambilan
│   ├── sign-in/
│   ├── taruh/
│   ├── tentang-kami/
│   ├── globals.css           ← CSS utama
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── public/               # 9 komponen (PublicNavbar 600 baris!)
│   ├── shared/               # 7 komponen (Navbar, Notification, dll)
│   └── ui/                   # 11 komponen primitif (Button, Card, dll)
├── constants/
│   └── assets.ts
├── features/
│   ├── claim/                # actions, components, types
│   ├── item/                 # actions, components, services, types, utils
│   └── warga/                # actions, components, types
├── generated/                # Prisma generated client
├── hooks/                    # 3 custom hooks
├── lib/                      # Prisma, Clerk, master data, sync-user
│   └── utils/                # codeGenerator, dateFormat, nisGenerator
├── styles/
│   └── globals.css           ← ❌ DUPLIKAT (subset dari app/globals.css)
├── types/
│   └── index.ts
└── proxy.ts                  ← ❌ Seharusnya middleware.ts
```

### ✅ Yang Sudah Bagus

| Aspek | Penilaian |
|-------|-----------|
| **Feature-based structure** (`features/claim`, `features/item`, `features/warga`) | 👍 Sangat bagus! Separation of concerns yang jelas |
| **Pemisahan `components/ui` (primitif) vs `components/shared` (composed)** | 👍 Pola yang tepat |
| **Server Actions di `features/*/actions/`** | 👍 Co-location yang baik |
| **Custom hooks terpisah di `hooks/`** | 👍 Reusable |
| **Types centralized di `types/` dan per-feature** | 👍 Hybrid approach yang masuk akal |
| **Prisma schema well-organized** dengan `@@map` naming | 👍 DB naming convention konsisten |

### ❌ Yang Harus Diperbaiki

| Masalah | Detail | Rekomendasi |
|---------|--------|-------------|
| **`proxy.ts` di root `src/`** | File seharusnya bernama `middleware.ts` dan Next.js akan otomatis mengenalinya | Rename → `src/middleware.ts` |
| **`styles/globals.css` duplikat** | 94 baris identik dengan bagian awal `app/globals.css` | Hapus `src/styles/globals.css` |
| **Komponen page-specific di `app/` folder** | `TaruhBarangForm.tsx`, `LaporForm.tsx`, `TemuanClient.tsx` ada di folder route, bukan di `features/` | Pindahkan ke `features/item/components/` atau `features/claim/components/` |
| **`components/public/` berisi 9 file besar** | `PublicNavbar.tsx` saja 600 baris, `CarouselFoundItems.tsx` 500+ baris | Pecah menjadi sub-komponen. `PublicNavbar` seharusnya ≤ 200 baris |
| **Tidak ada barrel exports (`index.ts`)** | Di `components/ui/` tidak ada `index.ts` untuk re-export | Tambahkan `index.ts` untuk cleaner imports |
| **`generated/` folder di `src/`** | Prisma generated client di-commit ke source — seharusnya diabaikan oleh git dan di-generate saat build | Tambahkan ke `.gitignore` |

### 📊 Skor Struktur Folder

| Kriteria | Skor | Catatan |
|----------|------|---------|
| Separation of Concerns | ⭐⭐⭐⭐ | Feature-based baik, tapi beberapa komponen bocor ke `app/` |
| Naming Convention | ⭐⭐⭐ | Mix bahasa (Indonesia + English), `proxy.ts` salah nama |
| Scalability | ⭐⭐⭐ | Cukup untuk project saat ini, tapi `components/public/` perlu refactor |
| Discoverability | ⭐⭐⭐ | Tidak ada barrel exports, CSS duplikat membingungkan |
| **Overall** | **⭐⭐⭐ (3/5)** | Fondasi bagus, butuh cleanup |

---

## 5. Ringkasan Prioritas Aksi

### 🔴 P0 — Harus Segera

1. **Rename `proxy.ts` → `middleware.ts`** (jika belum ada symlink/config khusus)
2. **Hapus `syncUserToDatabase()` dari RootLayout** — pindahkan ke route khusus admin
3. **Tambahkan `error.tsx` dan `not-found.tsx`**
4. **Hapus `src/styles/globals.css`** (duplikat)
5. **Fix font conflict** — pilih satu: Inter ATAU Poppins, hapus yang lain

### 🟡 P1 — Dampak Performa Tinggi

6. **Tambahkan `loading.tsx`** di route utama (dashboard, riwayat, taruh, ambil, lapor)
7. **Implementasi streaming SSR** — hapus `await getMasterData()` blocking di layout
8. **Ganti semua `force-dynamic`** dengan ISR/revalidation untuk halaman read-only
9. **Ganti `<img>` → `next/image`** di seluruh project
10. **Konsolidasi admin email** ke satu environment variable

### 🟢 P2 — Kualitas & Konsistensi

11. **Unifikasi warna background** ke satu CSS variable
12. **Gunakan `<Button>` component** di semua tempat (bukan inline styles)
13. **Unifikasi container width** ke satu nilai (1240px)
14. **Pecah `PublicNavbar.tsx`** (600 baris → max 200 baris per komponen)
15. **Pindahkan page-specific components** dari `app/` ke `features/`
16. **Tambahkan form validation** (Zod + server action validation)
17. **Compress favicon** (352KB → < 10KB)
