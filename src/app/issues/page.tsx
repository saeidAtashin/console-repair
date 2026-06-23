import Link from "next/link";
import { ChevronLeft, Wrench } from "lucide-react";

import FaqSection from "@/app/components/seo/FaqSection";
import OverviewSection from "@/app/components/seo/OverviewSection";
import PageShell from "@/app/components/seo/PageShell";
import TrustSignalsBar from "@/app/components/seo/TrustSignalsBar";
import { CtaButtonGroup } from "@/app/components/ui/cta";
import { issues } from "@/app/data/issues";
import {
  ISSUES_INDEX_CATEGORIES,
  ISSUES_INDEX_DESCRIPTION,
  ISSUES_INDEX_FAQS,
  ISSUES_INDEX_OVERVIEW,
  ISSUES_INDEX_TRUST_SIGNALS,
} from "@/app/data/issues-index-content";
import { collectionPageJsonLd, itemListJsonLd } from "../../lib/seo/jsonld";
import { createPageMetadata } from "../../lib/seo/metadata";

const PATH = "/issues";
const TITLE = "راهنمای مشکلات رایج کنسول بازی";

export const metadata = createPageMetadata({
  title: TITLE,
  description: ISSUES_INDEX_DESCRIPTION,
  path: PATH,
  keywords: [
    "مشکلات ps5",
    "مشکلات ps4",
    "تعمیر hdmi",
    "روشن نشدن ps5",
    "داغ شدن ps5",
    "drift دسته",
  ],
});

export default function IssuesIndexPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 text-white">
      <PageShell
        currentPath={PATH}
        jsonLd={[
          collectionPageJsonLd({
            name: TITLE,
            description: ISSUES_INDEX_DESCRIPTION,
            path: PATH,
          }),
          itemListJsonLd({
            name: TITLE,
            path: PATH,
            items: issues.map((i) => ({
              name: i.title,
              url: `/issues/${i.slug}`,
            })),
          }),
        ]}
        containerClassName="container mx-auto max-w-5xl px-6"
        className="container mx-auto max-w-5xl px-6 pb-12"
      >
        <div className="mb-10 flex items-center gap-3 text-cyan-400">
          <Wrench className="h-6 w-6" />
          <span className="text-sm font-semibold tracking-wide">
            راهنمای فنی
          </span>
        </div>

        <h1 className="text-4xl font-black md:text-5xl">
          مشکلات رایج کنسول بازی
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          علائم، علت احتمالی و راه‌حل تخصصی هر مشکل را بخوانید.
        </p>

        {ISSUES_INDEX_CATEGORIES.map((category) => {
          const categoryIssues = issues.filter((issue) =>
            issue.slug.startsWith(category.prefix),
          );
          if (categoryIssues.length === 0) return null;

          return (
            <section
              key={category.id}
              className="mt-14"
              aria-labelledby={`category-${category.id}`}
            >
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <h2
                  id={`category-${category.id}`}
                  className="text-2xl font-black"
                >
                  {category.title}
                </h2>
                <Link
                  href={category.href}
                  className="text-sm text-cyan-400 transition hover:text-cyan-300"
                >
                  مشاهده خدمات تعمیر
                  <ChevronLeft className="mr-1 inline h-4 w-4" />
                </Link>
              </div>

              <ul className="space-y-4">
                {categoryIssues.map((issue) => (
                  <li key={issue.slug}>
                    <Link
                      href={`/issues/${issue.slug}`}
                      className="block rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-cyan-500/50"
                    >
                      <h3 className="text-xl font-bold">{issue.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                        {issue.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm text-cyan-400">
                        مطالعه راهنما
                        <ChevronLeft className="h-4 w-4" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <OverviewSection
          title="راهنمای جامع عیب‌یابی کنسول"
          paragraphs={ISSUES_INDEX_OVERVIEW}
          className="py-16"
        />

        <TrustSignalsBar signals={ISSUES_INDEX_TRUST_SIGNALS} />

        <FaqSection items={ISSUES_INDEX_FAQS} />

        <section className="border-t border-zinc-800 py-16">
          <div className="rounded-[32px] border border-cyan-500/20 bg-cyan-500/5 px-8 py-12 text-center">
            <h2 className="text-3xl font-black">مشکل شما در لیست نبود؟</h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              همچنان می‌توانید درخواست تعمیر ثبت کنید و مشکل را شرح دهید.
            </p>
            <div className="mt-8 flex justify-center">
              <CtaButtonGroup repairLabel="ثبت سفارش تعمیر" secondary="tracking" />
            </div>
          </div>
        </section>
      </PageShell>
    </main>
  );
}
