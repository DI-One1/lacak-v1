"use client";

import { ChevronLeft, ChevronRight, SearchX, Grid } from "lucide-react";
import { PublicFoundItem } from "./public-utils";
import { ItemCard } from "@/components/ui/ItemCard";

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
          <h2 className="text-[17px] font-bold text-[#101b1b] flex items-center gap-2">
            <Grid className="h-4 w-4 text-[#0d7565]" />
            <span>Semua Barang Temuan</span>
          </h2>
        </div>

        <span className="result-count text-[11.5px] font-semibold text-[#5a6f6b] bg-[#eef7f4] px-2.5 py-1 rounded-full border border-[#d6e5df]">
          {totalResults} barang ditemukan
        </span>
      </div>

      {/* Grid or Empty State */}
      {items.length === 0 ? (
        <div className="empty-state my-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8e5e1] bg-[#fbfdfc] py-16 px-4 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#edf6f3] text-[#0d7565]">
            <SearchX className="h-7 w-7 stroke-[1.75]" />
          </div>
          <h3 className="text-base font-bold text-[#142e29]">Barang tidak ditemukan</h3>
          <p className="mt-1 max-w-sm text-xs text-[#637975]">
            Tidak ada barang temuan yang sesuai dengan kata kunci atau filter pencarian saat ini.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0d7565] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0b5d51] transition-colors cursor-pointer"
            >
              <span>Reset Semua Filter</span>
            </button>
          )}
        </div>
      ) : (
        <div className="all-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onSelectItem(item)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalResults > 0 && totalPages > 1 && (
        <div className="catalog-pagination mt-7 flex min-h-[42px] items-center justify-center gap-3 text-[12px] font-bold text-[#204a43]">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Halaman sebelumnya"
            className="page-arrow flex h-[36px] w-[36px] items-center justify-center rounded-lg border border-[#d6e4df] bg-white text-[#0d675b] shadow-xs hover:bg-[#eaf6f2] hover:border-[#0d7565] disabled:cursor-not-allowed disabled:opacity-35 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 stroke-[2.2]" />
          </button>

          <span className="px-3 py-1.5 rounded-lg bg-[#f0f7f4] border border-[#d6e4df] text-xs font-semibold text-[#204a43]">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Halaman berikutnya"
            className="page-arrow flex h-[36px] w-[36px] items-center justify-center rounded-lg border border-[#d6e4df] bg-white text-[#0d675b] shadow-xs hover:bg-[#eaf6f2] hover:border-[#0d7565] disabled:cursor-not-allowed disabled:opacity-35 transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 stroke-[2.2]" />
          </button>
        </div>
      )}
    </section>
  );
}

