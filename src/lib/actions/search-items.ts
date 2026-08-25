"use server";

import { prisma } from "@/lib/prisma";
import { checkAndExpireItems } from "./item-lifecycle";
import { Prisma } from "@/generated/prisma/client";

export type MatchLevelFilter = "all" | "100" | "75";

interface FormStateForSearch {
  jenisId?: string;
  warnaId?: string;
  merekId?: string;
  lokasiId?: string;
}

/**
 * Dipakai di form Lapor Kehilangan (SearchableFoundItem) untuk cari barang
 * temuan lawas yang mungkin cocok dengan apa yang lagi diisi pelapor.
 *
 * Kalau jenis+warna+merek udah lengkap diisi, hasil dihitung sebagai
 * 100% (4/4 sama persis) atau 75% (3/4 sama, lokasi beda).
 * Kalau belum lengkap, fallback ke pencarian teks biasa.
 */
export async function searchOldFoundItems(
  searchQuery: string,
  currentFormState: FormStateForSearch,
  matchLevel: MatchLevelFilter = "all"
) {
  // Run lazy expiration
  await checkAndExpireItems();

  const { jenisId, warnaId, merekId, lokasiId } = currentFormState;
  const hasCoreCategories = Boolean(jenisId && warnaId && merekId);

  const whereClause: Prisma.FoundItemWhereInput = {
    status: "FOUND",
    ...(searchQuery
      ? {
          OR: [
            { businessCode: { contains: searchQuery, mode: "insensitive" } },
            { jenis: { name: { contains: searchQuery, mode: "insensitive" } } },
            { merek: { name: { contains: searchQuery, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  if (hasCoreCategories && jenisId && warnaId && merekId) {
    whereClause.jenisId = jenisId;
    whereClause.warnaId = warnaId;
    whereClause.merekId = merekId;

    if (matchLevel === "100" && lokasiId) {
      whereClause.lokasiId = lokasiId;
    } else if (matchLevel === "75" && lokasiId) {
      whereClause.lokasiId = { not: lokasiId };
    }
  }

  const items = await prisma.foundItem.findMany({
    where: whereClause,
    include: { jenis: true, warna: true, merek: true, lokasi: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  // Belum cukup info buat nge-skor 100/75 -> kembalikan apa adanya
  if (!hasCoreCategories || !lokasiId) {
    return items.map((item) => ({ ...item, matchScore: 0 }));
  }

  const scored = items.map((item) => ({
    ...item,
    matchScore: item.lokasiId === lokasiId ? 100 : 75,
  }));

  const match100 = scored
    .filter((i) => i.matchScore === 100)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const match75 = scored
    .filter((i) => i.matchScore === 75)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  if (matchLevel === "100") return match100;
  if (matchLevel === "75") return match75;
  return [...match100, ...match75]; // "all": 100% duluan, baru 75%
}