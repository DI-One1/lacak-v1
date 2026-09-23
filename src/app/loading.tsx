export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6 bg-[#fafcfb]">
      {/* Brand Indicator */}
      <div className="flex items-center gap-3 mb-8 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d7565] to-[#053830] flex items-center justify-center text-white font-black text-lg shadow-sm">
          L
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-[#102d2a] tracking-wide">LACAK</span>
          <span className="text-[10px] font-semibold text-[#0d7565] uppercase tracking-wider">Memuat Data...</span>
        </div>
      </div>

      {/* Grid Skeleton Loading State */}
      <div className="w-full max-w-[1230px] space-y-6">
        {/* Banner Skeleton */}
        <div className="w-full h-36 sm:h-48 rounded-2xl bg-slate-100 animate-pulse border border-[#e8f2ee]" />

        {/* Categories Bar Skeleton */}
        <div className="flex gap-3 overflow-hidden py-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-28 h-16 rounded-xl bg-slate-100 animate-pulse shrink-0 border border-[#e8f2ee]" />
          ))}
        </div>

        {/* Card Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="rounded-xl border border-[#e5efec] bg-white p-3 space-y-3 shadow-xs">
              <div className="w-full h-36 rounded-lg bg-slate-100 animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
