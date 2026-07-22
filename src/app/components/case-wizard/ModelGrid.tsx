import Link from "next/link";
import type { PhoneModel } from "@/lib/cases/types";
import { PhoneBackSvg } from "./PhoneBackSvg";

type Props = {
  brandSlug: string;
  models: PhoneModel[];
};

export default function ModelGrid({ brandSlug, models }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {models.map((model) => (
        <Link
          key={model.slug}
          href={`/create/${brandSlug}/${model.slug}`}
          className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition hover:border-cyan-500/50 hover:bg-zinc-900"
        >
          <div className="relative mx-auto flex h-36 w-20 items-center justify-center">
            <PhoneBackSvg
              model={model}
              className="h-full w-auto max-w-full drop-shadow-lg transition group-hover:scale-105"
            />
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-bold text-white">{model.name}</p>
            <p className="text-xs text-zinc-500">{model.nameEn}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
