"use client";

import { useState, useRef, useEffect } from "react";
import { Warga } from "@/types/warga";

interface WargaRowProps {
  item: Warga;
  onHapus: (id: string) => void;
  onRincian: (warga: Warga) => void;
}

export default function WargaRow({ item, onHapus, onRincian }: WargaRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk menutup dropdown kalau user klik di luar kotak
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <tr className={item.id.startsWith("temp-") ? "opacity-50 animate-pulse bg-gray-50" : "hover:bg-gray-50 transition-colors"}>
      <td className="px-6 py-4 text-sm font-bold text-[#1a5c44]">
        {item.id.startsWith("temp-") ? "Generating..." : item.id}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.nama}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{item.peran}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{item.keterangan_peran || "-"}</td>
      <td className="px-6 py-4 text-center relative">
        
        {/* Wadah Dropdown (Butuh Ref) */}
        <div ref={dropdownRef} className="relative inline-block text-left">
          {/* Tombol Titik Tiga */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
            disabled={item.id.startsWith("temp-")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
          </button>

          {/* Menu Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onRincian(item);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Rincian
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onHapus(item.id);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Hapus
              </button>
            </div>
          )}
        </div>

      </td>
    </tr>
  );
}