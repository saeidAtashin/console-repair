"use client";

import Link from "next/link";

import type { BrandTheme } from "@/lib/brand-theme";
import { cn } from "@/lib/utils";

type Props = {
  trackingCode: string;
  theme: BrandTheme;
  onRestart: () => void;
};

export default function SuccessView({ trackingCode, theme, onRestart }: Props) {
  return (
    <div className="space-y-6 text-center">
      <div className={cn("rounded-3xl border bg-white/5 p-8 backdrop-blur-xl", theme.border)}>
        <p className="text-sm text-zinc-400">درخواست ثبت شد</p>
        <p className="mt-3 text-sm text-zinc-400">کد پیگیری</p>
        <p className={cn("mt-1 text-4xl font-black tracking-wide", theme.primary)}>
          {trackingCode}
        </p>
        <p className="mt-4 text-sm leading-7 text-zinc-400">
          با این کد می‌توانی وضعیت تعمیر را دنبال کنی.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/tracking?code=${encodeURIComponent(trackingCode)}`}
          className={cn(
            "inline-flex h-14 flex-1 items-center justify-center rounded-2xl font-bold text-black",
            theme.submit,
          )}
        >
          پیگیری تعمیر
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="h-14 flex-1 rounded-2xl border border-white/15 bg-white/5 font-bold text-white"
        >
          بررسی دستگاه دیگر
        </button>
      </div>
    </div>
  );
}
