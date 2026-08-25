"use client";

import { useState, useEffect } from "react";
import { createLostReport } from "@/lib/actions/item";
import { getSemuaWarga } from "@/lib/actions/warga";
import { Warga } from "@/types/warga";
import SearchableFoundItem, { FoundItemMatch } from "@/components/SearchableFoundItem";
import WargaVerificationCard from "@/components/warga/WargaVerificationCard";

interface MasterItem {
  id: string;
  name: string;
}

interface LaporFormProps {
  jenisList: MasterItem[];
  warnaList: MasterItem[];
  merekList: MasterItem[];
  lokasiList: MasterItem[];
}

export default function LaporForm({
  jenisList,
  warnaList,
  merekList,
  lokasiList,
}: LaporFormProps) {
  // State untuk Data Warga
  const [masterDataWarga, setMasterDataWarga] = useState<Warga[]>([]);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);

  // State atribut barang (controlled)
  const [jenisId, setJenisId] = useState("");
  const [warnaId, setWarnaId] = useState("");
  const [merekId, setMerekId] = useState("");
  const [lokasiId, setLokasiId] = useState("");

  // Barang temuan yang terpilih untuk klaim instan (Jalur 2)
  const [matchedFoundItem, setMatchedFoundItem] = useState<FoundItemMatch | null>(null);

  // State UI & Interaksi
  const [isScanning, setIsScanning] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Ambil data Warga saat komponen dimuat
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

  // Handler Simulasi Verifikasi Identitas
  const handleSelectWarga = (warga: Warga) => {
    setIsScanning(true);
    setErrorMessage("");

    setTimeout(() => {
      setIsScanning(false);
      setVerified(true);
      setSelectedWarga(warga);
    }, 1000);
  };

  // Handler Submit Form Laporan
  const handleSubmitReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!verified || !selectedWarga) {
      setErrorMessage("Verifikasi data pelapor wajib dilakukan terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    // Sisipkan data identitas yang dipilih ke dalam form
    formData.set("reporterName", selectedWarga.nama);
    formData.set("reporterIdCard", selectedWarga.id);
    formData.set("reporterContact", selectedWarga.nomor_telepon || "-");
    formData.set("wargaId", selectedWarga.id);

    // Sisipkan ID barang temuan jika user memilih klaim instan (Jalur 2)
    if (matchedFoundItem) {
      formData.set("claimFoundItemId", matchedFoundItem.id);
    }

    try {
      await createLostReport(formData);
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message || "Terjadi kesalahan saat menyimpan laporan.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm animate-in fade-in duration-300">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitReport} className="space-y-6">
        {/* LANGKAH 1: VERIFIKASI DATA PELAPOR */}
        <WargaVerificationCard
          masterDataWarga={masterDataWarga}
          selectedWarga={selectedWarga}
          verified={verified}
          isScanning={isScanning}
          onSelectWarga={handleSelectWarga}
          onReset={() => {
            setVerified(false);
            setSelectedWarga(null);
          }}
          stepNumber={1}
          title="Verifikasi Identitas Pelapor"
          roleLabel="Pelapor"
        />

        {/* LANGKAH 2: FORM SPESIFIKASI BARANG & CARI TEMUAN LAWAS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-[#0d3b2e] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0d3b2e] text-white text-xs flex items-center justify-center font-bold">
              2
            </span>
            Karakteristik & Detail Barang Hilang
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Jenis Barang *
              </label>
              <select
                name="jenisId"
                required
                value={jenisId}
                onChange={(e) => setJenisId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3dbd84] bg-white transition-all"
              >
                <option value="">Pilih Jenis...</option>
                {jenisList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Warna Dominan *
              </label>
              <select
                name="warnaId"
                required
                value={warnaId}
                onChange={(e) => setWarnaId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3dbd84] bg-white transition-all"
              >
                <option value="">Pilih Warna...</option>
                {warnaList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Merek / Brand *
              </label>
              <select
                name="merekId"
                required
                value={merekId}
                onChange={(e) => setMerekId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3dbd84] bg-white transition-all"
              >
                <option value="">Pilih Merek...</option>
                {merekList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Perkiraan Lokasi Hilang *
              </label>
              <select
                name="lokasiId"
                required
                value={lokasiId}
                onChange={(e) => setLokasiId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3dbd84] bg-white transition-all"
              >
                <option value="">Pilih Lokasi...</option>
                {lokasiList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Ciri Khusus / Deskripsi Tambahan
            </label>
            <textarea
              name="additionalDesc"
              rows={3}
              placeholder="Contoh: Ada gantungan kunci anime, layar ada goresan kecil di pojok kanan atas..."
              className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#3dbd84] transition-all"
            ></textarea>
          </div>

          {/* Pencocokan Realtime Barang Temuan Yang Sudah Ada */}
          <div className="pt-4 border-t border-gray-100">
            <SearchableFoundItem
              currentFormState={{ jenisId, warnaId, merekId, lokasiId }}
              onSelect={(foundItem) => setMatchedFoundItem(foundItem)}
            />
          </div>

          {/* Rincian Barang Temuan Terpilih untuk Klaim Instan (Jalur 2) */}
          {matchedFoundItem && (
            <div className="p-4 bg-[#3dbd84]/10 border border-[#3dbd84]/30 rounded-xl flex items-center justify-between animate-in fade-in duration-300">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a5c44]">
                  Barang Temuan Terpilih (Klaim Sekaligus / Jalur 2)
                </span>
                <p className="text-sm font-bold text-[#0d3b2e] mt-0.5">
                  {matchedFoundItem.jenis?.name} {matchedFoundItem.merek?.name} (
                  {matchedFoundItem.warna?.name})
                </p>
                <p className="text-xs font-mono text-[#1a5c44]">
                  Kode Unik: {matchedFoundItem.businessCode} | Lokasi Ditemukan:{" "}
                  {matchedFoundItem.lokasi?.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMatchedFoundItem(null)}
                className="text-xs text-red-600 hover:text-red-800 font-bold px-3 py-1 bg-white rounded-lg border border-red-200 shadow-sm cursor-pointer"
              >
                Batal Pilih
              </button>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !verified}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !verified
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : matchedFoundItem
                ? "bg-[#1a5c44] hover:bg-[#0d3b2e]"
                : "bg-[#0d3b2e] hover:bg-[#1a5c44]"
            }`}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Menyimpan...</span>
            ) : matchedFoundItem ? (
              <>Simpan Laporan & Selesaikan Klaim Sekaligus (Jalur 2) &rarr;</>
            ) : (
              <>Buat Laporan Kehilangan (Jalur 1) &rarr;</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}