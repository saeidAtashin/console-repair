import Link from "next/link";
import { notFound } from "next/navigation";

import FaqSection from "@/app/components/seo/FaqSection";
import PageShell from "@/app/components/seo/PageShell";
import TopicClusterNav from "@/app/components/seo/TopicClusterNav";
import { CtaButtonGroup } from "@/app/components/ui/cta";
import { services } from "@/app/data/services";
import {
  formatLandingPrice,
  getConsoleLanding,
} from "@/lib/repair/console-landing";
import { buildRepairHref, consoleIdFromRepairSlug } from "@/lib/repair-links";
import { itemListJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  getClusterByServiceSlug,
} from "@/lib/seo/topic-clusters";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ["ps5-repair", "ps4-repair", "xbox-repair"].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cluster = getClusterByServiceSlug(slug);
  const service = services.find((item) => item.slug === slug);

  if (!cluster || !service) {
    return createPageMetadata({
      title: "صفحه یافت نشد",
      path: `/services/${slug}/price`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: cluster.priceTitle,
    description: `قیمت تقریبی ${cluster.pillarTitle} در تهران. بازه هزینه پس از عیب‌یابی اعلام می‌شود و بدون تأیید شما تعمیر شروع نمی‌شود.`,
    path: `/services/${slug}/price`,
    keywords: [cluster.priceTitle, cluster.pillarTitle, "هزینه تعمیر کنسول"],
  });
}

export default async function RepairPricePage({ params }: Props) {
  const { slug } = await params;
  const cluster = getClusterByServiceSlug(slug);
  const service = services.find((item) => item.slug === slug);
  const consoleId = consoleIdFromRepairSlug(slug);

  if (!cluster || !service || !consoleId) {
    notFound();
  }

  const landing = getConsoleLanding(consoleId);
  const path = `/services/${slug}/price`;
  const repairHref = buildRepairHref({ consoleId });

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <PageShell
        currentPath={path}
        jsonLd={[
          webPageJsonLd({
            name: cluster.priceTitle,
            description: `تعرفه تقریبی ${cluster.pillarTitle}`,
            path,
          }),
          itemListJsonLd({
            name: cluster.priceTitle,
            path,
            items: landing.prices.map((row) => ({
              name: row.title,
              url: row.href,
            })),
          }),
        ]}
        containerClassName="container mx-auto max-w-5xl px-6"
      >
        <h1 className="text-4xl font-black md:text-5xl">{cluster.priceTitle}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          این بازه‌ها تقریبی هستند. هزینه نهایی بعد از عیب‌یابی اعلام می‌شود و
          تا تأیید شما هیچ تعمیری آغاز نمی‌گردد.
        </p>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10">
          <table className="w-full text-start">
            <thead className="bg-white/5 text-sm text-zinc-400">
              <tr>
                <th className="px-5 py-4 font-medium">نوع تعمیر</th>
                <th className="px-5 py-4 font-medium">بازه تقریبی</th>
                <th className="hidden px-5 py-4 font-medium md:table-cell">
                  توضیح
                </th>
              </tr>
            </thead>
            <tbody>
              {landing.prices.map((row) => (
                <tr key={row.href} className="border-t border-white/10">
                  <td className="px-5 py-4">
                    <Link
                      href={row.href}
                      className="font-bold text-white hover:text-cyan-300"
                    >
                      {row.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-cyan-200">
                    {formatLandingPrice(row.range)}
                  </td>
                  <td className="hidden px-5 py-4 text-sm text-zinc-400 md:table-cell">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CtaButtonGroup
          repairHref={repairHref}
          repairLabel="ثبت درخواست تعمیر"
          secondary="tracking"
        />

        <div className="mt-16">
          <TopicClusterNav cluster={cluster} currentHref={path} />
        </div>

        <FaqSection
          className="rounded-3xl py-12"
          items={[
            {
              question: `${cluster.priceTitle} از چقدر شروع می‌شود؟`,
              answer: `بسته به نوع خرابی متفاوت است. ${service.priceRange}. جدول همین صفحه بازه تقریبی هر مورد را نشان می‌دهد.`,
            },
            {
              question: "آیا قبل از تعمیر باید هزینه را تأیید کنم؟",
              answer:
                "بله. بعد از عیب‌یابی هزینه اعلام می‌شود و بدون تأیید شما تعمیر شروع نمی‌شود.",
            },
            {
              question: "عیب‌یابی چقدر طول می‌کشد؟",
              answer:
                "معمولاً همان روز پذیرش یا حداکثر یک روز کاری. سپس وضعیت از صفحه پیگیری تعمیر قابل مشاهده است.",
            },
          ]}
        />
      </PageShell>
    </main>
  );
}
