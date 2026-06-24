"use client";

import Link from "next/link";
import type { ConsoleId } from "@/lib/console-catalog";
import { cn } from "@/lib/utils";

import FaqSection from "@/app/components/seo/FaqSection";
import OverviewSection from "@/app/components/seo/OverviewSection";
import TrustSignalsBar from "@/app/components/seo/TrustSignalsBar";
import { getRepairContent } from "@/lib/seo/repair-content";
import { useRepairTheme } from "./RepairThemeContext";

type Props = {
  consoleId?: ConsoleId;
};

const RELATED_LINKS = [
  { href: "/services", label: "همه خدمات" },
  { href: "/services/ps5-repair", label: "تعمیر PS5" },
  { href: "/services/ps4-repair", label: "تعمیر PS4" },
  { href: "/services/xbox-repair", label: "تعمیر Xbox" },
  { href: "/tracking", label: "پیگیری تعمیر" },
  { href: "/contact", label: "تماس با ما" },
] as const;

export default function RepairPageContent({ consoleId }: Props) {
  const theme = useRepairTheme();
  const content = getRepairContent(consoleId);

  return (
    <div className={cn("relative mt-16 border-t transition-colors duration-700", theme.border)}>
      <div
        className={cn(
          "pointer-events-none absolute -top-20 left-1/2 h-56 w-[30rem] max-w-[90vw] -translate-x-1/2 rounded-full blur-3xl opacity-20 transition-[background] duration-700",
          theme.ambient,
        )}
        aria-hidden
      />
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
                <span
                  className={cn("mb-2 block font-mono text-sm", theme.primary)}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-semibold leading-7">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <TrustSignalsBar
        signals={content.trustSignals}
        iconClassName={theme.primary}
      />

      <FaqSection items={content.faqs} className="py-16" />

      <section className="border-t border-white/10 py-12">
        <h2 className="mb-6 text-xl font-black">لینک‌های مفید</h2>
        <nav className="flex flex-wrap gap-3" aria-label="لینک‌های مرتبط">
          {RELATED_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full border border-white/10 px-4 py-2 text-sm transition",
                theme.borderHover,
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}
