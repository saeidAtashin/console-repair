import Link from "next/link";
import { Wrench, Cpu, Gamepad2, ArrowLeft } from "lucide-react";

const SERVICE_LINKS = [
  {
    title: "تعمیر کنسول",
    description: "عیب یابی تخصصی PS4، PS5 و Xbox",
    href: "/services",
    icon: Wrench,
  },
  {
    title: "نصب بازی",
    description: "آرشیو بازی برای پلی استیشن و ایکس باکس",
    href: "/services/game-install/ps5",
    icon: Gamepad2,
  },
  {
    title: "فروش قطعات",
    description: "قطعات اورجینال و سازگار برای کنسول ها",
    href: "/shop/ps5/parts",
    icon: Cpu,
  },
] as const;

export default function ShopServicesSection() {
  return (
    <section className="mt-20">
      <div className="mb-6">
        <h2 className="text-3xl font-black md:text-4xl">خدمات مکمل فروشگاه</h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          بعد از خرید کنسول، خدمات نصب بازی، تعمیر و تامین قطعات را هم از همینجا
          دریافت کنید.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {SERVICE_LINKS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-3xl border border-white/10 bg-zinc-900/50 p-6 transition hover:-translate-y-1 hover:border-cyan-400/30"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-400">{item.description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400">
              مشاهده
              <ArrowLeft className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
