"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

export default function NavTabs() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;
  const isRiwayatActive = pathname.startsWith("/riwayat");

  // Close on Click Outside
  useClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  // Close on Escape
  useKeyboardShortcut("Escape", () => {
    setIsDropdownOpen(false);
  });

  return (
    <div className="container mx-auto px-4 md:px-5">
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 md:gap-10 items-center w-full">
        
        <div className="col-span-1 md:col-start-2 flex flex-wrap items-center gap-1 md:gap-2 overflow-visible py-1">
          
          {/* 1. Beranda */}
          <Link
            href="/dashboard"
            className={`block whitespace-nowrap text-[0.92rem] font-medium px-3 md:px-[18px] py-[13px] pb-[11px] border-b-[3px] transition-all no-underline ${
              isActive("/dashboard")
                ? "text-white font-semibold border-green-accent"
                : "text-white/65 hover:text-white border-transparent"
            }`}
          >
            Beranda
          </Link>

          {/* 2. Data Warga */}
          <Link
            href="/data-warga"
            className={`block whitespace-nowrap text-[0.92rem] font-medium px-3 md:px-[18px] py-[13px] pb-[11px] border-b-[3px] transition-all no-underline ${
              isActive("/data-warga")
                ? "text-white font-semibold border-green-accent"
                : "text-white/65 hover:text-white border-transparent"
            }`}
          >
            Data Warga
          </Link>


          {/* 3. Dropdown Riwayat */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className={`block whitespace-nowrap text-[0.92rem] font-medium px-3 md:px-[18px] py-[13px] pb-[11px] border-b-[3px] transition-all bg-transparent cursor-pointer flex items-center gap-1 ${
                isRiwayatActive
                  ? "text-white font-semibold border-green-accent"
                  : "text-white/65 hover:text-white border-transparent"
              }`}
            >
              Riwayat ▾
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 flex flex-col bg-white rounded-[14px] shadow-[0_15px_35px_rgba(0,0,0,.15)] p-2 min-w-[220px] z-[2000] border-0 text-gray-800 animate-in fade-in zoom-in-95 duration-150">
                <Link
                  href="/riwayat/temuan"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`block rounded-[8px] px-[14px] py-[10px] text-[0.88rem] font-medium transition-colors no-underline ${
                    isActive("/riwayat/temuan")
                      ? "bg-green-dark text-white"
                      : "text-green-dark hover:bg-green-dark hover:text-white"
                  }`}
                >
                  Taruh Barang
                </Link>
                <Link
                  href="/riwayat/laporan"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`block rounded-[8px] px-[14px] py-[10px] text-[0.88rem] font-medium transition-colors no-underline ${
                    isActive("/riwayat/laporan")
                      ? "bg-green-dark text-white"
                      : "text-green-dark hover:bg-green-dark hover:text-white"
                  }`}
                >
                  Laporan Kehilangan
                </Link>
                <Link
                  href="/riwayat/pengambilan"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`block rounded-[8px] px-[14px] py-[10px] text-[0.88rem] font-medium transition-colors no-underline ${
                    isActive("/riwayat/pengambilan")
                      ? "bg-green-dark text-white"
                      : "text-green-dark hover:bg-green-dark hover:text-white"
                  }`}
                >
                  Pengambilan Barang
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
