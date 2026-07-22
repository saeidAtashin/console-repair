export const GAME_INSTALL_CONSOLE_META: Record<
  string,
  { label: string; title: string; description: string }
> = {
  ps4: {
    label: "PS4",
    title: "نصب بازی PS4",
    description: "نصب و راه‌اندازی بازی روی پلی‌استیشن 4 با پشتیبانی تخصصی.",
  },
  ps5: {
    label: "PS5",
    title: "نصب بازی PS5",
    description: "نصب و راه‌اندازی بازی روی پلی‌استیشن 5 با پشتیبانی تخصصی.",
  },
  "xbox-one": {
    label: "Xbox One",
    title: "نصب بازی Xbox One",
    description: "نصب و راه‌اندازی بازی روی Xbox One.",
  },
  "xbox-series": {
    label: "Xbox Series",
    title: "نصب بازی Xbox Series",
    description: "نصب و راه‌اندازی بازی روی Xbox Series X|S.",
  },
};

export const GAME_INSTALL_CONSOLE_SLUGS = Object.keys(
  GAME_INSTALL_CONSOLE_META,
);

export type GameInstallConsoleSlug = keyof typeof GAME_INSTALL_CONSOLE_META;

export type GameInstallConsoleFilter = "all" | GameInstallConsoleSlug;

export const GAME_INSTALL_CONSOLE_ORDER: GameInstallConsoleSlug[] = [
  "ps5",
  "ps4",
  "xbox-series",
  "xbox-one",
];

export function isGameInstallConsoleSlug(
  value: string,
): value is GameInstallConsoleSlug {
  return value in GAME_INSTALL_CONSOLE_META;
}

export function parseGameInstallConsoleFilter(
  value: string | undefined,
): GameInstallConsoleFilter {
  if (!value || value === "all") return "all";
  return isGameInstallConsoleSlug(value) ? value : "all";
}

const GAME_INSTALL_INDEX_PATH = "/services/game-install";

export function gameInstallTabHref(
  console: GameInstallConsoleFilter,
): string {
  if (console === "all") return GAME_INSTALL_INDEX_PATH;
  return `${GAME_INSTALL_INDEX_PATH}?console=${console}`;
}
