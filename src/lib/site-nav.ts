export type SiteNavLeaf = {
  title: string;
  href: string;
};

export type SiteNavItem = SiteNavLeaf & {
  children?: SiteNavLeaf[];
};

const shopCategories: SiteNavLeaf[] = [
  { title: "همه محصولات", href: "/shop" },
  { title: "بسته هدیه گیمینگ", href: "/shop/gift-boxes" },
  { title: "دسته بازی", href: "/shop/controllers" },
  { title: "هدست و صدا", href: "/shop/headsets" },
  { title: "گیفت کارت", href: "/shop/gift-cards" },
  { title: "اکسسوری", href: "/shop/accessories" },
];

export const navbarNavItems: SiteNavItem[] = [
  { title: "خانه", href: "/" },
  {
    title: "فروشگاه",
    href: "/shop",
    children: shopCategories,
  },
  { title: "سبد خرید", href: "/cart" },
  { title: "حساب من", href: "/account" },
];

export const headerNavItems: SiteNavLeaf[] = [
  { title: "خانه", href: "/" },
  { title: "فروشگاه", href: "/shop" },
  { title: "سبد خرید", href: "/cart" },
];

export const footerQuickLinks: SiteNavLeaf[] = [
  { title: "خانه", href: "/" },
  { title: "فروشگاه", href: "/shop" },
  { title: "سبد خرید", href: "/cart" },
  { title: "حساب کاربری", href: "/account" },
];

export const footerInfoLinks: SiteNavLeaf[] = [
  { title: "درباره ما", href: "/about-us" },
  { title: "تماس با ما", href: "/contact" },
  { title: "سوالات متداول", href: "/faq" },
  { title: "قوانین و شرایط", href: "/terms" },
  { title: "حریم خصوصی", href: "/privacy-policy" },
];
