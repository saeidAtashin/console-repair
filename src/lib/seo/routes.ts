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
  { path: "/studio", changeFrequency: "weekly", priority: 0.95 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cart", changeFrequency: "monthly", priority: 0.5 },
  { path: "/checkout", changeFrequency: "monthly", priority: 0.5 },
  { path: "/tracking", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
];
