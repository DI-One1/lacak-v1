"use client";

import { useState } from "react";
import { timeAgo } from "@/utils/dateFormat";

interface LaporanRowProps {
  item: any;
}

export default function LaporanRow({ item }: LaporanRowProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DICARI":
        return (
          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">
            Sedang Dicari
          </span>
        );
      case "SELESAI":
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">
            Ditemukan / Selesai
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
        <td className="px-6 py-4 text-sm font-bold text-gray-900">
          {item.reporterName}
          <div className="text-[11px] font-mono text-gray-500 font-normal">
            ID: {item.reporterIdCard}
          </div>
        </td>
        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
          {item.jenis?.name || "-"}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {item.lokasi?.name || "-"}
        </td>
        <td className="px-6 py-4 text-center">
          {getStatusBadge(item.status)}
        </td>
        <td className="px-6 py-4 text-xs text-gray-500">
          {timeAgo(item.createdAt)}
        </td>
        <td className="px-6 py-4 text-right">
          <button
            onClick={() => setIsDetailOpen(!isDetailOpen)}
            className="text-xs text-[#3dbd84] hover:text-[#1a5c44] font-bold px-3 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
          >
            {isDetailOpen ? "Tutup" : "Rincian"}
          </button>
        </td>
      </tr>

      {/* Expanded Row Detail */}
      {isDetailOpen && (
        <tr className="bg-emerald-50/30 border-b border-emerald-100">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-bold text-gray-700 uppercase tracking-wider">
                  Informasi Kontak Pelapor
                </p>
                <p className="text-gray-900 font-semibold mt-1">{item.reporterName}</p>
                <p className="text-gray-500 font-mono">ID: {item.reporterIdCard}</p>
                <p className="text-gray-500">Kontak: {item.reporterContact || "-"}</p>
              </div>

              <div>
                <p className="font-bold text-gray-700 uppercase tracking-wider">
                  Deskripsi Kehilangan
                </p>
                <p className="text-gray-700 mt-1 italic">
                  {item.additionalDesc || "Tidak ada deskripsi tambahan."}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-700 uppercase tracking-wider">
                  Waktu Pelaporan
                </p>
                <p className="text-gray-700 mt-1">
                  {new Date(item.createdAt).toLocaleString("id-ID", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
