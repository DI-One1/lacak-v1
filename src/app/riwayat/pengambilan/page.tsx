export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import PengambilanClient from "./PengambilanClient"; // Import Client Component baru

export default async function RiwayatPengambilanPage() {
  const claims = await prisma.claimTransaction.findMany({
    include: {
      foundItem: {
        include: { jenis: true, warna: true, merek: true, lokasi: true },
      },
    },
    orderBy: { claimedAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl flex-grow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/" className="text-sm text-gray-500 hover:text-[#3dbd84] flex items-center gap-2 w-fit mb-2 transition-colors">
            <span>&larr;</span> Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-extrabold text-[#0d3b2e]">Riwayat Pengambilan Barang</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Daftar transaksi serah terima barang temuan kepada pemilik sah di sistem LACAK.
          </p>
        </div>
        <Link href="/ambil" className="bg-[#3dbd84] hover:bg-[#32a873] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-center">
          + Proses Pengambilan Baru
        </Link>
      </div>

      {/* Oper data ke Client Component */}
      <Suspense fallback={<div className="text-center py-10 text-gray-500">Memuat riwayat pengambilan...</div>}>
        <PengambilanClient claims={claims} />
      </Suspense>
    </div>
  );
}