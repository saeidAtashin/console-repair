import { gameCheatsPost } from "@/app/data/blog-cheats-data";
import type { BlogGame, BlogGameSection, BlogPost } from "@/app/data/blog";

export const CHEAT_POST_SLUG = gameCheatsPost.slug;

export type CheatConsoleFilter = "all" | "ps5" | "ps4" | "xbox";

export type CheatGameEntry = BlogGame & {
  gameSlug: string;
  sectionId: string;
  sectionTitle: string;
};

const CONSOLE_LABELS: Record<BlogGame["console"], string> = {
  ps5: "PS5",
  ps4: "PS4",
  xbox: "Xbox",
};

export const POPULAR_CHEAT_SLUGS = [
  "gta-v-cheats",
  "rdr2-cheats",
  "minecraft-cheats",
  "sims-4-cheats",
  "skyrim-cheats",
  "mortal-kombat-1-cheats",
] as const;

export const FEATURED_CHEAT_SLUGS = [
  "gta-v-cheats",
  "minecraft-cheats",
  "sims-4-cheats",
  "rdr2-cheats",
  "skyrim-cheats",
  "lego-harry-potter-cheats",
] as const;

export function getCheatPost(): BlogPost {
  return gameCheatsPost;
}

export function cheatHubPath(): string {
  return `/blog/${CHEAT_POST_SLUG}`;
}

export function cheatGamePath(gameSlug: string): string {
  return `/blog/${CHEAT_POST_SLUG}/${gameSlug}`;
}

export function gameInstallHref(console: BlogGame["console"]): string {
  const map: Record<BlogGame["console"], string> = {
    ps5: "/services/game-install/ps5",
    ps4: "/services/game-install/ps4",
    xbox: "/services/game-install/xbox-series",
  };
  return map[console];
}

export function gameInstallSlugFromConsole(
  console: BlogGame["console"],
): string {
  const map: Record<BlogGame["console"], string> = {
    ps5: "ps5",
    ps4: "ps4",
    xbox: "xbox-series",
  };
  return map[console];
}

function resolveGameSlug(game: BlogGame, index: number, sectionId: string): string {
  return game.slug ?? `${sectionId}-game-${index}`;
}

export function getAllCheatGames(): CheatGameEntry[] {
  return gameCheatsPost.sections.flatMap((section) =>
    section.games.map((game, index) => ({
      ...game,
      gameSlug: resolveGameSlug(game, index, section.id),
      sectionId: section.id,
      sectionTitle: section.title,
    })),
  );
}

export function getCheatGame(gameSlug: string): CheatGameEntry | undefined {
  return getAllCheatGames().find((game) => game.gameSlug === gameSlug);
}

export function getCheatGamesByConsole(
  console: CheatConsoleFilter,
): CheatGameEntry[] {
  const all = getAllCheatGames();
  if (console === "all") return all;
  return all.filter((game) => game.console === console);
}

export function normalizeCheatSearchQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

function gameSearchCorpus(game: CheatGameEntry): string {
  const cheatText =
    game.cheats?.map((c) => `${c.title} ${c.code} ${c.effect}`).join(" ") ?? "";
  return normalizeCheatSearchQuery(
    `${game.name} ${game.genre} ${game.highlight} ${cheatText} ${game.secrets?.join(" ") ?? ""}`,
  );
}

export function searchCheatGames(query: string): CheatGameEntry[] {
  const normalized = normalizeCheatSearchQuery(query);
  if (!normalized) return getAllCheatGames();

  return getAllCheatGames().filter((game) =>
    gameSearchCorpus(game).includes(normalized),
  );
}

export function filterCheatGames(
  console: CheatConsoleFilter,
  query: string,
): CheatGameEntry[] {
  const byConsole = getCheatGamesByConsole(console);
  const normalized = normalizeCheatSearchQuery(query);
  if (!normalized) return byConsole;

  return byConsole.filter((game) => gameSearchCorpus(game).includes(normalized));
}

export function filterCheatSections(
  sections: BlogGameSection[],
  console: CheatConsoleFilter,
  query: string,
): BlogGameSection[] {
  const filtered = filterCheatGames(console, query);
  const slugSet = new Set(filtered.map((g) => g.gameSlug));

  return sections
    .map((section) => ({
      ...section,
      games: section.games.filter((game, index) =>
        slugSet.has(resolveGameSlug(game, index, section.id)),
      ),
    }))
    .filter((section) => section.games.length > 0);
}

export function getCheatGamesForInstallConsole(
  installConsoleSlug: string,
  limit = 6,
): CheatGameEntry[] {
  const consoleMap: Record<string, BlogGame["console"]> = {
    ps5: "ps5",
    ps4: "ps4",
    "xbox-one": "xbox",
    "xbox-series": "xbox",
  };
  const blogConsole = consoleMap[installConsoleSlug];
  if (!blogConsole) return [];

  return getCheatGamesByConsole(blogConsole).slice(0, limit);
}

export function generateGameSeo(game: CheatGameEntry): {
  title: string;
  description: string;
  keywords: string[];
} {
  const consoleLabel = CONSOLE_LABELS[game.console];
  const cheatCount = game.cheats?.length ?? 0;
  const secretCount = game.secrets?.length ?? 0;

  const title =
    game.seoTitle ??
    `چیت ${game.name} ${consoleLabel} | کدهای تقلب و رمز مخفی`;

  const description =
    game.seoDescription ??
    `${game.highlight} ${cheatCount > 0 ? `${cheatCount} کد تقلب` : ""}${secretCount > 0 ? ` و ${secretCount} ترفند مخفی` : ""} برای ${consoleLabel} — راهنمای فارسی فیکس‌بازی.`.trim();

  const keywords =
    game.keywords ??
    [
      `چیت ${game.name}`,
      `رمز ${game.name}`,
      `کد تقلب ${game.name}`,
      `چیت ${game.name} ${consoleLabel}`,
      `رمز بازی ${consoleLabel}`,
      "کد مخفی بازی",
      "فیکس بازی",
    ];

  return { title, description, keywords };
}

export function getPopularCheatGames(): CheatGameEntry[] {
  const all = getAllCheatGames();
  return POPULAR_CHEAT_SLUGS.map(
    (slug) => all.find((g) => g.gameSlug === slug)!,
  ).filter(Boolean);
}

export function getFeaturedCheatGames(): CheatGameEntry[] {
  const all = getAllCheatGames();
  return FEATURED_CHEAT_SLUGS.map(
    (slug) => all.find((g) => g.gameSlug === slug)!,
  ).filter(Boolean);
}

export function getSampleCheat(game: CheatGameEntry): {
  title: string;
  code: string;
} | null {
  if (game.cheats && game.cheats.length > 0) {
    return { title: game.cheats[0].title, code: game.cheats[0].code };
  }
  if (game.secrets && game.secrets.length > 0) {
    return { title: "ترفند مخفی", code: game.secrets[0] };
  }
  return null;
}
