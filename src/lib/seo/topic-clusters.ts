import { consoleCatalog, type ConsoleId } from "@/lib/console-catalog";

export type ClusterPageKind = "issue" | "price";

export type TopicClusterPage = {
  title: string;
  href: string;
  kind: ClusterPageKind;
  issueSlug?: string;
};

export type TopicCluster = {
  id: ConsoleId;
  label: string;
  pillarTitle: string;
  pillarHref: string;
  cityHeadline: string;
  priceTitle: string;
  pages: TopicClusterPage[];
};

function issuePage(title: string, slug: string): TopicClusterPage {
  return {
    title,
    href: `/issues/${slug}`,
    kind: "issue",
    issueSlug: slug,
  };
}

function pricePage(title: string, serviceSlug: string): TopicClusterPage {
  return {
    title,
    href: `/services/${serviceSlug}/price`,
    kind: "price",
  };
}

function clusterFor(
  id: ConsoleId,
  cityHeadline: string,
  priceTitle: string,
  pages: TopicClusterPage[],
): TopicCluster {
  const config = consoleCatalog[id];
  const pillarHref = `/services/${config.repairSlug}`;
  return {
    id,
    label: config.title,
    pillarTitle: `تعمیر ${config.title}`,
    pillarHref,
    cityHeadline,
    priceTitle,
    pages,
  };
}

export const TOPIC_CLUSTERS: Record<ConsoleId, TopicCluster> = {
  ps5: clusterFor("ps5", "تعمیر PS5 در تهران", "قیمت تعمیر PS5", [
    issuePage("PS5 روشن نمی‌شود", "ps5-not-turning-on"),
    issuePage("PS5 تصویر ندارد", "ps5-no-video"),
    issuePage("تعمیر HDMI PS5", "ps5-hdmi-port-damage"),
    issuePage("PS5 داغ می‌کند", "ps5-overheating"),
    issuePage("صدای فن PS5", "ps5-loud-fan-noise"),
    issuePage("PS5 خاموش می‌شود", "ps5-random-shutdown"),
    issuePage("تعمیر پاور PS5", "ps5-power-supply-problem"),
    issuePage("تعمیر برد PS5", "ps5-motherboard-repair"),
    issuePage("تعمیر دسته PS5", "ps5-dualsense-controller-problem"),
    issuePage("دریفت DualSense", "controller-dualsense-drift"),
    pricePage("قیمت تعمیر PS5", "ps5-repair"),
  ]),
  ps4: clusterFor("ps4", "تعمیر PS4 در تهران", "قیمت تعمیر PS4", [
    issuePage("PS4 روشن نمی‌شود", "ps4-not-turning-on"),
    issuePage("تعمیر HDMI PS4", "ps4-hdmi-port-damage"),
    issuePage("PS4 داغ می‌کند", "ps4-overheating"),
    issuePage("صدای فن PS4", "ps4-loud-fan-noise"),
    issuePage("PS4 خاموش می‌شود", "ps4-random-shutdown"),
    issuePage("تعمیر پاور PS4", "ps4-power-supply-problem"),
    issuePage("تعمیر هارد PS4", "ps4-hard-drive-failure"),
    issuePage("ارور Safe Mode", "ps4-safe-mode-error"),
    issuePage("دریفت DualShock", "controller-dualshock-drift"),
    pricePage("قیمت تعمیر PS4", "ps4-repair"),
  ]),
  xbox: clusterFor("xbox", "تعمیر Xbox در تهران", "قیمت تعمیر Xbox", [
    issuePage("Xbox روشن نمی‌شود", "xbox-not-turning-on"),
    issuePage("تعمیر HDMI Xbox", "xbox-hdmi-port-damage"),
    issuePage("تعمیر پاور Xbox", "xbox-power-supply-problem"),
    issuePage("Xbox داغ می‌کند", "xbox-overheating"),
    issuePage("صدای فن Xbox", "xbox-loud-fan-noise"),
    issuePage("خرابی هارد Xbox", "xbox-hard-drive-failure"),
    issuePage("کرش بازی Xbox", "xbox-game-crashing"),
    issuePage("مشکل اینترنت Xbox", "xbox-wifi-connection-problem"),
    pricePage("قیمت تعمیر Xbox", "xbox-repair"),
  ]),
};

export const TOPIC_CLUSTER_IDS = Object.keys(TOPIC_CLUSTERS) as ConsoleId[];

export function getTopicCluster(id: ConsoleId): TopicCluster {
  return TOPIC_CLUSTERS[id];
}

export function getClusterByServiceSlug(slug: string): TopicCluster | undefined {
  return TOPIC_CLUSTER_IDS.map((id) => TOPIC_CLUSTERS[id]).find((cluster) =>
    cluster.pillarHref.endsWith(`/${slug}`),
  );
}

export function getClusterByIssueSlug(slug: string): TopicCluster | undefined {
  return TOPIC_CLUSTER_IDS.map((id) => TOPIC_CLUSTERS[id]).find((cluster) =>
    cluster.pages.some((page) => page.issueSlug === slug),
  );
}

export function getClusterByHref(href: string): TopicCluster | undefined {
  return TOPIC_CLUSTER_IDS.map((id) => TOPIC_CLUSTERS[id]).find(
    (cluster) =>
      cluster.pillarHref === href ||
      cluster.pages.some((page) => page.href === href),
  );
}

export function clusterIssueSlugs(cluster: TopicCluster): string[] {
  return cluster.pages
    .map((page) => page.issueSlug)
    .filter((slug): slug is string => Boolean(slug));
}

export function clusterSitemapPaths(): string[] {
  return TOPIC_CLUSTER_IDS.flatMap((id) =>
    TOPIC_CLUSTERS[id].pages
      .filter((page) => page.kind === "price")
      .map((page) => page.href),
  );
}
