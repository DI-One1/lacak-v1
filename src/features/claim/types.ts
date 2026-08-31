import { Warga } from "@/features/warga/types";
import { FoundItemMatch } from "@/features/item/types";
import { FoundItemData } from "@/types/index";

export type { Warga, FoundItemMatch, FoundItemData };

export interface ActiveLostReport {
  id: string;
  wargaId: string;
  jenisId: string;
  warnaId: string;
  merekId: string;
  lokasiId: string;
  additionalDesc?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  jenis: { id: string; name: string };
  warna: { id: string; name: string };
  merek: { id: string; name: string };
  lokasi: { id: string; name: string };
}
