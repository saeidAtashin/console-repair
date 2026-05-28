import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  Search,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Timer,
  Gauge,
} from "lucide-react";

import PageShell from "@/app/components/seo/PageShell";
import JsonLd from "@/app/components/seo/JsonLd";
import { issues } from "@/app/data/issues";
import {
  buildRepairHref,
  consoleIdFromIssueSlug,
} from "../../../lib/repair-links";
import { createPageMetadata } from "../../../lib/seo/metadata";
import { absoluteUrl, SITE_NAME } from "../../../lib/seo/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return issues.map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const issue = issues.find((i) => i.slug === slug);

  if (!issue) {
    return createPageMetadata({
      title: "مشکل یافت نشد",
      path: `/issues/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: issue.seoTitle ?? issue.title,
    description: issue.seoDescription ?? issue.description,
    path: `/issues/${issue.slug}`,
    type: "article",
    ogImage: issue.image,
  });
}

export default async function IssuePage({ params }: Props) {
  const { slug } = await params;
  const issue = issues.find((i) => i.slug === slug);

  if (!issue) notFound();

  const issuePath = `/issues/${issue.slug}`;
  const consoleId = consoleIdFromIssueSlug(issue.slug);
  const repairHref = buildRepairHref({
    consoleId,
    issue: issue.title,
  });
  const related =
    issue.relatedIssues?.map((s) => issues.find((i) => i.slug === s)) ?? [];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: issue.seoTitle ?? issue.title,
    description: issue.seoDescription ?? issue.description,
    url: absoluteUrl(issuePath),
    inLanguage: "fa-IR",
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    image: issue.image ? absoluteUrl(issue.image) : undefined,
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 text-white">
      <JsonLd data={articleSchema} />

      <PageShell
        currentPath={issuePath}
        containerClassName="container mx-auto max-w-5xl px-6"
      >
        <section className="relative overflow-hidden border-b border-zinc-800">
          <div className="absolute inset-0">
            <Image
              src={issue.image || "/images/Ps5-Parts-1-scaled.webp"}
              alt={issue.title}
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-zinc-950" />
          </div>

          <div className="relative mx-auto max-w-5xl px-6 py-20">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-500">
              <Wrench size={16} />
              راهنمای فنی
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl xl:text-7xl">
              {issue.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
              {issue.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-zinc-300">
              {issue.difficulty && (
                <span className="flex items-center gap-2">
                  <Gauge size={16} /> سختی: {issue.difficulty}
                </span>
              )}
              {issue.repairTime && (
                <span className="flex items-center gap-2">
                  <Timer size={16} /> زمان تعمیر: {issue.repairTime}
                </span>
              )}
              {issue.costLevel && (
                <span className="flex items-center gap-2">
                  هزینه: {issue.costLevel}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-24 px-6 py-20">
          <div className="grid gap-10 md:grid-cols-2">
            <section>
              <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold">
                <AlertTriangle className="text-red-400" />
                علائم خرابی
              </h2>
              <ul className="space-y-4">
                {issue.symptoms.map((item, i) => (
                  <li
                    key={i}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 text-zinc-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold">
                <Search className="text-yellow-400" />
                دلایل احتمالی
              </h2>
              <ul className="space-y-4">
                {issue.causes.map((cause, i) => (
                  <li
                    key={i}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-zinc-300"
                  >
                    {cause}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 md:p-14">
            <h2 className="mb-8 flex items-center gap-3 text-3xl font-extrabold text-blue-400">
              <Wrench />
              راه حل تخصصی
            </h2>
            <div className="text-lg leading-9 text-zinc-300">
              {issue.solution}
            </div>
          </section>

          {issue.prevention.length > 0 && (
            <section>
              <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold">
                <ShieldCheck className="text-green-400" />
                روش‌های پیشگیری
              </h2>
              <ul className="space-y-4">
                {issue.prevention.map((item, i) => (
                  <li
                    key={i}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 text-zinc-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {related.length > 0 && (
            <section>
              <h2 className="mb-8 text-2xl font-bold">مشکلات مرتبط</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {related.map(
                  (item) =>
                    item && (
                      <Link
                        key={item.slug}
                        href={`/issues/${item.slug}`}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-blue-500"
                      >
                        <h3 className="mb-2 font-bold">{item.title}</h3>
                        <p className="line-clamp-2 text-sm text-zinc-400">
                          {item.description}
                        </p>
                      </Link>
                    ),
                )}
              </div>
            </section>
          )}

          <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-12 text-center md:p-16">
            <h3 className="mb-6 text-3xl font-extrabold md:text-4xl">
              آیا کنسول شما نیاز به تعمیر دارد؟
            </h3>
            <p className="mx-auto mb-10 max-w-xl text-lg text-blue-100">
              درخواست مشاوره رایگان ثبت کنید تا کارشناسان ما مشکل دستگاه شما را
              بررسی کنند.
            </p>
            <Link
              href={repairHref}
              className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-bold text-blue-700 transition hover:scale-105"
            >
              شروع درخواست تعمیر
              <ArrowRight />
            </Link>
          </section>
        </div>
      </PageShell>
    </main>
  );
}
