import Link from "next/link";
import type { ConsoleId } from "@/lib/console-catalog";

import FaqSection from "@/app/components/seo/FaqSection";
import OverviewSection from "@/app/components/seo/OverviewSection";
import TrustSignalsBar from "@/app/components/seo/TrustSignalsBar";
import { getRepairContent } from "@/lib/seo/repair-content";
import { howToJsonLd } from "@/lib/seo/howto-jsonld";

type Props = {
  consoleId?: ConsoleId;
};

export default function RepairPageContent({ consoleId }: Props) {
  const content = getRepairContent(consoleId);

  return (
    <div className="mt-16 border-t border-white/10">
      <OverviewSection
        title="راهنمای ثبت سفارش تعمیر"
        paragraphs={content.overview}
        className="py-16"
      />

      <section
        className="border-t border-white/10 py-16"
        aria-labelledby="repair-process-title"
      >
        <div className="px-0">
          <h2 id="repair-process-title" className="mb-8 text-2xl font-black">
            مراحل تعمیر از ثبت تا تحویل
          </h2>
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {content.processSteps.map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <span className="mb-2 block font-mono text-sm text-cyan-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-semibold leading-7">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <TrustSignalsBar signals={content.trustSignals} />

      <FaqSection items={content.faqs} className="py-16" />

      <section className="border-t border-white/10 py-12">
        <h2 className="mb-6 text-xl font-black">لینک‌های مفید</h2>
        <nav className="flex flex-wrap gap-3" aria-label="لینک‌های مرتبط">
          <Link
            href="/services"
            className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-cyan-400/40"
          >
            همه خدمات
          </Link>
          <Link
            href="/services/ps5-repair"
            className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-cyan-400/40"
          >
            تعمیر PS5
          </Link>
          <Link
            href="/services/ps4-repair"
            className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-cyan-400/40"
          >
            تعمیر PS4
          </Link>
          <Link
            href="/services/xbox-repair"
            className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-cyan-400/40"
          >
            تعمیر Xbox
          </Link>
          <Link
            href="/tracking"
            className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-cyan-400/40"
          >
            پیگیری تعمیر
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-cyan-400/40"
          >
            تماس با ما
          </Link>
        </nav>
      </section>
    </div>
  );
}

export function repairContentJsonLd(consoleId?: ConsoleId) {
  const content = getRepairContent(consoleId);
  return howToJsonLd({
    name: "مراحل ثبت و تعمیر کنسول",
    description: content.overview[0],
    path: consoleId ? `/repair?console=${consoleId}` : "/repair",
    steps: content.processSteps,
  });
}
