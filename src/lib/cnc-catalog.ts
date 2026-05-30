import { services } from "@/app/data/services";
import { productCategories, products } from "@/app/data/products";

export type CncCategoryId = "wood" | "laser" | "milling" | "decor";

export type CncCategoryEntry = {
  id: CncCategoryId;
  title: string;
  description: string;
  serviceSlug: string;
  icon: string;
};

export const cncCatalog: Record<CncCategoryId, CncCategoryEntry> = {
  wood: {
    id: "wood",
    title: "برش چوب و MDF",
    description: "برش دقیق MDF، HDF و چوب با دستگاه CNC",
    serviceSlug: "cnc-wood-cutting",
    icon: "🪵",
  },
  laser: {
    id: "laser",
    title: "برش و حکاکی لیزر",
    description: "برش و حکاکی روی چوب، MDF و اکریلیک",
    serviceSlug: "laser-cutting",
    icon: "✨",
  },
  milling: {
    id: "milling",
    title: "فرز CNC",
    description: "ماشین‌کاری، قالب‌سازی و قطعات صنعتی",
    serviceSlug: "cnc-milling",
    icon: "⚙️",
  },
  decor: {
    id: "decor",
    title: "تابلو و دکور",
    description: "تابلو، استند، حروف برجسته و محصولات دکوراتیو",
    serviceSlug: "signs-decor",
    icon: "🏷️",
  },
};

export const cncCategoryIds = Object.keys(cncCatalog) as CncCategoryId[];

export function getCncCategory(id: string): CncCategoryEntry | undefined {
  return cncCatalog[id as CncCategoryId];
}

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getProductsByCategory(categoryId: CncCategoryId) {
  return products.filter((p) => p.category === categoryId);
}

export function resolveCategoryServicePath(categoryId: CncCategoryId): string {
  const config = cncCatalog[categoryId];
  return `/services/${config.serviceSlug}`;
}

export function resolveCategoryOrderPath(categoryId: CncCategoryId): string {
  const config = cncCatalog[categoryId];
  return `/order?service=${config.serviceSlug}`;
}

export { productCategories, products };
