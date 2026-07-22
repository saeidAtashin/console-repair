import { blogPosts } from "@/app/data/blog";
import { ISSUES_INDEX_CATEGORIES } from "@/app/data/issues-index-content";
import {
  consoleCatalog,
  consoleIds,
  getRepairService,
  type ConsoleId,
} from "./console-catalog";
import { siteBreadcrumbTree } from "./breadcrumb-tree-data";
import { SHOP_CONSOLE_ORDER, SHOP_CONSOLE_META } from "./shop";

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

function issueLabel(consoleId: ConsoleId) {
  return (
    getRepairService(consoleId)?.title ??
    `تعمیر ${consoleCatalog[consoleId].title}`
  );
}

function repairChildren(): SiteNavLeaf[] {
  return [
    ...consoleIds.map((id) => ({
      title: issueLabel(id),
      href: `/services/${consoleCatalog[id].repairSlug}`,
    })),
    { title: "تعمیر HDMI", href: "/services/hdmi-repair" },
    { title: "تعمیر دسته", href: "/services/controller-repair" },
  ];
}

function gameChildren(): SiteNavLeaf[] {
  return consoleIds.flatMap((id) =>
    consoleCatalog[id].gameInstallSlugs.map((game) => ({
      title: game.label,
      href: `/services/game-install/${game.slug}`,
    })),
  );
}

function shopChildren(): SiteNavLeaf[] {
  return [
    { title: "همه محصولات", href: "/shop" },
    ...SHOP_CONSOLE_ORDER.map((slug) => ({
      title: `خرید ${SHOP_CONSOLE_META[slug].label}`,
      href: `/shop/${slug}`,
    })),
  ];
}

function issuesChildren(): SiteNavLeaf[] {
  return ISSUES_INDEX_CATEGORIES.map((category) => {
    const consoleIdsSet = new Set<string>(consoleIds);
    const href = consoleIdsSet.has(category.id)
      ? `/consoles/${category.id}/issues`
      : `/issues#category-${category.id}`;

    return {
      title: category.title,
      href,
    };
  });
}

export const navbarNavItems: SiteNavItem[] = [
  { title: "خانه", href: "/" },
  {
    title: "تعمیرات",
    href: "/services",
    children: repairChildren(),
  },
  {
    title: "مشکلات رایج",
    href: "/issues",
    children: issuesChildren(),
  },
  {
    title: "فروشگاه",
    href: "/shop",
    children: shopChildren(),
  },
  trackingItem(),
  {
    title: "بازی",
    href: "/services/game-install",
    children: gameChildren(),
  },
  {
    title: "بلاگ",
    href: "/blog",
    children: blogPosts.map((post) => ({
      title: post.title,
      href: `/blog/${post.slug}`,
    })),
  },
];

export const headerNavItems: SiteNavLeaf[] = [
  { title: "خانه", href: "/" },
  { title: "همه خدمات", href: "/services" },
  { title: "ثبت سفارش تعمیر", href: "/repair" },
  { title: "مشکلات رایج", href: "/issues" },
  trackingItem(),
];

export const footerQuickLinks: SiteNavLeaf[] = [
  { title: "خانه", href: "/" },
  { title: "همه خدمات", href: "/services" },
  { title: "ثبت سفارش تعمیر", href: "/repair" },
  { title: "مشکلات رایج", href: "/issues" },
  trackingItem(),
];

export const footerInfoLinks: SiteNavLeaf[] = [
  { title: "درباره ما", href: "/about-us" },
  { title: "تماس با ما", href: "/contact" },
  { title: "سوالات متداول", href: "/faq" },
  { title: "قوانین و شرایط", href: "/terms" },
  { title: "حریم خصوصی", href: "/privacy-policy" },
];
