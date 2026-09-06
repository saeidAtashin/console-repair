"use client";

import type { TroubleshootingStep } from "@/lib/diagnosis";
import type { BrandTheme } from "@/lib/brand-theme";
import { cn } from "@/lib/utils";

type Props = {
  steps: TroubleshootingStep[];
  theme: BrandTheme;
  onResolved: () => void;
  onContinue: () => void;
};

export default function TroubleshootingView({
  steps,
  theme,
  onResolved,
  onContinue,
}: Props) {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-7 text-zinc-400">
        قبل از تعمیر، این تست‌های ساده و امن را انجام بده. نیاز به ابزار یا باز کردن دستگاه نیست.
      </p>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              "rounded-3xl border bg-white/5 p-5 backdrop-blur-xl",
              theme.border,
            )}
          >
            <p className={cn("text-sm font-bold", theme.primary)}>
              تست {index + 1}
            </p>
            <h3 className="mt-1 text-lg font-black text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-300">{step.description}</p>
          </li>
        ))}
      </ol>
      <p className="text-center text-sm text-zinc-400">حل شد؟</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onResolved}
          className="h-14 rounded-2xl border border-green-400/30 bg-green-500/10 font-bold text-green-200"
        >
          بله، حل شد
        </button>
        <button
          type="button"
          onClick={onContinue}
          className={cn("h-14 rounded-2xl font-bold text-black", theme.submit)}
        >
          هنوز مشکل دارد
        </button>
      </div>
    </div>
  );
}
