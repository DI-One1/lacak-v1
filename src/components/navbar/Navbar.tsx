import Link from "next/link";
import { Suspense } from "react";
import SearchBar from "./SearchBar";
import Notification from "./Notification";
import UserProfile from "./UserProfile";
import NavTabs from "./NavTabs";

export default function Navbar() {
  return (
    <header className="bg-[#0d3b2e] sticky top-0 z-[1030] shadow-md">
      
      {/* BARIS 1: Logo, SearchBar, Notifikasi & User Profile */}
      <div className="container mx-auto px-4 md:px-8 py-3">
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[120px_1fr_auto] gap-4 md:gap-10 items-center">
          
          <Link href="/" className="text-2xl font-bold text-white tracking-wide">
            LACAK
          </Link>

          <div className="w-full">
            <Suspense fallback={<div className="w-full bg-white/10 rounded-full py-2.5 h-[42px] animate-pulse" />}>
              <SearchBar />
            </Suspense>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Notification />
            <UserProfile />
          </div>

        </div>
      </div>

      {/* BARIS 2: Tab Navigasi (Garis Pembatas Atas) */}
      <div className="border-t border-white/10 bg-[#0d3b2e] relative z-[1020]">
        <NavTabs />
      </div>

    </header>
  );
}