import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import RouteChrome from "@/components/shared/RouteChrome";
import RouteFooter from "@/components/shared/RouteFooter";
import { prisma } from "@/lib/prisma";
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
  const [categories, colors, brands, locations] = await Promise.all([
    prisma.categoryItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.colorItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.brandItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.locationItem.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

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