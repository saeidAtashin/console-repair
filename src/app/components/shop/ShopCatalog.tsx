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
  type ShopProduct,
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

function ProductSection({
  title,
  products,
  emptyMessage,
}: {
  title: string;
  products: ShopProduct[];
  emptyMessage?: string;
}) {
  if (products.length === 0 && !emptyMessage) return null;

  return (
    <section className="mt-12 first:mt-8">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-2xl font-black text-white md:text-3xl">{title}</h2>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
          {products.length} مورد
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-transparent" />
      </div>

      {products.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 text-zinc-300">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

export default function ShopCatalog({ defaultConsole = "ps5" }: Props) {
  const [activeConsole, setActiveConsole] = useState<ShopConsole>(defaultConsole);
  const [condition, setCondition] = useState<FilterKey>("all");

  const theme = brandThemes[SHOP_CONSOLE_META[activeConsole].brand];
  const consoleLabel = SHOP_CONSOLE_META[activeConsole].label;

  const productsByCategory = useMemo(() => {
    const grouped = Object.fromEntries(
      PRODUCT_CATEGORY_ORDER.map((category) => [category, [] as ShopProduct[]]),
    ) as Record<ProductCategory, ShopProduct[]>;

    for (const category of PRODUCT_CATEGORY_ORDER) {
      grouped[category] = getProducts({
        console: activeConsole,
        category,
        condition:
          category === "console" && condition !== "all" ? condition : undefined,
      });
    }

    return grouped;
  }, [activeConsole, condition]);

  const totalCount = PRODUCT_CATEGORY_ORDER.reduce(
    (sum, category) => sum + productsByCategory[category].length,
    0,
  );

  return (
    <section className="mt-14">
      <div className="flex snap-x gap-3 overflow-x-auto pb-2">
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

      <p className="mt-6 text-sm text-zinc-400">
        {totalCount} محصول برای {consoleLabel}
      </p>

      {totalCount === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 text-zinc-300">
          محصولی با این فیلتر برای {consoleLabel} پیدا نشد.
        </div>
      ) : (
        <>
          <ProductSection
            title={PRODUCT_CATEGORY_LABELS.console}
            products={productsByCategory.console}
            emptyMessage={`کنسولی با این فیلتر برای ${consoleLabel} موجود نیست.`}
          />
          <ProductSection
            title={PRODUCT_CATEGORY_LABELS.tools}
            products={productsByCategory.tools}
          />
          <ProductSection
            title={PRODUCT_CATEGORY_LABELS.accessories}
            products={productsByCategory.accessories}
          />
        </>
      )}
    </section>
  );
}
