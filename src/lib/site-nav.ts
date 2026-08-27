import { blogPosts } from "@/app/data/blog";
import { services } from "@/app/data/services";
import {
  consoleCatalog,
  consoleIds,
  getRepairService,
  type ConsoleId,
} from "./console-catalog";
import { GAME_INSTALL_CONSOLE_META, GAME_INSTALL_CONSOLE_ORDER } from "./game-install-meta";
import { TOPIC_CLUSTERS } from "./seo/topic-clusters";
import {
  TEHRAN_SERVICE_SLUGS,
  tehranHub,
  tehranPagePath,
  tehranPages,
} from "./locations/tehran";
import { SHOP_CONSOLE_ORDER, SHOP_CONSOLE_META, SHOP_ENABLED } from "./shop";

export type SiteNavLeaf = {
  title: string;
  href: string;
};

export type SiteNavItem = SiteNavLeaf & {
  children?: SiteNavItem[];
};

function treeService(slug: string) {
  return services.find((s) => s.slug === slug);
}

function trackingItem(): SiteNavLeaf {
  return {
    title: "پیگیری تعمیر",
    href: "/tracking",
  };
}

function issueLeaves(
  repairSlug: string,
): SiteNavItem[] {
  return (
    treeService(repairSlug)?.commonIssues.map((issue) => ({
      title: issue.title,
      href: `/issues/${issue.slug}`,
    })) ?? []
  );
}

function repairConsoleChild(id: ConsoleId): SiteNavItem {
  const config = consoleCatalog[id];
  const repair = getRepairService(id);
  const cluster = TOPIC_CLUSTERS[id];
  return {
    title: repair?.title ?? `تعمیر ${config.title}`,
    href: `/services/${config.repairSlug}`,
    children: [
      {
        title: `همه خدمات ${config.title}`,
        href: `/consoles/${id}`,
      },
      ...cluster.pages.map((page) => ({
        title: page.title,
        href: page.href,
      })),
    ],
  };
}

function hdmiNavChild(): SiteNavItem {
  const hdmi = treeService("hdmi-repair");
  return {
    title: hdmi?.title ?? "تعمیر HDMI",
    href: "/services/hdmi-repair",
    children: issueLeaves("hdmi-repair"),
  };
}

function controllerNavItem(): SiteNavItem {
  const controller = treeService("controller-repair");
  return {
    title: "تعمیر دسته",
    href: "/services/controller-repair",
    children: issueLeaves("controller-repair"),
  };
}

function gameInstallChildren(): SiteNavItem[] {
  return GAME_INSTALL_CONSOLE_ORDER.map((slug) => {
    const meta = GAME_INSTALL_CONSOLE_META[slug];
    const hub = `/services/game-install/${slug}`;
    return {
      title: meta.title,
      href: hub,
      children: [
        { title: `لیست بازی‌های ${meta.label}`, href: `${hub}/games` },
        { title: "پکیج ۵ بازی", href: `${hub}/packages/5` },
        { title: "پکیج ۱۰ بازی", href: `${hub}/packages/10` },
        { title: "پکیج اقتصادی", href: `${hub}/packages/economy` },
      ],
    };
  });
}

function shopChildren(): SiteNavItem[] {
  return [
    { title: "همه محصولات", href: "/shop" },
    ...SHOP_CONSOLE_ORDER.map((slug) => ({
      title: `خرید ${SHOP_CONSOLE_META[slug].label}`,
      href: `/shop/${slug}`,
    })),
  ];
}

export const navbarNavItems: SiteNavItem[] = [
  { title: "عیب‌یابی", href: "/diagnosis" },
  {
    title: "تعمیر کنسول",
    href: "/services",
    children: [
      ...consoleIds.map(repairConsoleChild),
      hdmiNavChild(),
      controllerNavItem(),
    ],
  },
  {
    title: "مشکلات کنسول",
    href: "/issues",
    children: [
      { title: "مشکلات PS5", href: "/consoles/ps5/issues" },
      { title: "مشکلات PS4", href: "/consoles/ps4/issues" },
      { title: "مشکلات Xbox", href: "/consoles/xbox/issues" },
      { title: "مشکلات HDMI", href: "/services/hdmi-repair" },
      { title: "مشکلات دسته", href: "/services/controller-repair" },
    ],
  },
  {
    title: "نصب بازی",
    href: "/services/game-install",
    children: gameInstallChildren(),
  },
  ...(SHOP_ENABLED
    ? [
        {
          title: "فروشگاه",
          href: "/shop",
          children: shopChildren(),
        },
      ]
    : []),
  trackingItem(),
  {
    title: "راهنما",
    href: "/blog",
    children: blogPosts.map((post) => ({
      title: post.title,
      href: `/blog/${post.slug}`,
    })),
  },
];

export const headerNavItems: SiteNavLeaf[] = [
  { title: "عیب‌یابی", href: "/diagnosis" },
  { title: "تعمیر کنسول", href: "/services" },
  { title: "مشکلات کنسول", href: "/issues" },
  { title: "نصب بازی", href: "/services/game-install" },
  { title: "ثبت تعمیر", href: "/repair" },
  trackingItem(),
  { title: "راهنما", href: "/blog" },
];

export const footerQuickLinks: SiteNavLeaf[] = [
  { title: "عیب‌یابی", href: "/diagnosis" },
  { title: "تعمیر کنسول", href: "/services" },
  { title: "مشکلات کنسول", href: "/issues" },
  { title: "نصب بازی", href: "/services/game-install" },
  trackingItem(),
  { title: "راهنما", href: "/blog" },
];

export const footerLocationLinks: SiteNavLeaf[] = [
  { title: tehranHub.title, href: tehranHub.path },
  ...TEHRAN_SERVICE_SLUGS.map((slug) => ({
    title: tehranPages[slug].title,
    href: tehranPagePath(slug),
  })),
];

export const footerInfoLinks: SiteNavLeaf[] = [
  { title: "درباره ما", href: "/about-us" },
  { title: "تماس با ما", href: "/contact" },
  { title: "سوالات متداول", href: "/faq" },
  { title: "قوانین و شرایط", href: "/terms" },
  { title: "حریم خصوصی", href: "/privacy-policy" },
];
