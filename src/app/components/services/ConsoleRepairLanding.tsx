import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";

import FaqSection from "@/app/components/seo/FaqSection";
import TopicClusterNav from "@/app/components/seo/TopicClusterNav";
import FunnelNextStep from "@/app/components/funnel/FunnelNextStep";
import ServiceImageGallery from "@/app/components/services/ServiceImageGallery";
import { CtaButtonGroup } from "@/app/components/ui/cta";
import RepairFormClient from "@/app/repair/RepairFormClient";
import type { Service } from "@/app/data/services";
import { getThemeForConsole } from "@/lib/brand-theme";
import {
  formatLandingPrice,
  getConsoleLanding,
} from "@/lib/repair/console-landing";
import { buildRepairHref, gameInstallHrefForConsole } from "@/lib/repair-links";
import type { ConsoleId } from "@/lib/console-catalog";
import type { TopicCluster } from "@/lib/seo/topic-clusters";
import { cn } from "@/lib/utils";

type Props = {
  service: Service;
  consoleId: ConsoleId;
  cluster: TopicCluster;
};

export default function ConsoleRepairLanding({
  service,
  consoleId,
  cluster,
}: Props) {
  const landing = getConsoleLanding(consoleId);
  const theme = getThemeForConsole(consoleId);
  const repairHref = buildRepairHref({ consoleId });
  const formPrefill = { consoleId };

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className={`absolute inset-0 bg-linear-to-b ${theme.glow} via-transparent to-transparent`}
        />
        <div className="container mx-auto grid items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div className="relative z-10">
            <p
              className={cn(
                "mb-5 inline-flex items-center rounded-full border px-4 py-2 text-sm",
                theme.border,
                theme.bg,
                theme.primary,
              )}
            >
              تعمیر تخصصی کنسول در تهران
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              {landing.headline}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
              {landing.intro}
            </p>
            <CtaButtonGroup
              repairHref="#repair-request"
              repairLabel="ثبت درخواست تعمیر"
              secondary="tracking"
            />
          </div>
          <div className="relative">
            <div className={`absolute -inset-5 rounded-[40px] ${theme.bg} blur-3xl`} />
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900">
              <Image
                src={service.cover}
                alt={landing.headline}
                width={900}
                height={700}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20" aria-labelledby="problem-picker">
        <h2 id="problem-picker" className="text-3xl font-black md:text-4xl">
          مشکل کنسول شما چیست؟
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-400">
          روی مورد نزدیک به علائم دستگاه بزنید تا راهنمای همان مشکل را ببینید.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {landing.problems.map((problem) => (
            <Link
              key={problem.href}
              href={problem.href}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-cyan-400/40 sm:text-base"
            >
              {problem.label}
            </Link>
          ))}
          <Link
            href={landing.otherHref}
            className="rounded-2xl border border-dashed border-white/20 bg-transparent px-4 py-5 text-center text-sm font-bold text-zinc-300 transition hover:border-cyan-400/40 hover:text-white sm:text-base"
          >
            سایر
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-black md:text-4xl">چرا فیکس‌بازی؟</h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {landing.why.map((item) => (
              <li
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-400">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20" aria-labelledby="price-heading">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="price-heading" className="text-3xl font-black md:text-4xl">
              قیمت تقریبی تعمیرات
            </h2>
            <p className="mt-4 max-w-2xl text-zinc-400">
              قیمت نهایی بعد از عیب‌یابی اعلام می‌شود و بدون تأیید شما تعمیر
              شروع نمی‌شود.
            </p>
          </div>
          <Link
            href={cluster.pages.find((page) => page.kind === "price")?.href ?? "#"}
            className="inline-flex items-center gap-1 text-sm font-bold text-cyan-300"
          >
            صفحه کامل قیمت
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <table className="w-full text-start">
            <thead className="bg-white/5 text-sm text-zinc-400">
              <tr>
                <th className="px-5 py-4 font-medium">نوع تعمیر</th>
                <th className="px-5 py-4 font-medium">بازه تقریبی</th>
                <th className="hidden px-5 py-4 font-medium md:table-cell">توضیح</th>
              </tr>
            </thead>
            <tbody>
              {landing.prices.map((row) => (
                <tr key={row.href} className="border-t border-white/10">
                  <td className="px-5 py-4">
                    <Link href={row.href} className="font-bold text-white hover:text-cyan-300">
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
      </section>

      <ServiceImageGallery
        images={landing.samples.map((sample) => sample.src)}
        title={landing.headline}
        heading="نمونه تعمیرات واقعی"
        subtitle="چند نمونه از تعمیرات انجام‌شده در کارگاه فیکس‌بازی."
      />

      <section className="border-y border-white/10 bg-[#0a0908] py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-black md:text-4xl">مراحل تعمیر</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {landing.steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-3xl border border-white/10 bg-black/40 p-5"
              >
                <span className="text-sm font-black text-cyan-300">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-400">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <TopicClusterNav cluster={cluster} currentHref={cluster.pillarHref} />
      </div>

      <FaqSection items={service.faqs} />

      <section className="container mx-auto px-6 py-20" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="mb-10 text-3xl font-black md:text-4xl">
          نظرات مشتریان
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {landing.testimonials.map((item) => (
            <article
              key={item.name}
              className="rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <p className="leading-8 text-zinc-300">{item.text}</p>
              <p className="mt-6 font-bold text-white">{item.name}</p>
              <p className="text-sm text-zinc-500">مشتری فیکس‌بازی</p>
            </article>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-6 pb-8">
        <FunnelNextStep
          title={`${service.title} در تهران`}
          description="پیک آنلاین دستگاه را از تمام مناطق شهر و استان تهران می‌گیرد. مرکز حضوری در توپخانه است."
          actions={[
            {
              href: `/tehran/${service.slug}`,
              label: `${service.title} در تهران`,
              primary: true,
            },
            {
              href: gameInstallHrefForConsole(consoleId),
              label: `نصب بازی ${service.problemtag}`,
            },
          ]}
        />
      </div>

      <section className="container mx-auto px-6 pb-28">
        <RepairFormClient
          initialPrefill={formPrefill}
          theme={theme}
          variant="embedded"
        />
        <p className="mt-4 text-center text-sm text-zinc-500">
          یا از{" "}
          <Link href={repairHref} className="text-cyan-400">
            صفحه ثبت سفارش
          </Link>{" "}
          ادامه دهید.
        </p>
      </section>
    </>
  );
}
