"use server";

import { prisma } from "@/lib/prisma";
import { checkAndExpireItems } from "./item-lifecycle";

export type MatchLevel = "all" | "100" | "75";

export type MatchResult = {
  reportId: string;
  reporterName: string;
  reporterContact: string;
  wargaId: string | null;
  wargaName: string | null;
  lokasiName: string;
  createdAt: string;
  matchScore: 100 | 75;
  label: string;
};

/**
 * Mesin matching berdasarkan:
 * 4/4 atribut = 100%
 * 3/4 karena lokasi berbeda = 75%
 *
 * Matching adalah READ/hasil pencarian.
 * Matching tidak melakukan claim.
 */
export async function findMatchesForFoundItem(
  foundItemId: string,
  matchLevel: MatchLevel = "all"
): Promise<MatchResult[]> {
  await checkAndExpireItems();

  const foundItem = await prisma.foundItem.findUnique({
    where: { id: foundItemId },
    include: {
      jenis: true,
      warna: true,
      merek: true,
      lokasi: true,
    },
  });

  if (!foundItem || foundItem.status !== "FOUND") {
    return [];
  }

  const potentialMatches =
    await prisma.lostReport.findMany({
      where: {
        status: "DICARI",
        jenisId: foundItem.jenisId,
        warnaId: foundItem.warnaId,
        merekId: foundItem.merekId,
        ...(matchLevel === "100"
          ? { lokasiId: foundItem.lokasiId }
          : matchLevel === "75"
            ? { lokasiId: { not: foundItem.lokasiId } }
            : {}),
      },
      include: {
        warga: true,
        lokasi: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const results: MatchResult[] =
    potentialMatches.map((report) => {
      const score =
        report.lokasiId === foundItem.lokasiId
          ? 100
          : 75;

      return {
        reportId: report.id,
        reporterName: report.reporterName,
        reporterContact: report.reporterContact,
        wargaId: report.warga?.id ?? null,
        wargaName: report.warga?.nama ?? null,
        lokasiName: report.lokasi.name,
        createdAt: report.createdAt.toISOString(),
        matchScore: score,
        label:
          score === 100
            ? "Sangat Akurat (4/4)"
            : "Potensial (3/4 - Beda Lokasi)",
      };
    });

  return results;
}

/**
 * Matching otomatis ketika barang temuan baru masuk.
 * Hasilnya hanya menghasilkan notifikasi.
 */
export async function processNewFoundItemMatch(
  foundItemId: string,
  matchLevel: MatchLevel = "all"
) {
  try {
    const foundItem = await prisma.foundItem.findUnique({
      where: { id: foundItemId },
    });

    if (!foundItem) return [];

    await checkAndExpireItems();

    const activeItem = await prisma.foundItem.findUnique({
      where: { id: foundItemId },
    });

    if (!activeItem || activeItem.status !== "FOUND") {
      return [];
    }

    const matches = await findMatchesForFoundItem(
      foundItemId,
      matchLevel
    );

    for (const match of matches) {
      const alreadyNotified =
        await prisma.notification.findFirst({
          where: {
            wargaId: match.wargaId,
            type: "match",
            message: {
              contains: activeItem.businessCode,
            },
          },
          select: { id: true },
        });

      if (alreadyNotified) {
        continue;
      }

      const title =
        match.matchScore === 100
          ? "🎯 Kecocokan Sempurna!"
          : "🔍 Kecocokan Mendekati";

      const message = `Laporan kehilangan ${match.wargaName || match.reporterName} memiliki ${match.matchScore}% kecocokan dengan barang temuan ${activeItem.businessCode}.`;

      await prisma.notification.create({
        data: {
          title,
          message,
          type: "match",
          link: `/riwayat/laporan`,
          wargaId: match.wargaId,
        },
      });
    }

    return matches;
  } catch (error) {
    console.error(
      "[processNewFoundItemMatch] ERROR:",
      error
    );

    return [];
  }
}