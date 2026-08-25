import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LaporForm from "./LaporForm"; // Sesuaikan path jika berbeda

export default async function LaporKehilanganPage() {
  // Mengambil master data secara dinamis dari database PostgreSQL
  const categories = await prisma.categoryItem.findMany();
  const colors = await prisma.colorItem.findMany();
  const brands = await prisma.brandItem.findMany();
  const locations = await prisma.locationItem.findMany();

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl flex-grow">
      
      {/* Navigasi Kembali & Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-[#3dbd84] flex items-center gap-2 w-fit mb-4 transition-colors">
          <span>&larr;</span> Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0d3b2e]">Lapor Kehilangan</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Laporkan kehilangan barang untuk dipasangkan dengan temuan atau langsung klaim barang yang sudah terdaftar.
        </p>
      </div>

      {/* Panggil Komponen Form dengan Props */}
      <LaporForm 
        jenisList={categories}
        warnaList={colors}
        merekList={brands}
        lokasiList={locations}
      />
    </div>
  );
}