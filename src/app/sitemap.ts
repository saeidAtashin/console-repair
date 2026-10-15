import type { MetadataRoute } from "next";

import { getAllInstallCatalogGames } from "../lib/game-install-catalog.server";
import { installGameDetailPath } from "../lib/game-install-catalog";
import {
  GAME_INSTALL_CONSOLES,
  PUBLIC_SITEMAP_ENTRIES,
  type SitemapEntry,
} from "../lib/seo/routes";
import { matchFeaturedInstallGame } from "../app/data/featured-install-games";
import { absoluteUrl } from "../lib/seo/site";

export const dynamic = "force-dynamic";

const CATALOG_TIMEOUT_MS = 4000;
const MAX_GAMES_PER_CONSOLE = 80;

function isCleanSitemapPath(path: string): boolean {
  return path.startsWith("/") && !path.includes("?");
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("sitemap catalog timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function toSitemapRow(
  entry: Pick<SitemapEntry, "changeFrequency" | "priority"> & { path: string },
  lastModified: Date,
): MetadataRoute.Sitemap[number] | null {
  if (!isCleanSitemapPath(entry.path)) return null;
  try {
    const url = absoluteUrl(entry.path);
    new URL(url);
    return {
      url,
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    };
  } catch {
    return null;
  }
}

function staticSitemapRows(lastModified: Date): MetadataRoute.Sitemap {
  const rows: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  for (const entry of PUBLIC_SITEMAP_ENTRIES) {
    const row = toSitemapRow(entry, lastModified);
    if (!row || seen.has(row.url)) continue;
    seen.add(row.url);
    rows.push(row);
  }

  return rows;
}

async function catalogSitemapRows(lastModified: Date): Promise<MetadataRoute.Sitemap> {
  const gameEntries: MetadataRoute.Sitemap = [];

  for (const consoleSlug of GAME_INSTALL_CONSOLES) {
    try {
      const games = await withTimeout(
        getAllInstallCatalogGames(consoleSlug),
        CATALOG_TIMEOUT_MS,
      );
      for (const game of games.slice(0, MAX_GAMES_PER_CONSOLE)) {
        const featured = matchFeaturedInstallGame(game.name, game.slug);
        const row = toSitemapRow(
          {
            path: installGameDetailPath(consoleSlug, game.slug),
            changeFrequency: "weekly",
            priority: featured ? 0.7 : 0.5,
          },
          lastModified,
        );
        if (row) gameEntries.push(row);
      }
    } catch {
      /* catalog unavailable — money URLs still publish */
    }
  }

  return gameEntries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticRows = staticSitemapRows(lastModified);

  try {
    const gameRows = await catalogSitemapRows(lastModified);
    const seen = new Set(staticRows.map((row) => row.url));
    return [
      ...staticRows,
      ...gameRows.filter((row) => {
        if (seen.has(row.url)) return false;
        seen.add(row.url);
        return true;
      }),
    ];
  } catch {
    return staticRows;
  }
}
