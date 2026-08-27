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
            foundItemId,
            lostReportId: match.reportId,
            type: "match",
            isResolved: false,
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
          foundItemId,
          lostReportId: match.reportId,
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

export type FoundItemMatchResult = {
  foundItemId: string;
  businessCode: string;
  finderName: string;
  finderContact: string;
  wargaId: string | null;
  lokasiName: string;
  createdAt: string;
  matchScore: 100 | 75;
  label: string;
};

/**
 * Mencari barang temuan aktif (FOUND) yang cocok dengan detail laporan.
 */
export async function findMatchesForLostReport(
  lostReportId: string,
  matchLevel: MatchLevel = "all"
): Promise<FoundItemMatchResult[]> {
  await checkAndExpireItems();

  const lostReport = await prisma.lostReport.findUnique({
    where: { id: lostReportId },
    include: {
      jenis: true,
      warna: true,
      merek: true,
      lokasi: true,
    },
  });

  if (!lostReport || lostReport.status !== "DICARI") {
    return [];
  }

  const potentialMatches = await prisma.foundItem.findMany({
    where: {
      status: "FOUND",
      jenisId: lostReport.jenisId,
      warnaId: lostReport.warnaId,
      merekId: lostReport.merekId,
      ...(matchLevel === "100"
        ? { lokasiId: lostReport.lokasiId }
        : matchLevel === "75"
          ? { lokasiId: { not: lostReport.lokasiId } }
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

  const results: FoundItemMatchResult[] = potentialMatches.map((item) => {
    const score = item.lokasiId === lostReport.lokasiId ? 100 : 75;

    return {
      foundItemId: item.id,
      businessCode: item.businessCode,
      finderName: item.finderName,
      finderContact: item.finderContact,
      wargaId: item.warga?.id ?? null,
      lokasiName: item.lokasi.name,
      createdAt: item.createdAt.toISOString(),
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
 * Matching otomatis ketika laporan baru masuk.
 * Hasilnya hanya menghasilkan notifikasi.
 */
export async function processNewLostReportMatch(
  lostReportId: string,
  matchLevel: MatchLevel = "all"
) {
  try {
    const lostReport = await prisma.lostReport.findUnique({
      where: { id: lostReportId },
    });

    if (!lostReport) return [];

    await checkAndExpireItems();

    const activeReport = await prisma.lostReport.findUnique({
      where: { id: lostReportId },
      include: {
        warga: true,
      },
    });

    if (!activeReport || activeReport.status !== "DICARI") {
      return [];
    }

    const matches = await findMatchesForLostReport(
      lostReportId,
      matchLevel
    );

    for (const match of matches) {
      const alreadyNotified = await prisma.notification.findFirst({
        where: {
          lostReportId,
          foundItemId: match.foundItemId,
          type: "match",
          isResolved: false,
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

      const message = `Laporan kehilangan ${activeReport.warga?.nama || activeReport.reporterName} memiliki ${match.matchScore}% kecocokan dengan barang temuan ${match.businessCode}.`;

      await prisma.notification.create({
        data: {
          title,
          message,
          type: "match",
          link: `/riwayat/laporan`,
          wargaId: activeReport.wargaId,
          lostReportId,
          foundItemId: match.foundItemId,
        },
      });
    }

    return matches;
  } catch (error) {
    console.error(
      "[processNewLostReportMatch] ERROR:",
      error
    );

    return [];
  }
}