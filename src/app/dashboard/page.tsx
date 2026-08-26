import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col h-full"> 
      
      {/* 🟢 KONTEN UTAMA: Aksi LACAK (3 Modul Utama) */}
      <section className="container mx-auto px-4 md:px-8 my-12 flex-grow">
        <div className="text-center mb-12">
          <span className="text-[#3dbd84] font-bold text-xs uppercase tracking-wider">
            Layanan Cepat
          </span>
          <h2 className="text-3xl font-extrabold text-[#0d3b2e] mt-1 tracking-tight">
            Aksi LACAK
          </h2>
        </div>

        {/* Grid 3 Modul Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pb-8">
          
          {/* Modul 1: Taruh Barang */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#3dbd84]/30">
            <img 
              src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf" 
              alt="Taruh Barang" 
              className="h-48 w-full object-cover"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h4 className="text-xl font-bold text-[#0d3b2e] mb-2">Taruh Barang</h4>
              <p className="text-gray-500 text-xs flex-grow leading-relaxed mb-6">
                Scan sidik jari penemu, input data barang temuan baru, dan cetak barcode.
              </p>
              <Link 
                href="/taruh" 
                className="bg-[#1a5c44] hover:bg-[#0d3b2e] text-white text-center py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Mulai Input
              </Link>
            </div>
          </div>

          {/* Modul 2: Ambil Barang */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#3dbd84]/30">
            <img 
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62" 
              alt="Ambil Barang" 
              className="h-48 w-full object-cover"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h4 className="text-xl font-bold text-[#0d3b2e] mb-2">Ambil Barang</h4>
              <p className="text-gray-500 text-xs flex-grow leading-relaxed mb-6">
                Scan barcode barang dan verifikasi sidik jari pengambil untuk proses serah terima.
              </p>
              <Link 
                href="/ambil" 
                className="bg-[#1a5c44] hover:bg-[#0d3b2e] text-white text-center py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Proses Pengambilan
              </Link>
            </div>
          </div>

          {/* Modul 3: Laporan Kehilangan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#3dbd84]/30">
            <img 
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85" 
              alt="Laporan Kehilangan" 
              className="h-48 w-full object-cover"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h4 className="text-xl font-bold text-[#0d3b2e] mb-2">Laporan Kehilangan</h4>
              <p className="text-gray-500 text-xs flex-grow leading-relaxed mb-6">
                Bantu siswa mencatat detail barang yang hilang agar sistem dapat mencari kecocokan.
              </p>
              <Link 
                href="/lapor" 
                className="bg-[#1a5c44] hover:bg-[#0d3b2e] text-white text-center py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Buat Laporan
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
