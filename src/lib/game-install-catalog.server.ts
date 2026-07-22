import "server-only";

import type { InstallCatalogGame } from "@/lib/game-install-catalog";
import {
  getAllInstallationCatalogGames,
  getInstallationCatalogForConsole,
} from "@/lib/installation/catalog";

/** Installable games from `/installation/games/` filtered by console device. */
export async function getInstallCatalogGames(
  consoleSlug?: string,
): Promise<InstallCatalogGame[]> {
  if (!consoleSlug) return [];
  try {
    const { games } = await getInstallationCatalogForConsole(consoleSlug);
    return games;
  } catch {
    return [];
  }
}

export async function getInstallDeviceTypeId(
  consoleSlug: string,
): Promise<number | null> {
  try {
    const { deviceTypeId } =
      await getInstallationCatalogForConsole(consoleSlug);
    return deviceTypeId;
  } catch {
    return null;
  }
}

/** All installable games, optionally filtered by console slug. */
export async function getAllInstallCatalogGames(
  consoleSlug?: string,
): Promise<InstallCatalogGame[]> {
  try {
    const { games } = await getAllInstallationCatalogGames(consoleSlug);
    return games;
  } catch {
    return [];
  }
}
