"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronUp } from "lucide-react";

import GameCard from "@/app/components/game-install/GameCard";
import type { InstallCatalogGame } from "@/lib/game-install-catalog";

const GRID_COLS = 2;
const ROWS_PER_BATCH = 2;
const GAMES_PER_BATCH = GRID_COLS * ROWS_PER_BATCH;

type Props = {
  consoleSlug: string;
  consoleLabel: string;
  games: InstallCatalogGame[];
  allGamesHref?: string;
  showFullListLink?: boolean;
};

export default function GameCatalogGrid({
  consoleSlug,
  consoleLabel,
  games,
  allGamesHref,
  showFullListLink = true,
}: Props) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(GAMES_PER_BATCH);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter(
      (game) =>
        game.name.toLowerCase().includes(q) ||
        game.genre.toLowerCase().includes(q) ||
        game.console.toLowerCase().includes(q),
    );
  }, [games, query]);

  const visibleGames = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const listHref =
    allGamesHref ?? `/services/game-install/${consoleSlug}/games`;

  function handleSearchChange(value: string) {
    setQuery(value);
    setVisibleCount(GAMES_PER_BATCH);
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">جستجوی بازی</span>
          <input
            type="search"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="جستجوی نام بازی..."
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-400/40 focus:outline-none"
          />
        </label>
        {showFullListLink ? (
          <Link
            href={listHref}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-5 text-sm font-bold text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/20"
          >
            لیست کامل ({games.length.toLocaleString("fa-IR")})
          </Link>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 px-6 py-12 text-center">
          <p className="text-zinc-400">بازی‌ای با این جستجو یافت نشد.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-zinc-400">
            نمایش {visibleGames.length.toLocaleString("fa-IR")} از{" "}
            {filtered.length.toLocaleString("fa-IR")} بازی — برای نصب روی{" "}
            {consoleLabel}، «اضافه به لیست بازی‌ها» را بزنید.
          </p>

          <ul className="grid grid-cols-2 gap-3 sm:gap-4">
            {visibleGames.map((game) => (
              <li key={game.id}>
                <GameCard
                  game={game}
                  consoleSlug={consoleSlug}
                  showAddButton
                  layout="grid"
                />
              </li>
            ))}
          </ul>

          {hasMore ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((count) => count + GAMES_PER_BATCH)
                }
                className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-8 py-3 text-sm font-bold text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20"
              >
                نمایش {ROWS_PER_BATCH} ردیف بعدی (
                {Math.min(GAMES_PER_BATCH, filtered.length - visibleCount).toLocaleString("fa-IR")}{" "}
                بازی)
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
