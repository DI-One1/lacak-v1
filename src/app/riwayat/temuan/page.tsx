export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import TemuanClient from "./TemuanClient";

export default async function RiwayatTemuanPage() {
  const foundItems = await prisma.foundItem.findMany({
    include: {
      jenis: true,
      warna: true,
      merek: true,
      lokasi: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl flex-grow">
      {/* Header & Navigasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/" className="text-sm text-gray-500 hover:text-[#3dbd84] flex items-center gap-2 w-fit mb-2 transition-colors">
            <span>&larr;</span> Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-extrabold text-[#0d3b2e]">Riwayat Barang Temuan</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Daftar barang temuan yang telah diamankan and didaftarkan ke dalam sistem LACAK.
          </p>
        </div>

        <Link
          href="/taruh"
          className="bg-[#3dbd84] hover:bg-[#32a873] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-center"
        >
          + Taruh Barang Temuan
        </Link>
      </div>

      {/* Render Client Component untuk Interaksi & Tabel */}
      <Suspense fallback={<div className="text-center py-10 text-gray-500">Memuat riwayat barang temuan...</div>}>
        <TemuanClient foundItems={foundItems} />
      </Suspense>
    </div>
  );
}