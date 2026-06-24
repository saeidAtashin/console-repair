"use client";

import Image from "next/image";
import Link from "next/link";

import {
  PRODUCT_CATEGORY_SHORT_LABELS,
  SHOP_CONSOLE_META,
  formatToman,
  normalizeSearchQuery,
  type ShopSearchResult,
} from "@/lib/shop";

type Props = {
  listboxId: string;
  results: ShopSearchResult[];
  activeIndex: number;
  query: string;
  onSelect: (result: ShopSearchResult) => void;
  onHover: (index: number) => void;
  showPopularLabel?: boolean;
};

function highlightTitle(title: string, query: string) {
  const normalizedTitle = title.toLocaleLowerCase("fa");
  const normalizedQuery = normalizeSearchQuery(query);
  const index = normalizedQuery
    ? normalizedTitle.indexOf(normalizedQuery)
    : -1;

  if (index === -1 || !normalizedQuery) {
    return <span>{title}</span>;
  }

  const end = index + normalizedQuery.length;
  return (
    <>
      {title.slice(0, index)}
      <mark className="rounded bg-cyan-500/25 px-0.5 text-cyan-200">
        {title.slice(index, end)}
      </mark>
      {title.slice(end)}
    </>
  );
}

export default function ShopSearchSuggestions({
  listboxId,
  results,
  activeIndex,
  query,
  onSelect,
  onHover,
  showPopularLabel = false,
}: Props) {
  if (results.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-zinc-400">
        نتیجه‌ای پیدا نشد
      </div>
    );
  }

  return (
    <ul id={listboxId} role="listbox" className="max-h-80 overflow-y-auto py-2">
      {showPopularLabel ? (
        <li className="px-4 pb-2 text-xs font-semibold text-zinc-500">
          جستجوهای پرطرفدار
        </li>
      ) : null}
      {results.map((result, index) => {
        const categoryBadge =
          result.product.category !== "console"
            ? PRODUCT_CATEGORY_SHORT_LABELS[result.product.category]
            : result.product.condition === "new"
              ? "نو"
              : "دست دوم";

        return (
          <li key={result.product.id} role="presentation">
            <Link
              href={`/shop/${result.product.console}/${result.product.slug}`}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              onMouseEnter={() => onHover(index)}
              onClick={(event) => {
                event.preventDefault();
                onSelect(result);
              }}
              className={`flex items-center gap-3 px-4 py-3 transition ${
                activeIndex === index
                  ? "bg-cyan-500/10 text-white"
                  : "text-zinc-200 hover:bg-white/5"
              }`}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <Image
                  src={result.product.image}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  {highlightTitle(result.product.title, query)}
                </p>
                <p className="mt-0.5 truncate text-xs text-zinc-400">
                  {SHOP_CONSOLE_META[result.product.console].label} · {categoryBadge}
                </p>
              </div>
              <span className="shrink-0 text-xs font-bold text-cyan-300">
                {formatToman(result.product.price)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
