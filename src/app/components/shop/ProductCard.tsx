"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { useShopCart } from "@/app/context/ShopCartContext";
import AddToCartButton from "./AddToCartButton";
import {
  PRODUCT_CATEGORY_SHORT_LABELS,
  formatToman,
  type ShopProduct,
} from "@/lib/shop";
import { cn } from "@/lib/utils";

type Props = {
  product: ShopProduct;
};

export default function ProductCard({ product }: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const { flyingProductId } = useShopCart();
  const isFlying = flyingProductId === product.id;

  const categoryBadge =
    product.category !== "console"
      ? PRODUCT_CATEGORY_SHORT_LABELS[product.category]
      : null;

  return (
    <article
      ref={cardRef}
      className={cn(
        "group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 transition hover:-translate-y-1 hover:border-cyan-400/30",
        isFlying && "pointer-events-none opacity-0",
      )}
    >
      <Link href={`/shop/${product.console}/${product.slug}`} className="block">
        <div className="relative h-48 overflow-hidden bg-zinc-950">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain p-8 transition duration-500 group-hover:scale-105"
          />
          {categoryBadge ? (
            <span className="absolute start-3 top-3 rounded-lg border border-cyan-500/30 bg-cyan-500/15 px-2 py-1 text-xs text-cyan-300">
              {categoryBadge}
            </span>
          ) : (
            <span className="absolute start-3 top-3 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-xs text-zinc-200">
              {product.condition === "new" ? "نو" : "دست دوم"}
            </span>
          )}
          {!product.inStock ? (
            <span className="absolute bottom-3 end-3 rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-300">
              ناموجود
            </span>
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 p-5">
        <Link href={`/shop/${product.console}/${product.slug}`}>
          <h3 className="line-clamp-2 text-lg font-bold text-white">{product.title}</h3>
        </Link>
        <div className="flex flex-wrap gap-2">
          {product.badges?.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300"
            >
              {badge}
            </span>
          ))}
        </div>

        <div>
          {product.compareAtPrice ? (
            <p className="text-sm text-zinc-500 line-through">
              {formatToman(product.compareAtPrice)}
            </p>
          ) : null}
          <data value={product.price} className="text-xl font-black text-cyan-300">
            {formatToman(product.price)}
          </data>
        </div>

        <AddToCartButton
          productId={product.id}
          productTitle={product.title}
          inStock={product.inStock}
          animationSourceRef={cardRef}
          flyVariant="card"
        />
      </div>
    </article>
  );
}
