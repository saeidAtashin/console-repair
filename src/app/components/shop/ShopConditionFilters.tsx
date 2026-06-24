"use client";

import type { ProductCondition } from "@/lib/shop";

export type ConditionFilterKey = "all" | ProductCondition;

const CONDITION_FILTERS: { key: ConditionFilterKey; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "new", label: "نو" },
  { key: "used", label: "دست دوم" },
];

type Props = {
  value: ConditionFilterKey;
  onChange: (value: ConditionFilterKey) => void;
};

export default function ShopConditionFilters({ value, onChange }: Props) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-zinc-500">وضعیت:</span>
      <div className="inline-flex rounded-2xl border border-white/10 bg-zinc-900/50 p-1">
        {CONDITION_FILTERS.map((filter) => {
          const active = filter.key === value;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => onChange(filter.key)}
              className={`rounded-xl px-5 py-2 text-sm font-medium transition ${
                active
                  ? "bg-cyan-500/15 text-cyan-300 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
