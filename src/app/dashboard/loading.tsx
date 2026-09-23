export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8 space-y-8 animate-pulse">
      {/* Title Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2ede8] pb-6">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 rounded" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-xl" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl border border-[#e2ede8] bg-white space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="w-8 h-8 rounded-lg bg-slate-200" />
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Content Table Skeleton */}
      <div className="p-6 rounded-2xl border border-[#e2ede8] bg-white space-y-4 shadow-xs">
        <div className="h-6 w-40 bg-slate-200 rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
