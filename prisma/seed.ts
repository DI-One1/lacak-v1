// 1. TAMBAHKAN BARIS INI PALING ATAS agar .env terbaca!
import "dotenv/config"; 

// 2. Import prisma dari lib
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('⏳ Memulai proses seeding data master...');

  // 1. Data Kategori Barang (Jenis)
  const categories = [
    { name: 'Elektronik', code: 'E' },
    { name: 'Dompet & Uang', code: 'D' },
    { name: 'Dokumen/Kertas', code: 'K' },
    { name: 'Pakaian/Tas', code: 'P' },
    { name: 'Kunci', code: 'U' },
    { name: 'Aksesoris', code: 'A' },
    { name: 'Lainnya', code: 'L' }
  ];
  for (const cat of categories) {
    await prisma.categoryItem.upsert({
      where: { name: cat.name },
      update: { code: cat.code },
      create: { name: cat.name, code: cat.code },
    });
  }
  console.log('✅ Kategori Barang berhasil dibuat.');

  // 2. Data Warna
  const colors = [
    { name: 'Hitam', code: 'H' },
    { name: 'Putih', code: 'P' },
    { name: 'Merah', code: 'M' },
    { name: 'Biru', code: 'B' },
    { name: 'Kuning', code: 'K' },
    { name: 'Hijau', code: 'J' },
    { name: 'Cokelat', code: 'C' },
    { name: 'Abu-abu', code: 'A' },
    { name: 'Multi-warna', code: 'W' }
  ];
  for (const col of colors) {
    await prisma.colorItem.upsert({
      where: { name: col.name },
      update: { code: col.code },
      create: { name: col.name, code: col.code },
    });
  }
  console.log('✅ Kategori Warna berhasil dibuat.');

  // 3. Data Merek
  const brands = [
    { name: 'Samsung', code: 'S1' },
    { name: 'Apple', code: 'A1' },
    { name: 'Asus', code: 'A2' },
    { name: 'Lenovo', code: 'L1' },
    { name: 'HP', code: 'H1' },
    { name: 'Honda', code: 'H2' },
    { name: 'Yamaha', code: 'Y1' },
    { name: 'Toyota', code: 'T1' },
    { name: 'Tanpa Merek', code: 'TM' }
  ];
  for (const brnd of brands) {
    await prisma.brandItem.upsert({
      where: { name: brnd.name },
      update: { code: brnd.code },
      create: { name: brnd.name, code: brnd.code },
    });
  }
  console.log('✅ Kategori Merek berhasil dibuat.');

  // 4. Data Lokasi
  const locations = [
    { name: 'Ruang Kelas', code: 'RK' },
    { name: 'Perpustakaan', code: 'P' },
    { name: 'Kantin', code: 'K' },
    { name: 'Masjid', code: 'M' },
    { name: 'Tempat Parkir', code: 'TP' },
    { name: 'Lapangan', code: 'L' },
    { name: 'Toilet', code: 'TL' },
    { name: 'Lainnya', code: 'LY' }
  ];
  for (const loc of locations) {
    await prisma.locationItem.upsert({
      where: { name: loc.name },
      update: { code: loc.code },
      create: { name: loc.name, code: loc.code },
    });
  }
  console.log('✅ Kategori Lokasi berhasil dibuat.');

  console.log('🎉 SEMUA DATA MASTER BERHASIL DISIMPAN!, Tunggu Sebentar');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });