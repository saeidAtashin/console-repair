import type { InstallCatalogGame } from "@/lib/game-install-catalog";
import type { InstallationDraftItem } from "@/lib/installation/api";
import {
  calculateInstallQuote,
  formatQuoteSummary,
  type InstallMethodId,
} from "@/lib/game-install-quote";

export type InstallListGame = {
  id: string;
  /** Draft line-item id used for DELETE `/installation/requests/items/{id}/`. */
  itemId?: number;
  slug: string;
  name: string;
  backgroundImage: string | null;
  consoleSlug: string;
  custom?: boolean;
  price?: number;
  size?: number;
};

export const INSTALL_GAME_LIST_CHANGED_EVENT = "game-install-list-changed";
export const INSTALL_DEVICE_TYPE_STORAGE_PREFIX = "install-device-type:";

export function dispatchInstallListChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(INSTALL_GAME_LIST_CHANGED_EVENT));
}

export function toInstallListGame(
  game: InstallCatalogGame,
  consoleSlug: string,
  itemId?: number,
): InstallListGame {
  return {
    id: game.id,
    itemId,
    slug: game.slug,
    name: game.name,
    backgroundImage: game.coverImage || null,
    consoleSlug,
    price: game.price,
    size: game.size,
  };
}

export type DraftItemEnrichment = {
  coverImage?: string | null;
  size?: number;
};

export function draftItemToInstallListGame(
  item: InstallationDraftItem,
  consoleSlug: string,
  enrichment?: DraftItemEnrichment,
): InstallListGame {
  return {
    id: String(item.game.id),
    itemId: item.id,
    slug: `api-${item.game.id}`,
    name: item.game.name,
    backgroundImage: enrichment?.coverImage ?? null,
    consoleSlug,
    price: item.price,
    size: enrichment?.size ?? item.game.size,
  };
}

/** Sum line-item prices when every game has a finite price. */
export function sumInstallListPrices(games: InstallListGame[]): number | null {
  if (games.length === 0) return null;
  if (!games.every((g) => g.price != null && Number.isFinite(g.price))) {
    return null;
  }
  return games.reduce((sum, g) => sum + (g.price ?? 0), 0);
}

export function cacheDeviceTypeId(consoleSlug: string, deviceTypeId: number): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      `${INSTALL_DEVICE_TYPE_STORAGE_PREFIX}${consoleSlug}`,
      String(deviceTypeId),
    );
  } catch {
    /* ignore */
  }
}

export function readCachedDeviceTypeId(consoleSlug: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(
      `${INSTALL_DEVICE_TYPE_STORAGE_PREFIX}${consoleSlug}`,
    );
    if (!raw) return null;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function formatInstallGameListDescription(
  games: InstallListGame[],
  consoleLabel: string,
  options?: {
    installMethodId?: InstallMethodId;
  },
): string {
  const quote = options?.installMethodId
    ? calculateInstallQuote(options.installMethodId, games.length)
    : null;

  const lines = games.map(
    (game, index) =>
      `${(index + 1).toLocaleString("fa-IR")}. ${game.name}`,
  );

  const header = [`درخواست نصب بازی — ${consoleLabel}`];
  const quoteLine = formatQuoteSummary(quote);
  if (quoteLine) header.push(quoteLine);

  return [...header, "", ...lines].join("\n");
}
