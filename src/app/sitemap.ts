import type { MetadataRoute } from "next";

import { absoluteUrl } from "../lib/seo/site";
import { listActiveCategories, listProducts } from "../lib/shop";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const [categories, products] = await Promise.all([
    listActiveCategories(),
    listProducts(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified, changeFrequency: "daily", priority: 0.95 },
    { url: absoluteUrl("/cart"), lastModified, changeFrequency: "monthly", priority: 0.3 },
    { url: absoluteUrl("/about-us"), lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/contact"), lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/faq"), lastModified, changeFrequency: "monthly", priority: 0.4 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/shop/${c.slug}`),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/product/${p.slug}`),
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
