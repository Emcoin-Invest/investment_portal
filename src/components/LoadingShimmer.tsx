'use client';

export function ShimmerCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 overflow-hidden">
      <div className="space-y-4">
        <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-shimmer"></div>
        <div className="h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-1/2 animate-shimmer"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-3/4 animate-shimmer"></div>
      </div>
    </div>
  );
}

export function ShimmerMetricCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="space-y-4">
        <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-1/2 animate-shimmer"></div>
        <div className="h-10 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-shimmer"></div>
        <div className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-1/3 animate-shimmer"></div>
      </div>
    </div>
  );
}

export function ShimmerTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded flex-1 animate-shimmer"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded flex-1 animate-shimmer"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded flex-1 animate-shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShimmerChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="space-y-4">
        <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-1/3 animate-shimmer"></div>
        <div className="h-64 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-shimmer"></div>
      </div>
    </div>
  );
}

export function ShimmerLine() {
  return <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-shimmer"></div>;
}

export function ShimmerLoadingState() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <ShimmerMetricCard key={idx} />
        ))}
      </div>
      <ShimmerChart />
      <ShimmerTable />
    </div>
  );
}
