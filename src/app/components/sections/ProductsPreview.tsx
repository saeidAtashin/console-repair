"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { products, formatProductPrice } from "@/app/data/products";

export default function ProductsPreview() {
  const featured = products.slice(0, 6);

  return (
    <section className="container mx-auto px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">محصولات پرفروش</h2>
          <p className="mt-2 text-zinc-400">قیمت روز بازار — سفارش آنلاین</p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-orange-400 font-semibold hover:text-orange-300"
        >
          همه محصولات
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 transition hover:border-orange-400/40"
          >
            <div className="relative aspect-[16/10] bg-zinc-800">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover transition group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white">{product.title}</h3>
              <p className="mt-2 text-sm text-orange-400 font-semibold">
                {formatProductPrice(product)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
