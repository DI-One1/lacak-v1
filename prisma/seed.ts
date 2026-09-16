import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🧹 Mengosongkan seluruh database...");

  // Clear existing operational & transactional data
  await prisma.claimTransaction.deleteMany();
  await prisma.foundItem.deleteMany();
  await prisma.lostReport.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.warga.deleteMany();

  // Clear master data
  await prisma.categoryItem.deleteMany();
  await prisma.colorItem.deleteMany();
  await prisma.brandItem.deleteMany();
  await prisma.locationItem.deleteMany();

  console.log("✅ Database berhasil dikosongkan sepenuhnya.");

  console.log("⏳ Memulai seeding data master (100% presisi lacak-public-page-example)...");

  // 1. Kategori Barang (20 Kategori)
  const categoriesData = [
    { name: "Elektronik", code: "EL" },
    { name: "Komputer & Aksesoris", code: "KA" },
    { name: "Handphone & Aksesoris", code: "HA" },
    { name: "Jaket", code: "JK" },
    { name: "Jas Hujan", code: "JH" },
    { name: "Kemeja", code: "KM" },
    { name: "Kaos", code: "KS" },
    { name: "Pakaian Olahraga", code: "PO" },
    { name: "Sepatu", code: "SP" },
    { name: "Tas", code: "TS" },
    { name: "Dompet", code: "DP" },
    { name: "Jam Tangan", code: "JT" },
    { name: "Aksesoris", code: "AK" },
    { name: "Buku & Alat Tulis", code: "BAT" },
    { name: "Botol & Tumbler", code: "BT" },
    { name: "Perlengkapan Makan", code: "PM" },
    { name: "Kacamata", code: "KC" },
    { name: "Perlengkapan Rumah", code: "PR" },
    { name: "Kunci", code: "KN" },
    { name: "Lainnya", code: "LN" },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.categoryItem.create({
      data: { name: cat.name, code: cat.code },
    });
    categoryMap.set(cat.name, created.id);
  }
  console.log("✅ 20 Kategori Barang berhasil dibuat.");

  // 2. Warna
  const colorsData = [
    { name: "Hitam", code: "HTM" },
    { name: "Putih", code: "PTH" },
    { name: "Biru", code: "BRU" },
    { name: "Abu-abu", code: "ABU" },
    { name: "Pink", code: "PNK" },
    { name: "Merah", code: "MRH" },
    { name: "Hijau", code: "HJU" },
    { name: "Cokelat", code: "CKL" },
    { name: "Multi-warna", code: "MLT" },
  ];

  const colorMap = new Map<string, string>();
  for (const col of colorsData) {
    const created = await prisma.colorItem.create({
      data: { name: col.name, code: col.code },
    });
    colorMap.set(col.name, created.id);
  }
  console.log("✅ Data Warna berhasil dibuat.");

  // 3. Merek
  const brandsData = [
    { name: "Gucci", code: "GUC" },
    { name: "Apple", code: "APL" },
    { name: "Nike", code: "NKE" },
    { name: "Adidas", code: "ADS" },
    { name: "Lenovo", code: "LNV" },
    { name: "Prada", code: "PRD" },
    { name: "Tupperware", code: "TPW" },
    { name: "Sony", code: "SNY" },
    { name: "iPhone", code: "IPH" },
    { name: "Ray-Ban", code: "RYB" },
    { name: "Uniqlo", code: "UNQ" },
    { name: "Moleskine", code: "MLS" },
    { name: "Miniso", code: "MNS" },
    { name: "Logitech", code: "LGT" },
    { name: "Pandora", code: "PND" },
    { name: "Anker", code: "ANK" },
    { name: "LocknLock", code: "LNL" },
    { name: "Eiger", code: "EGR" },
    { name: "Lainnya", code: "LNY" },
  ];

  const brandMap = new Map<string, string>();
  for (const brnd of brandsData) {
    const created = await prisma.brandItem.create({
      data: { name: brnd.name, code: brnd.code },
    });
    brandMap.set(brnd.name, created.id);
  }
  console.log("✅ Data Merek berhasil dibuat.");

  // 4. Lokasi
  const locationsData = [
    { name: "Kelas", code: "KLS" },
    { name: "Asrama", code: "ASR" },
    { name: "Masjid", code: "MSJ" },
    { name: "Lapangan", code: "LPG" },
    { name: "Perpustakaan", code: "PRP" },
    { name: "Lab Komputer", code: "LAB" },
    { name: "Kantin", code: "KTN" },
    { name: "Parkiran", code: "PRK" },
    { name: "Lainnya", code: "LKN" },
  ];

  const locationMap = new Map<string, string>();
  for (const loc of locationsData) {
    const created = await prisma.locationItem.create({
      data: { name: loc.name, code: loc.code },
    });
    locationMap.set(loc.name, created.id);
  }
  console.log("✅ Data Lokasi berhasil dibuat.");

  // 5. Data Warga (Minimal 1 Warga Pembuat Barang)
  const warga = await prisma.warga.create({
    data: {
      id: "2026001",
      nama: "Ahmad Supriyadi",
      peran: "Siswa",
      keteranganPeran: "XII RPL 1",
      nomorTelepon: "081234567890",
    },
  });
  console.log(`✅ Data Warga (${warga.nama} - NIS ${warga.id}) berhasil dibuat.`);

  // 6. Data Barang Temuan (25 Barang dari lacak-public-page-example)
  const itemsData = [
    {
      name: "Tas Ransel",
      brand: "Gucci",
      color: "Hitam",
      category: "Tas",
      location: "Kelas",
      date: "2026-09-09T08:00:00.000Z",
      desc: "Tas ransel dengan logo Gucci di bagian depan.",
    },
    {
      name: "Jam Tangan",
      brand: "Apple",
      color: "Hitam",
      category: "Jam Tangan",
      location: "Asrama",
      date: "2026-09-09T09:30:00.000Z",
      desc: "Jam tangan Apple, memiliki lecet pada layar.",
    },
    {
      name: "Botol Minum",
      brand: "Tupperware",
      color: "Hitam",
      category: "Botol & Tumbler",
      location: "Kelas",
      date: "2026-09-09T10:15:00.000Z",
      desc: "Botol minum Tupperware dengan tutup flip.",
    },
    {
      name: "Dompet",
      brand: "Nike",
      color: "Hitam",
      category: "Dompet",
      location: "Masjid",
      date: "2026-09-07T12:00:00.000Z",
      desc: "Dompet kulit dengan logo Nike di bagian depan.",
    },
    {
      name: "Headphone",
      brand: "Sony",
      color: "Putih",
      category: "Elektronik",
      location: "Kelas",
      date: "2026-09-09T14:20:00.000Z",
      desc: "Headphone Sony dengan bantalan telinga.",
    },
    {
      name: "Tas Laptop",
      brand: "Lenovo",
      color: "Hitam",
      category: "Komputer & Aksesoris",
      location: "Asrama",
      date: "2026-09-04T16:00:00.000Z",
      desc: "Tas laptop dengan logo Lenovo di bagian depan.",
    },
    {
      name: "Sepatu",
      brand: "Nike",
      color: "Putih",
      category: "Sepatu",
      location: "Lapangan",
      date: "2026-09-04T17:10:00.000Z",
      desc: "Sepatu olahraga warna putih.",
    },
    {
      name: "Handphone",
      brand: "iPhone",
      color: "Biru",
      category: "Handphone & Aksesoris",
      location: "Kelas",
      date: "2026-09-02T11:00:00.000Z",
      desc: "Handphone berwarna biru ditemukan di kelas.",
    },
    {
      name: "Dompet",
      brand: "Prada",
      color: "Hitam",
      category: "Dompet",
      location: "Asrama",
      date: "2026-08-31T13:45:00.000Z",
      desc: "Dompet Prada warna hitam.",
    },
    {
      name: "Hoodie",
      brand: "Adidas",
      color: "Abu-abu",
      category: "Jaket",
      location: "Lapangan",
      date: "2026-08-28T15:30:00.000Z",
      desc: "Hoodie Adidas warna abu-abu.",
    },
    {
      name: "Tumbler",
      brand: "Tupperware",
      color: "Hitam",
      category: "Botol & Tumbler",
      location: "Kelas",
      date: "2026-08-26T09:00:00.000Z",
      desc: "Tumbler hitam dengan tutup rapat.",
    },
    {
      name: "Kacamata",
      brand: "Ray-Ban",
      color: "Hitam",
      category: "Kacamata",
      location: "Lapangan",
      date: "2026-08-24T16:20:00.000Z",
      desc: "Kacamata hitam ditemukan di lapangan.",
    },
    {
      name: "Kemeja Putih",
      brand: "Uniqlo",
      color: "Putih",
      category: "Kemeja",
      location: "Kelas",
      date: "2026-08-22T08:15:00.000Z",
      desc: "Kemeja putih lengan panjang dengan ukuran sedang.",
    },
    {
      name: "Charger Laptop",
      brand: "Lenovo",
      color: "Hitam",
      category: "Komputer & Aksesoris",
      location: "Perpustakaan",
      date: "2026-08-21T14:00:00.000Z",
      desc: "Charger laptop Lenovo dengan kabel hitam.",
    },
    {
      name: "Buku Catatan",
      brand: "Moleskine",
      color: "Biru",
      category: "Buku & Alat Tulis",
      location: "Masjid",
      date: "2026-08-20T12:30:00.000Z",
      desc: "Buku catatan biru dengan beberapa tulisan di dalamnya.",
    },
    {
      name: "Pouch Alat Tulis",
      brand: "Miniso",
      color: "Pink",
      category: "Buku & Alat Tulis",
      location: "Kelas",
      date: "2026-08-18T10:00:00.000Z",
      desc: "Pouch alat tulis warna pink dengan resleting.",
    },
    {
      name: "Topi Olahraga",
      brand: "Nike",
      color: "Biru",
      category: "Pakaian Olahraga",
      location: "Lapangan",
      date: "2026-08-17T16:45:00.000Z",
      desc: "Topi olahraga biru dengan logo Nike.",
    },
    {
      name: "Mouse Wireless",
      brand: "Logitech",
      color: "Putih",
      category: "Komputer & Aksesoris",
      location: "Lab Komputer",
      date: "2026-08-15T11:20:00.000Z",
      desc: "Mouse wireless putih ditemukan di meja komputer.",
    },
    {
      name: "Gelang",
      brand: "Pandora",
      color: "Putih",
      category: "Aksesoris",
      location: "Asrama",
      date: "2026-08-14T19:00:00.000Z",
      desc: "Gelang kecil dengan hiasan berbentuk hati.",
    },
    {
      name: "Sandal",
      brand: "Adidas",
      color: "Hitam",
      category: "Sepatu",
      location: "Masjid",
      date: "2026-08-12T13:00:00.000Z",
      desc: "Sandal Adidas hitam dengan garis putih.",
    },
    {
      name: "Kabel Data",
      brand: "Anker",
      color: "Putih",
      category: "Handphone & Aksesoris",
      location: "Perpustakaan",
      date: "2026-08-10T15:10:00.000Z",
      desc: "Kabel data USB-C berwarna putih.",
    },
    {
      name: "Tempat Makan",
      brand: "LocknLock",
      color: "Biru",
      category: "Perlengkapan Makan",
      location: "Kantin",
      date: "2026-08-08T12:15:00.000Z",
      desc: "Tempat makan biru dengan tutup transparan.",
    },
    {
      name: "Kunci Loker",
      brand: "Lainnya",
      color: "Abu-abu",
      category: "Kunci",
      location: "Asrama",
      date: "2026-08-06T07:45:00.000Z",
      desc: "Satu set kunci loker dengan gantungan kecil.",
    },
    {
      name: "Jas Hujan",
      brand: "Eiger",
      color: "Biru",
      category: "Jas Hujan",
      location: "Parkiran",
      date: "2026-08-04T17:00:00.000Z",
      desc: "Jas hujan biru tersimpan di dalam pouch hitam.",
    },
    {
      name: "Kaos Olahraga",
      brand: "Adidas",
      color: "Putih",
      category: "Kaos",
      location: "Lapangan",
      date: "2026-08-02T16:00:00.000Z",
      desc: "Kaos olahraga putih dengan logo kecil di dada.",
    },
  ];

  for (let i = 0; i < itemsData.length; i++) {
    const item = itemsData[i];
    const jenisId = categoryMap.get(item.category) || categoryMap.get("Lainnya")!;
    const warnaId = colorMap.get(item.color) || colorMap.get("Hitam")!;
    const merekId = brandMap.get(item.brand) || brandMap.get("Lainnya")!;
    const lokasiId = locationMap.get(item.location) || locationMap.get("Lainnya")!;

    // Code generator format: TS-HTM-GUC-KLS-0001
    const serial = String(i + 1).padStart(4, "0");
    const catCode = categoriesData.find((c) => c.name === item.category)?.code || "LN";
    const colCode = colorsData.find((c) => c.name === item.color)?.code || "HTM";
    const brndCode = brandsData.find((b) => b.name === item.brand)?.code || "LNY";
    const locCode = locationsData.find((l) => l.name === item.location)?.code || "LKN";

    const businessCode = `${catCode}-${colCode}-${brndCode}-${locCode}-${serial}`;

    await prisma.foundItem.create({
      data: {
        businessCode,
        finderName: warga.nama,
        finderIdCard: warga.id,
        finderContact: warga.nomorTelepon || "-",
        wargaId: warga.id,
        jenisId,
        warnaId,
        merekId,
        lokasiId,
        additionalDesc: item.desc,
        status: "FOUND",
        createdAt: new Date(item.date),
      },
    });
  }

  console.log("✅ 25 Data Barang Temuan berhasil dimasukkan ke database!");
  console.log("🎉 SEEDING DATA SELESAI DENGAN SUKSES!");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });