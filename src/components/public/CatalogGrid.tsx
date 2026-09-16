"use client";

import {
  PublicFoundItem,
  getItemTitle,
  getCategoryRepresentativeImage,
  formatIndonesianDate,
  DEFAULT_ITEM_IMAGE,
} from "./public-utils";

interface CatalogGridProps {
  items: PublicFoundItem[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectItem: (item: PublicFoundItem) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export default function CatalogGrid({
  items,
  totalResults,
  currentPage,
  totalPages,
  onPageChange,
  onSelectItem,
  onResetFilters,
  hasActiveFilters,
}: CatalogGridProps) {
  return (
    <section id="semua" className="section mx-auto mb-[32px] max-w-[1230px] scroll-mt-7 px-[8px]">
      {/* Section Header */}
      <div className="section-title mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-block h-[18px] w-[3.5px] rounded-[2px] bg-[#158a76]" />
          <h2 className="text-[17px] font-bold text-[#101b1b]">
            Semua Barang Temuan
          </h2>
        </div>

        <span className="result-count text-[11px] font-medium text-[#5a6f6b]">
          {totalResults} barang ditemukan
        </span>
      </div>

      {/* Grid or Empty State */}
      {items.length === 0 ? (
        <div className="empty-state my-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8e5e1] bg-[#fbfdfc] py-16 px-4 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#edf6f3] text-[#0d7565]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#142e29]">Barang tidak ditemukan</h3>
          <p className="mt-1 max-w-sm text-xs text-[#637975]">
            Tidak ada barang temuan yang sesuai dengan kata kunci atau filter pencarian saat ini.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0d7565] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0b5d51] transition-colors"
            >
              <span>Reset Semua Filter</span>
            </button>
          )}
        </div>
      ) : (
        <div className="all-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => {
            const title = getItemTitle(item);
            const imageUrl = getCategoryRepresentativeImage(item.jenis.name);
            const dateStr = formatIndonesianDate(item.createdAt);

            return (
              <article
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="card group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#e2ece8] bg-white text-left shadow-[0_2px_5px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-[#158a76]/50 hover:shadow-[0_12px_24px_rgba(13,59,46,0.1)]"
              >
                {/* Image Container */}
                <div className="card-image relative h-[155px] w-full overflow-hidden bg-[#eef4f1]">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_ITEM_IMAGE;
                    }}
                  />

                  {/* Gradient bottom overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/35 pointer-events-none" />

                  {/* Category Pill */}
                  <span className="card-category absolute left-2 top-2 max-w-[62%] truncate rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9.5px] font-semibold text-white shadow-xs">
                    {item.jenis.name}
                  </span>

                  {/* Status Pill */}
                  <span className="card-status absolute right-2 top-2 flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Tersedia
                  </span>
                </div>

                {/* Card Body */}
                <div className="card-body flex flex-1 flex-col p-3">
                  <h3 className="mb-1 line-clamp-2 min-h-[34px] text-[13px] font-bold leading-[1.3] text-[#142e29] transition-colors group-hover:text-[#0d7565]">
                    {title}
                  </h3>

                  {/* Meta */}
                  <p className="meta mb-2 truncate text-[10.5px] font-medium text-[#657975]">
                    {item.merek.name} · {item.warna.name}
                  </p>

                  {/* Clamped Description */}
                  <p className="desc mb-2.5 line-clamp-2 text-[11px] leading-[1.4] text-[#4f6460]">
                    {item.additionalDesc || "Barang ditemukan dan diamankan oleh petugas."}
                  </p>

                  {/* Footer */}
                  <div className="card-footer mt-auto flex items-center justify-between gap-1.5 pt-2 border-t border-[#f0f4f2] text-[10px]">
                    <span className="card-location flex items-center gap-1 max-w-[95px] truncate font-semibold text-[#0b7667]">
                      <svg className="h-3 w-3 shrink-0 text-[#0b7667]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{item.lokasi.name}</span>
                    </span>
                    <span className="date shrink-0 text-[#6e827e] text-[9.5px]">{dateStr}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalResults > 0 && totalPages > 1 && (
        <div className="catalog-pagination mt-6 flex min-h-[42px] items-center justify-center gap-3 text-[12px] font-bold text-[#204a43]">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Halaman sebelumnya"
            className="page-arrow flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[#d6e4df] bg-white text-[18px] leading-none text-[#0d675b] shadow-xs hover:bg-[#eaf6f2] hover:border-[#0d7565] disabled:cursor-not-allowed disabled:opacity-35 transition-all"
          >
            ‹
          </button>

          <span className="px-2 text-xs font-semibold text-[#44625d]">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Halaman berikutnya"
            className="page-arrow flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[#d6e4df] bg-white text-[18px] leading-none text-[#0d675b] shadow-xs hover:bg-[#eaf6f2] hover:border-[#0d7565] disabled:cursor-not-allowed disabled:opacity-35 transition-all"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
