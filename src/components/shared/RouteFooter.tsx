"use client";

import { usePathname } from "next/navigation";
import PublicFooter from "../public/PublicFooter";

const publicPaths = new Set(["/", "/pencarian", "/tentang-kami", "/beri-saran"]);

export default function RouteFooter() {
  const pathname = usePathname();
  const isPublicPage = publicPaths.has(pathname);

  return isPublicPage ? (
    <PublicFooter />
  ) : (
    <footer className="bg-[#0d3b2e] text-white/90 py-6 text-center text-xs border-t border-white/10">
      <div className="max-w-[1240px] mx-auto px-4">
        <p className="font-medium tracking-wide">© 2026 LACAK — Sistem Pengelolaan Barang Temuan</p>
        <p className="text-[11px] text-white/60 mt-1">Platform Terintegrasi Lost &amp; Found</p>
      </div>
    </footer>
  );
}