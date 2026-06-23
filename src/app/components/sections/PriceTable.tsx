"use client";

import FadeUp from "@/app/components/animations/FadeUp";
import {
  formatRangeToman,
  HOME_GAME_INSTALL_DISCOUNTED,
  type HomeGameInstallTab,
  type PriceRange,
} from "@/lib/game-install-pricing";
import { brandThemes, type Brand } from "@/lib/brand-theme";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  Flame,
  Gamepad2,
  Layers,
  ShieldCheck,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Ps4Icon from "../../../../public/icons/ps4.svg";
import Ps5Icon from "../../../../public/icons/ps5.svg";
import XboxIcon from "../../../../public/icons/xbox.svg";


const CONSOLE_TABS = [
  {
    id: "ps4" as const,
    label: "PS4",
    sublabel: "PlayStation 4",
    iconSrc: Ps4Icon,
    href: "/services/game-install/ps4",
    brand: "playstation" as Brand,
  },
  {
    id: "ps5" as const,
    label: "PS5",
    sublabel: "PlayStation 5",
    iconSrc: Ps5Icon,
    href: "/services/game-install/ps5",
    brand: "playstation" as Brand,
  },
  {
    id: "xbox" as const,
    label: "Xbox",
    sublabel: "Series X|S",
    iconSrc: XboxIcon,
    href: "/services/game-install/xbox-series",
    brand: "xbox" as Brand,
  },
];

const TRUST_SIGNALS = [
  { icon: Zap, label: "نصب سریع" },
  { icon: ShieldCheck, label: "ضمانت سرویس" },
  { icon: Timer, label: "تحویل همان روز" },
] as const;

function calcDiscountPercent(current: PriceRange, previous: PriceRange): number {
  const currentMid = (current.min + current.max) / 2;
  const previousMid = (previous.min + previous.max) / 2;
  if (previousMid <= 0) return 0;
  return Math.max(0, Math.round(((previousMid - currentMid) / previousMid) * 100));
}

function highlightIcon(title: string, index: number) {
  if (title.includes("پکیج")) return Layers;
  if (index === 0) return Gamepad2;
  return Sparkles;
}

const PriceTable = () => {
  const [activeTab, setActiveTab] = useState<HomeGameInstallTab>("ps5");
  const prefersReducedMotion = useReducedMotion();

  const activeTabMeta = CONSOLE_TABS.find((tab) => tab.id === activeTab)!;
  const theme = brandThemes[activeTabMeta.brand];

  const activeData = useMemo(
    () => HOME_GAME_INSTALL_DISCOUNTED[activeTab],
    [activeTab],
  );
  const activeHref = activeData.href;

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: "easeOut" as const };

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:48px_48px]" />
      <div
        className={`pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl ${theme.glow} bg-gradient-to-b opacity-40`}
      />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="mb-10 text-center sm:mb-14">
            <span
              className={`mb-4 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold backdrop-blur-xl ${theme.border} ${theme.bg} ${theme.primary}`}
            >
              <Flame className="h-4 w-4" aria-hidden />
              پیشنهاد ویژه نصب بازی
            </span>

            <h2 className="mb-5 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
              بازی‌های محبوب را با
              <span className="mt-2 block bg-[linear-gradient(90deg,#60a5fa,#22d3ee,#a78bfa,#60a5fa)] bg-[length:220%_220%] bg-clip-text text-transparent animate-gradient-x">
                قیمت گیمرها بگیر
              </span>
            </h2>

            <p className="mx-auto max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
              تعرفه شفاف، تخفیف محدود و نصب تخصصی روی PS4، PS5 و Xbox — بدون
              دردسر، آماده بازی.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-4 shadow-[0_0_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div
                className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden"
                role="tablist"
                aria-label="انتخاب کنسول"
              >
                {CONSOLE_TABS.map((tab) => {
                  const isActive = tab.id === activeTab;
                  const tabTheme = brandThemes[tab.brand];

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative shrink-0 snap-start overflow-hidden rounded-2xl border px-4 py-3 text-right transition-all duration-300 cursor-pointer sm:min-w-[148px] sm:px-5 ${isActive
                        ? `${tabTheme.border} ${tabTheme.bg} shadow-[0_0_24px_rgba(56,189,248,0.15)]`
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                        }`}
                    >
                      <span className="flex items-center gap-2.5 text-white">
                        <Image
                          src={tab.iconSrc}
                          alt=""
                          width={26}
                          height={26}
                          aria-hidden
                          className={`shrink-0 object-contain transition-opacity ${isActive
                            ? "opacity-100 text-white"
                            : "opacity-70 group-hover:opacity-90 text-white"
                            }`}
                        />
                        <span className="min-w-0 text-right">
                          <span
                            className={`block text-base font-black tracking-wide ${isActive ? tabTheme.primary : "text-white"
                              }`}
                          >
                            {tab.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-zinc-500 group-hover:text-zinc-400">
                            {tab.sublabel}
                          </span>
                        </span>
                      </span>
                      {isActive ? (
                        <span
                          className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-current to-transparent ${tabTheme.primary}`}
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  مشاوره رایگان
                </Link>
                <Link
                  href={activeHref ?? "/services/game-install/ps5"}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r px-5 py-3 text-sm font-black text-black shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:brightness-110 ${activeTabMeta.brand === "xbox"
                    ? "from-green-400 to-emerald-500"
                    : "from-cyan-400 to-blue-500"
                    }`}
                >
                  مشاهده تعرفه کامل
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={panelTransition}
                className="mt-6"
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border p-5 md:p-6 ${theme.border} ${theme.bg}`}
                >
                  <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
                  <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-xl font-black text-white sm:text-2xl">
                        {activeData.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-zinc-300 sm:text-base">
                        {activeData.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-semibold text-zinc-300"
                        >
                          <Icon className={`h-3.5 w-3.5 ${theme.primary}`} aria-hidden />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 xl:grid-cols-4">
                  {activeData.highlights.map((item, index) => {
                    const Icon = highlightIcon(item.title, index);
                    const discount = calcDiscountPercent(
                      item.current,
                      item.previous,
                    );
                    const isFeatured = index === 1;

                    return (
                      <motion.article
                        key={item.title}
                        initial={
                          prefersReducedMotion ? false : { opacity: 0, y: 16 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          ...panelTransition,
                          delay: prefersReducedMotion ? 0 : index * 0.06,
                        }}
                        className={`group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-2xl border bg-black/35 p-5 transition-all duration-300 hover:-translate-y-1 sm:min-h-[230px] sm:p-6 ${isFeatured
                          ? `${theme.border} shadow-[0_0_30px_rgba(34,211,238,0.12)]`
                          : "border-white/10 hover:border-white/20"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${theme.border} ${theme.bg}`}
                          >
                            <Icon className={`h-5 w-5 ${theme.primary}`} aria-hidden />
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1.5">
                            {discount > 0 ? (
                              <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-black text-red-300 ring-1 ring-red-400/30">
                                {discount}% تخفیف
                              </span>
                            ) : null}
                            {isFeatured ? (
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black tracking-wide ${theme.bg} ${theme.primary} ring-1 ${theme.border}`}
                              >
                                <Flame className="h-3 w-3" aria-hidden />
                                پرفروش‌ترین
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <p className="mt-4 text-base font-bold leading-7 text-zinc-100">
                          {item.title}
                        </p>

                        <div className="mt-5">
                          <p className="text-xs text-zinc-500 line-through decoration-red-400/80">
                            {formatRangeToman(item.previous)}
                          </p>
                          <p
                            className={`mt-1 text-lg font-black leading-7 sm:text-xl ${theme.primary}`}
                          >
                            {formatRangeToman(item.current)}
                          </p>
                          <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-300">
                            <Sparkles className="h-3.5 w-3.5" aria-hidden />
                            قیمت ویژه امروز
                          </p>
                        </div>

                        <div
                          className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                        >
                          <div
                            className={`absolute -bottom-8 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full blur-2xl ${theme.glow} bg-gradient-to-t`}
                          />
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 sm:flex-row sm:p-5">
              <p className="text-center text-sm text-zinc-400 sm:text-right">
                هنوز مطمئن نیستی؟ همین الان با تیم ما صحبت کن —{" "}
                <span className="font-semibold text-zinc-200">
                  مشاوره کاملاً رایگان است.
                </span>
              </p>
              <Link
                href={activeHref ?? "/services/game-install/ps5"}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition hover:brightness-110 ${activeTabMeta.brand === "xbox"
                  ? "bg-green-500/15 text-green-300 ring-1 ring-green-400/30"
                  : "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30"
                  }`}
              >
                شروع سفارش نصب
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default PriceTable;
