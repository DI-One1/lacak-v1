"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center p-6 bg-[#fafcfb]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-2xl border border-[#f5d0d0] shadow-sm">
        {/* Error Warning Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-[#102d2a]">
            Terjadi Kendala Memuat Halaman
          </h1>
          <p className="text-xs sm:text-sm text-[#52706a] leading-relaxed">
            Sistem mengalami masalah sementara saat memuat data. Silakan coba muat ulang atau kembali ke halaman beranda.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d7565] hover:bg-[#07564a] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#f1f8f5] text-[#0d7565] border border-[#d2e5df] text-xs font-semibold transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
