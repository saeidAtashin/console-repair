import Link from "next/link";
import { Download, Palette, Sparkles, Type } from "lucide-react";

import VerseSampleCard from "@/app/components/home/VerseSampleCard";
import { CALLIGRAPHY_FONT_OPTIONS } from "@/lib/calligraphy/fonts";
import { EXPORT_PRICES } from "@/lib/calligraphy/pricing";
import {
  FEATURED_VERSE,
  GRID_VERSES,
} from "@/lib/calligraphy/sample-verses";
import { formatToman } from "@/lib/shop/format";

export default function HomeCalligraphyPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-background to-background" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-bold tracking-wide text-cyan-400">
            خوشنویسی آنلاین فارسی
          </p>
          <h1 className="text-4xl font-black leading-tight text-foreground sm:text-5xl md:text-6xl">
            متن فارسی خود را به
            <span className="block text-cyan-400">خوشنویسی تبدیل کنید</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            با صدها فونت عربی و فارسی — پیش‌نمایش رایگان با واترمارک و
            دانلود با کیفیت بالا پس از پرداخت.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/studio"
              className="rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-bold text-black transition hover:bg-cyan-400"
            >
              شروع خوشنویسی
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-border px-8 py-3.5 text-sm font-bold text-foreground transition hover:border-cyan-500/50"
            >
              مشاهده تعرفه‌ها
            </Link>
          </div>

          <div className="mx-auto mt-14 max-w-xl">
            <VerseSampleCard verse={FEATURED_VERSE} variant="featured" />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { icon: Type, title: "فونت‌های متنوع", desc: "کتابخانه بزرگ فونت‌های عربی و فارسی" },
            { icon: Download, title: "دانلود رایگان", desc: "پیش‌نمایش با واترمارک بدون هزینه" },
            { icon: Sparkles, title: "خروجی حرفه‌ای", desc: "PNG و PDF با کیفیت بالا" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl p-4">
              <Icon size={22} className="mt-0.5 shrink-0 text-cyan-400" />
              <div>
                <p className="font-bold text-foreground">{title}</p>
                <p className="text-sm text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-black text-foreground">
              نمونه‌های تک‌بیت
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              از شعر کلاسیک تا رپ و پاپ — ببینید متن فارسی با فونت‌های
              خوشنویسی چطور دیده می‌شود.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GRID_VERSES.map((verse) => (
              <VerseSampleCard key={verse.id} verse={verse} variant="compact" />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/studio"
              className="inline-block rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-400"
            >
              با متن خودت شروع کن
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-black text-foreground">
            فونت‌های موجود
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            بیش از {CALLIGRAPHY_FONT_OPTIONS.length} فونت متنوع در استودیو —
            از خطاطی کلاسیک تا سبک‌های مدرن عربی و فارسی.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {CALLIGRAPHY_FONT_OPTIONS.slice(0, 8).map((font) => (
              <span
                key={font.family}
                className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted"
              >
                {font.label}
              </span>
            ))}
            {CALLIGRAPHY_FONT_OPTIONS.length > 8 ? (
              <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-400">
                +{CALLIGRAPHY_FONT_OPTIONS.length - 8} فونت دیگر
              </span>
            ) : null}
          </div>
          <Link
            href="/studio"
            className="mt-8 inline-block rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-400"
          >
            انتخاب فونت در استودیو
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-card/20 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Palette className="mx-auto h-10 w-10 text-cyan-400" />
          <h2 className="mt-4 text-2xl font-black text-foreground">آماده شروع هستید؟</h2>
          <p className="mt-3 text-muted">
            از {formatToman(0)} برای پیش‌نمایش — HD از {formatToman(EXPORT_PRICES["hd-png"])}
          </p>
          <Link
            href="/studio"
            className="mt-8 inline-block rounded-xl bg-cyan-500 px-10 py-3.5 text-sm font-bold text-black"
          >
            ورود به استودیو
          </Link>
        </div>
      </section>
    </main>
  );
}
