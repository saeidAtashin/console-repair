import { PHONE_BRANDS } from "./cases/brands.static";

export type SiteNavLeaf = {
  title: string;
  href: string;
};

export type SiteNavItem = SiteNavLeaf & {
  children?: SiteNavLeaf[];
};

export const navbarNavItems: SiteNavItem[] = [
  { title: "خانه", href: "/" },
  {
    title: "قاب‌های آماده",
    href: "/cases",
  },
  {
    title: "طراحی قاب",
    href: "/create",
    children: PHONE_BRANDS.map((brand) => ({
      title: brand.name,
      href: `/create/${brand.slug}`,
    })),
  },
  { title: "سبد خرید", href: "/cart" },
  { title: "پیگیری سفارش", href: "/tracking" },
];

export const headerNavItems: SiteNavLeaf[] = [
  { title: "خانه", href: "/" },
  { title: "قاب‌های آماده", href: "/cases" },
  { title: "طراحی قاب", href: "/create" },
  { title: "پیگیری سفارش", href: "/tracking" },
];

export const footerQuickLinks: SiteNavLeaf[] = [
  { title: "خانه", href: "/" },
  { title: "قاب‌های آماده", href: "/cases" },
  { title: "طراحی قاب", href: "/create" },
  { title: "سبد خرید", href: "/cart" },
];

export const footerInfoLinks: SiteNavLeaf[] = [
  { title: "درباره ما", href: "/about-us" },
  { title: "تماس با ما", href: "/contact" },
  { title: "سوالات متداول", href: "/faq" },
  { title: "قوانین و شرایط", href: "/terms" },
  { title: "حریم خصوصی", href: "/privacy-policy" },
];
