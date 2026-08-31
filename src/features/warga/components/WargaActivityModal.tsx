import { Warga, WargaActivityItem, ActivityType } from "../types";
import { Modal } from "@/components/ui/Modal";

interface WargaActivityModalProps {
  aksiWarga: Warga;
  isOpen: boolean;
  activityHistory: WargaActivityItem[];
  isLoadingActivities: boolean;
  activeFilter: ActivityType;
  setActiveFilter: (filter: ActivityType) => void;
  onClose: () => void;
}

export default function WargaActivityModal({
  aksiWarga,
  isOpen,
  activityHistory,
  isLoadingActivities,
  activeFilter,
  setActiveFilter,
  onClose,
}: WargaActivityModalProps) {
  const filteredActivities = activityHistory.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.type === activeFilter;
  });

  const formatActivityDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Riwayat Aksi Warga"
      className="max-w-2xl h-[85vh] flex flex-col"
    >
      <div className="flex-1 flex flex-col min-h-0 space-y-4">
        {/* Compact Identity Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-dark text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
            {aksiWarga.nama.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-bold text-green-dark leading-tight truncate">
              {aksiWarga.nama}
            </h4>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">
              ID: <strong className="text-green-mid font-semibold">{aksiWarga.id}</strong>
            </p>
          </div>
        </div>

        {/* Filters and List */}
        <div className="flex-grow flex flex-col min-h-0 bg-gray-50/50 rounded-xl p-3 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-2 border-b border-gray-200/50">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Aksi Terfilter
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-green-dark text-[9px] font-bold">
                {filteredActivities.length}
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-gray-200/60 p-0.5 rounded-lg gap-0.5 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setActiveFilter("ALL")}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeFilter === "ALL"
                    ? "bg-white text-green-dark shadow-sm font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("LAPORAN")}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeFilter === "LAPORAN"
                    ? "bg-white text-blue-700 shadow-sm font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Laporan
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("TARUH")}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeFilter === "TARUH"
                    ? "bg-white text-teal-700 shadow-sm font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Taruh
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("PENGAMBILAN")}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeFilter === "PENGAMBILAN"
                    ? "bg-white text-emerald-700 shadow-sm font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Ambil
              </button>
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {isLoadingActivities ? (
              <div className="py-12 text-center text-xs text-gray-400 animate-pulse flex flex-col items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-green-dark/20 border-t-green-dark rounded-full animate-spin"></div>
                <span>Memuat riwayat aksi warga...</span>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="py-12 px-3 text-center text-xs text-gray-400 bg-white rounded-lg border border-dashed border-gray-200">
                Belum ada riwayat aktivitas warga.
              </div>
            ) : (
              filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 bg-white border border-gray-100 hover:border-gray-200 rounded-lg transition-all shadow-sm text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
                          act.type === "LAPORAN"
                            ? "bg-blue-50 text-blue-700 border border-blue-200/50"
                            : act.type === "TARUH"
                            ? "bg-teal-50 text-teal-700 border border-teal-200/50"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                        }`}
                      >
                        {act.type === "LAPORAN"
                          ? "KEHILANGAN"
                          : act.type === "TARUH"
                          ? "TEMUAN"
                          : "PENGAMBILAN"}
                      </span>
                      <span className="text-gray-400 text-[10px]">
                        {formatActivityDate(act.date)}
                      </span>
                    </div>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        act.status === "SELESAI"
                          ? "bg-emerald-100 text-emerald-800"
                          : act.status === "DICARI"
                          ? "bg-amber-100 text-amber-800"
                          : act.status === "FOUND"
                          ? "bg-blue-100 text-blue-800"
                          : act.status === "CLAIMED"
                          ? "bg-teal-100 text-teal-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>

                  <div>
                    <p className="font-bold text-gray-800 text-sm leading-snug">
                      {act.title}
                    </p>
                    <p className="text-gray-500 text-[10px] mt-0.5">
                      <span className="font-semibold text-gray-700 bg-gray-100 px-1 py-0.5 rounded">{act.category}</span>
                      <span className="mx-1 text-gray-300">&bull;</span>
                      <span>Lokasi: <span className="font-semibold text-gray-700">{act.lokasi}</span></span>
                    </p>
                  </div>

                  {act.description && (
                    <p className="text-[11px] text-gray-600 bg-gray-50/80 border border-gray-100 rounded p-2 leading-relaxed">
                      {act.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto shrink-0">
          <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded">
            {filteredActivities.length > 0 ? `${filteredActivities.length} data` : "Kosong"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-green-dark hover:bg-green-mid text-white rounded-xl transition-all shadow-sm text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
