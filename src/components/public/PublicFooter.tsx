import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-[#e8f0ed] bg-white py-8 px-4 sm:px-6 text-center text-[#556965]">
      <div className="max-w-[1230px] mx-auto flex flex-col items-center gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-[#0d3b2e] hover:opacity-90 transition-opacity"
        >
          LACAK
        </Link>

        {/* Quick Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#465f5a]">
          <Link href="/" className="hover:text-[#0d7565] transition-colors">
            Beranda
          </Link>
          <Link href="/pencarian" className="hover:text-[#0d7565] transition-colors">
            Pencarian Katalog
          </Link>
          <Link href="/tentang-kami" className="hover:text-[#0d7565] transition-colors">
            Tentang Kami
          </Link>
          <Link href="/beri-saran" className="hover:text-[#0d7565] transition-colors">
            Beri Saran
          </Link>
        </nav>

        {/* Copyright */}
        <div className="pt-2 border-t border-[#f0f5f3] w-full max-w-md">
          <p className="text-[11px] text-[#718580]">
            © 2026 LACAK — SMK TI BAZMA Boarding School. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}