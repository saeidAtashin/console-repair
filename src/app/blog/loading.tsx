export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 text-white">
      <div className="container mx-auto max-w-6xl animate-pulse px-6 pb-12">
        <div className="mb-8 h-64 rounded-3xl bg-white/5" />
        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-white/5" />
          <div className="h-4 w-5/6 rounded bg-white/5" />
          <div className="h-4 w-4/6 rounded bg-white/5" />
        </div>
        <div className="mt-10 space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 rounded-2xl border border-white/[0.06] bg-white/[0.03]"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
