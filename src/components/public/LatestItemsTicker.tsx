"use client";

import {
  PublicFoundItem,
  getItemTitle,
  getCategoryRepresentativeImage,
  DEFAULT_ITEM_IMAGE,
} from "./public-utils";

interface LatestItemsTickerProps {
  items: PublicFoundItem[];
  onSelectItem: (item: PublicFoundItem) => void;
  onScrollToCatalog: () => void;
}

export default function LatestItemsTicker({
  items,
  onSelectItem,
  onScrollToCatalog,
}: LatestItemsTickerProps) {
  if (!items || items.length === 0) return null;

  const displayItems = items.length < 4 ? [...items, ...items, ...items, ...items] : [...items, ...items];

  return (
    <section id="terbaru" className="mx-auto mb-[28px] max-w-[1230px] px-[8px]">
      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-block h-[18px] w-[3.5px] rounded-[2px] bg-[#158a76]" />
          <h2 className="text-[17px] font-bold text-[#101b1b]">
            Barang Temuan Terbaru
          </h2>
        </div>

        <button
          type="button"
          onClick={onScrollToCatalog}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0c5c52] transition-colors hover:text-[#158a76] hover:underline"
        >
          <span>Lihat Semua</span>
          <span>→</span>
        </button>
      </div>

      {/* Marquee Slider Wrapper */}
      <div className="cards-wrap relative overflow-hidden rounded-2xl">
        <div className="latest-marquee py-1">
          {displayItems.map((item, index) => {
            const title = getItemTitle(item);
            const imageUrl = getCategoryRepresentativeImage(item.jenis.name);

            return (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() => onSelectItem(item)}
                className="highlight-card group relative flex-shrink-0 overflow-hidden rounded-xl text-left shadow-xs transition-all duration-300 hover:shadow-lg focus:outline-none"
              >
                {/* Background Image */}
                <img
                  src={imageUrl}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_ITEM_IMAGE;
                  }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#061814]/90 via-[#061814]/30 to-black/20" />

                {/* Category Badge */}
                <span className="absolute left-3 top-3 z-10 rounded-md border border-white/20 bg-black/50 backdrop-blur-xs px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                  {item.jenis.name}
                </span>

                {/* Bottom Caption */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-white">
                  <strong className="mb-0.5 block truncate text-[14px] font-bold leading-tight group-hover:text-[#6ee7b7] transition-colors">
                    {title}
                  </strong>
                  <span className="block truncate text-[10px] text-[#c9ede4]">
                    {item.merek.name} · {item.lokasi.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
