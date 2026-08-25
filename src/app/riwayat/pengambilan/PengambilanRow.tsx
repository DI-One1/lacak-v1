"use client";

import { useState } from "react";
import { timeAgo } from "@/lib/utils/dateFormat";

interface PengambilanRowProps {
  item: any;
}

export default function PengambilanRow({ item }: PengambilanRowProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
        <td className="px-6 py-4 text-sm font-bold text-gray-900">
          {item.claimantName}
          <div className="text-[11px] font-mono text-gray-500 font-normal">
            ID: {item.claimantIdCard}
          </div>
        </td>
        <td className="px-6 py-4 font-mono font-bold text-xs text-[#0d3b2e]">
          {item.foundItem?.businessCode || "-"}
        </td>
        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
          {item.foundItem?.jenis?.name || "-"}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {item.foundItem?.merek?.name || "-"} ({item.foundItem?.warna?.name || "-"})
        </td>
        <td className="px-6 py-4 text-xs text-gray-500">
          {timeAgo(item.claimedAt)}
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
                  Data Penerima / Pemilik
                </p>
                <p className="text-gray-900 font-semibold mt-1">{item.claimantName}</p>
                <p className="text-gray-500 font-mono">ID: {item.claimantIdCard}</p>
                <p className="text-gray-500">Kontak: {item.claimantContact || "-"}</p>
              </div>

              <div>
                <p className="font-bold text-gray-700 uppercase tracking-wider">
                  Data Penemu Awal
                </p>
                <p className="text-gray-900 font-semibold mt-1">
                  {item.foundItem?.finderName || "-"}
                </p>
                <p className="text-gray-500 font-mono">
                  ID: {item.foundItem?.finderIdCard || "-"}
                </p>
                <p className="text-gray-500">
                  Lokasi Temuan: {item.foundItem?.lokasi?.name || "-"}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-700 uppercase tracking-wider">
                  Waktu Serah Terima
                </p>
                <p className="text-gray-700 mt-1">
                  {new Date(item.claimedAt).toLocaleString("id-ID", {
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
