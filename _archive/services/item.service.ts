import { prisma } from "@/lib/prisma";

/**
 * Membentuk Business Code dengan format: [Inisial]-[Hash 3 Digit]-[Counter 4 Digit]
 * Contoh: A-129-0001
 */
export async function generateBusinessCode(
  jenisId: string,
  warnaId: string,
  merekId: string,
  lokasiId: string
): Promise<string> {
  // 1. Ambil data master untuk membentuk inisial & string hash
  const [jenis, warna, merek, lokasi] = await Promise.all([
    prisma.categoryItem.findUnique({ where: { id: jenisId } }),
    prisma.colorItem.findUnique({ where: { id: warnaId } }),
    prisma.brandItem.findUnique({ where: { id: merekId } }),
    prisma.locationItem.findUnique({ where: { id: lokasiId } }),
  ]);

  if (!jenis || !warna || !merek || !lokasi) {
    throw new Error("Data master tidak valid!");
  }

  // A. Inisial Jenis Barang (misal: 'A' dari 'Alat Tulis')
  const initial = jenis.name.trim().charAt(0).toUpperCase();

  // B. Hash 3 Digit dari kombinasi Warna + Merek + Lokasi
  const rawCombination = `${warna.name}-${merek.name}-${lokasi.name}`.toLowerCase();
  let hashNum = 0;
  for (let i = 0; i < rawCombination.length; i++) {
    hashNum = (hashNum << 5) - hashNum + rawCombination.charCodeAt(i);
    hashNum |= 0;
  }
  // Konversi ke 3 digit positif (100 - 999)
  const hash3Digit = String(Math.abs(hashNum) % 900 + 100);

  // C. Hitung urutan (Counter) barang dengan kombinasi Kategori + Hash serupa
  const prefixPattern = `${initial}-${hash3Digit}-`;
  const countSameCategory = await prisma.foundItem.count({
    where: {
      businessCode: {
        startsWith: prefixPattern,
      },
    },
  });

  const nextCounter = String(countSameCategory + 1).padStart(4, "0");

  return `${initial}-${hash3Digit}-${nextCounter}`;
}