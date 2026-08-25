"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import TemuanRow from "./TemuanRow";

interface TemuanClientProps {
  foundItems: any[];
}

export default function TemuanClient({ foundItems }: TemuanClientProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filteredItems = foundItems.filter((item) => {
    const matchesSearch =
      !query ||
      item.businessCode?.toLowerCase().includes(query) ||
      item.jenis?.name?.toLowerCase().includes(query) ||
      item.merek?.name?.toLowerCase().includes(query) ||
      item.warna?.name?.toLowerCase().includes(query) ||
      item.lokasi?.name?.toLowerCase().includes(query) ||
      item.finderName?.toLowerCase().includes(query);

    const matchesStatus =
      filterStatus === "ALL" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {["ALL", "FOUND", "CLAIMED", "EXPIRED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-[#0d3b2e] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {status === "ALL"
                ? "Semua"
                : status === "FOUND"
                ? "Tersedia"
                : status === "CLAIMED"
                ? "Sudah Diambil"
                : "Kedaluwarsa"}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-500">
          Menampilkan <strong>{filteredItems.length}</strong> data
        </span>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Kode Barang</th>
                <th className="px-6 py-4">Jenis</th>
                <th className="px-6 py-4">Merek</th>
                <th className="px-6 py-4">Warna</th>
                <th className="px-6 py-4">Lokasi</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-sm">
                    Tidak ada data barang temuan yang cocok.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <TemuanRow key={item.id} item={item} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
