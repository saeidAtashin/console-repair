import type { BlogGame } from "@/app/data/blog";
import type { InstallCatalogGame } from "@/lib/game-install-catalog";
import {
  fetchInstallationDevices,
  fetchInstallationGames,
  filterGamesForDevice,
  matchInstallationDevice,
  type InstallationGame,
} from "@/lib/installation/api";
import { consoleIdFromGameInstallSlug } from "@/lib/repair-links";

function rateNumber(rates: InstallationGame["rates"], source: string): number | undefined {
  const found = rates.find(
    (r) => r.source.toLowerCase() === source.toLowerCase(),
  );
  if (!found) return undefined;
  const n = Number.parseFloat(found.rate);
  return Number.isFinite(n) ? n : undefined;
}

export function mapInstallationGameToCatalog(
  game: InstallationGame,
  consoleSlug: string,
): InstallCatalogGame {
  const consoleId =
    consoleIdFromGameInstallSlug(consoleSlug) ?? ("ps5" as BlogGame["console"]);
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

export async function getInstallationCatalogForConsole(
  consoleSlug: string,
): Promise<{
  games: InstallCatalogGame[];
  deviceTypeId: number | null;
}> {
  const [devices, allGames] = await Promise.all([
    fetchInstallationDevices(),
    fetchInstallationGames({ page: 1, pageSize: 100 }),
  ]);

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
