"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  hapusWarga,
  hapusSemuaWarga,
  tambahWarga,
  getWargaActivityHistory,
} from "@/lib/actions/warga";
import { Warga, WargaActivityItem, ActivityType } from "@/types/warga";
import { useSearchParams } from "next/navigation";
import WargaRow from "./WargaRow";

export default function WargaClient({ initialData }: { initialData: Warga[] }) {
  const [dataWarga, setDataWarga] = useState<Warga[]>(initialData);
  const [prevInitialData, setPrevInitialData] = useState<Warga[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);

  // Sync state if server initialData changes
  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setDataWarga(initialData);
  }

  // State untuk Riwayat Aksi Warga
  const [activityHistory, setActivityHistory] = useState<WargaActivityItem[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ActivityType>("ALL");

  const formRef = useRef<HTMLFormElement>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // Realtime subscription via Supabase
  useEffect(() => {
    const channel = supabase
      .channel("warga-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "warga" }, (payload) => {
        setDataWarga((current) => {
          if (current.some((w) => w.id === payload.new.id)) return current;
          return [payload.new as Warga, ...current];
        });
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "warga" }, (payload) => {
        if (payload.old && payload.old.id) {
          setDataWarga((current) => current.filter((item) => item.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Load activity history when a warga is selected
  useEffect(() => {
    if (!selectedWarga) return;

    let isMounted = true;
    const loadHistory = async () => {
      setIsLoadingActivities(true);
      try {
        const history = await getWargaActivityHistory(selectedWarga.id);
        if (isMounted) {
          setActivityHistory(history);
        }
      } catch (error) {
        console.error("Gagal memuat riwayat aksi warga:", error);
      } finally {
        if (isMounted) {
          setIsLoadingActivities(false);
        }
      }
    };

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [selectedWarga]);

  const handleSelectWargaForDetail = (warga: Warga) => {
    setActivityHistory([]);
    setActiveFilter("ALL");
    setSelectedWarga(warga);
  };

  const handleTambahSubmit = async (formData: FormData) => {
    setIsModalOpen(false);

    const newTempWarga: Warga = {
      id: "temp-" + Date.now().toString(),
      nama: formData.get("nama") as string,
      peran: formData.get("peran") as string,
      keterangan_peran: (formData.get("keterangan_peran") as string) || null,
      nomor_telepon: (formData.get("nomor_telepon") as string) || null,
      created_at: new Date().toISOString(),
    };

    setDataWarga((current) => [newTempWarga, ...current]);

    try {
      await tambahWarga(formData);
      formRef.current?.reset();
    } catch {
      setDataWarga((current) => current.filter((w) => w.id !== newTempWarga.id));
      alert("Gagal menambahkan data.");
    }
  };

  const handleHapusSatu = async (id: string) => {
    if (confirm("Hapus data warga ini?")) {
      setDataWarga((current) => current.filter((w) => w.id !== id));
      await hapusWarga(id);
    }
  };

  const handleHapusSemua = async () => {
    if (confirm("Yakin hapus SEMUA?")) {
      setDataWarga([]);
      await hapusSemuaWarga();
    }
  };

  const filteredData = dataWarga.filter((warga) => {
    const query = searchQuery.toLowerCase();
    return (
      warga.nama.toLowerCase().includes(query) ||
      warga.peran.toLowerCase().includes(query) ||
      (warga.keterangan_peran && warga.keterangan_peran.toLowerCase().includes(query)) ||
      warga.id.toLowerCase().includes(query)
    );
  });

  const filteredActivities = activityHistory.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.type === activeFilter;
  });

  const formatActivityDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#0d3b2e]">Data Warga</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible mb-24">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">NIS / ID</th>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Peran</th>
              <th className="px-6 py-4">Keterangan Peran</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  {searchQuery
                    ? `Tidak ada warga dengan kata kunci "${searchQuery}"`
                    : "Belum ada data warga."}
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <WargaRow
                  key={item.id}
                  item={item}
                  onHapus={handleHapusSatu}
                  onRincian={handleSelectWargaForDetail}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
        {dataWarga.length > 0 && (
          <button
            onClick={handleHapusSemua}
            title="Hapus Semua Data Warga"
            className="flex items-center justify-center w-14 h-14 bg-red-500 text-white rounded-full shadow-xl hover:bg-red-600 hover:scale-110 transition-all duration-300 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path
                fillRule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
              />
            </svg>
          </button>
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          title="Tambah Warga Baru"
          className="flex items-center justify-center w-14 h-14 bg-[#0d3b2e] text-white rounded-full shadow-xl hover:bg-green-700 hover:scale-110 transition-all duration-300 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </button>
      </div>

      {/* MODAL TAMBAH DATA WARGA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#0d3b2e]">Tambah Data Warga</h2>
            <form ref={formRef} action={handleTambahSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
                <input
                  required
                  name="nama"
                  type="text"
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-[#0d3b2e] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Peran *</label>
                <select
                  required
                  name="peran"
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-[#0d3b2e] bg-white outline-none"
                >
                  <option value="">Pilih...</option>
                  <option value="Siswa">Siswa</option>
                  <option value="Guru">Guru</option>
                  <option value="Staf">Staf</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Keterangan Peran</label>
                <input
                  name="keterangan_peran"
                  placeholder="Contoh: XII-SIJA / Wali Kelas"
                  type="text"
                  className="w-full border rounded-lg p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                <input
                  name="nomor_telepon"
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  className="w-full border rounded-lg p-2.5 outline-none"
                />
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 p-2.5 rounded-lg hover:bg-gray-200 cursor-pointer font-medium text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0d3b2e] text-white p-2.5 rounded-lg hover:bg-green-700 cursor-pointer font-bold text-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL & RIWAYAT AKSI INDIVIDU WARGA */}
      {selectedWarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl p-6 md:p-8 relative flex flex-col overflow-hidden">
            <button
              onClick={() => setSelectedWarga(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
              </svg>
            </button>

            {/* Profil Singkat Warga */}
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0d3b2e] text-white flex items-center justify-center font-extrabold text-lg">
                  {selectedWarga.nama.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0d3b2e] leading-tight">
                    {selectedWarga.nama}
                  </h2>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    NIS/ID: <span className="font-bold text-[#1a5c44]">{selectedWarga.id}</span> &bull; {selectedWarga.peran}{" "}
                    {selectedWarga.keterangan_peran ? `(${selectedWarga.keterangan_peran})` : ""}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 block font-semibold uppercase text-[10px]">
                    Peran Warga
                  </span>
                  <span className="font-medium text-gray-800">{selectedWarga.peran}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold uppercase text-[10px]">
                    Keterangan
                  </span>
                  <span className="font-medium text-gray-800">
                    {selectedWarga.keterangan_peran || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold uppercase text-[10px]">
                    Kontak WhatsApp
                  </span>
                  {selectedWarga.nomor_telepon ? (
                    <a
                      href={`https://wa.me/${selectedWarga.nomor_telepon.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-green-700 hover:underline"
                    >
                      {selectedWarga.nomor_telepon}
                    </a>
                  ) : (
                    <span className="font-medium text-gray-400">-</span>
                  )}
                </div>
              </div>
            </div>

            {/* SEKSI RIWAYAT AKSI WARGA */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0d3b2e]">
                  Riwayat Aksi
                </h3>

                {/* Filter Tab Lokal */}
                <div className="flex bg-gray-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveFilter("ALL")}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      activeFilter === "ALL"
                        ? "bg-white text-[#0d3b2e] shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("LAPORAN")}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      activeFilter === "LAPORAN"
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Laporan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("TARUH")}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      activeFilter === "TARUH"
                        ? "bg-white text-teal-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Taruh Barang
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("PENGAMBILAN")}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      activeFilter === "PENGAMBILAN"
                        ? "bg-white text-green-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Pengambilan
                  </button>
                </div>
              </div>

              {/* Activity Timeline List */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                {isLoadingActivities ? (
                  <div className="p-8 text-center text-xs text-gray-400 animate-pulse">
                    Memuat riwayat aksi warga...
                  </div>
                ) : filteredActivities.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                    Belum ada riwayat aktivitas{" "}
                    {activeFilter === "ALL" ? "" : activeFilter.toLowerCase()} untuk warga ini.
                  </div>
                ) : (
                  filteredActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-xl transition-all text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              act.type === "LAPORAN"
                                ? "bg-blue-100 text-blue-700"
                                : act.type === "TARUH"
                                ? "bg-teal-100 text-teal-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {act.type === "LAPORAN"
                              ? "LAPORAN KEHILANGAN"
                              : act.type === "TARUH"
                              ? "TARUH BARANG"
                              : "PENGAMBILAN"}
                          </span>
                          <span className="text-gray-400 font-mono text-[10px]">
                            {formatActivityDate(act.date)}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            act.status === "SELESAI"
                              ? "bg-green-100 text-green-700"
                              : act.status === "DICARI"
                              ? "bg-amber-100 text-amber-700"
                              : act.status === "FOUND"
                              ? "bg-blue-100 text-blue-700"
                              : act.status === "CLAIMED"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {act.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <div>
                          <p className="font-bold text-[#0d3b2e] text-sm">{act.title}</p>
                          <p className="text-gray-500 text-[11px]">
                            {act.category} &bull; Lokasi: {act.lokasi}
                          </p>
                        </div>
                        {act.businessCode && (
                          <span className="font-mono font-bold text-[#1a5c44] bg-white border px-2 py-0.5 rounded text-[11px]">
                            {act.businessCode}
                          </span>
                        )}
                      </div>

                      {act.description && (
                        <p className="text-[11px] text-gray-500 italic bg-white/80 border border-gray-100 rounded-lg p-2 mt-1">
                          &quot;{act.description}&quot;
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="mt-4 pt-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedWarga(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}