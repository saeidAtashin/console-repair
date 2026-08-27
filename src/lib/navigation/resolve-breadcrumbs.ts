import { blogPosts } from "@/app/data/blog";
import { issues } from "@/app/data/issues";
import { services } from "@/app/data/services";
import {
  consoleCatalog,
  getConsole,
  getRepairService,
  type ConsoleId,
} from "@/lib/console-catalog";
import { getGameFilter } from "@/lib/game-filters";
import { GAME_INSTALL_CONSOLE_META } from "@/lib/game-install-meta";
import { isConsoleId } from "@/lib/repair-links";
import { getClusterByIssueSlug, getClusterByServiceSlug } from "@/lib/seo/topic-clusters";
import {
  getProducts,
  SHOP_CONSOLE_META,
  type ShopConsole,
} from "@/lib/shop";
import {
  TEHRAN_PATH,
  getTehranPage,
  tehranHub,
} from "@/lib/locations/tehran";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs";
import {
  normalizePath,
  pathForBreadcrumbMatch,
} from "@/lib/breadcrumb-tree-utils";

const HOME: BreadcrumbItem = { label: "خانه", href: "/" };

const STATIC_PAGES: Record<string, string> = {
  "/tracking": "پیگیری تعمیر",
  "/blog": "بلاگ",
  "/about-us": "درباره ما",
  "/contact": "تماس با ما",
  "/faq": "سوالات متداول",
  "/terms": "قوانین و شرایط",
  "/privacy-policy": "حریم خصوصی",
};

function withHome(...segments: BreadcrumbItem[]): BreadcrumbItem[] {
  return [HOME, ...segments];
}

function current(label: string): BreadcrumbItem {
  return { label };
}

function link(label: string, href: string): BreadcrumbItem {
  return { label, href };
}

function isShopConsole(slug: string): slug is ShopConsole {
  return slug in SHOP_CONSOLE_META;
}

function resolveRepair(path: string): BreadcrumbItem[] {
  const matchPath = pathForBreadcrumbMatch(path);
  if (matchPath === "/repair") {
    return withHome(current("ثبت سفارش تعمیر"));
  }

  if (matchPath.startsWith("/repair?console=")) {
    const consoleId = matchPath.split("=")[1] as ConsoleId;
    if (isConsoleId(consoleId)) {
      const service = getRepairService(consoleId);
      const config = consoleCatalog[consoleId];
      const label = service?.title ?? `تعمیر ${config.title}`;
      return withHome(
        link("ثبت سفارش تعمیر", "/repair"),
        current(label),
      );
    }
  }

  return withHome(current("ثبت سفارش تعمیر"));
}

function resolveServices(pathname: string, search: string): BreadcrumbItem[] | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "services") return null;

  if (segments.length === 1) {
    return withHome(current("همه خدمات"));
  }

  if (segments[1] === "game-install") {
    if (segments.length === 2) {
      return withHome(
        link("همه خدمات", "/services"),
        current("نصب بازی"),
      );
    }

    const consoleSlug = segments[2];
    const meta = consoleSlug ? GAME_INSTALL_CONSOLE_META[consoleSlug] : undefined;
    if (!meta) {
      return withHome(
        link("همه خدمات", "/services"),
        link("نصب بازی", "/services/game-install"),
      );
    }

    const hubPath = `/services/game-install/${consoleSlug}`;
    const hubLabel = `نصب بازی ${meta.label}`;

    if (segments[3] === "games") {
      const params = new URLSearchParams(search);
      const filter = getGameFilter(params.get("filter") ?? "best");
      return withHome(
        link("همه خدمات", "/services"),
        link("نصب بازی", "/services/game-install"),
        link(hubLabel, hubPath),
        current(filter?.label ?? "لیست بازی‌ها"),
      );
    }

    return withHome(
      link("همه خدمات", "/services"),
      link("نصب بازی", "/services/game-install"),
      current(hubLabel),
    );
  }

  const slug = segments[1];
  const service = services.find((s) => s.slug === slug);
  if (!service) {
    return withHome(link("همه خدمات", "/services"));
  }

  if (segments[2] === "price") {
    const cluster = getClusterByServiceSlug(slug);
    return withHome(
      link("همه خدمات", "/services"),
      link(service.title, `/services/${slug}`),
      current(cluster?.priceTitle ?? "قیمت تعمیر"),
    );
  }

  return withHome(
    link("همه خدمات", "/services"),
    current(service.title),
  );
}

function resolveShop(pathname: string): BreadcrumbItem[] | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "shop") return null;

  if (segments.length === 1) {
    return withHome(current("فروشگاه"));
  }

  if (segments[1] === "cart") {
    return withHome(link("فروشگاه", "/shop"), current("سبد خرید"));
  }

  if (segments[1] === "checkout") {
    return withHome(
      link("فروشگاه", "/shop"),
      link("سبد خرید", "/shop/cart"),
      current("تسویه حساب"),
    );
  }

  const consoleSlug = segments[1];
  if (!isShopConsole(consoleSlug)) {
    return withHome(current("فروشگاه"));
  }

  const consoleLabel = `خرید ${SHOP_CONSOLE_META[consoleSlug].label}`;
  const consolePath = `/shop/${consoleSlug}`;

  if (segments.length === 2) {
    return withHome(link("فروشگاه", "/shop"), current(consoleLabel));
  }

  if (segments[2] === "parts") {
    return withHome(
      link("فروشگاه", "/shop"),
      link(consoleLabel, consolePath),
      current("فروش قطعات"),
    );
  }

  const productSlug = segments[2];
  const product = getProducts({ console: consoleSlug }).find(
    (p) => p.slug === productSlug,
  );

  return withHome(
    link("فروشگاه", "/shop"),
    link(consoleLabel, consolePath),
    current(product?.title ?? productSlug),
  );
}

function resolveConsoles(pathname: string): BreadcrumbItem[] | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "consoles") return null;

  const consoleId = segments[1];
  const config = consoleId ? getConsole(consoleId) : undefined;
  if (!config) return withHome(current("کنسول‌ها"));

  const consolePath = `/consoles/${consoleId}`;

  if (segments[2] === "issues") {
    return withHome(
      link(config.title, consolePath),
      current("مشکلات رایج"),
    );
  }

  return withHome(current(config.title));
}

function resolveIssues(pathname: string): BreadcrumbItem[] | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "issues") return null;

  if (segments.length === 1) {
    return withHome(current("مشکلات کنسول"));
  }

  const issue = issues.find((i) => i.slug === segments[1]);
  const cluster = getClusterByIssueSlug(segments[1] ?? "");
  if (cluster) {
    return withHome(
      link(cluster.pillarTitle, cluster.pillarHref),
      current(issue?.title ?? segments[1]),
    );
  }

  return withHome(
    link("مشکلات کنسول", "/issues"),
    current(issue?.title ?? segments[1]),
  );
}

function resolveTehran(pathname: string): BreadcrumbItem[] | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "tehran") return null;

  if (segments.length === 1) {
    return withHome(current(tehranHub.title));
  }

  const location = getTehranPage(segments[1] ?? "");
  return withHome(
    link(tehranHub.title, TEHRAN_PATH),
    current(location?.title ?? segments[1]),
  );
}

function resolveBlog(pathname: string): BreadcrumbItem[] | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "blog") return null;

  if (segments.length === 1) {
    return withHome(current("بلاگ"));
  }

  const post = blogPosts.find((p) => p.slug === segments[1]);

  if (segments.length >= 3 && post?.kind === "cheats") {
    const gameSlug = segments[2];
    const game = post.sections
      .flatMap((s) => s.games)
      .find((g) => g.slug === gameSlug);
    return withHome(
      link("بلاگ", "/blog"),
      link(post.title, `/blog/${post.slug}`),
      current(game?.name ?? gameSlug),
    );
  }

  return withHome(
    link("بلاگ", "/blog"),
    current(post?.title ?? segments[1]),
  );
}

/** Resolve breadcrumb trail from path. Returns empty array on home. */
export function resolveBreadcrumbs(
  path: string,
  override?: BreadcrumbItem[],
): BreadcrumbItem[] {
  if (override?.length) return override;

  const normalized = normalizePath(path);
  if (normalized === "/") return [];

  const [pathname = "/", search = ""] = path.split("?");
  const repairMatch = pathForBreadcrumbMatch(path);
  if (repairMatch.startsWith("/repair")) {
    return resolveRepair(path);
  }

  const resolvers = [
    () => resolveServices(pathname, search),
    () => resolveShop(pathname),
    () => resolveConsoles(pathname),
    () => resolveIssues(pathname),
    () => resolveTehran(pathname),
    () => resolveBlog(pathname),
  ];

  for (const resolve of resolvers) {
    const trail = resolve();
    if (trail) return trail;
  }

  const staticLabel = STATIC_PAGES[normalized];
  if (staticLabel) {
    return withHome(current(staticLabel));
  }

  return withHome();
}
