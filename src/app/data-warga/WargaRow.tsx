"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Warga } from "@/types/warga";

interface WargaRowProps {
  item: Warga;
  onHapus: (id: string) => void;
  onRincianProfil: (warga: Warga) => void;
  onRincianAksi: (warga: Warga) => void;
}

/** Jarak antara tombol dan dropdown (px) */
const GAP = 8;
/** Margin aman dari tepi viewport (px) */
const VIEWPORT_MARGIN = 8;

interface DropdownPos {
  top: number;
  left: number;
}

export default function WargaRow({
  item,
  onHapus,
  onRincianProfil,
  onRincianAksi,
}: WargaRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<DropdownPos>({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  // Pastikan portal hanya dirender di client untuk menghindari hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // ---- Hitung posisi dropdown relatif terhadap viewport ----
  const recalcPosition = useCallback(() => {
    const btn = buttonRef.current;
    const dd = dropdownRef.current;
    if (!btn || !dd) return;

    const btnRect = btn.getBoundingClientRect();
    const ddRect = dd.getBoundingClientRect();
    const ddWidth = ddRect.width;
    const ddHeight = ddRect.height;

    // --- Vertikal: default di bawah, flip ke atas jika tidak cukup ---
    const spaceBelow = window.innerHeight - btnRect.bottom - GAP;
    const spaceAbove = btnRect.top - GAP;

    let top: number;
    if (spaceBelow >= ddHeight) {
      // Cukup ruang di bawah
      top = btnRect.bottom + GAP;
    } else if (spaceAbove >= ddHeight) {
      // Flip ke atas
      top = btnRect.top - ddHeight - GAP;
    } else {
      // Tidak cukup di atas maupun bawah — pilih yang lebih lega
      top =
        spaceBelow >= spaceAbove
          ? btnRect.bottom + GAP
          : btnRect.top - ddHeight - GAP;
    }

    // --- Horizontal: align kanan tombol, geser jika mepet ---
    let left = btnRect.right - ddWidth;

    // Jangan sampai keluar kanan viewport
    if (left + ddWidth > window.innerWidth - VIEWPORT_MARGIN) {
      left = window.innerWidth - ddWidth - VIEWPORT_MARGIN;
    }
    // Jangan sampai keluar kiri viewport
    if (left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN;
    }

    // Clamp vertikal agar tidak keluar viewport
    if (top < VIEWPORT_MARGIN) {
      top = VIEWPORT_MARGIN;
    }
    if (top + ddHeight > window.innerHeight - VIEWPORT_MARGIN) {
      top = window.innerHeight - ddHeight - VIEWPORT_MARGIN;
    }

    setPos({ top, left });
  }, []);

  // Hitung posisi setiap kali dropdown terbuka & saat scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    // Hitung posisi awal setelah render
    // requestAnimationFrame memastikan dropdown sudah ter-render sehingga dimensinya bisa diukur
    const rafId = requestAnimationFrame(() => {
      recalcPosition();
    });

    const handleScrollOrResize = () => {
      recalcPosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true); // capture phase agar menangkap scroll di container manapun
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, recalcPosition]);

  // ---- Click outside untuk menutup dropdown ----
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      // Jangan tutup jika klik pada tombol itu sendiri (toggle ditangani oleh onClick tombol)
      if (buttonRef.current?.contains(target)) return;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ---- Tutup dropdown saat tekan Escape ----
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // ---- Render dropdown via Portal ----
  const dropdownPortal =
    mounted && isOpen
      ? createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              zIndex: 99999,
            }}
            className="w-44 bg-white border border-gray-200/80 rounded-xl shadow-lg shadow-black/8 overflow-hidden py-1"
          >
            {/* Rincian Profil */}
            <button
              onClick={() => {
                setIsOpen(false);
                onRincianProfil(item);
              }}
              className="w-full text-left px-3.5 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="text-gray-400 shrink-0"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="text-gray-400 shrink-0"
              >
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.399l-.395-.007.124-.584h2.191zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="text-red-400 shrink-0"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path
                  fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
              Hapus
            </button>
          </div>,
          document.body
        )
      : null;

  return (
    <tr
      className={
        item.id.startsWith("temp-")
          ? "opacity-50 animate-pulse bg-gray-50"
          : "hover:bg-gray-50 transition-colors"
      }
    >
      <td className="px-6 py-4 text-sm font-bold text-[#1a5c44]">
        {item.id.startsWith("temp-") ? "Generating..." : item.id}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-800">
        {item.nama}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{item.peran}</td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {item.keterangan_peran || "-"}
      </td>
      <td className="px-6 py-4 text-center">
        <div className="inline-block">
          {/* Tombol Titik Tiga — tetap di dalam tabel */}
          <button
            ref={buttonRef}
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
            disabled={item.id.startsWith("temp-")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
          </button>
        </div>

        {/* Dropdown dirender via Portal ke document.body */}
        {dropdownPortal}
      </td>
    </tr>
  );
}
