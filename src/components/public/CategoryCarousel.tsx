"use client";

import { useRef } from "react";
import { getCategoryIcon } from "./public-utils";

interface CategoryCarouselProps {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export default function CategoryCarousel({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const distance = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -distance : distance,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="kategori" className="category-section mx-auto mb-[28px] max-w-[1230px] px-[8px]">
      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-block h-[18px] w-[3.5px] rounded-[2px] bg-[#158a76]" />
          <h2 className="text-[17px] font-bold text-[#101b1b]">
            Kategori Pilihan
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          className="text-[11px] font-semibold text-[#0c5c52] transition-colors hover:text-[#158a76] hover:underline"
        >
          {selectedCategory !== "all" ? "Tampilkan Semua" : "Lihat Semua →"}
        </button>
      </div>

      {/* Carousel Outer with Navigation Arrows */}
      <div className="relative flex items-center gap-2 group">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Kategori sebelumnya"
          className="category-arrow z-10 flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[#d8e6e1] bg-white text-[20px] leading-none text-[#0d675b] shadow-xs transition-all hover:bg-[#eaf6f2] hover:border-[#0d7565] hover:scale-105 active:scale-95"
        >
          ‹
        </button>

        {/* Categories Viewport */}
        <div
          ref={scrollContainerRef}
          className="categories-viewport min-w-0 flex-1 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {/* List Kategori dalam 2 Baris yang rapi dan rounded */}
          <div className="categories grid h-[210px] grid-cols-[repeat(10,minmax(102px,1fr))] grid-rows-[repeat(2,98px)] gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const icon = getCategoryIcon(cat.name);

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(isSelected ? "all" : cat.name)}
                  className={`category-card group/item flex h-[98px] min-w-[102px] flex-col items-center justify-center gap-2 rounded-xl border p-2 text-[#1a2d2b] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs ${
                    isSelected
                      ? "border-[#0d7565] bg-[#eaf6f2] shadow-xs ring-1 ring-[#0d7565]/40"
                      : "border-[#e5eeeb] bg-[#fbfdfc] hover:border-[#0d7565]/40 hover:bg-white"
                  }`}
                >
                  <span
                    className={`grid h-[42px] w-[42px] place-items-center rounded-full text-[20px] leading-none transition-transform group-hover/item:scale-110 shadow-xs ${
                      isSelected
                        ? "bg-[#0d7565] text-white shadow-xs"
                        : "bg-white text-[#0d7565] border border-[#e5eeeb]"
                    }`}
                  >
                    {icon}
                  </span>
                  <b
                    className={`max-w-[92px] truncate text-center text-[10.5px] leading-tight ${
                      isSelected ? "font-bold text-[#0d594f]" : "font-medium text-[#2d4642]"
                    }`}
                  >
                    {cat.name}
                  </b>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Kategori berikutnya"
          className="category-arrow z-10 flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[#d8e6e1] bg-white text-[20px] leading-none text-[#0d675b] shadow-xs transition-all hover:bg-[#eaf6f2] hover:border-[#0d7565] hover:scale-105 active:scale-95"
        >
          ›
        </button>
      </div>
    </section>
  );
}
