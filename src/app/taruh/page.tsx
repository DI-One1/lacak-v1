// app/taruh/page.tsx (Atau sesuaikan dengan letak page_7.tsx kamu)
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import TaruhBarangForm from "./TaruhBarangForm"; // Import Client Component yang kita buat di bawah

export default async function TaruhBarangPage() {
  // Mengambil master data secara dinamis dari database PostgreSQL
  const categories = await prisma.categoryItem.findMany();
  const colors = await prisma.colorItem.findMany();
  const brands = await prisma.brandItem.findMany();
  const locations = await prisma.locationItem.findMany();

  return (
    <TaruhBarangForm 
      categories={categories} 
      colors={colors} 
      brands={brands} 
      locations={locations} 
    />
  );
}