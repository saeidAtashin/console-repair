"use client";

import { ShoppingCart } from "lucide-react";
import { useShopCart } from "@/app/context/ShopCartContext";

type Props = {
  productId: string;
  inStock: boolean;
};

export default function AddToCartButton({ productId, inStock }: Props) {
  const { addToCart } = useShopCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(productId)}
      disabled={!inStock}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
    >
      <ShoppingCart className="h-4 w-4" />
      {inStock ? "افزودن به سبد خرید" : "ناموجود"}
    </button>
  );
}
