"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Gamepad2,
  Package,
  ShoppingBag,
  Wrench,
} from "lucide-react";

import FadeUp from "@/app/components/animations/FadeUp";
import ProductCard from "@/app/components/shop/ProductCard";
import ConsoleTabIcon from "@/app/components/ui/ConsoleTabIcon";
import { brandThemes } from "@/lib/brand-theme";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORY_ORDER,
  getFeaturedProducts,
  getProducts,
  getShopOverviewStats,
  SHOP_CONSOLE_META,
  SHOP_CONSOLE_ORDER,
} from "@/lib/shop";

const CATEGORY_ICONS = {
  console: Gamepad2,
  tools: Wrench,
  accessories: Package,
} as const;

const featuredProducts = getFeaturedProducts(6);
const shopStats = getShopOverviewStats();

export default function StoreSection() {
  return (
    <section
      id="store"
      aria-labelledby="store-heading"
      className="relative overflow-hidden py-32"
    >
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="container relative mx-auto px-6">
        <FadeUp>
          <div className="mb-16 text-center">
            <span className="mb-4 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-400 backdrop-blur-xl">
              فروشگاه کنسول
            </span>

            <h2
              id="store-heading"
              className="mb-6 text-4xl font-black text-white md:text-6xl"
            >
              خرید کنسول، لوازم جانبی و قطعات
            </h2>

            <p className="mx-auto max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
              فروشگاه تخصصی PS5، PS4، Xbox Series و Xbox One — کنسول نو و
              دست‌دوم تست‌شده، ابزار تعمیر، دسته بازی، کابل و لوازم جانبی با
              مشاوره خرید و پشتیبانی پس از فروش.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              {shopStats.totalProducts} محصول
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              {shopStats.inStockCount} مورد موجود
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              {shopStats.consoleShops} فروشگاه پلتفرم
            </span>
          </div>
        </FadeUp>

        <div className="mb-14">
          <FadeUp delay={0.08}>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black text-white md:text-3xl">
                فروشگاه بر اساس کنسول
              </h3>
              <Link
                href="/shop"
                className="hidden items-center gap-2 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300 sm:inline-flex"
              >
                همه محصولات
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {SHOP_CONSOLE_ORDER.map((slug, index) => {
              const meta = SHOP_CONSOLE_META[slug];
              const theme = brandThemes[meta.brand];
              const count = getProducts({ console: slug }).length;

              return (
                <FadeUp key={slug} delay={0.1 + index * 0.06}>
                  <Link
                    href={`/shop/${slug}`}
                    className={`group relative block h-full overflow-hidden rounded-3xl border bg-zinc-900/50 p-6 backdrop-blur-md transition duration-500 hover:-translate-y-1 ${theme.border} hover:border-cyan-400/40`}
                  >
                    <div
                      className={`absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${theme.glow} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                    />

                    <div className="relative z-10">
                      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <ConsoleTabIcon src={meta.iconSrc} className="h-7 w-7" />
                      </div>

                      <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                        {meta.subtitle}
                      </p>
                      <h4 className="mt-1 text-xl font-black text-white group-hover:text-cyan-300">
                        {meta.label}
                      </h4>
                      <p className="mt-2 text-sm text-zinc-400">
                        {count} محصول — کنسول، ابزار و لوازم جانبی
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400">
                        ورود به فروشگاه
                        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>

        <div className="mb-14">
          <FadeUp delay={0.12}>
            <h3 className="mb-6 text-2xl font-black text-white md:text-3xl">
              دسته‌بندی محصولات
            </h3>
          </FadeUp>

          <div className="grid gap-4 md:grid-cols-3">
            {PRODUCT_CATEGORY_ORDER.map((category, index) => {
              const Icon = CATEGORY_ICONS[category];
              const count = shopStats.categories.find(
                (entry) => entry.category === category,
              )?.count;

              return (
                <FadeUp key={category} delay={0.14 + index * 0.06}>
                  <Link
                    href="/shop"
                    className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-cyan-400/30 hover:bg-zinc-900/60"
                  >
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-cyan-300">
                        {PRODUCT_CATEGORY_LABELS[category]}
                      </h4>
                      <p className="mt-1 text-sm text-zinc-400">
                        {count} محصول در فروشگاه
                      </p>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>

        <div>
          <FadeUp delay={0.16}>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-white md:text-3xl">
                  محصولات پیشنهادی
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-zinc-400 md:text-base">
                  منتخب کنسول‌ها و لوازم پرفروش با موجودی فعال — برای مشاهده
                  قیمت، جزئیات و افزودن به سبد خرید روی هر محصول کلیک کنید.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <ShoppingBag className="h-4 w-4" />
                مشاهده فروشگاه
              </Link>
            </div>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <FadeUp key={product.id} delay={0.18 + index * 0.05}>
                <ProductCard product={product} />
              </FadeUp>
            ))}
          </div>
        </div>

        <FadeUp delay={0.22}>
          <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-l from-zinc-900/80 to-black/60 p-8 md:flex-row">
            <div className="flex items-center gap-5">
              <div className="relative hidden h-16 w-16 sm:block">
                <Image
                  src="/icons/ps5.svg"
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain opacity-80"
                  aria-hidden
                />
              </div>
              <div className="text-center md:text-right">
                <p className="text-lg font-bold text-white">
                  کنسول مناسب خود را پیدا نکردید؟
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  در فروشگاه کامل جستجو کنید یا برای مشاوره خرید با ما تماس
                  بگیرید.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-cyan-400"
              >
                ورود به فروشگاه
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                href="/repair"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-cyan-400/30 hover:text-white"
              >
                ثبت تعمیر
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
