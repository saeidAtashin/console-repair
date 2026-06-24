"use client";

import Image from "next/image";
import Link from "next/link";

import { formatToman, type CartLineItem as CartItemType, type ShopProduct } from "@/lib/shop";

type Props = {
  item: CartItemType;
  product: ShopProduct;
  onIncrement?: (productId: string) => void;
  onDecrement?: (productId: string) => void;
  onRemove?: (productId: string) => void;
};

export default function CartLineItem({
  item,
  product,
  onIncrement,
  onDecrement,
  onRemove,
}: Props) {
  return (
    <article className="grid gap-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-4 sm:grid-cols-[88px_1fr_auto] sm:items-center">
      <Link href={`/shop/${product.console}/${product.slug}`} className="relative block h-20 rounded-xl bg-black/40">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="88px"
          className="object-cover"
        />
      </Link>

      <div>
        <Link href={`/shop/${product.console}/${product.slug}`} className="text-sm font-bold text-white">
          {product.title}
        </Link>
        <p className="mt-1 text-xs text-zinc-400">
          {product.condition === "new" ? "نو" : "دست دوم"}
        </p>
        <p className="mt-2 text-sm font-bold text-cyan-300">
          {formatToman(product.price)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {onDecrement ? (
          <button
            type="button"
            onClick={() => onDecrement(product.id)}
            className="h-8 w-8 rounded-lg border border-white/10 text-zinc-300 hover:border-cyan-400/30"
          >
            -
          </button>
        ) : null}
        <span className="min-w-8 text-center text-sm font-bold text-white">{item.qty}</span>
        {onIncrement ? (
          <button
            type="button"
            onClick={() => onIncrement(product.id)}
            className="h-8 w-8 rounded-lg border border-white/10 text-zinc-300 hover:border-cyan-400/30"
          >
            +
          </button>
        ) : null}
        {onRemove ? (
          <button
            type="button"
            onClick={() => onRemove(product.id)}
            className="rounded-lg border border-red-500/30 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
          >
            حذف
          </button>
        ) : null}
      </div>
    </article>
  );
}
