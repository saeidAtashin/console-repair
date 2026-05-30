import { services } from "@/app/data/services";
import { products } from "@/app/data/products";
import { orderSitemapPaths } from "../cnc-seo";

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
  { path: "/products", changeFrequency: "weekly", priority: 0.9 },
  ...orderSitemapPaths().map((path) => ({
    path,
    changeFrequency: "monthly" as const,
    priority: path === "/order" ? 0.85 : 0.8,
  })),
  { path: "/tracking", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  ...services.map((s) => ({
    path: `/services/${s.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  })),
  ...products.map((p) => ({
    path: `/products/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  })),
];
