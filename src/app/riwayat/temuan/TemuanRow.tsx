"use client";

import { useState } from "react";
import { timeAgo } from "@/utils/dateFormat";

interface TemuanRowProps {
  item: any;
  onDelete?: (id: string) => void;
}

export default function TemuanRow({ item, onDelete }: TemuanRowProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FOUND":
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">
            Tersedia
          </span>
        );
      case "CLAIMED":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">
            Diambil
          </span>
        );
      case "EXPIRED":
        return (
          <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-bold">
            Kedaluwarsa
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
        <td className="px-6 py-4 font-mono font-bold text-xs text-[#0d3b2e]">
          {item.businessCode}
        </td>
        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
          {item.jenis?.name || "-"}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {item.merek?.name || "-"}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {item.warna?.name || "-"}
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
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-bold text-gray-700 uppercase tracking-wider">
                  Penemu Barang
                </p>
                <p className="text-gray-900 font-semibold mt-1">{item.finderName}</p>
                <p className="text-gray-500 font-mono">ID: {item.finderIdCard}</p>
                <p className="text-gray-500">Kontak: {item.finderContact || "-"}</p>
              </div>

              <div>
                <p className="font-bold text-gray-700 uppercase tracking-wider">
                  Keterangan Tambahan
                </p>
                <p className="text-gray-700 mt-1 italic">
                  {item.additionalDesc || "Tidak ada keterangan tambahan."}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-700 uppercase tracking-wider">
                  Waktu Pendaftaran
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
