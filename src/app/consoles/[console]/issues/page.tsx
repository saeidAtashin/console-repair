import { notFound } from "next/navigation";

import FunnelNextStep from "@/app/components/funnel/FunnelNextStep";
import IssueListCard from "@/app/components/issues/IssueListCard";
import PageShell from "@/app/components/seo/PageShell";
import { issues as allIssues } from "@/app/data/issues";
import { services } from "@/app/data/services";
import { consoleIds, getConsole } from "../../../../lib/console-catalog";
import { gameInstallHrefForConsole } from "../../../../lib/repair-links";
import { webPageJsonLd } from "../../../../lib/seo/jsonld";
import { createPageMetadata } from "../../../../lib/seo/metadata";

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
      title: "صفحه یافت نشد",
      path: `/consoles/${consoleSlug}/issues`,
      noIndex: true,
    });
  }

  const path = `/consoles/${config.id}/issues`;

  return createPageMetadata({
    title: `مشکلات رایج ${config.title}`,
    description: `لیست مشکلات متداول ${config.title} و راهنمای تعمیر.`,
    path,
  });
}

export default async function ConsoleIssuesPage({ params }: Props) {
  const { console: consoleSlug } = await params;
  const config = getConsole(consoleSlug);

  if (!config) notFound();

  const repair = services.find((s) => s.slug === config.repairSlug);
  const commonIssues = repair?.commonIssues ?? [];
  const path = `/consoles/${config.id}/issues`;

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

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 text-white">
      <PageShell
        currentPath={path}
        jsonLd={webPageJsonLd({
          name: `مشکلات رایج ${config.title}`,
          description: `مشکلات متداول ${config.title}`,
          path,
        })}
        containerClassName="container mx-auto max-w-5xl px-6"
      >
        <h1 className="mb-4 text-3xl font-black">مشکلات رایج {config.title}</h1>
        <p className="mb-10 max-w-2xl text-lg text-zinc-400">
          رایج‌ترین خرابی‌های {config.title} و لینک راهنمای تعمیر هر مورد.
        </p>

        <ul className="space-y-4">
          {resolvedIssues.map((issue) => (
            <li key={issue.slug}>
              <IssueListCard issue={issue} />
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <FunnelNextStep
            title={`تعمیر یا نصب بازی ${config.title}`}
            description="اگر دستگاه معیوب است تعمیر کنید. اگر کنسول سالم است، نصب بازی را سفارش دهید."
            actions={[
              {
                href: `/services/${config.repairSlug}`,
                label: `ثبت درخواست تعمیر ${config.title}`,
                primary: true,
              },
              {
                href: gameInstallHrefForConsole(config.id),
                label: `نصب بازی ${config.title}`,
              },
            ]}
          />
        </div>
      </PageShell>
    </main>
  );
}
