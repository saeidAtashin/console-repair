import { services } from "@/app/data/services";
import { productCategories } from "@/app/data/products";
import { siteBreadcrumbTree } from "./breadcrumb-tree-data";

export type SiteNavLeaf = {
  title: string;
  href: string;
};

export type SiteNavItem = SiteNavLeaf & {
  children?: SiteNavLeaf[];
};

function treeChild(href: string) {
  return siteBreadcrumbTree.children?.find((node) => node.href === href);
}

function trackingItem(): SiteNavLeaf {
  const tracking = treeChild("/tracking");
  return {
    title: tracking?.title ?? "پیگیری",
    href: "/tracking",
  };
}

function serviceChildren(): SiteNavLeaf[] {
  return services.map((s) => ({
    title: s.title,
    href: `/services/${s.slug}`,
  }));
}

function productChildren(): SiteNavLeaf[] {
  return productCategories.map((c) => ({
    title: c.title,
    href: `/products?category=${c.id}`,
  }));
}

export const navbarNavItems: SiteNavItem[] = [
  { title: "خانه", href: "/" },
  {
    title: "خدمات",
    href: "/services",
    children: serviceChildren(),
  },
  {
    title: "محصولات",
    href: "/products",
    children: productChildren(),
  },
  { title: "ثبت سفارش", href: "/order" },
  trackingItem(),
];

export const headerNavItems: SiteNavLeaf[] = [
  { title: "خانه", href: "/" },
  { title: "همه خدمات", href: "/services" },
  { title: "محصولات", href: "/products" },
  { title: "ثبت سفارش", href: "/order" },
  trackingItem(),
];

export const footerQuickLinks: SiteNavLeaf[] = [
  { title: "خانه", href: "/" },
  { title: "همه خدمات", href: "/services" },
  { title: "محصولات", href: "/products" },
  { title: "ثبت سفارش", href: "/order" },
  trackingItem(),
];

export const footerInfoLinks: SiteNavLeaf[] = [
  { title: "درباره ما", href: "/about-us" },
  { title: "تماس با ما", href: "/contact" },
  { title: "سوالات متداول", href: "/faq" },
  { title: "قوانین و شرایط", href: "/terms" },
  { title: "حریم خصوصی", href: "/privacy-policy" },
];
