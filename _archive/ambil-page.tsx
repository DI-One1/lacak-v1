"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { processClaimItem, verifyItemExists } from "@/lib/actions/claim";
import { getSemuaWarga } from "@/lib/actions/warga"; 
import { Warga } from "@/types/warga"; 

export default function AmbilBarangPage() {
  const [masterDataWarga, setMasterDataWarga] = useState<Warga[]>([]);
  
  const [isCheckingBarcode, setIsCheckingBarcode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [verified, setVerified] = useState(false);
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [businessCode, setBusinessCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchWarga = async () => {
      try {
        const data = await getSemuaWarga();
        if (data && data.length > 0) {
          setMasterDataWarga(data);
        }
      } catch (error) {
        console.error("Gagal memuat DB Warga", error);
      }
    };
    fetchWarga();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectWarga = (warga: Warga) => {
    setIsDropdownOpen(false);
    setIsScanning(true);
    setErrorMessage("");
    
    setTimeout(() => {
      setIsScanning(false);
      setVerified(true);
      setSelectedWarga(warga);
    }, 1200);
  };

  const handleScanBarcode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessCode.trim()) return;

    setIsCheckingBarcode(true);
    setErrorMessage("");
    setBarcodeScanned(false);

    try {
      const isAvailable = await verifyItemExists(businessCode);
      
      if (isAvailable) {
        setBarcodeScanned(true); 
      } else {
        setErrorMessage("Barang dengan kode unik tersebut tidak ditemukan atau sudah diambil!");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Gagal memverifikasi kode barang.");
    } finally {
      setIsCheckingBarcode(false);
    }
  };

  const handleSubmitClaim = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!verified || !selectedWarga) {
      setErrorMessage("Verifikasi data pengambil wajib dilakukan terlebih dahulu!");
      return;
    }
    if (!barcodeScanned) {
      setErrorMessage("Identifikasi barang via barcode wajib dilakukan terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set("businessCode", businessCode);
    
    formData.set("claimantName", selectedWarga.nama);
    formData.set("claimantIdCard", selectedWarga.id);
    formData.set("claimantContact", selectedWarga.nomor_telepon || "-");

    try {
      await processClaimItem(formData);
    } catch (error: any) {
      setErrorMessage(error.message || "Terjadi kesalahan saat memproses klaim.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl flex-grow">
      
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-[#3dbd84] flex items-center gap-2 w-fit mb-4 transition-colors">
          <span>&larr;</span> Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0d3b2e]">Pengambilan Barang</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Proses verifikasi serah terima barang temuan kepada pemilik yang sah menggunakan identifikasi otomatis.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm animate-in fade-in duration-300">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitClaim} className="space-y-6">
        
        {/* LANGKAH 1: VERIFIKASI DATA PENGAMBIL */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="text-lg font-bold text-[#0d3b2e] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0d3b2e] text-white text-xs flex items-center justify-center">1</span>
            Verifikasi Data Pengambil
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {verified 
                  ? `Identitas pengambil (${selectedWarga?.nama}) telah berhasil ditarik dari Database Warga[cite: 16].` 
                  : "Gunakan dropdown simulasi untuk menarik data warga otomatis dari Database[cite: 16]."}
              </p>
            </div>
            
            {/* Split Button Container */}
            <div className="relative inline-flex" ref={dropdownRef}>
              <button 
                type="button"
                onClick={() => masterDataWarga.length > 0 && handleSelectWarga(masterDataWarga[0])}
                disabled={verified || isScanning || masterDataWarga.length === 0}
                className={`px-5 py-3 rounded-l-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  verified || masterDataWarga.length === 0
                    ? "bg-[#3dbd84]/20 text-[#1a5c44] cursor-default" 
                    : "bg-[#3dbd84] hover:bg-[#32a873] text-white shadow-md shadow-[#3dbd84]/20"
                }`}
              >
                {isScanning ? (
                  <span className="animate-pulse">Memindai...</span>
                ) : verified ? (
                  <><span>✓</span> Terverifikasi</>
                ) : masterDataWarga.length === 0 ? (
                  <span className="animate-pulse">Memuat DB...</span>
                ) : (
                  <><span>👆</span> Scan Sidik Jari</>
                )}
              </button>
              
              {/* Chevron Dropdown Trigger */}
              <button 
                type="button"
                disabled={verified || isScanning || masterDataWarga.length === 0}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`px-3 py-3 rounded-r-xl border-l transition-colors flex items-center justify-center ${
                  verified || masterDataWarga.length === 0
                    ? "bg-[#3dbd84]/20 text-[#1a5c44] border-white/40 cursor-default" 
                    : "bg-[#3dbd84] hover:bg-[#32a873] text-white border-white/20 shadow-md shadow-[#3dbd84]/20"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>

              {/* Dropdown Menu Data Warga */}
              {isDropdownOpen && !verified && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Pilih dari Database</span>
                    <span className="text-[10px] font-bold text-[#3dbd84] bg-[#3dbd84]/10 px-2 py-0.5 rounded-full">{masterDataWarga.length} Data</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {masterDataWarga.map((warga) => (
                      <button
                        key={warga.id}
                        type="button"
                        onClick={() => handleSelectWarga(warga)}
                        className="w-full text-left px-4 py-3 hover:bg-[#3dbd84]/10 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="text-sm font-bold text-[#0d3b2e]">{warga.nama}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="font-semibold text-[#1a5c44]">{warga.peran}</span> 
                          {warga.keterangan_peran && ` • ${warga.keterangan_peran}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LANGKAH 2: IDENTIFIKASI BARANG VIA BARCODE */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 transition-opacity ${!verified ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <h3 className="text-lg font-bold text-[#0d3b2e] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0d3b2e] text-white text-xs flex items-center justify-center">2</span>
            Identifikasi Barang via Barcode
          </h3>
          
          <div className="flex gap-3">
            <input 
              type="text" 
              value={businessCode}
              onChange={(e) => setBusinessCode(e.target.value)}
              placeholder="Scan atau ketik kode unik barang (contoh: A-129-0001)..." 
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:border-[#3dbd84] transition-all"
              required
            />
            <button 
              type="button"
              onClick={handleScanBarcode}
              disabled={isCheckingBarcode || !businessCode.trim()}
              className="bg-[#1a5c44] hover:bg-[#0d3b2e] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap min-w-[140px]"
            >
              {isCheckingBarcode ? "Mengecek..." : "Cari Barang"}
            </button>
          </div>

          {barcodeScanned && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between animate-in fade-in duration-300">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-[#3dbd84]/20 flex items-center justify-center text-[#1a5c44]">📦</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3dbd84]">Status: Tersedia</span>
                  <h4 className="font-bold text-[#0d3b2e] text-sm">Kode: {businessCode.toUpperCase()}</h4>
                  <p className="text-xs text-gray-500">Barang ditemukan di sistem. Silakan lanjutkan konfirmasi.</p>
                </div>
              </div>
              <span className="text-xs bg-[#3dbd84]/10 text-[#1a5c44] font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                Kode Valid
              </span>
            </div>
          )}
        </div>

        {/* LANGKAH 3: KONFIRMASI & SUBMIT */}
        {verified && selectedWarga && barcodeScanned && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#3dbd84]/30 p-6 md:p-8 space-y-6 animate-in fade-in duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3dbd84]/5 rounded-bl-full -z-0"></div>

            <h3 className="text-lg font-bold text-[#0d3b2e] mb-4 flex items-center gap-2 relative z-10">
              <span className="w-6 h-6 rounded-full bg-[#0d3b2e] text-white text-xs flex items-center justify-center">3</span>
              Konfirmasi Serah Terima Barang
            </h3>

            <div className="bg-[#3dbd84]/10 rounded-xl p-5 border border-[#3dbd84]/20 relative z-10 space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">Kode Barang yang Diambil</p>
                <p className="text-sm font-mono font-bold text-[#0d3b2e]">{businessCode.toUpperCase()}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 pt-2 border-t border-[#3dbd84]/20">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">Nama Lengkap Pengambil</p>
                  <p className="text-sm font-semibold text-[#0d3b2e]">{selectedWarga.nama}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">ID Warga (Database)</p>
                  <p className="text-sm font-mono font-semibold text-[#0d3b2e] break-all">{selectedWarga.id}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">Peran & Keterangan</p>
                  <p className="text-sm font-semibold text-[#0d3b2e]">
                    {selectedWarga.peran} {selectedWarga.keterangan_peran ? `- ${selectedWarga.keterangan_peran}` : ""}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">Kontak Tersimpan</p>
                  <p className="text-sm font-semibold text-[#0d3b2e]">{selectedWarga.nomor_telepon || "Tidak ada data kontak"}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end relative z-10">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-[#0d3b2e] hover:bg-[#1a5c44] shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Memproses...</span>
                ) : (
                  <>Selesaikan Serah Terima Barang &rarr;</>
                )}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}