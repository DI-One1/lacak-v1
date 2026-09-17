"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase";
import {
  hapusWarga,
  hapusSemuaWarga,
  tambahWarga,
  getWargaActivityHistory,
} from "../actions";
import { Warga, WargaActivityItem, ActivityType } from "../types";
import { useSearchParams } from "next/navigation";
import WargaRow from "./WargaRow";
import WargaProfileModal from "./WargaProfileModal";
import WargaActivityModal from "./WargaActivityModal";

import { Users, UserPlus, Trash2 } from "lucide-react";

// UI primitives
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";

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
          // payload.new mapping from DB (snake_case)
          const newWarga: Warga = {
            id: payload.new.id,
            nama: payload.new.nama,
            peran: payload.new.peran,
            keterangan_peran: payload.new.keterangan_peran || payload.new.keteranganPeran || null,
            nomor_telepon: payload.new.nomor_telepon || payload.new.nomorTelepon || null,
            created_at: payload.new.created_at || payload.new.createdAt || new Date().toISOString(),
          };
          if (current.some((w) => w.id === newWarga.id)) return current;
          return [newWarga, ...current];
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

    // Optimistically insert temporary row
    setDataWarga((current) => [newTempWarga, ...current]);

    try {
      const response = await tambahWarga(formData);
      if (response && response.success && response.data) {
        // Replace temp row with actual saved database row
        setDataWarga((current) =>
          current.map((w) => (w.id === newTempWarga.id ? (response.data as Warga) : w))
        );
        formRef.current?.reset();
      } else {
        // Fallback cleanup if success wasn't fully verified
        setDataWarga((current) => current.filter((w) => w.id !== newTempWarga.id));
      }
    } catch {
      // Remove temp row on failure
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

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0d7565] flex items-center gap-2.5">
          <Users className="h-6 w-6 text-[#0d7565]" />
          <span>Data Warga</span>
        </h1>

        <span className="text-xs font-semibold text-[#57706a] bg-[#eef7f4] px-3 py-1.5 rounded-full border border-[#d6e5df]">
          {filteredData.length} warga terdaftar
        </span>
      </div>

      <div className="mb-24">
        <Table headers={["NIS / ID", "Nama", "Peran", "Keterangan Peran", "Aksi"]}>
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
        </Table>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-3">
        {dataWarga.length > 0 && (
          <button
            onClick={handleHapusSemua}
            title="Hapus Semua Data Warga"
            className="flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:scale-105 transition-all duration-200 cursor-pointer border-none outline-none"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          title="Tambah Warga Baru"
          className="flex items-center justify-center w-14 h-14 bg-[#0d7565] text-white rounded-full shadow-xl hover:bg-[#0a5d50] hover:scale-105 transition-all duration-200 cursor-pointer border-none outline-none"
        >
          <UserPlus className="h-6 w-6" />
        </button>
      </div>

      {/* MODAL TAMBAH DATA WARGA */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Data Warga">
        <form ref={formRef} action={handleTambahSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nama Lengkap *</label>
            <Input
              required
              name="nama"
              type="text"
              placeholder="Masukkan nama lengkap..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Peran *</label>
            <Select
              required
              name="peran"
              options={[
                { value: "Siswa", label: "Siswa" },
                { value: "Guru", label: "Guru" },
                { value: "Staf", label: "Staf" },
              ]}
              placeholder="Pilih peran..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Keterangan Peran</label>
            <Input
              name="keterangan_peran"
              placeholder="Contoh: XII-SIJA / Wali Kelas"
              type="text"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nomor Telepon</label>
            <Input
              name="nomor_telepon"
              type="tel"
              placeholder="Contoh: 08123456789"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL RINCIAN PROFIL */}
      {profilWarga && (
        <WargaProfileModal
          profilWarga={profilWarga}
          isOpen={!!profilWarga}
          onClose={() => setProfilWarga(null)}
        />
      )}

      {/* MODAL RINCIAN AKSI */}
      {aksiWarga && (
        <WargaActivityModal
          aksiWarga={aksiWarga}
          isOpen={!!aksiWarga}
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
