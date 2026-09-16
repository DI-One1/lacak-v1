"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  PublicFoundItem,
  getItemTitle,
  getCategoryRepresentativeImage,
  formatIndonesianDate,
  DEFAULT_ITEM_IMAGE,
} from "./public-utils";

interface ItemDetailModalProps {
  item: PublicFoundItem | null;
  onClose: () => void;
}

// Nomor WhatsApp Admin LACAK (Bisa disesuaikan lewat ENV jika ada)
const ADMIN_WA_NUMBER =
  process.env.NEXT_PUBLIC_ADMIN_WA || "6281284567890";

export default function ItemDetailModal({
  item,
  onClose,
}: ItemDetailModalProps) {
  const { isSignedIn, user } = useUser();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    if (item) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
      setShowLoginPrompt(false);
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [item]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const title = getItemTitle(item);
  const imageUrl = getCategoryRepresentativeImage(item.jenis.name);
  const formattedDate = formatIndonesianDate(item.createdAt);

  const userName = user?.fullName || user?.firstName || "Warga BAZMA";
  const userEmail =
    user?.primaryEmailAddress?.emailAddress || "email tidak terdata";

  // Pesan WhatsApp otomatis terstruktur
  const waMessage = encodeURIComponent(
    `Halo Admin LACAK, saya *${userName}* (${userEmail}) ingin konfirmasi pengambilan barang temuan:\n\n` +
      `📦 *${title}*\n` +
      `🏷️ Kategori: ${item.jenis.name}\n` +
      `🎨 Warna: ${item.warna.name}\n` +
      `📍 Lokasi Ditemukan: ${item.lokasi.name}\n` +
      `🔑 Kode Barang: ${item.businessCode || item.id.slice(0, 8)}\n\n` +
      `Mohon petunjuk untuk proses verifikasi dan pengambilan barang. Terima kasih!`
  );

  const waUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${waMessage}`;

  return (
    <div className="reference-modal fixed inset-0 z-[1100] flex items-center justify-center overflow-y-auto p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#061814]/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Body */}
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalItemName"
        className="reference-modal-dialog relative z-10 my-auto w-full max-w-[900px] overflow-hidden rounded-[12px] bg-white shadow-[0_24px_70px_rgba(5,31,28,0.3)]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail barang"
          className="absolute top-3.5 right-3.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors shadow-sm text-lg"
        >
          ✕
        </button>

        <div className="reference-modal-grid grid md:grid-cols-[1.05fr_1.3fr]">
          {/* Kolom Kiri: Gambar Barang */}
          <div className="relative min-h-[220px] md:min-h-[460px] bg-gray-100 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_ITEM_IMAGE;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="absolute top-4 left-4 rounded-md bg-[#0a2622]/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
              {item.jenis.name}
            </span>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[11px] opacity-85 block mb-1">
                Kode Barang: {item.businessCode || item.id.slice(0, 8)}
              </span>
              <p className="text-xs opacity-75">
                Ditemukan di {item.lokasi.name}
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Detail & Spesifikasi */}
          <div className="flex flex-col p-5 sm:p-7 md:p-8 bg-white">
            <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#0d7565] mb-1">
              BARANG TEMUAN
            </div>
            <div className="text-xs font-semibold text-gray-500 mb-2">
              {item.jenis.name}
            </div>
            <h2
              id="modalItemName"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#102020] leading-tight mb-5"
            >
              {title}
            </h2>

            {/* Grid Spesifikasi 4 Kotak */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-xl border border-[#edf3f1] bg-[#f8faf9] p-3">
                <span className="block text-[10px] uppercase font-semibold text-gray-400 mb-0.5">
                  Brand / Merek
                </span>
                <strong className="text-sm font-semibold text-[#18312d] truncate block">
                  {item.merek.name}
                </strong>
              </div>

              <div className="rounded-xl border border-[#edf3f1] bg-[#f8faf9] p-3">
                <span className="block text-[10px] uppercase font-semibold text-gray-400 mb-0.5">
                  Warna
                </span>
                <strong className="text-sm font-semibold text-[#18312d] truncate block">
                  {item.warna.name}
                </strong>
              </div>

              <div className="rounded-xl border border-[#edf3f1] bg-[#f8faf9] p-3">
                <span className="block text-[10px] uppercase font-semibold text-gray-400 mb-0.5">
                  Lokasi Ditemukan
                </span>
                <strong className="text-sm font-semibold text-[#18312d] truncate block">
                  {item.lokasi.name}
                </strong>
              </div>

              <div className="rounded-xl border border-[#edf3f1] bg-[#f8faf9] p-3">
                <span className="block text-[10px] uppercase font-semibold text-gray-400 mb-0.5">
                  Tanggal Ditemukan
                </span>
                <strong className="text-sm font-semibold text-[#18312d] truncate block">
                  {formattedDate}
                </strong>
              </div>
            </div>

            {/* Keterangan */}
            <div className="mb-5">
              <span className="block text-[11px] font-semibold text-gray-500 mb-1">
                Keterangan Tambahan
              </span>
              <p className="text-xs leading-relaxed text-gray-600 rounded-lg bg-[#fbfdfc] border border-dashed border-[#e1ece8] p-3">
                {item.additionalDesc || "Tidak ada keterangan khusus untuk barang ini."}
              </p>
            </div>

            {/* Catatan Privasi & Keamanan */}
            <div className="rounded-lg bg-[#f2f8f6] border border-[#d6ebe5] p-3 mb-6">
              <p className="text-[11px] text-[#24534a] leading-relaxed flex items-start gap-2">
                <span className="text-[#0d7565] font-bold text-sm">🔒</span>
                <span>
                  Informasi kontak pemilik tidak ditampilkan untuk menjaga
                  privasi. Silakan masuk akun untuk menghubungi admin pengurus
                  barang.
                </span>
              </p>
            </div>

            {/* Aksi WhatsApp dengan Guard Autentikasi */}
            <div className="mt-auto">
              {isSignedIn ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#0d594f] px-5 py-3.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#09473f] hover:shadow-lg shadow-[#0d594f]/20 active:scale-[0.99]"
                >
                  <span>Chat Admin untuk Pengambilan</span>
                  <span className="text-sm font-bold">→</span>
                </a>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowLoginPrompt(true)}
                    className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#0d594f] px-5 py-3.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#09473f] hover:shadow-lg shadow-[#0d594f]/20 active:scale-[0.99]"
                  >
                    <span>Chat Admin untuk Pengambilan</span>
                    <span className="text-sm font-bold">→</span>
                  </button>

                  {showLoginPrompt && (
                    <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 animate-fadeIn">
                      <p className="text-xs text-amber-800 mb-2 font-medium">
                        🛡️ Demi keamanan dan mencegah spam, silakan masuk dengan akun Anda terlebih dahulu untuk konfirmasi pengambilan ke admin.
                      </p>
                      <SignInButton mode="modal">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Masuk Sekarang
                        </button>
                      </SignInButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
