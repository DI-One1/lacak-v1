"use client";

import SearchableFoundItem from "./SearchableFoundItem";
import { FoundItemMatch } from "../types";

interface MasterItem {
  id: string;
  name: string;
}

interface StepDetailBarangProps {
  jenisList: MasterItem[];
  warnaList: MasterItem[];
  merekList: MasterItem[];
  lokasiList: MasterItem[];

  jenisId: string;
  warnaId: string;
  merekId: string;
  lokasiId: string;

  matchedFoundItem: FoundItemMatch | null;

  onJenisChange: (value: string) => void;
  onWarnaChange: (value: string) => void;
  onMerekChange: (value: string) => void;
  onLokasiChange: (value: string) => void;

  onSelectFoundItem: (item: FoundItemMatch) => void;

  onClearFoundItem: () => void;
}

export default function StepDetailBarang({
  jenisList,
  warnaList,
  merekList,
  lokasiList,
  jenisId,
  warnaId,
  merekId,
  lokasiId,
  matchedFoundItem,
  onJenisChange,
  onWarnaChange,
  onMerekChange,
  onLokasiChange,
  onSelectFoundItem,
  onClearFoundItem,
}: StepDetailBarangProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
      <h3 className="text-lg font-bold text-green-dark mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-green-dark text-white text-xs flex items-center justify-center font-bold">
          2
        </span>
        Karakteristik & Detail Barang Hilang
      </h3>

      {/* =====================================
          ATRIBUT BARANG
      ===================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* JENIS */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Jenis Barang *
          </label>

          <select
            name="jenisId"
            required
            value={jenisId}
            onChange={(e) => onJenisChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-accent bg-white transition-all"
          >
            <option value="">Pilih Jenis...</option>

            {jenisList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* WARNA */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Warna Dominan *
          </label>

          <select
            name="warnaId"
            required
            value={warnaId}
            onChange={(e) => onWarnaChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-accent bg-white transition-all"
          >
            <option value="">Pilih Warna...</option>

            {warnaList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* MEREK */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Merek / Brand *
          </label>

          <select
            name="merekId"
            required
            value={merekId}
            onChange={(e) => onMerekChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-accent bg-white transition-all"
          >
            <option value="">Pilih Merek...</option>

            {merekList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* LOKASI */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Perkiraan Lokasi Hilang *
          </label>

          <select
            name="lokasiId"
            required
            value={lokasiId}
            onChange={(e) => onLokasiChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-accent bg-white transition-all"
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

      {/* =====================================
          DESKRIPSI
      ===================================== */}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          Ciri Khusus / Deskripsi Tambahan
        </label>

        <textarea
          name="additionalDesc"
          rows={3}
          placeholder="Contoh: Ada gantungan kunci anime, layar ada goresan kecil di pojok kanan atas..."
          className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-green-accent transition-all"
        />
      </div>

      {/* =====================================
          PENCARIAN BARANG TEMUAN
      ===================================== */}

      <div className="pt-4 border-t border-gray-100">
        <SearchableFoundItem
          currentFormState={{
            jenisId,
            warnaId,
            merekId,
            lokasiId,
          }}
          onSelect={onSelectFoundItem}
        />
      </div>

      {/* =====================================
          BARANG TEMUAN TERPILIH
      ===================================== */}

      {matchedFoundItem && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-mid">
              Barang Temuan Terpilih (Klaim Sekaligus / Jalur 2)
            </span>

            <p className="text-sm font-bold text-green-dark mt-0.5">
              {matchedFoundItem.jenis?.name} {matchedFoundItem.merek?.name} ({matchedFoundItem.warna?.name})
            </p>

            <p className="text-xs font-mono text-green-mid">
              Kode Unik: {matchedFoundItem.businessCode} | Lokasi Ditemukan: {matchedFoundItem.lokasi?.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClearFoundItem}
            className="text-xs text-red-600 hover:text-red-800 font-bold px-3 py-1 bg-white rounded-lg border border-red-200 shadow-sm cursor-pointer"
          >
            Batal Pilih
          </button>
        </div>
      )}
    </div>
  );
}
