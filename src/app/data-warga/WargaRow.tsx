"use client";

import { useState, useRef, useEffect } from "react";
import { Warga } from "@/types/warga";

interface WargaRowProps {
  item: Warga;
  onHapus: (id: string) => void;
  onRincianProfil: (warga: Warga) => void;
  onRincianAksi: (warga: Warga) => void;
}

export default function WargaRow({ item, onHapus, onRincianProfil, onRincianAksi }: WargaRowProps) {
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
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
            disabled={item.id.startsWith("temp-")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
          </button>

          {/* Menu Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200/80 rounded-xl shadow-lg shadow-black/8 z-50 overflow-hidden py-1">
              {/* Rincian Profil */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onRincianProfil(item);
                }}
                className="w-full text-left px-3.5 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="text-gray-400 shrink-0">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
                Rincian Profil
              </button>

              {/* Rincian Aksi */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onRincianAksi(item);
                }}
                className="w-full text-left px-3.5 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="text-gray-400 shrink-0">
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.399l-.395-.007.124-.584h2.191zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
                Rincian Aksi
              </button>

              {/* Separator */}
              <div className="my-1 mx-2.5 border-t border-gray-100"></div>

              {/* Hapus — Destructive Action */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onHapus(item.id);
                }}
                className="w-full text-left px-3.5 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="text-red-400 shrink-0">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
                Hapus
              </button>
            </div>
          )}
        </div>

      </td>
    </tr>
  );
}
