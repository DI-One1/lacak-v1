"use client";

import { useSearchParams } from "next/navigation";
import PengambilanRow from "./PengambilanRow";

interface PengambilanClientProps {
  claims: any[];
}

export default function PengambilanClient({ claims }: PengambilanClientProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const filteredClaims = claims.filter((item) => {
    return (
      !query ||
      item.claimantName?.toLowerCase().includes(query) ||
      item.claimantIdCard?.toLowerCase().includes(query) ||
      item.foundItem?.businessCode?.toLowerCase().includes(query) ||
      item.foundItem?.jenis?.name?.toLowerCase().includes(query) ||
      item.foundItem?.merek?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Menampilkan <strong>{filteredClaims.length}</strong> transaksi pengambilan
        </span>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Penerima (Pemilik)</th>
                <th className="px-6 py-4">Kode Barang</th>
                <th className="px-6 py-4">Jenis Barang</th>
                <th className="px-6 py-4">Merek & Warna</th>
                <th className="px-6 py-4">Waktu Klaim</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                    Tidak ada riwayat transaksi serah terima.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((item) => (
                  <PengambilanRow key={item.id} item={item} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
