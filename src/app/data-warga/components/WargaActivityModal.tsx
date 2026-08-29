import { Warga, WargaActivityItem, ActivityType } from "@/types/warga";

interface WargaActivityModalProps {
  aksiWarga: Warga;
  activityHistory: WargaActivityItem[];
  isLoadingActivities: boolean;
  activeFilter: ActivityType;
  setActiveFilter: (filter: ActivityType) => void;
  onClose: () => void;
}

export default function WargaActivityModal({
  aksiWarga,
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
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-2xl h-[85vh] sm:max-h-[85vh] rounded-2xl shadow-2xl border border-gray-100 flex flex-col relative modal-animate-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors z-10 cursor-pointer"
          title="Tutup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
          </svg>
        </button>

        {/* Compact Identity Header */}
        <div className="shrink-0 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-gray-100 pr-14">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0d3b2e] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {aksiWarga.nama.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-[#0d3b2e] leading-snug truncate">
                {aksiWarga.nama}
              </h2>
              <p className="text-xs text-gray-500 font-mono mt-1">
                ID: <strong className="text-[#1a5c44] font-semibold">{aksiWarga.id}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
          {/* Section Header & Filter Tabs */}
          <div className="shrink-0 px-5 sm:px-6 py-4 bg-white border-b border-gray-100/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0d3b2e]">
                  Riwayat Aksi
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100/80 text-[#0d3b2e] text-[10px] font-bold">
                  {filteredActivities.length}
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl gap-1 text-[11px] font-semibold border border-gray-200/50 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeFilter === "ALL"
                      ? "bg-white text-[#0d3b2e] shadow-xs font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("LAPORAN")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeFilter === "LAPORAN"
                      ? "bg-white text-blue-700 shadow-xs font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Laporan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("TARUH")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeFilter === "TARUH"
                      ? "bg-white text-teal-700 shadow-xs font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Taruh
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("PENGAMBILAN")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeFilter === "PENGAMBILAN"
                      ? "bg-white text-emerald-700 shadow-xs font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Ambil
                </button>
              </div>
            </div>
          </div>

          {/* Activity List — Internal Scroll */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-3">
            {isLoadingActivities ? (
              <div className="py-16 text-center text-sm text-gray-400 animate-pulse flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-[#0d3b2e]/20 border-t-[#0d3b2e] rounded-full animate-spin"></div>
                <span>Memuat riwayat aksi warga...</span>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="py-16 px-4 text-center text-sm text-gray-400 bg-white rounded-xl border border-dashed border-gray-200 shadow-sm">
                Belum ada riwayat aktivitas{" "}
                {activeFilter === "ALL" ? "" : activeFilter.toLowerCase()} untuk warga ini.
              </div>
            ) : (
              filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="group p-4 bg-white hover:bg-gray-50/80 border border-gray-100 hover:border-gray-200 rounded-xl transition-all shadow-sm text-sm space-y-2.5"
                >
                  {/* Row 1: Type + Date + Status */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                          act.type === "LAPORAN"
                            ? "bg-blue-50 text-blue-700 border border-blue-200/50"
                            : act.type === "TARUH"
                            ? "bg-teal-50 text-teal-700 border border-teal-200/50"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                        }`}
                      >
                        {act.type === "LAPORAN"
                          ? "LAPORAN KEHILANGAN"
                          : act.type === "TARUH"
                          ? "TARUH BARANG"
                          : "PENGAMBILAN"}
                      </span>
                      <span className="text-gray-400 text-xs font-medium">
                        {formatActivityDate(act.date)}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide shrink-0 ${
                        act.status === "SELESAI"
                          ? "bg-emerald-100/70 text-emerald-800"
                          : act.status === "DICARI"
                          ? "bg-amber-100/70 text-amber-800"
                          : act.status === "FOUND"
                          ? "bg-blue-100/70 text-blue-800"
                          : act.status === "CLAIMED"
                          ? "bg-teal-100/70 text-teal-800"
                          : "bg-red-100/70 text-red-800"
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>

                  {/* Row 2: Title & Business Code */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-base group-hover:text-[#0d3b2e] transition-colors leading-snug">
                        {act.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        <span className="font-medium text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">{act.category}</span>
                        <span className="mx-1.5 text-gray-300">•</span>
                        <span>Lokasi: <span className="font-medium text-gray-700">{act.lokasi}</span></span>
                      </p>
                    </div>
                    {act.businessCode && (
                      <span className="font-mono font-semibold text-[#1a5c44] bg-emerald-50/80 border border-emerald-200/60 px-2 py-1 rounded-md text-xs shrink-0 self-start sm:self-auto">
                        {act.businessCode}
                      </span>
                    )}
                  </div>

                  {/* Row 3: Optional Description */}
                  {act.description && (
                    <p className="text-xs text-gray-600 bg-gray-50/80 border border-gray-100 rounded-lg p-3 leading-relaxed">
                      {act.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 sm:px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between rounded-b-2xl">
          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
            {filteredActivities.length > 0
              ? `Total: ${filteredActivities.length} data`
              : "Riwayat kosong"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0d3b2e] hover:bg-[#1a5c44] text-white rounded-xl transition-all shadow-sm text-sm font-semibold cursor-pointer active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
