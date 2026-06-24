export default function ShopCatalogSkeleton() {
  return (
    <div className="mt-10 animate-pulse space-y-8" aria-hidden>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-[88px] min-w-[140px] shrink-0 rounded-2xl bg-white/5"
          />
        ))}
      </div>
      <div className="h-4 w-32 rounded bg-white/5" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40"
          >
            <div className="h-48 bg-white/5" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 rounded bg-white/5" />
              <div className="h-4 w-1/2 rounded bg-white/5" />
              <div className="h-10 rounded-xl bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
