"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Gift, ShoppingBag } from "lucide-react";

import CategoryGrid from "@/app/components/shop/CategoryGrid";
import ProductCard from "@/app/components/shop/ProductCard";
import GamingBackground from "./ui/GamingBackground";

type HomeData = {
  categories: {
    id: string;
    name: string;
    slug: string;
    description: string;
    productCount: number;
  }[];
  featured: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    shortDescription: string;
    isGiftReady: boolean;
    imageUrl: string | null;
    stock: number;
  }[];
};

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    fetch("/api/shop/home")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(null));
  }, []);

  return (
    <main className="relative bg-[#050816] pt-20 min-h-screen text-white">
      <GamingBackground />

      <section className="relative container mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            <Gift className="h-4 w-4" />
            فروشگاه هدیه گیمینگ
          </span>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            بهترین <span className="text-cyan-400">هدایا</span> برای گیمرها
          </h1>
          <p className="text-lg text-zinc-400 mb-10 leading-8">
            محصولات منتخب PlayStation و Xbox با بسته‌بندی هدیه — گیم‌پد، هدست،
            گیفت کارت و بسته‌های آماده برای مناسبت‌های خاص.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-black hover:bg-cyan-400 transition"
            >
              <ShoppingBag className="h-5 w-5" />
              مشاهده فروشگاه
            </Link>
            <Link
              href="/shop/gift-boxes"
              className="rounded-2xl border border-white/10 px-8 py-4 transition hover:border-cyan-400/30"
            >
              بسته‌های هدیه
            </Link>
          </div>
        </div>
      </section>

      {data && (
        <>
          <section className="container mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-3xl font-black mb-8">دسته‌بندی‌های هدیه</h2>
            <CategoryGrid categories={data.categories} />
          </section>

          <section className="container mx-auto max-w-7xl px-6 py-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-black">محصولات ویژه</h2>
              <Link href="/shop" className="text-cyan-400 hover:underline">
                همه محصولات
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
