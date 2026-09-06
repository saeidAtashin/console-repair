import type { BlogGame } from "@/app/data/blog";
import {
  positiveOrUndefined,
  sortInstallCatalogByRating,
  uniquifyInstallCatalogSlugs,
  type InstallCatalogGame,
} from "@/lib/game-install-catalog";
import {
  fetchAllInstallationGames,
  fetchInstallationDevices,
  fetchInstallationGamesPage,
  filterGamesForDevice,
  matchInstallationDevice,
  type InstallationGame,
} from "@/lib/installation/api";
import {
  consoleIdFromDeviceName,
  consoleIdFromGameInstallSlug,
} from "@/lib/repair-links";

export type InstallationCatalogPage = {
  games: InstallCatalogGame[];
  deviceTypeId: number | null;
  hasNext: boolean;
  totalCount: number;
};

function rateNumber(rates: InstallationGame["rates"], source: string): number | undefined {
  const found = rates.find(
    (r) => r.source.toLowerCase() === source.toLowerCase(),
  );
  if (!found) return undefined;
  const n = Number.parseFloat(found.rate);
  return Number.isFinite(n) ? n : undefined;
}

function slugFromGameName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
  const displayRating = gamespot ?? metacritic;

  const slug = slugFromGameName(game.name) || `api-${game.id}`;
  const size = positiveOrUndefined(game.size);
  const price = positiveOrUndefined(game.price);

  return {
    id: String(game.id),
    apiId: game.id,
    slug,
    name: game.name,
    coverImage: game.image ?? "",
    ...(displayRating != null ? { rating: displayRating } : {}),
    metacritic,
    gamespot,
    genre: "نصب بازی",
    console: consoleId,
    sectionTitle: "کاتالوگ نصب",
    source: "api",
    ...(size != null ? { size } : {}),
    ...(price != null ? { price } : {}),
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

export async function getInstallationCatalogPage(
  consoleSlug: string | undefined,
  page: number,
): Promise<InstallationCatalogPage> {
  const { games: rawGames, hasNext, totalCount } =
    await fetchInstallationGamesPage(page);

  if (!consoleSlug) {
    return {
      games: uniquifyInstallCatalogSlugs(
        sortInstallCatalogByRating(
          rawGames.map(mapInstallationGameToCatalogForAll),
        ),
      ),
      deviceTypeId: null,
      hasNext,
      totalCount,
    };
  }

  const devices = await fetchInstallationDevices();
  const device = matchInstallationDevice(devices, consoleSlug);
  if (!device) {
    return { games: [], deviceTypeId: null, hasNext: false, totalCount: 0 };
  }

  const filtered = filterGamesForDevice(rawGames, device.id);
  return {
    games: uniquifyInstallCatalogSlugs(
      sortInstallCatalogByRating(
        filtered.map((game) => mapInstallationGameToCatalog(game, consoleSlug)),
      ),
    ),
    deviceTypeId: device.id,
    hasNext,
    totalCount,
  };
}

export async function getInstallationCatalogForConsole(
  consoleSlug: string,
): Promise<InstallationCatalogPage> {
  return getInstallationCatalogPage(consoleSlug, 1);
}

export async function getAllInstallationCatalogGames(
  consoleSlug?: string,
): Promise<InstallationCatalogPage> {
  const rawGames = await fetchAllInstallationGames(100);

  if (!consoleSlug) {
    const games = uniquifyInstallCatalogSlugs(
      sortInstallCatalogByRating(
        rawGames.map(mapInstallationGameToCatalogForAll),
      ),
    );
    return {
      games,
      deviceTypeId: null,
      hasNext: false,
      totalCount: games.length,
    };
  }

  const devices = await fetchInstallationDevices();
  const device = matchInstallationDevice(devices, consoleSlug);
  if (!device) {
    return { games: [], deviceTypeId: null, hasNext: false, totalCount: 0 };
  }

  const filtered = filterGamesForDevice(rawGames, device.id);
  const games = uniquifyInstallCatalogSlugs(
    sortInstallCatalogByRating(
      filtered.map((game) => mapInstallationGameToCatalog(game, consoleSlug)),
    ),
  );

  return {
    games,
    deviceTypeId: device.id,
    hasNext: false,
    totalCount: games.length,
  };
}
