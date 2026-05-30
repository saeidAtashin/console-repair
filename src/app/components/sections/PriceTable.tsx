"use client";

import { useMemo, useState } from "react";
import {
  CNC_PRICE_DATA,
  CNC_PRICE_TABS,
  formatTomanRange,
  type CncPriceTabId,
} from "@/lib/cnc-pricing";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const PriceTable = () => {
  const [activeTab, setActiveTab] = useState<CncPriceTabId>("wood");
  const activeConfig = CNC_PRICE_TABS.find((t) => t.id === activeTab)!;
  const activeData = CNC_PRICE_DATA[activeConfig.dataKey];

  const items = useMemo(
    () => ("items" in activeData ? activeData.items : []),
    [activeData],
  );

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <section className="mt-8 overflow-hidden rounded-2xl border border-orange-400/30 bg-linear-to-br from-orange-500/10 via-amber-500/5 to-zinc-500/10 p-4 sm:mt-10 sm:rounded-3xl sm:p-6 md:p-8">
        <div className="mb-4">
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            قیمت‌های روز CNC
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            بازه قیمت تقریبی — قیمت نهایی پس از بررسی فایل
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto scrollbar-none px-1 pb-1">
            {CNC_PRICE_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 snap-start rounded-full px-4 py-2.5 text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-orange-500 text-black"
                      : "border border-white/15 bg-white/5 text-zinc-200 hover:border-orange-300/40"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <Link
            href="/products"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-400 sm:w-auto"
          >
            مشاهده همه محصولات
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 md:mt-6 md:p-5">
          <p className="text-lg font-black text-white">{activeData.title}</p>
          {"notes" in activeData && activeData.notes && (
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              {activeData.notes}
            </p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex min-h-[150px] flex-col justify-between rounded-2xl border border-white/10 bg-black/25 p-5 sm:min-h-[170px] sm:p-6"
            >
              <p className="text-base font-semibold leading-7 text-zinc-200">
                {item.label}
              </p>
              <p className="mt-4 text-2xl font-black text-orange-300 sm:text-3xl">
                {formatTomanRange(item.priceRangeToman)}
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-500">تومان</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PriceTable;
