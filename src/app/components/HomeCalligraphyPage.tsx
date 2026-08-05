import Link from "next/link";
import { Download, Palette, Sparkles, Type } from "lucide-react";

import { CALLIGRAPHY_FONT_OPTIONS } from "@/lib/calligraphy/fonts";
import { EXPORT_PRICES } from "@/lib/calligraphy/pricing";
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
            با فونت‌های نستعلیق، نسخ و خطاطی — پیش‌نمایش رایگان با واترمارک و
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
        </div>
      </section>

      <section className="border-y border-border bg-card/30 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { icon: Type, title: "فونت‌های خوشنویسی", desc: "نستعلیق، نسخ و خطاطی تزئینی" },
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
          <h2 className="text-center text-2xl font-black text-foreground">
            فونت‌های موجود
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CALLIGRAPHY_FONT_OPTIONS.map((font) => (
              <div
                key={font.family}
                className="rounded-2xl border border-border bg-card/60 p-5 text-center"
              >
                <p className="text-2xl font-bold text-foreground" style={{ fontFamily: font.label }}>
                  {font.label}
                </p>
                <p className="mt-1 text-sm text-muted">{font.style}</p>
                {font.tier === "premium" ? (
                  <span className="mt-2 inline-block rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">
                    ویژه
                  </span>
                ) : (
                  <span className="mt-2 inline-block text-xs text-emerald-400">رایگان</span>
                )}
              </div>
            ))}
          </div>
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
