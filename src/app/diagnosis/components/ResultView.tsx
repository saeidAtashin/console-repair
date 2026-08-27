"use client";

import Link from "next/link";

import {
  CONFIDENCE_LABELS,
  SEVERITY_LABELS,
  type DiagnosisResult,
} from "@/lib/diagnosis";
import type { BrandTheme } from "@/lib/brand-theme";
import { cn } from "@/lib/utils";

type Props = {
  result: DiagnosisResult;
  theme: BrandTheme;
  onRepair: () => void;
};

export default function ResultView({ result, theme, onRepair }: Props) {
  return (
    <div className="space-y-6">
      {result.warning ? (
        <div className="rounded-3xl border border-amber-400/30 bg-amber-500/10 p-5 text-amber-100">
          {result.warning}
        </div>
      ) : null}

      <div className={cn("rounded-3xl border bg-white/5 p-6 backdrop-blur-xl", theme.border)}>
        <p className="text-sm text-zinc-400">دستگاه</p>
        <p className="mt-1 text-2xl font-black text-white">
          {result.consoleModel}
          {result.variant ? ` · ${result.variant}` : ""}
        </p>
        <p className="mt-4 text-sm text-zinc-400">مشکل</p>
        <p className="mt-1 text-lg font-bold text-white">
          {result.problemCategory} / {result.problem}
        </p>
      </div>

      <div className={cn("rounded-3xl border bg-white/5 p-6 backdrop-blur-xl", theme.border)}>
        <h2 className="text-xl font-black text-white">احتمال علت</h2>
        <ul className="mt-4 space-y-4">
          {result.likelyCauses.map((cause) => (
            <li key={cause.id}>
              <p className={cn("font-bold", theme.primary)}>{cause.label}</p>
              <p className="mt-1 text-sm leading-7 text-zinc-300">{cause.summary}</p>
            </li>
          ))}
        </ul>
      </div>

      {result.symptoms.length > 0 ? (
        <div className={cn("rounded-3xl border bg-white/5 p-6 backdrop-blur-xl", theme.border)}>
          <h2 className="text-xl font-black text-white">علائم ثبت‌شده</h2>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-300">
            {result.symptoms.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="اطمینان" value={CONFIDENCE_LABELS[result.confidence]} />
        <Stat label="شدت" value={SEVERITY_LABELS[result.severity]} />
        <Stat label="اقدام" value={result.actionLabel} />
      </div>

      {result.service ? (
        <div className={cn("rounded-3xl border bg-white/5 p-6 backdrop-blur-xl", theme.border)}>
          <p className="text-sm text-zinc-400">سرویس پیشنهادی</p>
          <Link
            href={result.service.href}
            className={cn("mt-2 inline-block text-lg font-bold", theme.primary)}
          >
            {result.service.label}
          </Link>
        </div>
      ) : null}

      {result.needsSpecialist ? (
        <p className="text-sm text-zinc-400">نیازمند بررسی تخصصی</p>
      ) : null}

      <p className="text-sm leading-7 text-zinc-500">{result.disclaimer}</p>

      <button
        type="button"
        onClick={onRepair}
        className={cn("h-14 w-full rounded-2xl text-lg font-bold text-black", theme.submit)}
      >
        🔧 ثبت درخواست تعمیر
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
