"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

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
  const summary = `${result.consoleModel}${result.variant ? ` · ${result.variant}` : ""} — ${result.problem}`;

  return (
    <div className="space-y-6">
      {result.warning ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {result.warning}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="اطمینان" value={CONFIDENCE_LABELS[result.confidence]} />
        <Stat label="شدت" value={SEVERITY_LABELS[result.severity]} />
        <Stat label="اقدام" value={result.actionLabel} />
        <Stat
          label="سرویس پیشنهادی"
          value={result.service?.label ?? "بررسی تخصصی"}
          href={result.service?.href}
          accent={theme.primary}
        />
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onRepair}
          className={cn(
            "mx-auto h-14 w-full max-w-xs rounded-2xl text-lg font-bold text-black",
            theme.submit,
          )}
        >
          ثبت درخواست تعمیر
        </button>
      </div>

      <details className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span>
            <span className="block text-sm font-bold text-white">جزئیات بررسی</span>
            <span className="mt-1 block text-xs text-zinc-400">{summary}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400 transition group-open:rotate-180" />
        </summary>
        <div className="space-y-5 border-t border-white/10 px-5 py-5">
          <div>
            <p className="text-sm text-zinc-400">دستگاه</p>
            <p className="mt-1 text-lg font-black text-white">
              {result.consoleModel}
              {result.variant ? ` · ${result.variant}` : ""}
            </p>
            <p className="mt-4 text-sm text-zinc-400">مشکل</p>
            <p className="mt-1 font-bold text-white">
              {result.problemCategory} / {result.problem}
            </p>
          </div>

          {result.likelyCauses.length > 0 ? (
            <div>
              <h2 className="font-black text-white">احتمال علت</h2>
              <ul className="mt-3 space-y-3">
                {result.likelyCauses.map((cause) => (
                  <li key={cause.id}>
                    <p className={cn("font-bold", theme.primary)}>{cause.label}</p>
                    <p className="mt-1 text-sm leading-7 text-zinc-300">
                      {cause.summary}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.symptoms.length > 0 ? (
            <div>
              <h2 className="font-black text-white">علائم ثبت‌شده</h2>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-300">
                {result.symptoms.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.needsSpecialist ? (
            <p className="text-sm text-zinc-400">نیازمند بررسی تخصصی</p>
          ) : null}
        </div>
      </details>

      <p className="text-center text-xs leading-6 text-zinc-500">{result.disclaimer}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: string;
  href?: string;
  accent?: string;
}) {
  const body = (
    <>
      <p className="text-xs text-zinc-400">{label}</p>
      <p className={cn("mt-1 text-sm font-bold leading-6 text-white", accent)}>
        {value}
      </p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-2xl border border-white/10 bg-black/30 p-3 transition hover:border-white/25"
      >
        {body}
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">{body}</div>
  );
}
