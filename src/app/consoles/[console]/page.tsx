import { notFound } from "next/navigation";

import FunnelNextStep from "@/app/components/funnel/FunnelNextStep";
import HubLinkGrid from "@/app/components/HubLinkGrid";
import IssueListCard from "@/app/components/issues/IssueListCard";
import PageShell from "@/app/components/seo/PageShell";
import { issues as allIssues } from "@/app/data/issues";
import {
  consoleIds,
  getConsole,
  getRepairService,
} from "../../../lib/console-catalog";
import { SHOP_ENABLED } from "../../../lib/shop";
import { webPageJsonLd } from "../../../lib/seo/jsonld";
import { createPageMetadata } from "../../../lib/seo/metadata";

type Props = {
  params: Promise<{ console: string }>;
};

export function generateStaticParams() {
  return consoleIds.map((console) => ({ console }));
}

export async function generateMetadata({ params }: Props) {
  const { console: consoleSlug } = await params;
  const config = getConsole(consoleSlug);

  if (!config) {
    return createPageMetadata({
      title: "کنسول یافت نشد",
      path: `/consoles/${consoleSlug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `خدمات ${config.title}`,
    description: config.description,
    path: `/consoles/${consoleSlug}`,
    keywords: [`تعمیر ${config.title}`, `خدمات ${config.title}`],
  });
}

export default async function ConsoleHubPage({ params }: Props) {
  const { console: consoleSlug } = await params;
  const config = getConsole(consoleSlug);

  if (!config) notFound();

  const repair = getRepairService(config.id);
  const path = `/consoles/${config.id}`;
  const commonIssues = repair?.commonIssues ?? [];
  const resolvedIssues = commonIssues.map((item) => {
    const full = allIssues.find((issue) => issue.slug === item.slug);
    return (
      full ?? {
        slug: item.slug,
        title: item.title,
        description: `راهنمای عیب‌یابی و تعمیر ${item.title}`,
      }
    );
  });
  const shopLinks = SHOP_ENABLED
    ? config.id === "xbox"
      ? [
          {
            title: "فروش Xbox Series",
            description: "خرید Xbox Series نو و دست دوم تست شده.",
            href: "/shop/xbox-series",
          },
          {
            title: "فروش Xbox One",
            description: "خرید Xbox One تست شده با قیمت اقتصادی.",
            href: "/shop/xbox-one",
          },
        ]
      : [
          {
            title: `فروش ${config.title}`,
            description: "خرید کنسول نو یا دست‌دوم تست‌شده با ضمانت.",
            href: `/shop/${config.id}`,
          },
        ]
    : [];

  const links = [
    {
      title: repair?.title ?? `تعمیر ${config.title}`,
      description: repair?.description,
      href: `/services/${config.repairSlug}`,
    },
    ...config.gameInstallSlugs.map((g) => ({
      title: g.label,
      href: `/services/game-install/${g.slug}`,
    })),
    ...shopLinks,
    ...(SHOP_ENABLED
      ? [
          {
            title: "فروش قطعات",
            description: "قطعات اورجینال و سازگار با این کنسول.",
            href: `/shop/${config.id}/parts`,
          },
        ]
      : []),
    {
      title: "مشکلات رایج",
      description: "راهنمای عیب‌یابی و ثبت تعمیر برای مشکلات متداول.",
      href: `/consoles/${config.id}/issues`,
    },
  ];

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <PageShell
        currentPath={path}
        jsonLd={webPageJsonLd({
          name: `خدمات ${config.title}`,
          description: config.description,
          path,
        })}
        containerClassName="container mx-auto max-w-5xl px-6"
      >
        <HubLinkGrid
          heading={`خدمات ${config.title}`}
          description={config.description}
          links={links}
        />

        {resolvedIssues.length > 0 ? (
          <section className="mt-16" aria-labelledby="console-issues-heading">
            <h2
              id="console-issues-heading"
              className="mb-3 text-2xl font-black"
            >
              مشکلات رایج {config.title}
            </h2>
            <p className="mb-8 max-w-2xl text-zinc-400">
              راهنمای عیب‌یابی هر مشکل و ثبت درخواست تعمیر با عنوان از پیش پرشده.
            </p>
            <ul className="space-y-4">
              {resolvedIssues.map((issue) => (
                <li key={issue.slug}>
                  <IssueListCard issue={issue} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-12">
          <FunnelNextStep
            title={`عیب‌یابی یا نصب بازی ${config.title}`}
            description="اول دستگاه را مرحله‌به‌مرحله بررسی می‌کنیم. اگر کنسول سالم است، نصب بازی از همین‌جا شروع می‌شود."
            actions={[
              {
                href: "/diagnosis",
                label: `عیب‌یابی ${config.title}`,
                primary: true,
              },
              ...(config.gameInstallSlugs[0]
                ? [
                    {
                      href: `/services/game-install/${config.gameInstallSlugs[0].slug}`,
                      label: `نصب بازی ${config.title}`,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </PageShell>
    </main>
  );
}
