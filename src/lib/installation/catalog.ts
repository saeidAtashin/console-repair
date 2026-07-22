import type { BlogGame } from "@/app/data/blog";
import type { InstallCatalogGame } from "@/lib/game-install-catalog";
import {
  fetchAllInstallationGames,
  fetchInstallationDevices,
  filterGamesForDevice,
  matchInstallationDevice,
  type InstallationGame,
} from "@/lib/installation/api";
import {
  consoleIdFromDeviceName,
  consoleIdFromGameInstallSlug,
} from "@/lib/repair-links";

function rateNumber(rates: InstallationGame["rates"], source: string): number | undefined {
  const found = rates.find(
    (r) => r.source.toLowerCase() === source.toLowerCase(),
  );
  if (!found) return undefined;
  const n = Number.parseFloat(found.rate);
  return Number.isFinite(n) ? n : undefined;
}

function consoleIdFromGameDevices(
  deviceTypes: InstallationGame["device_type"],
): BlogGame["console"] {
  for (const device of deviceTypes) {
    const consoleId = consoleIdFromDeviceName(device.name);
    if (consoleId) return consoleId;
  }
  return "ps5";
}

function buildInstallCatalogGame(
  game: InstallationGame,
  consoleId: BlogGame["console"],
): InstallCatalogGame {
  const metacritic = rateNumber(game.rates, "metacritic");
  const gamespot = rateNumber(game.rates, "gamespot");

  return {
    id: String(game.id),
    apiId: game.id,
    slug: `api-${game.id}`,
    name: game.name,
    coverImage: game.image ?? "",
    rating: gamespot ?? metacritic ?? 0,
    metacritic,
    genre: "نصب بازی",
    console: consoleId,
    sectionTitle: "کاتالوگ نصب",
    source: "api",
    size: game.size,
    price: game.price,
  };
}

export function mapInstallationGameToCatalog(
  game: InstallationGame,
  consoleSlug: string,
): InstallCatalogGame {
  const consoleId =
    consoleIdFromGameInstallSlug(consoleSlug) ??
    consoleIdFromGameDevices(game.device_type);
  return buildInstallCatalogGame(game, consoleId);
}

export function mapInstallationGameToCatalogForAll(
  game: InstallationGame,
): InstallCatalogGame {
  return buildInstallCatalogGame(game, consoleIdFromGameDevices(game.device_type));
}

export async function getInstallationCatalogForConsole(
  consoleSlug: string,
): Promise<{
  games: InstallCatalogGame[];
  deviceTypeId: number | null;
}> {
  const { games, deviceTypeId } = await getAllInstallationCatalogGames(consoleSlug);
  return { games, deviceTypeId };
}

export async function getAllInstallationCatalogGames(
  consoleSlug?: string,
): Promise<{
  games: InstallCatalogGame[];
  deviceTypeId: number | null;
}> {
  const [devices, allGames] = await Promise.all([
    fetchInstallationDevices(),
    fetchAllInstallationGames(),
  ]);

  if (!consoleSlug) {
    return {
      games: allGames.map(mapInstallationGameToCatalogForAll),
      deviceTypeId: null,
    };
  }

  const device = matchInstallationDevice(devices, consoleSlug);
  if (!device) {
    return { games: [], deviceTypeId: null };
  }

  const filtered = filterGamesForDevice(allGames, device.id);
  return {
    games: filtered.map((g) => mapInstallationGameToCatalog(g, consoleSlug)),
    deviceTypeId: device.id,
  };
}
