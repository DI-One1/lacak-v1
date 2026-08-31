# Rancangan Visualisasi: Arsitektur Folder & File Professional `lacak-v1`

Dokumen ini merancang tata letak dan hierarki folder yang telah dirombak ke arah standar industri untuk **Next.js App Router (Production-Grade)**. 

Karena `lacak-v1` menggunakan Next.js (bukan Single Page Application React biasa), strukturnya harus dirancang untuk mendukung server actions, hybrid rendering (Server vs. Client Components), database ORM (Prisma), dan integrasi autentikasi Clerk.

---

## 1. Visualisasi Folder & File (Proposed Architecture)

Berikut adalah visualisasi hierarki folder `src/` yang baru, bersih, modular, dan berbasis fitur (*domain/feature-driven*):

```text
src/
│
├── app/                        # ROUTING LAYER (Murni navigasi & data fetching awal)
│   ├── (auth)/                 # Route Grouping untuk halaman autentikasi
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── api/                    # API Routes (Backend Endpoints)
│   │   └── public/
│   │       └── found-items/route.ts
│   ├── dashboard/              # Halaman Dashboard utama
│   │   └── page.tsx
│   ├── data-warga/             # Halaman pengelolaan data warga
│   │   └── page.tsx
│   ├── lapor/                  # Halaman pembuatan laporan kehilangan
│   │   └── page.tsx
│   ├── ambil/                  # Halaman serah terima barang
│   │   └── page.tsx
│   ├── riwayat/                # Halaman riwayat (dengan Sub-routes)
│   │   ├── laporan/page.tsx
│   │   ├── temuan/page.tsx
│   │   └── pengambilan/page.tsx
│   ├── access-denied/page.tsx  # Halaman error / hak akses
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # Landing Page
│
├── components/                 # GLOBAL UI COMPONENT LAYER
│   ├── ui/                     # Design System Primitives (Agnostik Data, Murni Visual)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx           # Reusable Modal dengan Focus Trap & Keyboard Esc
│   │   └── Table.tsx           # Reusable Responsive Table
│   └── shared/                 # Komponen Layout Global (Consuming data & UI components)
│       ├── Navbar.tsx
│       ├── SearchBar.tsx       # SearchBar dengan debounced input
│       ├── Notification.tsx
│       └── UserProfile.tsx
│
├── features/                   # DOMAIN-DRIVEN FEATURE LAYER (Core Business Logic)
│   │
│   ├── warga/                  # Domain Warga (Siswa, Guru, Staf)
│   │   ├── components/         # Komponen khusus domain warga
│   │   │   ├── WargaRow.tsx    # Menggunakan portal dropdown dari components/ui
│   │   │   ├── WargaProfileModal.tsx
│   │   │   └── WargaActivityModal.tsx
│   │   ├── actions.ts          # Server Actions untuk Warga (tambahWarga, hapusWarga, dll)
│   │   ├── types.ts            # Tipe TypeScript lokal khusus domain Warga
│   │   └── hooks.ts            # Custom hook khusus (misal: useWargaRealtime)
│   │
│   ├── item/                   # Domain Barang (LostReport & FoundItem)
│   │   ├── components/         # Komponen khusus inventaris & laporan barang
│   │   │   ├── StepDetailBarang.tsx
│   │   │   └── SearchableFoundItem.tsx
│   │   ├── actions/            # Server Actions dibagi per berkas agar tidak menumpuk
│   │   │   ├── found-item.ts
│   │   │   ├── lost-report.ts
│   │   │   └── matching.ts
│   │   └── types.ts
│   │
│   └── claim/                  # Domain Klaim & Serah Terima Barang
│       ├── components/
│       │   ├── StepPilihLaporan.tsx
│       │   ├── StepIdentifikasiBarang.tsx
│       │   └── StepKonfirmasiKlaim.tsx
│       ├── actions.ts          # Server Actions untuk Klaim (processClaimItem)
│       └── types.ts
│
├── hooks/                      # GLOBAL UTILITY HOOKS (Client-side behaviors)
│   ├── useDebounce.ts          # Digunakan untuk input text search agar tidak flooding
│   ├── useClickOutside.ts      # Deteksi klik luar dropdown/modal
│   └── useKeyboardShortcut.ts  # Shortcut escape, dll
│
├── lib/                        # SERVICES & RUNTIME CLIENTS LAYER
│   ├── prisma.ts               # Prisma ORM Singleton Client
│   ├── supabase.ts             # Supabase Realtime Client
│   └── clerk.ts                # Clerk SDK Wrapper (jika ada custom config)
│
├── utils/                      # PURE HELPER FUNCTIONS LAYER (Agnostik State)
│   ├── codeGenerator.ts        # Generator kode unik barang
│   ├── nisGenerator.ts         # Generator NIS warga
│   └── dateFormat.ts           # Format tanggal & penunjuk waktu (timeAgo)
│
├── types/                      # GLOBAL TYPE DECLARATIONS
│   └── index.ts                # Tipe shareable lintas domain
│
├── middleware.ts               # 🛡️ GLOBAL ROUTE GUARD (Di folder src/ untuk Clerk Auth)
└── styles/                     # GLOBAL STYLE CONFIGURATION
    └── globals.css
```

---

## 2. Alasan Mengapa Harus Seperti Ini (The Rationale)

Mengubah struktur folder Next.js App Router menjadi berorientasi **Domain-Driven Feature Layer** dan memisahkan **Design System Primitives** membawa keuntungan besar untuk pemeliharaan jangka panjang:

### A. Solusi untuk Masalah Utama (Bypass Autentikasi)
* **Middleware Terdeteksi**: Di Next.js, file middleware **harus** dinamakan `middleware.ts` dan diletakkan di root folder `/src` (bukan `src/proxy.ts`). Dengan memindahkan file ini ke lokasi yang tepat (`src/middleware.ts`), routing guard Next.js akan aktif secara otomatis dan mengunci rute sensitif secara aman.

### B. Isolasi Kode melalui Fitur (Feature Layer vs Fragmented Folders)
* **Kondisi Lama**: Kode satu fitur tersebar di mana-mana. File action warga ada di `lib/actions/warga.ts`, tipenya di `types/warga.ts`, dan komponennya di `components/warga`. Pengembang harus membuka 4 folder berbeda untuk memodifikasi satu fitur.
* **Kondisi Baru**: Konsep **Domain-Driven (Colocation)** menaruh file actions, types, components, dan hooks lokal Warga ke dalam satu folder terintegrasi (`src/features/warga/`). Pengembang baru cukup fokus ke folder tersebut untuk mengembangkan fitur terkait warga.

### C. Pemisahan UI Primitives (`components/ui`)
* Memaksa pembuatan file style atomic seperti `<Button />`, `<Input />`, `<Select />`, dan `<Table />`.
* **Solusi Duplikasi CSS**: Class style visual box input, tombol, dan card yang sebelumnya ditulis berulang-ulang kini diatur sekali saja di dalam file primitive ini. Penggunaannya cukup memanggil `<Input required />` atau `<Select inputList={warna} />`.

### D. Solusi untuk Input Pencarian Lambat (Debouncing)
* Halaman pencarian saat ini mengalami *input lag* karena `router.replace` berjalan di setiap huruf yang diketik.
* Melalui struktur baru, kita membuat global custom hook `useDebounce.ts` di folder `src/hooks/`. Search input akan membaca query lewat state local, mendebounce input selama 300ms, lalu baru memperbarui URL query string menggunakan Next.js router. Hal ini memotong navigasi redundan hingga **80%**.

### E. Solusi untuk Dynamic Stacking Order (Z-Index)
* Di struktur baru, component modal global diletakkan di `components/ui/Modal.tsx` dengan standarisasi `z-index` yang tinggi (misal `z-[2000]`).
* Ini memastikan tidak ada lagi tab navigasi (`z-[1050]`) atau Navbar (`z-[1030]`) yang melayang menutupi layar dialog modal (`z-50` pada project lama). Modal dipaksa berada di urutan teratas secara terpusat.

### F. API Route & Server Actions yang Terorganisir
* Folder `src/app/` dibersihkan dari subkomponen visual berukuran besar. Berkas `page.tsx` di `src/app/data-warga/page.tsx` hanya bertanggung jawab melakukan query database server-side, lalu langsung mengoper data mentah ke `<WargaClient />` yang berada di layer fitur.
