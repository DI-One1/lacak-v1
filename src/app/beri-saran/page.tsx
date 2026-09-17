"use client";

import { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

const ADMIN_GMAIL = "lacak.smktibazma@gmail.com";

export default function BeriSaranPage() {
  const { isSignedIn, isLoaded, user } = useUser();

  const [topic, setTopic] = useState("Kritik & Saran Penggunaan");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const userName = user?.fullName || user?.firstName || "Warga";
  const userEmail =
    user?.primaryEmailAddress?.emailAddress || "email tidak terdata";

  const handleSendViaGmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const emailSubject = `[SARAN LACAK] ${topic} - dari ${userName}`;
    const emailBody =
      `Halo Tim Pengelola LACAK,\n\n` +
      `Saya ingin menyampaikan masukan/saran untuk sistem Lost & Found:\n\n` +
      `👤 Nama Pengirim: ${userName}\n` +
      `📧 Email: ${userEmail}\n` +
      `📌 Topik: ${topic}\n\n` +
      `📝 Isi Saran:\n${message.trim()}\n\n` +
      `---\n` +
      `Dikirim melalui Formulir Saran Publik LACAK`;

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      ADMIN_GMAIL
    )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
      emailBody
    )}`;

    // Buka Gmail di tab baru
    window.open(gmailWebUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="public-page-panel public-feedback px-4 pt-10 pb-20 sm:px-6 sm:pt-14 sm:pb-24 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#d3e7e0] bg-white/80 px-4 py-2 text-xs font-semibold text-[#0d594f] backdrop-blur-xs transition-all hover:bg-white hover:border-[#158a76]/40 hover:shadow-xs group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#0d7565] block mb-1">
            BERI SARAN
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142926] tracking-tight mb-3">
            Punya saran untuk Lacak?
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Bantu kami membuat sistem Lost &amp; Found menjadi lebih baik,
            cepat, dan nyaman digunakan bersama.
          </p>
        </div>

        {/* Konten Berdasarkan Status Login */}
        {!isLoaded ? (
          <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
        ) : !isSignedIn ? (
          /* Card Ajakan Login */
          <div className="rounded-2xl border border-[#d3e7e0] bg-white p-6 sm:p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#eaf5f1] text-[#0d594f] flex items-center justify-center mx-auto mb-4 text-2xl">
              🛡️
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#18342f] mb-2">
              Masuk untuk Mengirimkan Saran
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
              Untuk menjaga kualitas masukan, mencegah penyalahgunaan, dan
              memastikan kami dapat menindaklanjuti masukan Anda, silakan masuk
              dengan akun Anda terlebih dahulu.
            </p>
            <SignInButton mode="modal">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d594f] px-6 py-3 text-xs font-semibold text-white hover:bg-[#09473f] transition-all shadow-md shadow-[#0d594f]/15"
              >
                <span>Masuk dengan Akun</span>
                <span>→</span>
              </button>
            </SignInButton>
          </div>
        ) : (
          /* Form Saran untuk User yang Sudah Login */
          <div className="rounded-2xl border border-[#e1ede8] bg-white p-6 sm:p-8 shadow-sm">
            {/* User Identity Banner */}
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#f2f8f5] border border-[#dceee6] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0d594f] text-white flex items-center justify-center font-bold text-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#142926]">
                    {userName}
                  </span>
                  <span className="block text-[11px] text-gray-500">
                    {userEmail}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-[#0d7565] bg-white px-2.5 py-1 rounded-md border border-[#cbe4dc]">
                Akun Terverifikasi
              </span>
            </div>

            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <div className="font-bold mb-1 flex items-center gap-1.5 text-sm">
                  <span>✅</span>
                  <span>Tab Gmail Berhasil Dibuka!</span>
                </div>
                <p className="leading-relaxed text-emerald-800">
                  Draf saran telah disiapkan di tab Gmail Anda menuju{" "}
                  <strong>{ADMIN_GMAIL}</strong>. Silakan periksa dan tekan tombol
                  kirim di Gmail. Terima kasih atas kontribusi Anda!
                </p>
              </div>
            )}

            <form onSubmit={handleSendViaGmail} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="saranTopic"
                  className="block text-xs font-semibold text-[#18312d] mb-1.5"
                >
                  Topik Masukan
                </label>
                <select
                  id="saranTopic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#d6ebe5] bg-[#fbfdfc] text-xs text-[#173f39] outline-none focus:border-[#158a76] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Kritik & Saran Penggunaan">
                    Kritik & Saran Penggunaan
                  </option>
                  <option value="Usulan Fitur Baru">Usulan Fitur Baru</option>
                  <option value="Laporan Masalah / Bug">
                    Laporan Masalah / Bug Sistem
                  </option>
                  <option value="Pelayanan Petugas">
                    Pelayanan Petugas & Pengambilan
                  </option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="saranMessage"
                  className="block text-xs font-semibold text-[#18312d] mb-1.5"
                >
                  Isi Saran / Masukan
                </label>
                <textarea
                  id="saranMessage"
                  rows={6}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan saran, kritik, atau ide perbaikan untuk Lacak secara jelas..."
                  className="w-full p-3.5 rounded-xl border border-[#d6ebe5] bg-[#fbfdfc] text-xs sm:text-sm text-[#173f39] placeholder-gray-400 outline-none focus:border-[#158a76] focus:bg-white transition-all resize-y leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-gray-500">
                  Tujuan: <strong>{ADMIN_GMAIL}</strong>
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d594f] px-6 py-3 text-xs font-semibold text-white hover:bg-[#09473f] transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
                >
                  <span>Kirim Saran via Gmail</span>
                  <span>↗</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
