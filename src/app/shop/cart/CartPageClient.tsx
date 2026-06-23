"use client";

import Link from "next/link";

import CartLineItem from "@/app/components/shop/CartLineItem";
import { useShopCart } from "@/app/context/ShopCartContext";
import { formatToman, getProducts } from "@/lib/shop";

const productById = new Map(getProducts().map((product) => [product.id, product]));

export default function CartPageClient() {
  const { items, incrementQty, decrementQty, removeItem, subtotal } = useShopCart();
  const displayItems = items
    .map((item) => {
      const product = productById.get(item.productId);
      return product ? { item, product } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => !!entry);

  if (displayItems.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 text-center">
        <h2 className="text-2xl font-black text-white">سبد خرید شما خالی است</h2>
        <p className="mt-3 text-zinc-400">برای شروع خرید، محصولات فروشگاه را ببینید.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
        >
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {displayItems.map(({ item, product }) => (
          <CartLineItem
            key={item.productId}
            item={item}
            product={product}
            onIncrement={incrementQty}
            onDecrement={decrementQty}
            onRemove={removeItem}
          />
        ))}
      </div>

      <aside className="h-fit rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-xl font-black text-white">خلاصه سفارش</h2>
        <div className="mt-5 flex items-center justify-between text-sm text-zinc-300">
          <span>جمع کل</span>
          <span className="text-lg font-black text-cyan-300">{formatToman(subtotal)}</span>
        </div>
        <Link
          href="/shop/checkout"
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-black transition hover:bg-cyan-400"
        >
          تکمیل سفارش
        </Link>
        <Link
          href="/shop"
          className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-zinc-300 transition hover:border-cyan-400/30"
        >
          ادامه خرید
        </Link>
      </aside>
    </section>
  );
}
