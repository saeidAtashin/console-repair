import Link from "next/link";

const quickLinks = [
  { title: "خانه", href: "/" },
  { title: "خدمات", href: "/services/ps4-repair" },
  { title: "پیگیری سفارش", href: "/tracking" },
  { title: "بلاگ", href: "/blog/controller-repair" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">کنسول ریپیر</p>
            <p className="text-sm leading-7 text-zinc-400">
              مرکز تخصصی تعمیرات پلی استیشن، ایکس باکس و دسته بازی با پشتیبانی
              سریع.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-cyan-400">دسترسی سریع</p>
            <div className="flex flex-wrap gap-3">
              {quickLinks.map((link) => (
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
            <p className="text-sm text-zinc-400">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
            <p className="text-sm text-zinc-400">
              آدرس: تهران، خیابان مثال، پلاک ۲۴
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-zinc-500">
          {`© ${year} Console Repair. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
