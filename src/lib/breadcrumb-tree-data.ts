import { services } from "@/app/data/services";
import { productCategories, products } from "@/app/data/products";

export type BranchNode = {
  title: string;
  href?: string;
  children?: BranchNode[];
};

const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

function serviceBranch(): BranchNode {
  return {
    title: "خدمات CNC",
    href: "/services",
    children: services.map((s) => ({
      title: s.title,
      href: `/services/${s.slug}`,
    })),
  };
}

function productsBranch(): BranchNode {
  return {
    title: "محصولات",
    href: "/products",
    children: productCategories.map((c) => ({
      title: c.title,
      href: `/products?category=${c.id}`,
      children: products
        .filter((p) => p.category === c.id)
        .slice(0, 4)
        .map((p) => ({
          title: p.title,
          href: `/products/${p.slug}`,
        })),
    })),
  };
}

export const siteBreadcrumbTree: BranchNode = {
  title: "خانه",
  href: "/",
  children: [
    serviceBranch(),
    productsBranch(),
    {
      title: "ثبت سفارش",
      href: "/order",
      children: services.map((s) => ({
        title: s.title,
        href: `/order?service=${s.slug}`,
      })),
    },
    {
      title: "پیگیری سفارش",
      href: "/tracking",
    },
    {
      title: "درباره ما",
      href: "/about-us",
    },
    {
      title: "تماس با ما",
      href: "/contact",
    },
    {
      title: "سوالات متداول",
      href: "/faq",
    },
    {
      title: "قوانین و شرایط",
      href: "/terms",
    },
    {
      title: "حریم خصوصی",
      href: "/privacy-policy",
    },
  ],
};

export { serviceBySlug };
