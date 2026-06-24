"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";

import { useShopCart } from "@/app/context/ShopCartContext";

type Props = {
  productId: string;
  productTitle: string;
  inStock: boolean;
};

export default function AddToCartButton({ productId, productTitle, inStock }: Props) {
  const { addToCart } = useShopCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    const product = addToCart(productId);
    if (!product) return;

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 900);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!inStock}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300 disabled:active:scale-100 ${
        justAdded
          ? "bg-emerald-400 text-black shadow-[0_0_0_10px_rgba(34,211,238,0)] animate-pulse"
          : "bg-cyan-500 text-black hover:bg-cyan-400"
      }`}
      aria-label={
        inStock ? `افزودن ${productTitle} به سبد خرید` : `${productTitle} ناموجود است`
      }
    >
      {justAdded ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <ShoppingCart className="h-4 w-4" aria-hidden />
      )}
      {inStock ? (justAdded ? "اضافه شد" : "افزودن به سبد خرید") : "ناموجود"}
    </button>
  );
}
