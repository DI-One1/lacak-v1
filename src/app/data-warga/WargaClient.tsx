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
import WargaProfileModal from "./components/WargaProfileModal";
import WargaActivityModal from "./components/WargaActivityModal";
export default function WargaClient({ initialData }: { initialData: Warga[] }) {
  const [dataWarga, setDataWarga] = useState<Warga[]>(initialData);
  const [prevInitialData, setPrevInitialData] = useState<Warga[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State terpisah untuk dua modal
  const [profilWarga, setProfilWarga] = useState<Warga | null>(null);
  const [aksiWarga, setAksiWarga] = useState<Warga | null>(null);

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

  // Load activity history when aksiWarga is selected
  useEffect(() => {
    if (!aksiWarga) return;

    let isMounted = true;
    const loadHistory = async () => {
      setIsLoadingActivities(true);
      try {
        const history = await getWargaActivityHistory(aksiWarga.id);
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
  }, [aksiWarga]);

  // Lock background scrolling when any modal is open
  useEffect(() => {
    if (profilWarga || aksiWarga || isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [profilWarga, aksiWarga, isModalOpen]);


  const handleRincianProfil = (warga: Warga) => {
    setProfilWarga(warga);
  };

  const handleRincianAksi = (warga: Warga) => {
    setActivityHistory([]);
    setActiveFilter("ALL");
    setAksiWarga(warga);
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto mb-24">
        <table className="w-full text-left border-collapse min-w-[700px]">
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
                  onRincianProfil={handleRincianProfil}
                  onRincianAksi={handleRincianAksi}
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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL RINCIAN PROFIL                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {profilWarga && (
        <WargaProfileModal
          profilWarga={profilWarga}
          onClose={() => setProfilWarga(null)}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL RINCIAN AKSI                                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {aksiWarga && (
        <WargaActivityModal
          aksiWarga={aksiWarga}
          activityHistory={activityHistory}
          isLoadingActivities={isLoadingActivities}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onClose={() => setAksiWarga(null)}
        />
      )}
    </div>
  );
}