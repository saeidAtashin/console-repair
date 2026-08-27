"use client";

import { cn } from "@/lib/utils";
import {
  TRACKING_STEPS,
  getTrackingStepState,
  type TrackingStepDef,
  type TrackingStepState,
  type TrackingStepTone,
} from "@/lib/repair/tracking";

const TONE_DOT: Record<TrackingStepTone, string> = {
  green: "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.65)]",
  yellow: "bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.65)]",
  blue: "bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.65)]",
  purple: "bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.65)]",
};

const TONE_RING: Record<TrackingStepTone, string> = {
  green: "border-emerald-400/40 bg-emerald-500/10",
  yellow: "border-amber-400/40 bg-amber-500/10",
  blue: "border-sky-400/40 bg-sky-500/10",
  purple: "border-violet-400/40 bg-violet-500/10",
};

const TONE_TEXT: Record<TrackingStepTone, string> = {
  green: "text-emerald-300",
  yellow: "text-amber-300",
  blue: "text-sky-300",
  purple: "text-violet-300",
};

function stateCopy(step: TrackingStepDef, state: TrackingStepState): string {
  if (state === "active") return step.description;
  if (state === "done") return "این مرحله تکمیل شده است.";
  return "هنوز به این مرحله نرسیده‌اید.";
}

type Props = {
  currentIndex: number;
  preview?: boolean;
};

export default function TrackingStatusTimeline({
  currentIndex,
  preview = false,
}: Props) {
  return (
    <ol className="relative space-y-3">
      {TRACKING_STEPS.map((step, index) => {
        const state = preview
          ? "upcoming"
          : getTrackingStepState(index, currentIndex);
        const isActive = state === "active";
        const isUpcoming = state === "upcoming";

        return (
          <li key={step.key} className="relative flex gap-4">
            {index < TRACKING_STEPS.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  "absolute start-[1.35rem] top-12 h-[calc(100%-0.5rem)] w-px",
                  state === "done" || isActive
                    ? "bg-linear-to-b from-white/35 to-white/10"
                    : "bg-white/10",
                )}
              />
            ) : null}

            <div
              className={cn(
                "relative z-10 mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border",
                isUpcoming ? "border-white/10 bg-white/5" : TONE_RING[step.tone],
              )}
            >
              <span
                className={cn(
                  "h-3 w-3 rounded-full",
                  isUpcoming ? "bg-zinc-500" : TONE_DOT[step.tone],
                  isActive && "animate-pulse",
                )}
              />
            </div>

            <div
              className={cn(
                "min-w-0 flex-1 rounded-2xl border p-4 sm:p-5",
                isActive
                  ? `${TONE_RING[step.tone]} border-current`
                  : "border-white/10 bg-black/25",
                isUpcoming && "opacity-50",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3
                  className={cn(
                    "text-lg font-black",
                    isUpcoming ? "text-zinc-300" : TONE_TEXT[step.tone],
                  )}
                >
                  {step.title}
                </h3>
                <span className="text-xs text-zinc-500">
                  {state === "done"
                    ? "انجام شد"
                    : state === "active"
                      ? "وضعیت فعلی"
                      : "بعدی"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                {preview ? step.description : stateCopy(step, state)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
