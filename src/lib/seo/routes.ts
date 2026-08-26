import { blogPosts } from "@/app/data/blog";
import { getAllCheatGames } from "@/lib/blog-cheats";
import { issues } from "@/app/data/issues";
import { services } from "@/app/data/services";
import { SHOP_CONSOLES, SHOP_ENABLED, getProducts } from "@/lib/shop";
import { consoleIds } from "@/lib/console-catalog";
import { GAME_FILTER_IDS } from "@/lib/game-filters";
import { GAME_INSTALL_PACKAGE_TIERS } from "@/lib/game-install-packages";
import { repairSitemapPaths } from "./repair-seo";

export const GAME_INSTALL_CONSOLES = [
  "ps4",
  "ps5",
  "xbox-one",
  "xbox-series",
] as const;

export type SitemapEntry = {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
};

/** Public indexable routes for sitemap and internal linking. */
export const PUBLIC_SITEMAP_ENTRIES: SitemapEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/issues", changeFrequency: "weekly", priority: 0.8 },
  ...repairSitemapPaths().map((path) => ({
    path,
    changeFrequency: "monthly" as const,
    priority: path === "/repair" ? 0.85 : 0.8,
  })),
  { path: "/tracking", changeFrequency: "monthly", priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.75 },
  ...blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
  ...getAllCheatGames().map((game) => ({
    path: `/blog/game-cheats-codes-2026/${game.gameSlug}`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  })),
  ...services.map((s) => ({
    path: `/services/${s.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  })),
  ...issues.map((i) => ({
    path: `/issues/${i.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  })),
  ...consoleIds.map((id) => ({
    path: `/consoles/${id}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  })),
  ...consoleIds.map((id) => ({
    path: `/consoles/${id}/issues`,
    changeFrequency: "weekly" as const,
    priority: 0.72,
  })),
  { path: "/about-us", changeFrequency: "monthly" as const, priority: 0.45 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly" as const, priority: 0.55 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/services/game-install", changeFrequency: "weekly", priority: 0.7 },
  ...GAME_INSTALL_CONSOLES.map((slug) => ({
    path: `/services/game-install/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  })),
  ...GAME_INSTALL_CONSOLES.map((slug) => ({
    path: `/services/game-install/${slug}/games`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  })),
  ...GAME_INSTALL_CONSOLES.flatMap((slug) =>
    GAME_INSTALL_PACKAGE_TIERS.map((tier) => ({
      path: `/services/game-install/${slug}/packages/${tier}`,
      changeFrequency: "monthly" as const,
      priority: 0.62,
    })),
  ),
  ...GAME_INSTALL_CONSOLES.flatMap((slug) =>
    GAME_FILTER_IDS.map((filter) => ({
      path: `/services/game-install/${slug}/games?filter=${filter}`,
      changeFrequency: "weekly" as const,
      priority: 0.55,
    })),
  ),
  ...(SHOP_ENABLED
    ? [
        { path: "/shop", changeFrequency: "daily" as const, priority: 0.9 },
        ...SHOP_CONSOLES.map((slug) => ({
          path: `/shop/${slug}`,
          changeFrequency: "daily" as const,
          priority: 0.82,
        })),
        ...getProducts().map((product) => ({
          path: `/shop/${product.console}/${product.slug}`,
          changeFrequency: "weekly" as const,
          priority: 0.72,
        })),
      ]
    : []),
];
