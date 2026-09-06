"use client";

import { cn } from "@/lib/utils";
import type { BrandTheme } from "@/lib/brand-theme";

type Props = {
  value: number;
  theme: BrandTheme;
  label: string;
};

export default function DiagnosisProgress({ value, theme, label }: Props) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className={cn("font-bold", theme.primary)}>{label}</span>
        <span className="text-zinc-400">{value}٪</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full bg-linear-to-l from-cyan-400 to-blue-500 transition-[width] duration-500",
            theme.submit.split(" ")[0],
          )}
          style={{ width: `${Math.min(100, Math.max(8, value))}%` }}
        />
      </div>
    </div>
  );
}
