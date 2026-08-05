"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useShopCart } from "@/app/context/ShopCartContext";
import { formatToman } from "@/lib/shop/format";
import { getCartItemKey, isCalligraphyExportItem } from "@/lib/shop/types";

export default function CartPageClient() {
  const { items, subtotal, incrementQty, decrementQty, removeItem } = useShopCart();

  const displayItems = useMemo(
    () =>
      items.map((item) => ({
        item,
        key: getCartItemKey(item),
        title:
          item.kind === "calligraphy-export" || item.kind === "custom"
            ? item.title
            : "محصول",
        price:
          item.kind === "calligraphy-export" || item.kind === "custom"
            ? item.unitPrice
            : 0,
        image:
          item.kind === "calligraphy-export" || item.kind === "custom"
            ? item.previewUrl
            : "",
      })),
    [items],
  );

  if (displayItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-28 pb-16 text-center">
        <h1 className="text-2xl font-black text-foreground">سبد خرید خالی است</h1>
        <p className="mt-3 text-muted">خروجی خوشنویسی خود را به سبد اضافه کنید</p>
        <Link href="/studio" className="mt-6 inline-block rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-black">
          رفتن به استودیو
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-28 pb-16">
      <h1 className="text-2xl font-black text-foreground">سبد خرید</h1>
      <ul className="mt-8 space-y-4">
        {displayItems.map((entry) => {
          if (!entry) return null;
          const isExport = isCalligraphyExportItem(entry.item);
          return (
            <li
              key={entry.key}
              className="flex gap-4 rounded-2xl border border-border bg-card/60 p-4"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-surface">
                {entry.image?.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={entry.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-900/40 to-purple-900/40 text-xs text-muted">
                    پیش‌نمایش
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground">{entry.title}</p>
                <p className="mt-1 text-sm text-cyan-400">{formatToman(entry.price)}</p>
                {!isExport ? (
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decrementQty(entry.key)}
                      className="rounded-lg border border-border px-2 py-1 text-sm"
                    >
                      −
                    </button>
                    <span className="text-sm text-muted">{entry.item.qty}</span>
                    <button
                      type="button"
                      onClick={() => incrementQty(entry.key)}
                      className="rounded-lg border border-border px-2 py-1 text-sm"
                    >
                      +
                    </button>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeItem(entry.key)}
                className="shrink-0 text-sm text-red-400 hover:underline"
              >
                حذف
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-card/60 p-6">
        <span className="font-bold text-foreground">جمع کل</span>
        <span className="text-xl font-black text-cyan-400">{formatToman(subtotal)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-xl bg-cyan-500 py-3.5 text-center text-sm font-bold text-black"
      >
        ادامه تسویه
      </Link>
    </div>
  );
}
