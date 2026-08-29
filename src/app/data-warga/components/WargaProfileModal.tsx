import { Warga } from "@/types/warga";

interface WargaProfileModalProps {
  profilWarga: Warga;
  onClose: () => void;
}

export default function WargaProfileModal({ profilWarga, onClose }: WargaProfileModalProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 relative modal-animate-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors z-10 cursor-pointer"
          title="Tutup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
          </svg>
        </button>

        {/* Identity Header */}
        <div className="p-8 sm:p-10 pb-0 pr-16">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0d3b2e] text-white flex items-center justify-center font-bold text-3xl shadow-sm shrink-0">
              {profilWarga.nama.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0d3b2e] leading-tight truncate">
                {profilWarga.nama}
              </h2>
              <p className="text-sm text-gray-500 font-mono mt-2 flex flex-wrap items-center gap-2">
                <span>ID: <strong className="text-[#1a5c44] font-semibold">{profilWarga.id}</strong></span>
                <span className="text-gray-300">•</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-sans font-medium border border-emerald-100">
                  {profilWarga.peran}{profilWarga.keterangan_peran ? ` (${profilWarga.keterangan_peran})` : ""}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-8 sm:mx-10 my-6 border-t border-gray-100"></div>

        {/* Detail Profil */}
        <div className="px-8 sm:px-10 pb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">
            Detail Profil
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-base">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
                Peran
              </span>
              <span className="font-medium text-gray-800">{profilWarga.peran}</span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
                Keterangan
              </span>
              <span className="font-medium text-gray-800">
                {profilWarga.keterangan_peran || "—"}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
                Kontak WhatsApp
              </span>
              {profilWarga.nomor_telepon ? (
                <a
                  href={`https://wa.me/${profilWarga.nomor_telepon.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-2 text-base"
                >
                  <span>{profilWarga.nomor_telepon}</span>
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                    <path d="M6.586 1A2 2 0 0 0 5.172 1.586l-1.828 1.83a3 3 0 0 0 0 4.243l.544.544a4.01 4.01 0 0 1 .128-1.287l-.793-.793a2 2 0 1 1 2.828-2.83l1.829-1.829A2 2 0 0 1 8.586 3.5L9 2.914a1.002 1.002 0 0 0 .154-.199A2 2 0 0 0 6.586 1z"/>
                  </svg>
                </a>
              ) : (
                <span className="font-medium text-gray-400">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:px-10 mt-2 bg-gray-50/50 border-t border-gray-100 rounded-b-2xl flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0d3b2e] hover:bg-[#1a5c44] text-white rounded-xl transition-all shadow-sm text-sm font-semibold cursor-pointer active:scale-95"
          >
            Tutup Profil
          </button>
        </div>
      </div>
    </div>
  );
}
