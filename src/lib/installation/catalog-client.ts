import { positiveOrUndefined } from "@/lib/game-install-catalog";
import { fetchAllInstallationGames } from "@/lib/installation/api";

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
