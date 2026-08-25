import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl flex-grow">
      
      {/* Header Info */}
      <div className="text-center mb-12">
        <span className="text-[#3dbd84] font-bold text-xs uppercase tracking-wider">Tentang Aplikasi</span>
        <h1 className="text-3xl font-extrabold text-[#0d3b2e] mt-1">Mengenal Lebih Dekat LACAK</h1>
        <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
          Sistem inovatif pengelolaan barang temuan dan kehilangan berbasis digital di lingkungan SMK TI BAZMA.
        </p>
      </div>

      {/* Konten Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#0d3b2e] mb-3">Visi & Misi</h3>
            <p className="text-gray-600 text-xs leading-relaxed mb-4">
              Memberikan transparansi dan kecepatan dalam proses pengembalian barang milik siswa maupun staf yang tertinggal atau hilang melalui sistem pencocokan otomatis (*matching system*).
            </p>
          </div>
          <div className="text-xs text-[#3dbd84] font-semibold">
            #InovasiSMKTIBazma
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#0d3b2e] mb-3">Tim Pengembang</h3>
            <p className="text-gray-600 text-xs leading-relaxed mb-2">
              Aplikasi ini dikembangkan secara kolaboratif oleh talenta muda berbakat:
            </p>
            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 font-medium">
              <li>Nafis</li>
              <li>Akbar</li>
            </ul>
          </div>
          <div className="text-xs text-gray-400">
            Versi 2.0.0 - Stable
          </div>
        </div>
      </div>

      {/* Tombol Kembali */}
      <div className="text-center">
        <Link 
          href="/" 
          className="inline-block bg-[#0d3b2e] hover:bg-[#1a5c44] text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors shadow-md"
        >
          Kembali ke Beranda
        </Link>
      </div>

    </div>
  );
}