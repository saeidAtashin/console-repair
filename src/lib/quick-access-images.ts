import type { ConsoleId } from "@/lib/console-catalog";
import { consoleIdFromIssueSlug } from "@/lib/repair-links";
import { getServiceIssueImage } from "@/lib/service-galleries";
import type { ShopConsole, ShopProduct } from "@/lib/shop/types";

export type QuickAccessServiceKind = "game-install" | "repair" | "shop";

export const quickAccessImages: Record<
  ConsoleId,
  Record<QuickAccessServiceKind, string>
> = {
  ps4: {
    "game-install": "/quick-access/ps4game.jpg",
    repair: "/ps4repair/fan1.png",
    shop: "/quick-access/ps4shop.png",
  },
  ps5: {
    "game-install": "/quick-access/ps5game.jpg",
    repair: "/ps5repair/ps5-repair1.jpg",
    shop: "/quick-access/ps5shop.png",
  },
  xbox: {
    "game-install": "/quick-access/xboxgame.png",
    repair: "/xboxrepair/xboxfanrepair.png",
    shop: "/quick-access/xboxshop.png",
  },
};

const DEFAULT_ISSUE_IMAGE = "/images/Ps5-Parts-1-scaled.webp";

export function shopConsoleToConsoleId(console: ShopConsole): ConsoleId {
  if (console === "ps4" || console === "ps5") return console;
  return "xbox";
}

export function getShopProductImage(product: ShopProduct): string {
  return quickAccessImages[shopConsoleToConsoleId(product.console)].shop;
}

export function getGameInstallImage(consoleSlug: string): string | undefined {
  if (consoleSlug === "ps4" || consoleSlug === "ps5") {
    return quickAccessImages[consoleSlug]["game-install"];
  }
  if (consoleSlug === "xbox-one" || consoleSlug === "xbox-series") {
    return quickAccessImages.xbox["game-install"];
  }
  return undefined;
}

export function getIssueImage(slug: string, explicitImage?: string): string {
  if (explicitImage) return explicitImage;

  const mapped = getServiceIssueImage(slug);
  if (mapped) return mapped;

  const consoleId = consoleIdFromIssueSlug(slug);
  if (consoleId) {
    return quickAccessImages[consoleId].repair;
  }

  return DEFAULT_ISSUE_IMAGE;
}
