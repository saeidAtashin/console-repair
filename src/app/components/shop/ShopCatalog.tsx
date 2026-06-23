"use client";

import { useMemo, useState } from "react";

import ConsoleTabIcon from "@/app/components/ui/ConsoleTabIcon";
import ProductCard from "@/app/components/shop/ProductCard";
import { brandThemes } from "@/lib/brand-theme";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORY_ORDER,
  SHOP_CONSOLE_META,
  SHOP_CONSOLE_ORDER,
  getProducts,
  type ProductCategory,
  type ProductCondition,
  type ShopConsole,
} from "@/lib/shop";

type FilterKey = "all" | ProductCondition;

const CONDITION_FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "new", label: "نو" },
  { key: "used", label: "دست دوم" },
];

type Props = {
  defaultConsole?: ShopConsole;
};

export default function ShopCatalog({ defaultConsole = "ps5" }: Props) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("console");
  const [activeConsole, setActiveConsole] = useState<ShopConsole>(defaultConsole);
  const [condition, setCondition] = useState<FilterKey>("all");

  const theme = brandThemes[SHOP_CONSOLE_META[activeConsole].brand];
  const products = useMemo(
    () =>
      getProducts({
        console: activeConsole,
        category: activeCategory,
        condition:
          activeCategory === "console" && condition !== "all"
            ? condition
            : undefined,
      }),
    [activeConsole, activeCategory, condition],
  );

  const emptyMessage =
    activeCategory === "console"
      ? "محصولی با این فیلتر پیدا نشد."
      : `موردی در دسته ${PRODUCT_CATEGORY_LABELS[activeCategory]} برای ${SHOP_CONSOLE_META[activeConsole].label} موجود نیست.`;

  return (
    <section className="mt-14">
      <div className="flex flex-wrap gap-2">
        {PRODUCT_CATEGORY_ORDER.map((category) => {
          const active = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-300"
                  : "border-white/10 bg-black/40 text-zinc-300 hover:border-cyan-400/30"
              }`}
            >
              {PRODUCT_CATEGORY_LABELS[category]}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2">
        {SHOP_CONSOLE_ORDER.map((slug) => {
          const tab = SHOP_CONSOLE_META[slug];
          const active = slug === activeConsole;
          const tabTheme = brandThemes[tab.brand];
          return (
            <button
              key={slug}
              type="button"
              onClick={() => setActiveConsole(slug)}
              className={`min-w-[140px] shrink-0 rounded-2xl border px-4 py-3 text-start transition ${
                active
                  ? `${tabTheme.border} ${tabTheme.bg} ${tabTheme.primary}`
                  : "border-white/10 bg-black/40 text-zinc-300 hover:border-cyan-400/30"
              }`}
            >
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <ConsoleTabIcon src={tab.iconSrc} className="h-5 w-5" />
              </div>
              <p className="text-sm font-black">{tab.label}</p>
              <p className="text-xs text-zinc-400">{tab.subtitle}</p>
            </button>
          );
        })}
      </div>

      {activeCategory === "console" ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {CONDITION_FILTERS.map((filter) => {
            const active = filter.key === condition;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setCondition(filter.key)}
                className={`rounded-xl border px-4 py-2 text-sm transition ${
                  active
                    ? `${theme.border} ${theme.bg} ${theme.primary}`
                    : "border-white/10 bg-black/40 text-zinc-300 hover:border-cyan-400/30"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <p className="mt-6 text-sm text-zinc-400">
        {products.length} {PRODUCT_CATEGORY_LABELS[activeCategory]} برای{" "}
        {SHOP_CONSOLE_META[activeConsole].label}
      </p>

      {products.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 text-zinc-300">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
