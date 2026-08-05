export type SiteNavLeaf = {
  title: string;
  href: string;
};

export type SiteNavBranch = SiteNavLeaf & {
  children?: SiteNavLeaf[];
};

export type SiteNavItem = SiteNavLeaf & {
  children?: SiteNavBranch[];
};

export const navbarNavItems: SiteNavItem[] = [
  { title: "خانه", href: "/" },
  { title: "استودیو", href: "/studio" },
  { title: "تعرفه‌ها", href: "/pricing" },
  { title: "سبد خرید", href: "/cart" },
  { title: "پیگیری سفارش", href: "/tracking" },
];

export const headerNavItems: SiteNavLeaf[] = [
  { title: "خانه", href: "/" },
  { title: "استودیو", href: "/studio" },
  { title: "تعرفه‌ها", href: "/pricing" },
  { title: "پیگیری سفارش", href: "/tracking" },
];

export const footerQuickLinks: SiteNavLeaf[] = [
  { title: "خانه", href: "/" },
  { title: "استودیو", href: "/studio" },
  { title: "تعرفه‌ها", href: "/pricing" },
  { title: "سبد خرید", href: "/cart" },
];

export const footerInfoLinks: SiteNavLeaf[] = [
  { title: "درباره ما", href: "/about-us" },
  { title: "تماس با ما", href: "/contact" },
  { title: "سوالات متداول", href: "/faq" },
  { title: "قوانین و شرایط", href: "/terms" },
  { title: "حریم خصوصی", href: "/privacy-policy" },
];
