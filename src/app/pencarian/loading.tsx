export default function PencarianLoading() {
  return (
    <div className="mx-auto max-w-[1230px] px-4 sm:px-6 py-8 space-y-6 animate-pulse">
      {/* Title Header Skeleton */}
      <div className="flex items-end justify-between border-b border-[#e5eeeb] pb-3.5">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-7 w-56 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-4 w-32 bg-slate-100 rounded" />
      </div>

      {/* Grid Layout Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Date Filter Sidebar Skeleton */}
        <div className="w-full md:w-[175px] shrink-0 p-4 rounded-xl border border-[#dce8e4] bg-[#fbfdfc] space-y-3">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-8 w-full bg-slate-100 rounded-lg" />
          <div className="h-8 w-full bg-slate-100 rounded-lg" />
        </div>

        {/* Item Cards Skeleton */}
        <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-xl border border-[#e5efec] bg-white p-3 space-y-3 shadow-xs">
              <div className="w-full h-36 rounded-lg bg-slate-100" />
              <div className="h-4 w-3/4 bg-slate-100 rounded" />
              <div className="h-3 w-1/2 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
