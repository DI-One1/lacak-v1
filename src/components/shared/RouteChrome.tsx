"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import PublicNavbar from "../public/PublicNavbar";

// Halaman yang tidak menampilkan navbar sama sekali (hanya tombol kembali)
const noNavbarPaths = new Set(["/tentang-kami", "/beri-saran"]);

// Halaman publik yang menampilkan PublicNavbar
const publicPaths = new Set(["/", "/pencarian"]);

export default function RouteChrome({
  publicData,
}: {
  publicData: {
    categories: { id: string; name: string }[];
    colors: { id: string; name: string }[];
    brands: { id: string; name: string }[];
    locations: { id: string; name: string }[];
  };
}) {
  const pathname = usePathname();

  if (noNavbarPaths.has(pathname)) {
    return null;
  }

  return publicPaths.has(pathname) ? <PublicNavbar {...publicData} /> : <Navbar />;
}