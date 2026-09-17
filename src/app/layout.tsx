import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import RouteChrome from "@/components/shared/RouteChrome";
import RouteFooter from "@/components/shared/RouteFooter";
import { ClerkProvider } from "@clerk/nextjs";
import { syncUserToDatabase } from "@/lib/sync-user";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LACAK - Platform Terintegrasi Lost & Found",
  description:
    "Sistem Informasi Pengelolaan Barang Hilang & Temuan Terintegrasi",
};

import { getMasterData } from "@/lib/master-data";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Jalankan sinkronisasi user secara non-blocking di background agar tidak menahan response HTML
  syncUserToDatabase().catch((err) =>
    console.error("Background user sync error:", err)
  );

  const { categories, colors, brands, locations } = await getMasterData();

  return (
    <ClerkProvider>
      <html lang="id" suppressHydrationWarning>
        <body
          className={`${inter.className} min-h-screen flex flex-col bg-[#fdfdfd]`}
          suppressHydrationWarning
        >
          <Suspense
            fallback={
              <header className="bg-[#0d3b2e] min-h-[120px]" />
            }
          >
            <RouteChrome publicData={{ categories, colors, brands, locations }} />
          </Suspense>

          <main className="flex-grow flex flex-col">
            {children}
          </main>

          <RouteFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}