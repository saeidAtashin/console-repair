"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { ProductCondition } from "@/lib/shop";
import { buildShopPageUrl } from "@/lib/shop";

export type ConditionFilterKey = "all" | ProductCondition;

const CONDITION_FILTERS: { key: ConditionFilterKey; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "new", label: "نو" },
  { key: "used", label: "دست دوم" },
];

type Props = {
  value: ConditionFilterKey;
  basePath: string;
};

export default function ShopConditionFilters({ value, basePath }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const handleChange = useCallback(
    (nextCondition: ConditionFilterKey) => {
      const currentParams = new URLSearchParams(searchParamsKey);
      const nextUrl = buildShopPageUrl(basePath, {
        q: currentParams.get("q") ?? undefined,
        condition: nextCondition,
      });
      const currentUrl = searchParamsKey
        ? `${basePath}?${searchParamsKey}`
        : basePath;

      if (nextUrl === currentUrl) return;

      router.replace(nextUrl, { scroll: false });
    },
    [basePath, router, searchParamsKey],
  );

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
              onClick={() => handleChange(filter.key)}
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
