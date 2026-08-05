import Link from "next/link";

import JsonLd from "@/app/components/seo/JsonLd";
import PageShell from "@/app/components/seo/PageShell";
import {
  EXPORT_PRICES,
  getExportTierDescription,
} from "@/lib/calligraphy/pricing";
import { CALLIGRAPHY_FONT_OPTIONS } from "@/lib/calligraphy/fonts";
import { createPageMetadata } from "@/lib/seo/metadata";
import { faqPageJsonLd } from "@/lib/seo/jsonld";
import { formatToman } from "@/lib/shop/format";

const PATH = "/pricing";
const TITLE = "تعرفه‌ها";

export const metadata = createPageMetadata({
  title: TITLE,
  description: "تعرفه دانلود خوشنویسی — پیش‌نمایش رایگان، PNG با کیفیت بالا و PDF",
  path: PATH,
  keywords: ["تعرفه خوشنویسی", "دانلود فونت نستعلیق", "خوشنویسی آنلاین"],
});

const tiers = [
  { key: "free" as const, price: 0, label: "پیش‌نمایش رایگان" },
  { key: "hd-png" as const, price: EXPORT_PRICES["hd-png"], label: "PNG با کیفیت بالا" },
  { key: "pdf" as const, price: EXPORT_PRICES.pdf, label: "فایل PDF" },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background pt-24 text-foreground">
      <JsonLd
        data={faqPageJsonLd(
          tiers.map((t) => ({
            question: t.label,
            answer: getExportTierDescription(t.key),
          })),
        )}
      />
      <PageShell currentPath={PATH} className="container mx-auto px-6 pb-14">
        <h1 className="text-4xl font-black md:text-5xl">{TITLE}</h1>
        <p className="mt-4 max-w-2xl text-muted">
          پیش‌نمایش با واترمارک کاملاً رایگان است. برای خروجی حرفه‌ای بدون واترمارک
          یکی از بسته‌های زیر را انتخاب کنید.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <article
              key={tier.key}
              className={`rounded-2xl border p-6 ${
                tier.key === "hd-png"
                  ? "border-cyan-500 bg-cyan-500/5"
                  : "border-border bg-card/40"
              }`}
            >
              <h2 className="text-lg font-black text-foreground">{tier.label}</h2>
              <p className="mt-4 text-3xl font-black text-cyan-400">
                {tier.price === 0 ? "رایگان" : formatToman(tier.price)}
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">
                {getExportTierDescription(tier.key)}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-border bg-card/40 p-6">
          <h2 className="text-lg font-bold text-foreground">فونت‌ها</h2>
          <p className="mt-2 text-sm text-muted">
            تمام فونت‌های استودیو ({CALLIGRAPHY_FONT_OPTIONS.length} فونت) بدون
            هزینه اضافی در خروجی‌های پولی در دسترس هستند.
          </p>
        </section>

        <div className="mt-10">
          <Link
            href="/studio"
            className="inline-block rounded-xl bg-cyan-500 px-8 py-3 text-sm font-bold text-black"
          >
            شروع در استودیو
          </Link>
        </div>
      </PageShell>
    </main>
  );
}
