import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";

import FaqSection from "@/app/components/seo/FaqSection";
import OverviewSection from "@/app/components/seo/OverviewSection";
import PageShell from "@/app/components/seo/PageShell";
import ServiceSchema from "@/app/components/schema/ServiceSchema";
import FunnelNextStep from "@/app/components/funnel/FunnelNextStep";
import ServiceCommonIssues from "@/app/components/services/ServiceCommonIssues";
import { CtaButtonGroup } from "@/app/components/ui/cta";
import { services } from "@/app/data/services";
import { brandThemes } from "@/lib/brand-theme";
import {
  TEHRAN_PATH,
  TEHRAN_SERVICE_SLUGS,
  getTehranPage,
  tehranPagePath,
} from "@/lib/locations/tehran";
import {
  buildRepairHref,
  consoleIdFromRepairSlug,
} from "@/lib/repair-links";
import { SITE_ADDRESS_DISPLAY } from "@/lib/seo/site";
import { webPageJsonLd } from "@/lib/seo/jsonld";
import { createPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return TEHRAN_SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const location = getTehranPage(slug);

  if (!location) {
    return createPageMetadata({
      title: "صفحه یافت نشد",
      path: `${TEHRAN_PATH}/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: location.seoTitle,
    description: location.seoDescription,
    path: tehranPagePath(location.slug),
    keywords: location.keywords,
  });
}

export default async function TehranServicePage({ params }: Props) {
  const { slug } = await params;
  const location = getTehranPage(slug);
  const service = services.find((item) => item.slug === slug);

  if (!location || !service) notFound();

  const path = tehranPagePath(location.slug);
  const theme = brandThemes[service.brand];
  const consoleId = consoleIdFromRepairSlug(service.slug);
  const repairHref = buildRepairHref(consoleId ? { consoleId } : undefined);

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <ServiceSchema
        title={location.title}
        description={location.seoDescription}
        url={path}
      />

      <PageShell
        currentPath={path}
        jsonLd={webPageJsonLd({
          name: location.seoTitle,
          description: location.seoDescription,
          path,
        })}
        containerClassName="container mx-auto px-6"
      >
        <section className="relative overflow-hidden border-b border-white/10">
          <div
            className={`absolute inset-0 bg-linear-to-b ${theme.glow} via-transparent to-transparent`}
          />
          <div className="container mx-auto grid items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <div className="relative z-10">
              <p
                className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${theme.border} ${theme.bg} ${theme.primary}`}
              >
                <MapPin size={16} aria-hidden />
                {SITE_ADDRESS_DISPLAY}
              </p>
              <h1 className="text-4xl font-black leading-tight md:text-6xl">
                {location.headline}
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
                {location.lead}
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {location.highlights.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <CtaButtonGroup
                repairHref={repairHref}
                repairLabel="ثبت تعمیر"
                secondary="consult"
              />
            </div>
            <div className="relative">
              <div
                className={`absolute -inset-5 rounded-[40px] ${theme.bg} blur-3xl`}
              />
              <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-zinc-900">
                <Image
                  src={service.cover}
                  alt={location.title}
                  width={900}
                  height={700}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <OverviewSection
          title={`${location.title} با پیک و مراجعه حضوری`}
          paragraphs={location.overview}
          className="py-16"
        />

        <ServiceCommonIssues issues={service.commonIssues} />

        <div className="container mx-auto px-6 py-8">
          <FunnelNextStep
            title="جزئیات فنی این تعمیر"
            description="مراحل، قطعات و مشکلات رایج روی صفحه خدمت سراسری آمده؛ این صفحه مخصوص دریافت و تحویل در تهران است."
            actions={[
              {
                href: `/services/${service.slug}`,
                label: service.title,
                primary: true,
              },
              {
                href: TEHRAN_PATH,
                label: "همه تعمیرها در تهران",
              },
            ]}
          />
        </div>

        <FaqSection items={location.faqs} />

        <section className="pb-28">
          <div className="container mx-auto px-6">
            <div
              className={`relative overflow-hidden rounded-[40px] border px-8 py-16 text-center ${theme.border} ${theme.bg}`}
            >
              <h2 className="text-3xl font-black md:text-4xl">
                پیک را برای {location.title.replace(" در تهران", "")} هماهنگ کنیم؟
              </h2>
              <div className="mt-10 flex justify-center">
                <Link
                  href={repairHref}
                  className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-8 py-4 text-lg font-black text-black transition hover:scale-105"
                >
                  ثبت تعمیر
                  <ChevronLeft size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageShell>
    </main>
  );
}
