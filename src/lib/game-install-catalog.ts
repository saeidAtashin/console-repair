import type { GameFilterId } from "@/lib/game-filters";
import type { BlogGame } from "@/app/data/blog";

export type InstallCatalogGame = {
  id: string;
  /** Numeric game id from `/installation/games/` when source is api. */
  apiId?: number;
  slug: string;
  name: string;
  coverImage: string;
  rating?: number;
  metacritic?: number;
  gamespot?: number;
  genre: string;
  console: BlogGame["console"];
  sectionTitle: string;
  source: "cheats" | "blog" | "api";
  size?: number;
  price?: number;
};

/** Matches GameCatalogGrid batch size and `/installation/games/` page_size. */
export const INSTALLATION_CATALOG_PAGE_SIZE = 10;

/** Section titles hidden from catalog and category filters. */
export const EXCLUDED_CATALOG_SECTIONS = new Set([
  "رمز و چیت انحصاری‌ها و مستقل‌ها",
  "کلاسیک‌های PS4 که هنوز ارزش نصب دارند",
]);

const CONSOLE_LABELS: Record<BlogGame["console"], string> = {
  ps5: "PS5",
  ps4: "PS4",
  xbox: "Xbox",
};

export function getInstallCatalogConsoleLabel(
  consoleId: BlogGame["console"],
): string {
  return CONSOLE_LABELS[consoleId];
}

export function isExcludedCatalogSection(sectionTitle: string): boolean {
  return EXCLUDED_CATALOG_SECTIONS.has(sectionTitle);
}

export function getInstallCatalogSections(
  games: InstallCatalogGame[],
): string[] {
  return [...new Set(games.map((g) => g.sectionTitle))]
    .filter((title) => !isExcludedCatalogSection(title))
    .sort((a, b) => a.localeCompare(b, "fa"));
}

export function hasInstallGameRating(game: InstallCatalogGame): boolean {
  return game.rating != null && game.rating > 0;
}

/** Treat API zero/null as absent (e.g. placeholder price/size). */
export function positiveOrUndefined(
  value: number | null | undefined,
): number | undefined {
  return value != null && value > 0 ? value : undefined;
}

export function hasInstallGamePrice(game: InstallCatalogGame): boolean {
  return positiveOrUndefined(game.price) != null;
}

export function hasInstallGameSize(game: InstallCatalogGame): boolean {
  return positiveOrUndefined(game.size) != null;
}

/** Display install size from API (assumed GB). */
export function formatInstallGameSize(size: number): string {
  if (size >= 1000) {
    return `${(size / 1000).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} ترابایت`;
  }
  return `${size.toLocaleString("fa-IR")} گیگابایت`;
}

export function sortInstallCatalogByRating(
  games: InstallCatalogGame[],
): InstallCatalogGame[] {
  return [...games].sort((a, b) => {
    const ratingA = a.rating ?? 0;
    const ratingB = b.rating ?? 0;
    if (ratingB !== ratingA) return ratingB - ratingA;
    return a.name.localeCompare(b.name, "fa");
  });
}

export function sortInstallCatalogByFilter(
  games: InstallCatalogGame[],
  filter: GameFilterId,
): InstallCatalogGame[] {
  if (filter === "metacritic") {
    return [...games].sort((a, b) => {
      const scoreA = a.metacritic ?? 0;
      const scoreB = b.metacritic ?? 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return a.name.localeCompare(b.name, "fa");
    });
  }
  if (filter === "newest") {
    return [...games].sort((a, b) => {
      const idA = a.apiId ?? (Number.parseInt(a.id, 10) || 0);
      const idB = b.apiId ?? (Number.parseInt(b.id, 10) || 0);
      if (idB !== idA) return idB - idA;
      return a.name.localeCompare(b.name, "fa");
    });
  }
  return sortInstallCatalogByRating(games);
}

export function uniquifyInstallCatalogSlugs(
  games: InstallCatalogGame[],
): InstallCatalogGame[] {
  const seen = new Map<string, number>();
  return games.map((game) => {
    const key = `${game.console}:${game.slug}`;
    const count = seen.get(key) ?? 0;
    seen.set(key, count + 1);
    if (count === 0) return game;
    const suffix = game.apiId ?? game.id;
    return { ...game, slug: `${game.slug}-${suffix}` };
  });
}

export function installGameDetailPath(
  consoleSlug: string,
  gameSlug: string,
): string {
  return `/services/game-install/${consoleSlug}/games/${gameSlug}`;
}
