/**
 * Shared types for Items & Reports feature domain.
 * Re-exports from @/types/index for feature-local convenience.
 */
export type { MasterItem, LostReportItem, FoundItemData, ClaimTransactionData } from "@/types/index";

/**
 * Match level filter for search and matching operations.
 */
export type MatchLevelFilter = "all" | "100" | "75";

/**
 * FoundItem search result with matchScore appended.
 */
export interface FoundItemMatch {
  id: string;
  businessCode: string;
  finderName: string;
  finderContact: string;
  wargaId?: string | null;
  jenisId: string;
  warnaId: string;
  merekId: string;
  lokasiId: string;
  additionalDesc?: string | null;
  status: string;
  activeDaysCount?: number;
  createdAt: Date;
  updatedAt: Date;
  jenis: { id: string; name: string };
  warna: { id: string; name: string };
  merek: { id: string; name: string };
  lokasi: { id: string; name: string };
  matchScore: number;
}
