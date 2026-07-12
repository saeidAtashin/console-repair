import Link from "next/link";
import { footerInfoLinks, footerQuickLinks } from "@/lib/site-nav";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">قاب‌کده</p>
            <p className="text-sm leading-7 text-zinc-400">
              طراحی و فروش قاب موبایل اختصاصی با چاپ با کیفیت و ارسال سریع.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-cyan-400">دسترسی سریع</p>
            <div className="flex flex-wrap gap-3">
              {footerQuickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-cyan-400/50 hover:text-white"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-cyan-400">اطلاعات</p>
            <div className="flex flex-wrap gap-3">
              {footerInfoLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-cyan-400/50 hover:text-white"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-cyan-400">ارتباط</p>
            <p className="text-sm text-zinc-400">تلفن: ۰۹۱۰۷۷۰۱۷۰۴</p>
            <p className="text-sm text-zinc-400">تهران، ایران</p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-600">
          © {year} قاب‌کده — تمامی حقوق محفوظ است
        </p>
      </div>
    </footer>
  );
}
