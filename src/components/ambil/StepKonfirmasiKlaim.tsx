import { Warga } from "@/types/warga";
import { LostReportItem, FoundItemData } from "@/types/models";
import { FoundItemMatch } from "@/components/SearchableFoundItem";

type Props = {
  selectedWarga: Warga;
  selectedLostReport: LostReportItem;
  selectedFoundItem: FoundItemData | FoundItemMatch;
  isSubmitting: boolean;
};

export default function StepKonfirmasiKlaim({
  selectedWarga,
  selectedLostReport,
  selectedFoundItem,
  isSubmitting,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#3dbd84]/30 p-6 md:p-8 space-y-6 animate-in fade-in duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#3dbd84]/5 rounded-bl-full -z-0"></div>

      <h3 className="text-lg font-bold text-[#0d3b2e] mb-4 flex items-center gap-2 relative z-10">
        <span className="w-6 h-6 rounded-full bg-[#0d3b2e] text-white text-xs flex items-center justify-center font-bold">
          4
        </span>
        Konfirmasi Serah Terima Barang
      </h3>

      <div className="bg-[#3dbd84]/10 rounded-xl p-5 border border-[#3dbd84]/20 relative z-10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">
              Nama Lengkap Pengambil
            </p>

            <p className="text-sm font-semibold text-[#0d3b2e]">
              {selectedWarga.nama} ({selectedWarga.id})
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">
              Menyelesaikan Laporan
            </p>

            <p className="text-sm font-semibold text-[#0d3b2e]">
              {selectedLostReport.jenis?.name} -{" "}
              {selectedLostReport.merek?.name}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">
              Kode Barang yang Diambil
            </p>

            <p className="text-sm font-mono font-bold text-[#0d3b2e]">
              {selectedFoundItem.businessCode}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-[#1a5c44] mb-1">
              Kontak Pengambil
            </p>

            <p className="text-sm font-semibold text-[#0d3b2e]">
              {selectedWarga.nomor_telepon || "Tidak ada data kontak"}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end relative z-10">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-[#0d3b2e] hover:bg-[#1a5c44] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Memproses...</span>
          ) : (
            <>Selesaikan Serah Terima Barang &rarr;</>
          )}
        </button>
      </div>
    </div>
  );
}