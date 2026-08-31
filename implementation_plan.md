# Rencana Implementasi Restrukturisasi Folder & File modular profesional `lacak-v1`

Dokumen ini merinci rencana penyelesaian migrasi arsitektur pada proyek `lacak-v1` menuju **Proposed Architecture** yang bersih dan berorientasi fitur (*domain-driven feature layer*). Rencana ini juga menangani isu-isu kritis/penting yang tercantum dalam `audit_report.md`.

## Analisis Kondisi Aktual (GAP)

1. **Routing Layer (`src/app/`)**:
   - Halaman data warga (`src/app/data-warga/page.tsx`) masih menggunakan `WargaClient.tsx` lama yang berada di folder routing.
   - Halaman pengambilan barang (`src/app/ambil/page.tsx`) masih menggunakan `AmbilBarangClient.tsx` lama.
   - Berkas `middleware.ts` sudah ada di `/src/middleware.ts` (aman dan aktif).
2. **Components (`src/components/`)**:
   - Terdapat folder `src/components/navbar/` yang duplikat dengan `src/components/shared/`.
   - `Navbar` yang aktif di `layout.tsx` adalah versi lama (`@/components/navbar/Navbar`) yang menggunakan `SearchBar` non-debounced.
   - Komponen visual `StepDetailBarang.tsx` masih berada di `src/components/lapor/`.
   - Komponen `SearchableFoundItem.tsx` masih berada di `src/components/`.
   - Komponen serah terima klaim (`StepPilihLaporan.tsx`, `StepIdentifikasiBarang.tsx`, `StepKonfirmasiKlaim.tsx`) masih berada di `src/components/ambil/`.
3. **Features (`src/features/`)**:
   - `src/features/claim/` belum dibuat.
   - `src/features/item/components/` belum dibuat.
   - Actions dan components yang berada di fitur belum diintegrasikan kembali ke halaman `app/`.

---

## Proposed Changes

### 1. Komponen Pendukung Global & Layout (`components/`)

#### [MODIFY] [layout.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/layout.tsx)
- Ganti import `Navbar` dari `@/components/navbar/Navbar` ke `@/components/shared/Navbar`.
- Hubungkan/jalankan fungsi `syncUserToDatabase()` di dalam Server Component `RootLayout` untuk memicu sinkronisasi user Clerk ke tabel database `users` secara otomatis setiap kali ada interaksi.

#### [DELETE] [navbar](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/navbar)
- Hapus folder `src/components/navbar/` beserta isinya karena sudah diduplikasi secara bersih di `src/components/shared/`.

---

### 2. Domain Warga (`features/warga/`)

#### [MODIFY] [page.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/data-warga/page.tsx)
- Arahkan import `WargaClient` dari local component ke `@/features/warga/components/WargaClient`.

#### [DELETE] [data-warga/components](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/data-warga/components)
- Hapus file `WargaClient.tsx` dan `WargaRow.tsx` langsung di `src/app/data-warga/`.
- Hapus subfolder `src/app/data-warga/components/` (karena isinya sudah ada di `src/features/warga/components/`).
- Hapus `src/components/warga/WargaVerificationCard.tsx` (karena versinya sudah dipindahkan ke `src/features/warga/components/WargaVerificationCard.tsx`).

---

### 3. Domain Barang / Item (`features/item/`)

#### [NEW] [item/components](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/features/item/components)
- Pindahkan `src/components/lapor/StepDetailBarang.tsx` ke `src/features/item/components/StepDetailBarang.tsx`.
- Pindahkan `src/components/SearchableFoundItem.tsx` ke `src/features/item/components/SearchableFoundItem.tsx`.
- Refactor import di `StepDetailBarang.tsx` dan `SearchableFoundItem.tsx` untuk:
  - Mengambil actions dari `@/features/item/actions/...` bukan `@/lib/actions/...`.
  - Menggunakan modal global `<Modal>` (dari `@/components/ui/Modal`) dengan z-index `z-[2000]` dan focus trap di `SearchableFoundItem.tsx`.

#### [MODIFY] [LaporForm.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/lapor/LaporForm.tsx)
- Ganti import `createLostReport` ke `@/features/item/actions/lost-report`.
- Ganti import `getSemuaWarga` ke `@/features/warga/actions`.
- Ganti import `WargaVerificationCard` ke `@/features/warga/components/WargaVerificationCard`.
- Ganti import `StepDetailBarang` ke `@/features/item/components/StepDetailBarang`.
- Perbarui tipe `Warga` ke `@/features/warga/types`.

#### [MODIFY] [TaruhBarangForm.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/taruh/TaruhBarangForm.tsx)
- Ganti import `createFoundItem` dan `getBusinessCodePreview` ke `@/features/item/actions/found-item`.
- Ganti import `getSemuaWarga` ke `@/features/warga/actions`.
- Ganti import `WargaVerificationCard` ke `@/features/warga/components/WargaVerificationCard`.
- Perbarui tipe `Warga` ke `@/features/warga/types`.

#### [DELETE] [lapor](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/lapor)
- Hapus folder `src/components/lapor/` lama.
- Hapus file `src/components/SearchableFoundItem.tsx` lama.

---

### 4. Domain Klaim / Claim (`features/claim/`)

#### [NEW] [claim](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/features/claim)
- Buat folder `src/features/claim/`.
- **`actions.ts`**: Pindahkan business logic dari `src/lib/actions/claim.ts`.
  > [!IMPORTANT]
  > Optimalkan fungsi action agar *tidak* memanggil `checkAndExpireItems` pada pembacaan (seperti `verifyItemExists`, `getActiveLostReportsOfWarga`, `getMatchingFoundItemsForReport`). Fungsi `checkAndExpireItems` hanya dipanggil di write operation `processClaimItem`.
- **`types.ts`**: Tentukan tipe data lokal yang relevan untuk klaim.
- **`components/`**:
  - Pindahkan `src/components/ambil/StepPilihLaporan.tsx` ke `src/features/claim/components/StepPilihLaporan.tsx`.
  - Pindahkan `src/components/ambil/StepIdentifikasiBarang.tsx` ke `src/features/claim/components/StepIdentifikasiBarang.tsx`.
  - Pindahkan `src/components/ambil/StepKonfirmasiKlaim.tsx` ke `src/features/claim/components/StepKonfirmasiKlaim.tsx`.
  - Pindahkan `src/app/ambil/AmbilBarangClient.tsx` ke `src/features/claim/components/AmbilBarangClient.tsx`.
  - Refactor component-component di atas agar mengonsumsi actions dari `@/features/claim/actions` dan tipe-tipe modular.

#### [MODIFY] [page.tsx](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/app/ambil/page.tsx)
- Ganti import `getSemuaWarga` ke `@/features/warga/actions`.
- Ganti import `AmbilBarangClient` ke `@/features/claim/components/AmbilBarangClient`.

#### [DELETE] [ambil](file:///c:/Users/pcbaz/Desktop/Muhammad-Choerul-Akbar/Lainnya/Belajar/lacak-project/lacak-v1/src/components/ambil)
- Hapus folder `src/components/ambil/` lama.
- Hapus file `src/app/ambil/AmbilBarangClient.tsx` lama.

---

## Rencana Verifikasi

### Automated Verification
Setelah menerapkan seluruh restrukturisasi di atas, jalankan perintah berikut:
1. Periksa type-safety: `npx tsc --noEmit`
2. Jalankan build aplikasi: `npm run build`

### Manual Verification
1. Masuk ke halaman **Data Warga** dan pastikan penambahan warga, sinkronisasi realtime, riwayat aksi, dan popup modal berjalan mulus.
2. Masuk ke halaman **Taruh Barang** dan **Lapor Kehilangan**, pastikan form pencarian barang (debounced) dan verifikasi identitas warga berfungsi.
3. Masuk ke halaman **Ambil Barang**, pastikan alur klaim berjalan tanpa error.
4. Lakukan pengecekan pada notifikasi dropdown di Navbar, pastikan dropdown dapat ditutup dengan tombol `Escape` dan z-index modal dialog berada di atas Navbar.
