"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import AddToCartButton from "@/app/components/shop/AddToCartButton";
import { useShopCart } from "@/app/context/ShopCartContext";
import {
  PRODUCT_CATEGORY_LABELS,
  SHOP_CONSOLE_META,
  formatToman,
  type ShopProduct,
  type ShopProductDetail,
} from "@/lib/shop";
import type { Brand } from "@/lib/brand-theme";
import { brandThemes } from "@/lib/brand-theme";
import { cn } from "@/lib/utils";

type Props = {
  product: ShopProduct;
  detail: ShopProductDetail;
  brand: Brand;
};

export default function ProductDetailHero({ product, detail, brand }: Props) {
  const heroImageRef = useRef<HTMLDivElement>(null);
  const { flyingProductId } = useShopCart();
  const isFlying = flyingProductId === product.id;
  const theme = brandThemes[brand];
  const meta = SHOP_CONSOLE_META[product.console];

  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div
        ref={heroImageRef}
        className={cn(
          `relative overflow-hidden rounded-3xl border ${theme.border} bg-zinc-900/40`,
          isFlying && "pointer-events-none opacity-0",
        )}
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-linear-to-br ${theme.glow} to-transparent opacity-60`}
        />
        <div className="relative h-[320px] sm:h-[400px] lg:h-[480px]">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="lg:sticky lg:top-28">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            {product.badges?.map((badge) => (
              <span
                key={badge}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${theme.border} ${theme.bg} ${theme.primary}`}
              >
                {badge}
              </span>
            ))}
            <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-300">
              {meta.label}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
            {product.title}
          </h1>

          <p className="mt-4 leading-8 text-zinc-400">{detail.summary}</p>

          <p className="mt-3 text-sm text-zinc-500">
            {product.category === "console"
              ? `وضعیت: ${product.condition === "new" ? "نو" : "دست‌دوم تست‌شده"}`
              : `دسته: ${PRODUCT_CATEGORY_LABELS[product.category]}`}
            {product.storage ? ` · ${product.storage}` : ""}
            {product.edition ? ` · ${product.edition}` : ""}
          </p>

          <div className="mt-6 border-t border-white/10 pt-6">
            {product.compareAtPrice ? (
              <p className="text-lg text-zinc-500 line-through">
                {formatToman(product.compareAtPrice)}
              </p>
            ) : null}
            <p className={`text-3xl font-black ${theme.primary}`}>
              {formatToman(product.price)}
            </p>
            {!product.inStock ? (
              <p className="mt-2 text-sm text-red-300">ناموجود — امکان پیش‌سفارش</p>
            ) : null}
          </div>

          {product.highlights && product.highlights.length > 0 ? (
            <ul className="mt-5 space-y-2 text-sm text-zinc-300">
              {product.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${theme.bg} ${theme.primary}`} />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-7">
            <AddToCartButton
              productId={product.id}
              productTitle={product.title}
              inStock={product.inStock}
              animationSourceRef={heroImageRef}
              flyVariant="hero"
            />
          </div>

          <Link
            href={`/shop/${product.console}`}
            className={`mt-4 inline-flex text-sm ${theme.primary} hover:opacity-80`}
          >
            بازگشت به محصولات {meta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
