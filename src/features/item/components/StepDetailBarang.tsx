"use client";

import { Package, Tag, Palette, MapPin, Info, X, CheckCircle2 } from "lucide-react";
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
    <div className="bg-white rounded-2xl shadow-xs border border-[#e2ece8] p-6 md:p-8 space-y-6">
      <h3 className="text-base md:text-lg font-bold text-[#0d7565] mb-4 flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-full bg-[#0d7565] text-white text-xs flex items-center justify-center font-bold shadow-xs">
          2
        </span>
        <span>Karakteristik & Detail Barang Hilang</span>
      </h3>

      {/* =====================================
          ATRIBUT BARANG
      ===================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* JENIS */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#57706a] mb-2">
            <Tag className="h-3.5 w-3.5 text-[#0d7565]" />
            <span>Jenis Barang *</span>
          </label>

          <select
            name="jenisId"
            required
            value={jenisId}
            onChange={(e) => onJenisChange(e.target.value)}
            className="w-full border border-[#d6e5df] rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-[#0d7565] focus:ring-2 focus:ring-[#0d7565]/20 bg-white transition-all text-[#142e29]"
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
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#57706a] mb-2">
            <Palette className="h-3.5 w-3.5 text-[#0d7565]" />
            <span>Warna Dominan *</span>
          </label>

          <select
            name="warnaId"
            required
            value={warnaId}
            onChange={(e) => onWarnaChange(e.target.value)}
            className="w-full border border-[#d6e5df] rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-[#0d7565] focus:ring-2 focus:ring-[#0d7565]/20 bg-white transition-all text-[#142e29]"
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
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#57706a] mb-2">
            <Package className="h-3.5 w-3.5 text-[#0d7565]" />
            <span>Merek / Brand *</span>
          </label>

          <select
            name="merekId"
            required
            value={merekId}
            onChange={(e) => onMerekChange(e.target.value)}
            className="w-full border border-[#d6e5df] rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-[#0d7565] focus:ring-2 focus:ring-[#0d7565]/20 bg-white transition-all text-[#142e29]"
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
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#57706a] mb-2">
            <MapPin className="h-3.5 w-3.5 text-[#0d7565]" />
            <span>Perkiraan Lokasi Hilang *</span>
          </label>

          <select
            name="lokasiId"
            required
            value={lokasiId}
            onChange={(e) => onLokasiChange(e.target.value)}
            className="w-full border border-[#d6e5df] rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-[#0d7565] focus:ring-2 focus:ring-[#0d7565]/20 bg-white transition-all text-[#142e29]"
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
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#57706a] mb-2">
          <Info className="h-3.5 w-3.5 text-[#0d7565]" />
          <span>Ciri Khusus / Deskripsi Tambahan</span>
        </label>

        <textarea
          name="additionalDesc"
          rows={3}
          placeholder="Contoh: Ada gantungan kunci anime, layar ada goresan kecil di pojok kanan atas..."
          className="w-full border border-[#d6e5df] rounded-xl p-4 text-xs md:text-sm focus:outline-none focus:border-[#0d7565] focus:ring-2 focus:ring-[#0d7565]/20 transition-all text-[#142e29]"
        />
      </div>

      {/* =====================================
          PENCARIAN BARANG TEMUAN
      ===================================== */}

      <div className="pt-4 border-t border-[#edf4f1]">
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
        <div className="p-4 bg-[#eaf6f2] border border-[#a8dbc9] rounded-xl flex items-center justify-between animate-fadeIn">
          <div>
            <span className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-[#0d7565]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#0d7565]" />
              <span>Barang Temuan Terpilih (Klaim Sekaligus / Jalur 2)</span>
            </span>

            <p className="text-sm font-bold text-[#0d594f] mt-0.5">
              {matchedFoundItem.jenis?.name} {matchedFoundItem.merek?.name} ({matchedFoundItem.warna?.name})
            </p>

            <p className="text-xs font-mono text-[#0d7565]">
              Kode Unik: {matchedFoundItem.businessCode} | Lokasi Ditemukan: {matchedFoundItem.lokasi?.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClearFoundItem}
            className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-bold px-3 py-1.5 bg-white rounded-lg border border-red-200 shadow-xs cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Batal Pilih</span>
          </button>
        </div>
      )}
    </div>
  );
}

