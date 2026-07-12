import Link from "next/link";
import type { PhoneModel } from "@/lib/cases/types";

type Props = {
  brandSlug: string;
  models: PhoneModel[];
};

function PhoneSilhouette({ name }: { name: string }) {
  return (
    <div className="relative mx-auto flex h-36 w-20 items-center justify-center">
      <div className="absolute inset-0 rounded-[1.75rem] border-2 border-zinc-600 bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-inner">
        <div className="absolute left-1/2 top-3 h-1.5 w-8 -translate-x-1/2 rounded-full bg-zinc-700" />
        <div className="absolute inset-x-2 bottom-3 top-8 rounded-xl bg-zinc-950/50" />
      </div>
      <span className="relative z-10 px-1 text-center text-[10px] font-medium text-zinc-500">
        {name.split(" ").slice(-2).join(" ")}
      </span>
    </div>
  );
}

export default function ModelGrid({ brandSlug, models }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {models.map((model) => (
        <Link
          key={model.slug}
          href={`/create/${brandSlug}/${model.slug}`}
          className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition hover:border-cyan-500/50 hover:bg-zinc-900"
        >
          <PhoneSilhouette name={model.nameEn} />
          <div className="mt-3 text-center">
            <p className="text-sm font-bold text-white">{model.name}</p>
            <p className="text-xs text-zinc-500">{model.nameEn}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
