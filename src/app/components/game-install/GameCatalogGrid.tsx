"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

import GameCard from "@/app/components/game-install/GameCard";
import {
  INSTALLATION_CATALOG_PAGE_SIZE,
  type InstallCatalogGame,
} from "@/lib/game-install-catalog";
import { fetchInstallationCatalogPage } from "@/lib/installation/catalog-client";

const ROWS_PER_BATCH = 2;

type Props = {
  consoleSlug: string;
  consoleLabel: string;
  games: InstallCatalogGame[];
  deviceTypeId?: number | null;
  hasMoreGames?: boolean;
  totalCount?: number;
  allGamesHref?: string;
  showFullListLink?: boolean;
  fetchFailed?: boolean;
};

export default function GameCatalogGrid({
  consoleSlug,
  consoleLabel,
  games: initialGames,
  deviceTypeId = null,
  hasMoreGames: initialHasMore = false,
  totalCount = 0,
  allGamesHref,
  showFullListLink = true,
  fetchFailed = false,
}: Props) {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState(initialGames);
  const [nextPage, setNextPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  const isSearching = query.trim().length > 0;
  const listHref =
    allGamesHref ?? `/services/game-install/${consoleSlug}/games`;
  const catalogTotal = totalCount > 0 ? totalCount : games.length;

  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || isSearching) return;

    setLoadingMore(true);
    setLoadError(null);
    try {
      const result = await fetchInstallationCatalogPage(
        consoleSlug || undefined,
        nextPage,
        deviceTypeId,
      );
      setGames((prev) => {
        const existingIds = new Set(prev.map((game) => game.id));
        const appended = result.games.filter((game) => !existingIds.has(game.id));
        return [...prev, ...appended];
      });
      setHasMore(result.hasNext);
      setNextPage((page) => page + 1);
    } catch {
      setLoadError("بارگذاری بازی‌های بیشتر ناموفق بود.");
    } finally {
      setLoadingMore(false);
    }
  }, [consoleSlug, deviceTypeId, hasMore, isSearching, loadingMore, nextPage]);

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
        {showFullListLink && consoleSlug ? (
          <Link
            href={listHref}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-5 text-sm font-bold text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/20"
          >
            لیست کامل ({catalogTotal.toLocaleString("fa-IR")})
          </Link>
        ) : null}
      </div>

      {fetchFailed ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-12 text-center">
          <p className="text-red-200">
            بارگذاری لیست بازی‌ها ناموفق بود. لطفاً چند لحظه بعد دوباره تلاش
            کنید.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 px-6 py-12 text-center">
          <p className="text-zinc-400">
            {games.length === 0
              ? "هنوز بازی‌ای برای این کنسول ثبت نشده است."
              : "بازی‌ای با این جستجو یافت نشد."}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-zinc-400">
            نمایش {filtered.length.toLocaleString("fa-IR")}
            {!isSearching && catalogTotal > filtered.length
              ? ` از ${catalogTotal.toLocaleString("fa-IR")}`
              : ""}{" "}
            بازی — برای نصب روی {consoleLabel}، «اضافه به لیست بازی‌ها» را
            بزنید.
          </p>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((game) => (
              <li key={game.id}>
                <GameCard
                  game={game}
                  consoleSlug={consoleSlug}
                  showAddButton={Boolean(consoleSlug)}
                  layout="grid"
                />
              </li>
            ))}
          </ul>

          {loadError ? (
            <p className="mt-4 text-center text-sm text-red-300">{loadError}</p>
          ) : null}

          {hasMore && !isSearching ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => void handleLoadMore()}
                disabled={loadingMore}
                className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-8 py-3 text-sm font-bold text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20 disabled:cursor-wait disabled:opacity-60"
              >
                {loadingMore
                  ? "در حال بارگذاری..."
                  : `نمایش ${ROWS_PER_BATCH} ردیف بعدی (${INSTALLATION_CATALOG_PAGE_SIZE.toLocaleString("fa-IR")} بازی)`}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
