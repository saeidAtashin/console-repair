import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock3,
  ShieldCheck,
  ChevronLeft,
  BadgeDollarSign,
} from "lucide-react";

import { CtaButtonGroup } from "@/app/components/ui/cta";
import ServiceRelatedProducts from "@/app/components/services/ServiceRelatedProducts";
import ServiceFeaturesGrid from "@/app/components/services/ServiceFeaturesGrid";
import ServiceRepairSteps from "../../components/services/ServiceRepairSteps";
import PageShell from "@/app/components/seo/PageShell";
import FAQSchema from "@/app/components/schema/FAQSchema";
import ServiceSchema from "@/app/components/schema/ServiceSchema";
import { services } from "@/app/data/services";
import { brandThemes } from "../../../lib/brand-theme";
import { buildOrderHref } from "../../../lib/order-links";
import { webPageJsonLd } from "../../../lib/seo/jsonld";
import { createPageMetadata } from "../../../lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return createPageMetadata({
      title: "خدمت یافت نشد",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
    ogImage: service.cover,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) notFound();

  const theme = brandThemes[service.brand];
  const servicePath = `/services/${service.slug}`;
  const orderHref = buildOrderHref({ serviceSlug: service.slug });

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <ServiceSchema
        title={service.title}
        description={service.seoDescription}
        url={servicePath}
      />
      {service.faqs.length > 0 && <FAQSchema items={service.faqs} />}

      <PageShell
        currentPath={servicePath}
        jsonLd={webPageJsonLd({
          name: service.seoTitle,
          description: service.seoDescription,
          path: servicePath,
        })}
        containerClassName="container mx-auto px-6"
      >
        <section className="relative overflow-hidden border-b border-white/10">
          <div
            className={`absolute inset-0 bg-linear-to-b ${theme.glow} via-transparent to-transparent`}
          />

          <div className="container mx-auto grid items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <div className="relative z-10">
              <div
                className={`mb-5 inline-flex items-center rounded-full border px-4 py-2 text-sm ${theme.border} ${theme.bg} ${theme.primary}`}
              >
                {service.categoryTag}
              </div>

              <h1 className="text-4xl font-black leading-tight md:text-6xl">
                {service.title}
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
                {service.longDescription}
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <InfoBox
                  icon={<Clock3 className={theme.primary} />}
                  label="زمان تحویل"
                  value={service.estimatedTime}
                />
                <InfoBox
                  icon={<ShieldCheck className={theme.primary} />}
                  label="ضمانت"
                  value={service.warranty}
                />
                <InfoBox
                  icon={<BadgeDollarSign className={theme.primary} />}
                  label="حدود قیمت"
                  value={service.priceRange}
                />
              </div>

              <CtaButtonGroup
                repairHref={orderHref}
                repairLabel="ثبت سفارش"
                secondary="tracking"
              />
            </div>

            <div className="relative">
              <div
                className={`absolute -inset-5 rounded-[40px] ${theme.bg} blur-3xl`}
              />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900 aspect-[4/3]">
                <Image
                  src={service.cover}
                  alt={service.title}
                  width={900}
                  height={700}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-24">
          <div className="mb-14">
            <h2 className="text-3xl font-black">چرا این خدمت را از ما بگیرید؟</h2>
            <p className="mt-4 max-w-2xl text-zinc-400">
              تولید با تجهیزات CNC حرفه‌ای، قیمت شفاف و کنترل کیفیت.
            </p>
          </div>
          <ServiceFeaturesGrid features={service.features} theme={theme} />
        </section>

        <ServiceRelatedProducts products={service.relatedProducts} />

        <section className="relative overflow-hidden border-y border-orange-500/10 bg-[#0a0908]">
          <div className="container relative mx-auto rounded-2xl border border-orange-200/15 bg-[linear-gradient(135deg,rgba(20,12,9,0.88),rgba(12,10,9,0.72))] px-6 py-5 mt-8 mb-1">
            <h2 className="text-3xl font-black text-orange-50">
              مراحل انجام سفارش
            </h2>
          </div>
          <div className="container relative mx-auto px-0 pb-12">
            <ServiceRepairSteps steps={service.processSteps} />
          </div>
        </section>

        {service.faqs.length > 0 && (
          <section className="border-t border-white/10 bg-zinc-950">
            <div className="container mx-auto px-6 py-24">
              <h2 className="mb-10 text-3xl font-black">سوالات متداول</h2>
              <div className="space-y-4">
                {service.faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group rounded-2xl border border-white/10 bg-black/40 p-6"
                  >
                    <summary className="cursor-pointer font-bold marker:content-none">
                      {faq.question}
                    </summary>
                    <p className="mt-4 leading-8 text-zinc-400">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="pb-28">
          <div className="container mx-auto px-6">
            <div
              className={`relative overflow-hidden rounded-[40px] border px-8 py-16 text-center ${theme.border} ${theme.bg}`}
            >
              <div className="relative z-10">
                <h2 className="text-4xl font-black">آماده ثبت سفارش هستید؟</h2>
                <div className="mt-10 flex justify-center">
                  <Link
                    href={orderHref}
                    className={`flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-black text-black transition hover:scale-105 bg-orange-500 hover:bg-orange-400`}
                  >
                    ثبت سفارش CNC
                    <ChevronLeft size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageShell>
    </main>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 backdrop-blur">
      <div className="mb-3">{icon}</div>
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
