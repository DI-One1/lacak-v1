export interface MasterItem {
  id: string;
  name: string;
}

export interface LostReportItem {
  id: string;
  reporterName: string;
  reporterIdCard: string;
  reporterContact: string;
  wargaId: string | null;
  jenisId: string;
  warnaId: string;
  merekId: string;
  lokasiId: string;
  status: string;
  additionalDesc: string | null;
  createdAt: Date;
  updatedAt: Date;
  jenis: MasterItem;
  warna: MasterItem;
  merek: MasterItem;
  lokasi: MasterItem;
}

export interface FoundItemData {
  id: string;
  businessCode: string;
  finderName: string;
  finderIdCard: string;
  finderContact: string;
  wargaId: string | null;
  jenisId: string;
  warnaId: string;
  merekId: string;
  lokasiId: string;
  additionalDesc: string | null;
  status: string;
  activeDaysCount: number;
  createdAt: Date;
  updatedAt: Date;
  jenis: MasterItem;
  warna: MasterItem;
  merek: MasterItem;
  lokasi: MasterItem;
}

export interface ClaimTransactionData {
  id: string;
  foundItemId: string;
  claimantName: string;
  claimantIdCard: string;
  claimantContact: string;
  wargaId: string | null;
  lostReportId: string | null;
  claimedAt: Date;
  foundItem: FoundItemData;
}
