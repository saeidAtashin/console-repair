"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { formatPriceToman } from "@/lib/format-price";
import { calculateShipping, getFreeShippingThreshold } from "@/lib/shipping";

type CartLine = {
  id: string;
  quantity: number;
  product: {
    name: string;
    slug: string;
    price: number;
    imageUrl: string | null;
    stock: number;
  };
};

type Cart = {
  items: CartLine[];
  subtotal: number;
  itemCount: number;
};

export default function CartPageClient() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data.cart);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  async function updateQty(cartItemId: string, quantity: number) {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItemId, quantity }),
    });
    const data = await res.json();
    setCart(data.cart);
    window.dispatchEvent(new Event("cart-updated"));
  }

  if (loading) {
    return <p className="text-zinc-400">در حال بارگذاری سبد...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
        <p className="text-zinc-400 mb-6">سبد خرید شما خالی است</p>
        <Link
          href="/shop"
          className="inline-block rounded-2xl bg-cyan-500 px-8 py-3 font-bold text-black hover:bg-cyan-400"
        >
          مشاهده فروشگاه
        </Link>
      </div>
    );
  }

  const shipping = calculateShipping(cart.subtotal);
  const total = cart.subtotal + shipping;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {cart.items.map((line) => (
          <div
            key={line.id}
            className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-4"
          >
            <div className="h-24 w-24 shrink-0 rounded-2xl bg-black/30 overflow-hidden">
              {line.product.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={line.product.imageUrl}
                  alt={line.product.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <Link href={`/product/${line.product.slug}`} className="font-bold hover:text-cyan-400">
                {line.product.name}
              </Link>
              <p className="mt-1 text-cyan-400">{formatPriceToman(line.product.price)}</p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateQty(line.id, line.quantity - 1)}
                  className="rounded-lg border border-white/10 p-2"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span>{line.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQty(line.id, line.quantity + 1)}
                  disabled={line.quantity >= line.product.stock}
                  className="rounded-lg border border-white/10 p-2 disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => updateQty(line.id, 0)}
                  className="mr-auto rounded-lg border border-white/10 p-2 text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 h-fit">
        <h2 className="text-xl font-bold mb-4">خلاصه سفارش</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">جمع جزء</span>
            <span>{formatPriceToman(cart.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">ارسال</span>
            <span>{shipping === 0 ? "رایگان" : formatPriceToman(shipping)}</span>
          </div>
          {cart.subtotal < getFreeShippingThreshold() && (
            <p className="text-xs text-zinc-500">
              ارسال رایگان برای خرید بالای{" "}
              {formatPriceToman(getFreeShippingThreshold())}
            </p>
          )}
          <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
            <span>مجموع</span>
            <span className="text-cyan-400">{formatPriceToman(total)}</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="mt-6 block w-full rounded-2xl bg-cyan-500 py-4 text-center font-bold text-black hover:bg-cyan-400"
        >
          ادامه checkout
        </Link>
      </div>
    </div>
  );
}
