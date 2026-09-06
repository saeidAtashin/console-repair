import Link from "next/link";
import { MapPin, Truck } from "lucide-react";

import FaqSection from "@/app/components/seo/FaqSection";
import OverviewSection from "@/app/components/seo/OverviewSection";
import PageShell from "@/app/components/seo/PageShell";
import TrustSignalsBar from "@/app/components/seo/TrustSignalsBar";
import { CtaButtonGroup } from "@/app/components/ui/cta";
import { services } from "@/app/data/services";
import {
  TEHRAN_DISTRICTS,
  TEHRAN_PATH,
  TEHRAN_PROVINCE_CITIES,
  TEHRAN_SERVICE_SLUGS,
  tehranHub,
  tehranPagePath,
  tehranPages,
} from "@/lib/locations/tehran";
import { SITE_ADDRESS_DISPLAY } from "@/lib/seo/site";
import {
  collectionPageJsonLd,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo/jsonld";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: tehranHub.seoTitle,
  description: tehranHub.seoDescription,
  path: TEHRAN_PATH,
  keywords: tehranHub.keywords,
});

export default function TehranHubPage() {
  const locationServices = TEHRAN_SERVICE_SLUGS.flatMap((slug) => {
    const location = tehranPages[slug];
    const service = services.find((item) => item.slug === slug);
    return service ? [{ location, service }] : [];
  });

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <PageShell
        currentPath={TEHRAN_PATH}
        jsonLd={[
          webPageJsonLd({
            name: tehranHub.seoTitle,
            description: tehranHub.seoDescription,
            path: TEHRAN_PATH,
          }),
          collectionPageJsonLd({
            name: tehranHub.title,
            description: tehranHub.seoDescription,
            path: TEHRAN_PATH,
          }),
          itemListJsonLd({
            name: tehranHub.title,
            path: TEHRAN_PATH,
            items: locationServices.map(({ location }) => ({
              name: location.title,
              url: tehranPagePath(location.slug),
            })),
          }),
        ]}
        containerClassName="container mx-auto px-6"
        className="container mx-auto px-6 pb-12"
      >
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
          <MapPin size={16} aria-hidden />
          {SITE_ADDRESS_DISPLAY}
        </p>
        <h1 className="text-4xl font-black md:text-5xl">{tehranHub.headline}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
          {tehranHub.lead}
        </p>

        <CtaButtonGroup
          repairHref="/repair"
          repairLabel="ثبت تعمیر"
          secondary="consult"
        />

        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/50 p-5 text-sm leading-7 text-zinc-300">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" aria-hidden />
          <p>
            پیک آنلاین برای دریافت و پیگیری در تمام مناطق شهر تهران و استان
            تهران فعال است. اگر نزدیک مرکز شهر هستید، مراجعه حضوری به توپخانه هم
            ممکن است.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {locationServices.map(({ location, service }) => {
            const Icon = service.icon;
            return (
              <Link
                key={location.slug}
                href={tehranPagePath(location.slug)}
                className="group rounded-3xl border border-white/10 bg-zinc-900/60 p-6 transition hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <Icon className="mb-4 h-8 w-8 text-cyan-400" aria-hidden />
                <h2 className="text-xl font-black">{location.title}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {location.lead}
                </p>
                <span className="mt-5 inline-block text-sm font-bold text-cyan-400">
                  مشاهده جزئیات
                </span>
              </Link>
            );
          })}
        </div>
      </PageShell>

      <OverviewSection
        title="تعمیر کنسول برای ساکنان تهران"
        paragraphs={tehranHub.overview}
        className="py-16"
      />

      <TrustSignalsBar signals={tehranHub.trustSignals} className="py-12" />

      <section className="border-t border-white/10 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-black">محدوده پوشش پیک</h2>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
            {tehranHub.coverageNote}
          </p>
          <h3 className="mt-10 text-lg font-bold text-white">مناطق شهر تهران</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {TEHRAN_DISTRICTS.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/10 bg-zinc-900/70 px-3 py-1.5 text-sm text-zinc-300"
              >
                {name}
              </span>
            ))}
          </div>
          <h3 className="mt-10 text-lg font-bold text-white">
            شهرستان‌های استان تهران
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {TEHRAN_PROVINCE_CITIES.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/10 bg-zinc-900/70 px-3 py-1.5 text-sm text-zinc-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <FaqSection items={tehranHub.faqs} />
    </main>
  );
}
