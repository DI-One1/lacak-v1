import { prisma } from "@/lib/prisma";
import WargaClient from "./WargaClient";

// BARIS INI YANG BIKIN DATA GAK BASI (CACHE MATI)
export const dynamic = "force-dynamic";

export default async function DataWargaPage() {
  const rows = await prisma.warga.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Map ke bentuk snake_case biar WargaClient.tsx nggak perlu diubah
  const initialData = rows.map((w) => ({
    id: w.id,
    nama: w.nama,
    peran: w.peran,
    keterangan_peran: w.keteranganPeran,
    nomor_telepon: w.nomorTelepon,
    created_at: w.createdAt.toISOString(),
  }));

  return <WargaClient initialData={initialData} />;
}