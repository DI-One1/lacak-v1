"use client";

import { useState } from "react";
import {
  processClaimItem,
  verifyItemExists,
  getActiveLostReportsOfWarga,
  getMatchingFoundItemsForReport,
} from "../actions";
import { Warga, FoundItemMatch, FoundItemData } from "../types";
import { LostReportItem } from "@/features/item/types";
import WargaVerificationCard from "@/features/warga/components/WargaVerificationCard";
import StepPilihLaporan from "./StepPilihLaporan";
import StepIdentifikasiBarang from "./StepIdentifikasiBarang";
import StepKonfirmasiKlaim from "./StepKonfirmasiKlaim";

type AmbilBarangClientProps = {
  initialDataWarga: Warga[];
};

export default function AmbilBarangClient({
  initialDataWarga,
}: AmbilBarangClientProps) {
  const [masterDataWarga] = useState<Warga[]>(initialDataWarga);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);

  const [wargaLostReports, setWargaLostReports] = useState<LostReportItem[]>(
    []
  );
  const [selectedLostReport, setSelectedLostReport] =
    useState<LostReportItem | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  const [matchingFoundItems, setMatchingFoundItems] = useState<
    FoundItemMatch[]
  >([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [selectedFoundItem, setSelectedFoundItem] = useState<
    FoundItemData | FoundItemMatch | null
  >(null);

  const [isScanning, setIsScanning] = useState(false);
  const [verified, setVerified] = useState(false);

  const [isCheckingBarcode, setIsCheckingBarcode] = useState(false);
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [businessCode, setBusinessCode] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetSelection = () => {
    setVerified(false);
    setSelectedWarga(null);
    setSelectedLostReport(null);
    setSelectedFoundItem(null);
    setBarcodeScanned(false);
    setBusinessCode("");
    setWargaLostReports([]);
    setMatchingFoundItems([]);
    setErrorMessage("");
  };

  const handleSelectWarga = (warga: Warga) => {
    setIsScanning(true);
    setErrorMessage("");
    setSelectedLostReport(null);
    setSelectedFoundItem(null);
    setBarcodeScanned(false);
    setBusinessCode("");
    setMatchingFoundItems([]);

    setTimeout(async () => {
      setIsScanning(false);
      setVerified(true);
      setSelectedWarga(warga);

      setIsLoadingReports(true);

      try {
        const reports = await getActiveLostReportsOfWarga(warga.id);
        setWargaLostReports(reports as unknown as LostReportItem[]);
      } catch (error) {
        console.error("Gagal memuat laporan warga", error);
      } finally {
        setIsLoadingReports(false);
      }
    }, 1000);
  };

  const handleSelectLostReport = async (report: LostReportItem) => {
    setSelectedLostReport(report);
    setSelectedFoundItem(null);
    setBarcodeScanned(false);
    setBusinessCode("");
    setErrorMessage("");
    setMatchingFoundItems([]);

    setIsLoadingMatches(true);

    try {
      const matches = await getMatchingFoundItemsForReport(report.id);
      setMatchingFoundItems(matches as unknown as FoundItemMatch[]);
    } catch (error) {
      console.error("Gagal memuat matching items", error);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  const handleScanBarcode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessCode.trim()) return;

    setIsCheckingBarcode(true);
    setErrorMessage("");
    setSelectedFoundItem(null);
    setBarcodeScanned(false);

    try {
      const foundItem = await verifyItemExists(businessCode.trim());

      if (foundItem) {
        setBarcodeScanned(true);
        setSelectedFoundItem(foundItem as unknown as FoundItemData);
      } else {
        setErrorMessage(
          "Barang dengan kode unik tersebut tidak ditemukan, sudah diambil, atau sudah Expired!"
        );
      }
    } catch (error) {
      const err = error as Error;

      setErrorMessage(
        err.message || "Gagal memverifikasi kode barang."
      );
    } finally {
      setIsCheckingBarcode(false);
    }
  };

  const handleSelectFoundItem = (item: FoundItemMatch) => {
    setSelectedFoundItem(item);
    setBarcodeScanned(true);
    setErrorMessage("");
  };

  const handleSubmitClaim = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!verified || !selectedWarga) {
      setErrorMessage(
        "Verifikasi data pengambil wajib dilakukan terlebih dahulu!"
      );
      return;
    }

    if (!selectedFoundItem) {
      setErrorMessage(
        "Identifikasi barang wajib dilakukan terlebih dahulu!"
      );
      return;
    }

    if (!selectedLostReport) {
      setErrorMessage(
        "Pilihan laporan kehilangan wajib ditentukan!"
      );
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    formData.set("businessCode", selectedFoundItem.businessCode);
    formData.set("claimantName", selectedWarga.nama);
    formData.set("claimantIdCard", selectedWarga.id);
    formData.set(
      "claimantContact",
      selectedWarga.nomor_telepon || "-"
    );
    formData.set("wargaId", selectedWarga.id);
    formData.set("lostReportId", selectedLostReport.id);

    try {
      await processClaimItem(formData);
    } catch (error) {
      const err = error as Error;

      setErrorMessage(
        err.message || "Terjadi kesalahan saat memproses klaim."
      );

      setIsSubmitting(false);
    }
  };

  return (
    <>
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm animate-in fade-in duration-300">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitClaim} className="space-y-6">
        <WargaVerificationCard
          masterDataWarga={masterDataWarga}
          selectedWarga={selectedWarga}
          verified={verified}
          isScanning={isScanning}
          onSelectWarga={handleSelectWarga}
          onReset={resetSelection}
          stepNumber={1}
          title="Verifikasi Data Pengambil"
          roleLabel="Pengambil"
        />

        {verified && selectedWarga && (
          <StepPilihLaporan
            selectedWarga={selectedWarga}
            wargaLostReports={wargaLostReports}
            selectedLostReport={selectedLostReport}
            isLoadingReports={isLoadingReports}
            onSelectLostReport={handleSelectLostReport}
          />
        )}

        {verified && selectedLostReport && (
          <StepIdentifikasiBarang
            businessCode={businessCode}
            onBusinessCodeChange={setBusinessCode}
            onScanBarcode={handleScanBarcode}
            isCheckingBarcode={isCheckingBarcode}
            matchingFoundItems={matchingFoundItems}
            isLoadingMatches={isLoadingMatches}
            selectedFoundItem={selectedFoundItem}
            barcodeScanned={barcodeScanned}
            onSelectFoundItem={handleSelectFoundItem}
          />
        )}

        {verified &&
          selectedWarga &&
          selectedLostReport &&
          selectedFoundItem && (
            <StepKonfirmasiKlaim
              selectedWarga={selectedWarga}
              selectedLostReport={selectedLostReport}
              selectedFoundItem={selectedFoundItem}
              isSubmitting={isSubmitting}
            />
          )}
      </form>
    </>
  );
}
