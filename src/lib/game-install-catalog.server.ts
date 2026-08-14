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
    return { games: [], deviceTypeId: null, fetchFailed: false };
  }
  try {
    const { games, deviceTypeId } =
      await getInstallationCatalogForConsole(consoleSlug);
    return { games, deviceTypeId, fetchFailed: false };
  } catch (error) {
    logCatalogError(error);
    return { games: [], deviceTypeId: null, fetchFailed: true };
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
    const { games, deviceTypeId } =
      await getAllInstallationCatalogGames(consoleSlug);
    return { games, deviceTypeId, fetchFailed: false };
  } catch (error) {
    logCatalogError(error);
    return { games: [], deviceTypeId: null, fetchFailed: true };
  }
}
