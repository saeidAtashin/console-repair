"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";

import ConsoleTabIcon from "@/app/components/ui/ConsoleTabIcon";
import type { ConditionFilterKey } from "@/app/components/shop/ShopConditionFilters";
import { brandThemes } from "@/lib/brand-theme";
import {
  SHOP_CONSOLE_META,
  SHOP_CONSOLE_ORDER,
  shopTabHref,
  type ShopConsole,
} from "@/lib/shop";

export type ShopConsoleFilter = ShopConsole | "all";

type Props = {
  activeConsole: ShopConsoleFilter;
  condition?: ConditionFilterKey;
};

export default function ShopConsoleTabs({
  activeConsole,
  condition = "all",
}: Props) {
  const isAllConsoles = activeConsole === "all";

  return (
    <div className="mt-10 flex snap-x gap-3 overflow-x-auto pb-2">
      <Link
        href={shopTabHref("all", condition)}
        scroll={false}
        className={`min-w-[140px] shrink-0 rounded-2xl border px-4 py-3 text-start transition ${
          isAllConsoles
            ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300"
            : "border-white/10 bg-black/40 text-zinc-300 hover:border-cyan-400/30"
        }`}
      >
        <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          <LayoutGrid className="h-5 w-5" />
        </div>
        <p className="text-sm font-black">همه</p>
        <p className="text-xs text-zinc-400">تمام محصولات</p>
      </Link>

      {SHOP_CONSOLE_ORDER.map((slug) => {
        const tab = SHOP_CONSOLE_META[slug];
        const active = slug === activeConsole;
        const tabTheme = brandThemes[tab.brand];

        return (
          <Link
            key={slug}
            href={shopTabHref(slug, condition)}
            scroll={false}
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
          </Link>
        );
      })}
    </div>
  );
}
