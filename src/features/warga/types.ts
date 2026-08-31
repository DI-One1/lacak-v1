/**
 * Tipe data Warga yang dipakai di seluruh aplikasi.
 * Menggunakan snake_case agar sesuai dengan mapping dari Prisma → client.
 */
export interface Warga {
  id: string;
  nama: string;
  peran: string;
  keterangan_peran: string | null;
  nomor_telepon: string | null;
  created_at: string;
}

/**
 * Tipe filter untuk riwayat aksi warga.
 * Bukan NavTabs — ini filter lokal di halaman detail individu.
 */
export type ActivityType = "ALL" | "LAPORAN" | "TARUH" | "PENGAMBILAN";

/**
 * Satu item dalam riwayat aksi warga.
 * Dihasilkan oleh getWargaActivityHistory() dari gabungan
 * lostReports + foundItems + claimTransactions.
 */
export interface WargaActivityItem {
  id: string;
  type: "LAPORAN" | "TARUH" | "PENGAMBILAN";
  title: string;
  category: string;
  businessCode?: string;
  lokasi: string;
  status: string;
  date: string;
  description?: string | null;
}
