import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { syncUserToDatabase } from "@/lib/sync-user";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LACAK - Kehilangan & Temuan SMK TI BAZMA",
  description:
    "Platform terintegrasi SMK TI BAZMA",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Jalankan sinkronisasi user Clerk ke database PostgreSQL
  await syncUserToDatabase();

  return (
    <ClerkProvider>
      <html lang="id" suppressHydrationWarning>
        <body
          className={`${inter.className} min-h-screen flex flex-col bg-[#fdfdfd]`}
        >
          <Suspense
            fallback={
              <header className="bg-[#0d3b2e] min-h-[120px]" />
            }
          >
            <Navbar />
          </Suspense>

          <main className="flex-grow flex flex-col">
            {children}
          </main>

          <footer className="bg-[#0d3b2e] text-white py-5 text-center text-xs">
            © 2026 LACAK oleh Akbar. Seluruh Hak Cipta Dilindungi.
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}