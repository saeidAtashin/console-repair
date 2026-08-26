import type { MetadataRoute } from "next";

import { getAllInstallCatalogGames } from "../lib/game-install-catalog.server";
import { installGameDetailPath } from "../lib/game-install-catalog";
import { GAME_INSTALL_CONSOLES, PUBLIC_SITEMAP_ENTRIES } from "../lib/seo/routes";
import { matchFeaturedInstallGame } from "../app/data/featured-install-games";
import { absoluteUrl } from "../lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const gameEntries: MetadataRoute.Sitemap = [];
  for (const consoleSlug of GAME_INSTALL_CONSOLES) {
    try {
      const games = await getAllInstallCatalogGames(consoleSlug);
      for (const game of games) {
        const featured = matchFeaturedInstallGame(game.name, game.slug);
        gameEntries.push({
          url: absoluteUrl(installGameDetailPath(consoleSlug, game.slug)),
          lastModified,
          changeFrequency: "weekly",
          priority: featured ? 0.7 : 0.5,
        });
      }
    } catch {
      /* catalog unavailable */
    }
  }

  return [
    ...PUBLIC_SITEMAP_ENTRIES.map((entry) => ({
      url: absoluteUrl(entry.path),
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...gameEntries,
  ];
}
