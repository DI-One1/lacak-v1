"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import SearchBar from "./SearchBar";
import Notification from "./Notification";
import UserProfile from "./UserProfile";
import NavTabs from "./NavTabs";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  const isPublicPage = pathname === "/" || pathname === "/tentang-kami";

  if (isPublicPage) {
    return (
      <header className="bg-[#0d3b2e] sticky top-0 z-[1030] shadow-md">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white tracking-wide hover:opacity-90 transition-opacity">
              LACAK
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/tentang-kami"
                className={`text-[0.92rem] font-medium transition-colors ${
                  pathname === "/tentang-kami"
                    ? "text-white font-semibold border-b-2 border-[#3dbd84] pb-0.5"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Tentang Kami
              </Link>
              
              {isLoaded && isSignedIn && (
                <Link
                  href="/dashboard"
                  className="text-[0.92rem] font-medium text-white/80 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              )}

              <UserProfile />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#0d3b2e] sticky top-0 z-[1030] shadow-md">
      
      {/* BARIS 1: Logo, SearchBar, Notifikasi & User Profile */}
      <div className="container mx-auto px-4 md:px-8 py-3">
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[120px_1fr_auto] gap-4 md:gap-10 items-center">
          
          <Link href="/" className="text-2xl font-bold text-white tracking-wide hover:opacity-90 transition-opacity">
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