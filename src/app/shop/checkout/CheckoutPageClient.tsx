"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

import CartLineItem from "@/app/components/shop/CartLineItem";
import { useShopCart } from "@/app/context/ShopCartContext";
import { normalizeIranPhone } from "@/lib/phone";
import {
  formatToman,
  getProducts,
  submitShopOrder,
  type ShopOrderPayload,
} from "@/lib/shop";

const productById = new Map(getProducts().map((product) => [product.id, product]));

export default function CheckoutPageClient() {
  const { items, subtotal, clearCart } = useShopCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const displayItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = productById.get(item.productId);
          return product ? { item, product } : null;
        })
        .filter((entry): entry is NonNullable<typeof entry> => !!entry),
    [items],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("نام و نام خانوادگی الزامی است.");
      return;
    }

    const normalizedPhone = normalizeIranPhone(phone);
    if (!normalizedPhone) {
      setError("شماره موبایل معتبر نیست.");
      return;
    }

    if (displayItems.length === 0) {
      setError("سبد خرید خالی است.");
      return;
    }

    const payload: ShopOrderPayload = {
      name: name.trim(),
      phone: normalizedPhone,
      note: note.trim() || undefined,
      items: displayItems.map(({ item }) => ({
        productId: item.productId,
        qty: item.qty,
      })),
    };

    setLoading(true);
    try {
      const response = await submitShopOrder(payload);
      setOrderCode(response.orderCode);
      clearCart();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "ثبت سفارش انجام نشد. دوباره تلاش کنید.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (orderCode) {
    return (
      <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-8">
        <h2 className="text-2xl font-black text-green-200">سفارش ثبت شد</h2>
        <p className="mt-3 text-green-100">
          کد پیگیری شما: <span className="font-black">{orderCode}</span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
          >
            بازگشت به فروشگاه
          </Link>
          <Link
            href="/tracking"
            className="rounded-2xl border border-white/10 px-6 py-3 text-zinc-200 transition hover:border-cyan-400/30"
          >
            صفحه پیگیری
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6"
      >
        <h2 className="text-xl font-black text-white">اطلاعات خریدار</h2>
        <div className="mt-5 grid gap-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="نام و نام خانوادگی"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
          />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="شماره موبایل"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
          />
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            placeholder="توضیحات (اختیاری)"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
          />
        </div>
        {error ? (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
        >
          {loading ? "در حال ثبت..." : "ثبت سفارش"}
        </button>
      </form>

      <aside className="h-fit rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-xl font-black text-white">خلاصه خرید</h2>
        <div className="mt-4 space-y-3">
          {displayItems.map(({ item, product }) => (
            <CartLineItem key={item.productId} item={item} product={product} />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm text-zinc-300">جمع کل</span>
          <span className="text-lg font-black text-cyan-300">{formatToman(subtotal)}</span>
        </div>
      </aside>
    </section>
  );
}
