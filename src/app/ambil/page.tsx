"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  processClaimItem,
  verifyItemExists,
  getActiveLostReportsOfWarga,
  getMatchingFoundItemsForReport,
} from "@/lib/actions/claim";
import { getSemuaWarga } from "@/lib/actions/warga";
import { Warga } from "@/types/warga";
import { LostReportItem, FoundItemData } from "@/types/models";
import { FoundItemMatch } from "@/components/SearchableFoundItem";
import WargaVerificationCard from "@/components/warga/WargaVerificationCard";

export default function AmbilBarangPage() {
  const [masterDataWarga, setMasterDataWarga] = useState<Warga[]>([]);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);

  // State untuk laporan warga
  const [wargaLostReports, setWargaLostReports] = useState<LostReportItem[]>([]);
  const [selectedLostReport, setSelectedLostReport] = useState<LostReportItem | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // State untuk matching found items
  const [matchingFoundItems, setMatchingFoundItems] = useState<FoundItemMatch[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [selectedFoundItem, setSelectedFoundItem] = useState<FoundItemData | FoundItemMatch | null>(null);

  // State UI
  const [isScanning, setIsScanning] = useState(false);
  const [verified, setVerified] = useState(false);

  const [isCheckingBarcode, setIsCheckingBarcode] = useState(false);
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [businessCode, setBusinessCode] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSelectWarga = (warga: Warga) => {
    setIsScanning(true);
    setErrorMessage("");
    setSelectedLostReport(null);
    setSelectedFoundItem(null);
    setBarcodeScanned(false);
    setBusinessCode("");

    setTimeout(async () => {
      setIsScanning(false);
      setVerified(true);
      setSelectedWarga(warga);

      // Load active lost reports
      setIsLoadingReports(true);
      try {
        const reports = await getActiveLostReportsOfWarga(warga.id);
        setWargaLostReports(reports as unknown as LostReportItem[]);
      } catch (error) {
        console.error("Gagal memuat laporan warga", error);
      } finally {
        setIsLoadingReports(false);
      }
    }, 1000);
  };

  const handleSelectLostReport = async (report: LostReportItem) => {
    setSelectedLostReport(report);
    setSelectedFoundItem(null);
    setBarcodeScanned(false);
    setBusinessCode("");
    setErrorMessage("");

    setIsLoadingMatches(true);
    try {
      const matches = await getMatchingFoundItemsForReport(report.id);
      setMatchingFoundItems(matches as unknown as FoundItemMatch[]);
    } catch (error) {
      console.error("Gagal memuat matching items", error);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  const handleScanBarcode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessCode.trim()) return;

    setIsCheckingBarcode(true);
    setErrorMessage("");
    setSelectedFoundItem(null);
    setBarcodeScanned(false);

    try {
      const foundItem = await verifyItemExists(businessCode.trim());

      if (foundItem) {
        setBarcodeScanned(true);
        setSelectedFoundItem(foundItem as unknown as FoundItemData);
      } else {
        setErrorMessage(
          "Barang dengan kode unik tersebut tidak ditemukan, sudah diambil, atau sudah Expired!"
        );
      }
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message || "Gagal memverifikasi kode barang.");
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
    if (!selectedFoundItem) {
      setErrorMessage("Identifikasi barang wajib dilakukan terlebih dahulu!");
      return;
    }
    if (!selectedLostReport) {
      setErrorMessage("Pilihan laporan kehilangan wajib ditentukan!");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set("businessCode", selectedFoundItem.businessCode);
    formData.set("claimantName", selectedWarga.nama);
    formData.set("claimantIdCard", selectedWarga.id);
    formData.set("claimantContact", selectedWarga.nomor_telepon || "-");
    formData.set("wargaId", selectedWarga.id);
    formData.set("lostReportId", selectedLostReport.id);

    try {
      await processClaimItem(formData);
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses klaim.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl flex-grow">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-[#3dbd84] flex items-center gap-2 w-fit mb-4 transition-colors"
        >
          <span>&larr;</span> Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0d3b2e]">Pengambilan Barang</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Proses verifikasi serah terima barang temuan kepada pemilik yang sah berdasarkan laporan kehilangan yang aktif.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm animate-in fade-in duration-300">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitClaim} className="space-y-6">
        {/* LANGKAH 1: VERIFIKASI DATA PENGAMBIL */}
        <WargaVerificationCard
          masterDataWarga={masterDataWarga}
          selectedWarga={selectedWarga}
          verified={verified}
          isScanning={isScanning}
          onSelectWarga={handleSelectWarga}
          onReset={() => {
            setVerified(false);
            setSelectedWarga(null);
            setSelectedLostReport(null);
            setSelectedFoundItem(null);
            setBarcodeScanned(false);
            setWargaLostReports([]);
          }}
          stepNumber={1}
          title="Verifikasi Data Pengambil"
          roleLabel="Pengambil"
        />

        {/* LANGKAH 2: PILIH LAPORAN KEHILANGAN AKTIF MILIK WARGA */}
        {verified && selectedWarga && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-[#0d3b2e] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0d3b2e] text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              Pilih Laporan Kehilangan yang Diselesaikan
            </h3>
            <p className="text-xs text-gray-500">
              Pengambilan barang ditujukan untuk menyelesaikan laporan kehilangan yang berstatus aktif (DICARI).
            </p>

            {isLoadingReports ? (
              <div className="p-6 text-center text-xs text-gray-400 animate-pulse">
                Memuat laporan kehilangan milik {selectedWarga.nama}...
              </div>
            ) : wargaLostReports.length === 0 ? (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <p className="text-sm font-bold text-amber-800">
                  Tidak Ada Laporan Kehilangan Aktif
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Warga ini belum memiliki laporan kehilangan berstatus DICARI. Jika barang yang dicari sudah ada di sistem, silakan lakukan proses melalui menu{" "}
                  <Link href="/lapor" className="underline font-bold hover:text-amber-900">
                    Lapor Kehilangan (Jalur 2)
                  </Link>.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {wargaLostReports.map((report) => (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => handleSelectLostReport(report)}
                    className={`text-left p-4 rounded-xl border text-xs transition-all cursor-pointer ${selectedLostReport?.id === report.id
                        ? "border-[#1a5c44] bg-[#3dbd84]/10 shadow-sm ring-2 ring-[#3dbd84]/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-[#0d3b2e] text-sm truncate">
                        {report.jenis?.name} {report.merek?.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700">
                        {report.status}
                      </span>
                    </div>
                    <p className="text-gray-500">
                      Warna: {report.warna?.name} | Lokasi Hilang: {report.lokasi?.name}
                    </p>
                    {report.additionalDesc && (
                      <p className="text-[11px] text-gray-400 mt-1 italic truncate">
                        &quot;{report.additionalDesc}&quot;
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LANGKAH 3: CARI / PILIH BARANG TEMUAN YANG AKAN DIAMBIL */}
        {verified && selectedLostReport && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-[#0d3b2e] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0d3b2e] text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              Identifikasi Barang Temuan yang Diambil
            </h3>
            <p className="text-xs text-gray-500">
              Pilih barang temuan yang sesuai melalui pencocokan otomatis rekomendasi sistem atau masukkan kode barcode unik secara manual.
            </p>

            {/* OPSI A: Scan / Input Barcode */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Cara 1: Input / Scan Kode Barcode
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={businessCode}
                  onChange={(e) => setBusinessCode(e.target.value)}
                  placeholder="Kode unik barang (contoh: A-129-0001)..."
                  className="flex-1 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-[#3dbd84] transition-all"
                />
                <button
                  type="button"
                  onClick={handleScanBarcode}
                  disabled={isCheckingBarcode || !businessCode.trim()}
                  className="bg-[#1a5c44] hover:bg-[#0d3b2e] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isCheckingBarcode ? "Memeriksa..." : "Cari Kode"}
                </button>
              </div>
            </div>

            {/* OPSI B: Matching Pencocokan Otomatis */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Cara 2: Rekomendasi Kecocokan Sistem
              </h4>
              {isLoadingMatches ? (
                <div className="p-4 text-center text-xs text-gray-400 animate-pulse">
                  Mencari kecocokan barang temuan di database...
                </div>
              ) : matchingFoundItems.length === 0 ? (
                <div className="p-4 bg-white border border-dashed rounded-xl text-center text-xs text-gray-400">
                  Tidak ada barang temuan yang cocok secara otomatis dengan laporan ini.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {matchingFoundItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedFoundItem(item);
                        setBarcodeScanned(true);
                        setErrorMessage("");
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex justify-between items-center cursor-pointer ${selectedFoundItem?.id === item.id
                          ? "border-[#1a5c44] bg-[#3dbd84]/15 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                      <div className="truncate pr-2">
                        <p className="font-bold text-[#0d3b2e] truncate">
                          {item.jenis?.name} - {item.merek?.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                          {item.businessCode} &bull; Lokasi: {item.lokasi?.name}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full flex-shrink-0 ${item.matchScore === 100
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                          }`}
                      >
                        {item.matchScore}% Cocok
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rincian Barang Terpilih */}
            {barcodeScanned && selectedFoundItem && (
              <div className="p-5 bg-[#3dbd84]/10 rounded-xl border border-[#3dbd84]/30 animate-in fade-in duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a5c44]">
                    Barang Terpilih untuk Diambil
                  </h4>
                  <span className="text-[10px] bg-[#1a5c44] text-white font-bold px-2 py-0.5 rounded-full">
                    Terpilih
                  </span>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#1a5c44] text-xl shadow-sm">
                    📦
                  </div>
                  <div className="flex-grow">
                    <h5 className="font-bold text-[#0d3b2e] text-base">
                      {selectedFoundItem.jenis?.name} {selectedFoundItem.merek?.name}
                    </h5>
                    <p className="text-xs font-mono font-bold text-[#1a5c44] mt-0.5">
                      Kode: {selectedFoundItem.businessCode}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Warna: {selectedFoundItem.warna?.name} | Lokasi Ditemukan:{" "}
                      {selectedFoundItem.lokasi?.name}
                    </p>
                    {selectedFoundItem.additionalDesc && (
                      <p className="text-xs text-gray-500 bg-white border rounded-lg p-2 mt-2 italic">
                        Ciri khusus: &quot;{selectedFoundItem.additionalDesc}&quot;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LANGKAH 4: KONFIRMASI & SUBMIT */}
        {verified && selectedWarga && selectedLostReport && selectedFoundItem && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#3dbd84]/30 p-6 md:p-8 space-y-6 animate-in fade-in duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3dbd84]/5 rounded-bl-full -z-0"></div>

            <h3 className="text-lg font-bold text-[#0d3b2e] mb-4 flex items-center gap-2 relative z-10">
              <span className="w-6 h-6 rounded-full bg-[#0d3b2e] text-white text-xs flex items-center justify-center font-bold">
                4
              </span>
              Konfirmasi Serah Terima Barang
            </h3>

            <div className="bg-[#3dbd84]/10 rounded-xl p-5 border border-[#3dbd84]/20 relative z-10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">
                    Nama Lengkap Pengambil
                  </p>
                  <p className="text-sm font-semibold text-[#0d3b2e]">
                    {selectedWarga.nama} ({selectedWarga.id})
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">
                    Menyelesaikan Laporan
                  </p>
                  <p className="text-sm font-semibold text-[#0d3b2e]">
                    {selectedLostReport.jenis?.name} - {selectedLostReport.merek?.name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">
                    Kode Barang yang Diambil
                  </p>
                  <p className="text-sm font-mono font-bold text-[#0d3b2e]">
                    {selectedFoundItem.businessCode}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">
                    Kontak Pengambil
                  </p>
                  <p className="text-sm font-semibold text-[#0d3b2e]">
                    {selectedWarga.nomor_telepon || "Tidak ada data kontak"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end relative z-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-[#0d3b2e] hover:bg-[#1a5c44] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
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