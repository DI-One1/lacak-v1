import { prisma } from "@/lib/prisma";

export async function generateNextNIS(): Promise<string> {
  // 1. Ambil data warga terakhir berdasarkan ID tertinggi
  const lastWarga = await prisma.warga.findFirst({
    orderBy: { id: 'desc' } 
  });

  // 2. Jika belum ada data sama sekali, mulai dari tahun ajaran default (misal 24/25)
  if (!lastWarga) {
    return "2425001";
  }

  const lastId = lastWarga.id; // Contoh: "2425026"
  
  // 3. Pecah ID menjadi bagian Tahun dan bagian Urutan
  const yearPart = lastId.substring(0, 4); // "2425"
  const sequencePart = parseInt(lastId.substring(4, 7), 10); // 26

  // 4. Logika Pengecekan Batas 26 Data
  if (sequencePart < 26) {
    // Masih dalam tahun ajaran yang sama, tambah 1
    const nextSeq = String(sequencePart + 1).padStart(3, "0");
    return `${yearPart}${nextSeq}`;
  } else {
    // Sudah mencapai 26, pindah ke tahun ajaran berikutnya
    const startYear = parseInt(yearPart.substring(0, 2), 10) + 1; // 24 -> 25
    const endYear = parseInt(yearPart.substring(2, 4), 10) + 1;   // 25 -> 26
    return `${startYear}${endYear}001`; // Menghasilkan "2526001"
  }
}
