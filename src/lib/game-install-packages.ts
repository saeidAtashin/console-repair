import { GAME_INSTALL_CONSOLE_META } from "@/lib/game-install-meta";
import {
  GAME_INSTALL_PRICE_DATA,
  formatRangeToman,
  type PriceRange,
} from "@/lib/game-install-pricing";

export const GAME_INSTALL_PACKAGE_TIERS = ["5", "10", "economy"] as const;

export type GameInstallPackageTier =
  (typeof GAME_INSTALL_PACKAGE_TIERS)[number];

export type GameInstallPackage = {
  tier: GameInstallPackageTier;
  title: string;
  shortTitle: string;
  description: string;
  notes: string;
  gameCountHint: string;
  priceRange: PriceRange;
  ctaLabel: string;
};

const ACCOUNT = GAME_INSTALL_PRICE_DATA.accountCapacityInstallation;
const ECONOMY = GAME_INSTALL_PRICE_DATA.economyPackagesRandomGames;

export const GAME_INSTALL_PACKAGES: Record<
  GameInstallPackageTier,
  GameInstallPackage
> = {
  "5": {
    tier: "5",
    title: "پکیج ۵ بازی",
    shortTitle: "پکیج ۵",
    description:
      "پنج عنوان انتخابی خودتان را از کاتالوگ نصب کنید. مناسب برای شروع کتابخانه روی کنسول تازه‌تعمیر یا نو.",
    notes: ACCOUNT.notes,
    gameCountHint: "۵ بازی انتخابی از کاتالوگ",
    priceRange: ACCOUNT.items[1].priceRangeToman,
    ctaLabel: "انتخاب ۵ بازی و ثبت سفارش",
  },
  "10": {
    tier: "10",
    title: "پکیج ۱۰ بازی",
    shortTitle: "پکیج ۱۰",
    description:
      "ده بازی انتخابی با تعرفه پکیج. برای گیمرهایی که می‌خواهند چند ژانر را یک‌جا نصب کنند.",
    notes: ACCOUNT.notes,
    gameCountHint: "۱۰ بازی انتخابی از کاتالوگ",
    priceRange: ACCOUNT.items[2].priceRangeToman,
    ctaLabel: "انتخاب ۱۰ بازی و ثبت سفارش",
  },
  economy: {
    tier: "economy",
    title: "پکیج اقتصادی",
    shortTitle: "اقتصادی",
    description:
      "پکیج بازی تصادفی با قیمت پایین‌تر. عناوین را ما از موجودی کاتالوگ انتخاب می‌کنیم؛ مناسب وقتی عنوان خاص مدنظر نیست.",
    notes: ECONOMY.notes,
    gameCountHint: "۱۰ بازی تصادفی (غیر انتخابی)",
    priceRange: ECONOMY.items[0].priceRangeToman,
    ctaLabel: "ثبت سفارش پکیج اقتصادی",
  },
};

export function isGameInstallPackageTier(
  value: string,
): value is GameInstallPackageTier {
  return (GAME_INSTALL_PACKAGE_TIERS as readonly string[]).includes(value);
}

export function gameInstallPackagePath(
  consoleSlug: string,
  tier: GameInstallPackageTier,
): string {
  return `/services/game-install/${consoleSlug}/packages/${tier}`;
}

export function gameInstallPackageHrefFromHighlight(
  consoleSlug: string,
  title: string,
): string {
  const hub = `/services/game-install/${consoleSlug}`;
  if (/اقتصادی/.test(title)) return gameInstallPackagePath(consoleSlug, "economy");
  if (/پکیج\s*10|پکیج\s*۱۰|10\s*بازی|۱۰\s*بازی/.test(title)) {
    return gameInstallPackagePath(consoleSlug, "10");
  }
  if (/پکیج\s*5|پکیج\s*۵|5\s*بازی|۵\s*بازی|5\s*تا\s*10/.test(title)) {
    return gameInstallPackagePath(consoleSlug, "5");
  }
  return hub;
}

export function formatPackagePrice(tier: GameInstallPackageTier): string {
  return formatRangeToman(GAME_INSTALL_PACKAGES[tier].priceRange);
}

export function packagePageTitle(
  consoleSlug: string,
  tier: GameInstallPackageTier,
): string {
  const label = GAME_INSTALL_CONSOLE_META[consoleSlug]?.label ?? consoleSlug;
  return `${GAME_INSTALL_PACKAGES[tier].title} — نصب بازی ${label}`;
}
