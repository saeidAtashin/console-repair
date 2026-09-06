import type { FaqItem } from "@/app/components/seo/FaqSection";
import { matchFeaturedInstallGame } from "@/app/data/featured-install-games";
import {
  formatInstallGameSize,
  getInstallCatalogConsoleLabel,
  hasInstallGamePrice,
  hasInstallGameSize,
  type InstallCatalogGame,
} from "@/lib/game-install-catalog";
import { formatToman } from "@/lib/game-install-pricing";
import {
  getDefaultInstallMethod,
  getInstallMethodsForConsole,
} from "@/lib/game-install-quote";
import { getAllInstallCatalogWithMeta } from "@/lib/game-install-catalog.server";

export function estimateInstallDuration(size?: number): string {
  if (size == null || size <= 0) return "پس از بررسی فضای SSD اعلام می‌شود";
  if (size < 40) return "حدود ۳۰ تا ۹۰ دقیقه";
  if (size < 80) return "حدود ۲ تا ۴ ساعت";
  if (size < 130) return "حدود ۴ تا ۶ ساعت";
  return "حدود ۶ تا ۱۰ ساعت (بسته به آپدیت)";
}

export function defaultInstallMethodLabel(consoleSlug: string): string {
  const methods = getInstallMethodsForConsole(consoleSlug);
  const id = getDefaultInstallMethod(consoleSlug);
  return methods.find((m) => m.id === id)?.label ?? "نصب اکانتی";
}

export function buildInstallGameOverview(
  game: InstallCatalogGame,
  consoleLabel: string,
): string[] {
  const featured = matchFeaturedInstallGame(game.name, game.slug);
  if (featured) return featured.paragraphs;

  const sizeLine = hasInstallGameSize(game)
    ? `حجم اعلام‌شده حدود ${formatInstallGameSize(game.size!)} است`
    : "حجم دقیق پس از بررسی کاتالوگ اعلام می‌شود";
  const priceLine = hasInstallGamePrice(game)
    ? `تعرفه این عنوان از کاتالوگ ${formatToman(game.price!)} است`
    : "قیمت نهایی پس از انتخاب روش نصب اعلام می‌شود";

  return [
    `نصب ${game.name} روی ${consoleLabel} در فیکس‌بازی به‌صورت حضوری انجام می‌شود؛ کنسول را می‌آورید، فضا و روش نصب بررسی می‌شود و بازی از کاتالوگ روی دستگاه قرار می‌گیرد.`,
    `${sizeLine}. ${priceLine}. پلتفرم این صفحه ${getInstallCatalogConsoleLabel(game.console)} است و موجودی یعنی عنوان همین حالا در کاتالوگ نصب ما ثبت شده است.`,
    `پس از نصب، اجرای اولیه تست می‌شود. اگر کنسول روشن نمی‌شود یا تصویر ندارد، ابتدا تعمیر لازم است — نصب روی دستگاه معیوب انجام نمی‌شود.`,
  ];
}

export function buildInstallGameFaqs(
  game: InstallCatalogGame,
  consoleLabel: string,
): FaqItem[] {
  const featured = matchFeaturedInstallGame(game.name, game.slug);
  if (featured?.faqs?.length) return featured.faqs;

  return [
    {
      question: `نصب ${game.name} روی ${consoleLabel} چقدر طول می‌کشد؟`,
      answer: estimateInstallDuration(game.size),
    },
    {
      question: "اگر بازی در کاتالوگ نباشد چه کار کنم؟",
      answer:
        "در فرم سفارش بخش «بازی در لیست نیست» را پر کنید تا عنوان درخواستی ثبت شود.",
    },
    {
      question: "آیا کنسول باید سالم باشد؟",
      answer:
        "بله. اگر تصویر، بوت یا HDMI مشکل دارد ابتدا تعمیر انجام می‌شود و بعد نصب بازی.",
    },
  ];
}

export async function getInstallGameBySlug(
  consoleSlug: string,
  gameSlug: string,
): Promise<{
  game: InstallCatalogGame | null;
  related: InstallCatalogGame[];
  deviceTypeId: number | null;
  fetchFailed: boolean;
}> {
  const result = await getAllInstallCatalogWithMeta(consoleSlug);
  if (result.fetchFailed) {
    return { game: null, related: [], deviceTypeId: null, fetchFailed: true };
  }

  const game =
    result.games.find((item) => item.slug === gameSlug) ??
    result.games.find((item) => item.slug.startsWith(`${gameSlug}-`)) ??
    null;

  const related = result.games
    .filter((item) => item.slug !== game?.slug)
    .slice(0, 6);

  return {
    game,
    related,
    deviceTypeId: result.deviceTypeId,
    fetchFailed: false,
  };
}
