import "server-only";

import type { InstallCatalogGame } from "@/lib/game-install-catalog";
import {
  getAllInstallationCatalogGames,
  getInstallationCatalogForConsole,
} from "@/lib/installation/catalog";

export type InstallCatalogResult = {
  games: InstallCatalogGame[];
  deviceTypeId: number | null;
  fetchFailed: boolean;
  hasMoreGames: boolean;
  totalCount: number;
};

function logCatalogError(error: unknown): void {
  if (process.env.NODE_ENV === "development") {
    console.error("[game-install] catalog fetch failed:", error);
  }
}

/** Installable games from `/installation/games/` filtered by console device. */
export async function getInstallCatalogGames(
  consoleSlug?: string,
): Promise<InstallCatalogGame[]> {
  const result = await getInstallCatalogWithMeta(consoleSlug);
  return result.games;
}

export async function getInstallCatalogWithMeta(
  consoleSlug?: string,
): Promise<InstallCatalogResult> {
  if (!consoleSlug) {
    return {
      games: [],
      deviceTypeId: null,
      fetchFailed: false,
      hasMoreGames: false,
      totalCount: 0,
    };
  }
  try {
    const { games, deviceTypeId, hasNext, totalCount } =
      await getInstallationCatalogForConsole(consoleSlug);
    return {
      games,
      deviceTypeId,
      fetchFailed: false,
      hasMoreGames: hasNext,
      totalCount,
    };
  } catch (error) {
    logCatalogError(error);
    return { games: [], deviceTypeId: null, fetchFailed: true, hasMoreGames: false, totalCount: 0 };
  }
}

export async function getInstallDeviceTypeId(
  consoleSlug: string,
): Promise<number | null> {
  const { deviceTypeId } = await getInstallCatalogWithMeta(consoleSlug);
  return deviceTypeId;
}

/** All installable games, optionally filtered by console slug. */
export async function getAllInstallCatalogGames(
  consoleSlug?: string,
): Promise<InstallCatalogGame[]> {
  const result = await getAllInstallCatalogWithMeta(consoleSlug);
  return result.games;
}

export async function getAllInstallCatalogWithMeta(
  consoleSlug?: string,
): Promise<InstallCatalogResult> {
  try {
    const { games, deviceTypeId, hasNext, totalCount } =
      await getAllInstallationCatalogGames(consoleSlug);
    return {
      games,
      deviceTypeId,
      fetchFailed: false,
      hasMoreGames: hasNext,
      totalCount,
    };
  } catch (error) {
    logCatalogError(error);
    return { games: [], deviceTypeId: null, fetchFailed: true, hasMoreGames: false, totalCount: 0 };
  }
}
