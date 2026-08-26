"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavTabs() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;
  const isRiwayatActive = pathname.startsWith("/riwayat");

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-5">
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 md:gap-10 items-center w-full">
        
        <div className="col-span-1 md:col-start-2 flex items-center gap-2 overflow-x-auto md:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1">
          
          {/* 1. Beranda */}
          <Link
            href="/dashboard"
            className={`block whitespace-nowrap text-[0.92rem] font-medium px-[18px] py-[13px] pb-[11px] border-b-[3px] transition-all no-underline ${
              isActive("/dashboard")
                ? "text-white font-semibold border-[#3dbd84]"
                : "text-white/65 hover:text-white border-transparent"
            }`}
          >
            Beranda
          </Link>

          {/* 2. Data Warga */}
          <Link
            href="/data-warga"
            className={`block whitespace-nowrap text-[0.92rem] font-medium px-[18px] py-[13px] pb-[11px] border-b-[3px] transition-all no-underline ${
              isActive("/data-warga")
                ? "text-white font-semibold border-[#3dbd84]"
                : "text-white/65 hover:text-white border-transparent"
            }`}
          >
            Data Warga
          </Link>

          {/* 3. Tentang Kami */}
          <Link
            href="/tentang-kami"
            className={`block whitespace-nowrap text-[0.92rem] font-medium px-[18px] py-[13px] pb-[11px] border-b-[3px] transition-all no-underline ${
              isActive("/tentang-kami")
                ? "text-white font-semibold border-[#3dbd84]"
                : "text-white/65 hover:text-white border-transparent"
            }`}
          >
            Tentang Kami
          </Link>

          {/* 3. Dropdown Riwayat */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`block whitespace-nowrap text-[0.92rem] font-medium px-[18px] py-[13px] pb-[11px] border-b-[3px] transition-all bg-transparent cursor-pointer flex items-center gap-1 ${
                isRiwayatActive
                  ? "text-white font-semibold border-[#3dbd84]"
                  : "text-white/65 hover:text-white border-transparent"
              }`}
            >
              Riwayat ▾
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 flex flex-col bg-white rounded-[14px] shadow-[0_15px_35px_rgba(0,0,0,.15)] p-2 min-w-[220px] z-[1050] border-0 text-gray-800 animate-in fade-in zoom-in-95 duration-150">
                <Link
                  href="/riwayat/temuan"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`block rounded-[8px] px-[14px] py-[10px] text-[0.88rem] font-medium transition-colors no-underline ${
                    isActive("/riwayat/temuan")
                      ? "bg-[#0d3b2e] text-white"
                      : "text-[#0d3b2e] hover:bg-[#0d3b2e] hover:text-white"
                  }`}
                >
                  Taruh Barang
                </Link>
                <Link
                  href="/riwayat/laporan"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`block rounded-[8px] px-[14px] py-[10px] text-[0.88rem] font-medium transition-colors no-underline ${
                    isActive("/riwayat/laporan")
                      ? "bg-[#0d3b2e] text-white"
                      : "text-[#0d3b2e] hover:bg-[#0d3b2e] hover:text-white"
                  }`}
                >
                  Laporan Kehilangan
                </Link>
                <Link
                  href="/riwayat/pengambilan"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`block rounded-[8px] px-[14px] py-[10px] text-[0.88rem] font-medium transition-colors no-underline ${
                    isActive("/riwayat/pengambilan")
                      ? "bg-[#0d3b2e] text-white"
                      : "text-[#0d3b2e] hover:bg-[#0d3b2e] hover:text-white"
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