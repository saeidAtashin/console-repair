import Link from "next/link";
import { Palette, Sparkles, Truck, Shield } from "lucide-react";
import ReadyCaseCard from "@/app/components/cases/ReadyCaseCard";
import { getReadyCases } from "@/lib/cases/ready.static";

export default function HomeCasePage() {
  const featured = getReadyCases().slice(0, 4);

  return (
    <main className="min-h-screen bg-background pt-20">
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-semibold text-cyan-400">قاب‌کده — طراحی اختصاصی</p>
          <h1 className="text-3xl font-black leading-tight text-foreground sm:text-5xl">
            قاب موبایل خودت را
            <span className="block text-cyan-400">طراحی کن</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            برند و مدل گوشی‌ات را انتخاب کن، متن و استیکر اضافه کن، پیش‌نمایش ببین و سفارش بده.
            قاب‌های آماده هم داریم!
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-bold text-black shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
            >
              <Palette size={18} />
              شروع طراحی
            </Link>
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-sm font-bold text-foreground transition hover:border-cyan-500/50"
            >
              <Sparkles size={18} />
              قاب‌های آماده
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background/50 px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: Palette, title: "طراحی زنده", desc: "متن و استیکر را لحظه‌ای ببین" },
            { icon: Truck, title: "ارسال سریع", desc: "چاپ با کیفیت و ارسال به سراسر ایران" },
            { icon: Shield, title: "گارانتی", desc: "۷ روز ضمانت بازگشت" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl p-4">
              <Icon size={20} className="mt-0.5 shrink-0 text-cyan-400" />
              <div>
                <p className="font-bold text-foreground">{title}</p>
                <p className="text-sm text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black text-foreground">قاب‌های آماده</h2>
              <p className="mt-1 text-sm text-muted">طراحی‌های از پیش ساخته‌شده</p>
            </div>
            <Link href="/cases" className="text-sm text-cyan-400 hover:underline">
              مشاهده همه
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((product) => (
              <ReadyCaseCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
