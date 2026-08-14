import {
  INSTALLATION_CATALOG_PAGE_SIZE,
  positiveOrUndefined,
  sortInstallCatalogByRating,
} from "@/lib/game-install-catalog";
import {
  fetchAllInstallationGames,
  fetchInstallationGamesPage,
  filterGamesForDevice,
} from "@/lib/installation/api";
import {
  getInstallationCatalogPage,
  mapInstallationGameToCatalog,
  type InstallationCatalogPage,
} from "@/lib/installation/catalog";

export type InstallCatalogIndexEntry = {
  coverImage: string | null;
  price?: number;
  size?: number;
};

let catalogIndexPromise: Promise<Map<number, InstallCatalogIndexEntry>> | null =
  null;

/** Lazy client-side index of `/installation/games/` for draft enrichment. */
export async function ensureInstallCatalogIndex(): Promise<
  Map<number, InstallCatalogIndexEntry>
> {
  if (!catalogIndexPromise) {
    catalogIndexPromise = fetchAllInstallationGames()
      .then((games) => {
        const map = new Map<number, InstallCatalogIndexEntry>();
        for (const game of games) {
          const price = positiveOrUndefined(game.price);
          const size = positiveOrUndefined(game.size);
          map.set(game.id, {
            coverImage: game.image,
            ...(price != null ? { price } : {}),
            ...(size != null ? { size } : {}),
          });
        }
        return map;
      })
      .catch(() => new Map());
  }
  return catalogIndexPromise;
}

/** Client fetch for GameCatalogGrid "show more" — one API page at a time. */
export async function fetchInstallationCatalogPage(
  consoleSlug: string | undefined,
  page: number,
  deviceTypeId: number | null,
): Promise<InstallationCatalogPage> {
  if (consoleSlug && deviceTypeId != null) {
    const { games: rawGames, hasNext, totalCount } =
      await fetchInstallationGamesPage(page, INSTALLATION_CATALOG_PAGE_SIZE);
    const filtered = filterGamesForDevice(rawGames, deviceTypeId);
    return {
      games: sortInstallCatalogByRating(
        filtered.map((game) => mapInstallationGameToCatalog(game, consoleSlug)),
      ),
      deviceTypeId,
      hasNext,
      totalCount,
    };
  }

  return getInstallationCatalogPage(consoleSlug, page);
}
