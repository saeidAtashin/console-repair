"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import ConsoleTabIcon from "@/app/components/ui/ConsoleTabIcon";
import type { BlogGameSection } from "@/app/data/blog";
import {
  cheatGamePath,
  CHEAT_POST_SLUG,
  filterCheatSections,
  getPopularCheatGames,
  type CheatConsoleFilter,
} from "@/lib/blog-cheats";
import { cn } from "@/lib/utils";

import BlogCheatSection from "./BlogCheatSection";

const CONSOLE_TABS: {
  id: CheatConsoleFilter;
  label: string;
  icon?: string;
}[] = [
  { id: "all", label: "همه" },
  { id: "ps5", label: "PS5", icon: "/icons/ps5.svg" },
  { id: "ps4", label: "PS4", icon: "/icons/ps4.svg" },
  { id: "xbox", label: "Xbox", icon: "/icons/xbox.svg" },
];

type SectionLink = { id: string; title: string };

type Props = {
  sections: BlogGameSection[];
  sectionLinks: SectionLink[];
};

export default function CheatHubClient({ sections, sectionLinks }: Props) {
  const [consoleFilter, setConsoleFilter] = useState<CheatConsoleFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const filteredSections = useMemo(
    () => filterCheatSections(sections, consoleFilter, debouncedQuery),
    [sections, consoleFilter, debouncedQuery],
  );

  const totalGames = filteredSections.reduce(
    (sum, section) => sum + section.games.length,
    0,
  );

  const popularGames = useMemo(() => getPopularCheatGames(), []);

  return (
    <div className="mt-8">
      <div className="sticky top-20 z-30 -mx-2 mb-8 space-y-4 rounded-2xl border border-white/[0.08] bg-zinc-950/95 p-4 backdrop-blur-md sm:-mx-0">
        <div className="flex flex-wrap gap-2">
          {CONSOLE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setConsoleFilter(tab.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition",
                consoleFilter === tab.id
                  ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200",
              )}
            >
              {tab.icon ? (
                <ConsoleTabIcon src={tab.icon} className="h-4 w-4" />
              ) : null}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی بازی، ژانر یا کد چیت..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pe-10 ps-10 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
            aria-label="جستجو در چیت‌ها"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
              aria-label="پاک کردن جستجو"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-500">دسترسی سریع — بخش‌ها</p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sectionLinks.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-violet-500/40 hover:text-violet-300"
              >
                {section.title.replace("رمز و چیت ", "")}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-500">بازی‌های محبوب</p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {popularGames.map((game) => (
              <a
                key={game.gameSlug}
                href={cheatGamePath(game.gameSlug)}
                className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition hover:border-amber-500/40"
              >
                {game.name}
              </a>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          {totalGames} بازی نمایش داده می‌شود
        </p>
      </div>

      {filteredSections.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-zinc-300">نتیجه‌ای یافت نشد</p>
          <p className="mt-2 text-sm text-zinc-500">
            فیلتر یا عبارت جستجو را تغییر دهید.
          </p>
        </div>
      ) : (
        filteredSections.map((section, index) => (
          <BlogCheatSection
            key={section.id}
            section={section}
            index={index}
            postSlug={CHEAT_POST_SLUG}
          />
        ))
      )}
    </div>
  );
}
