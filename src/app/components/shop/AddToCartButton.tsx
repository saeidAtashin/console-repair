"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";

import { useShopCart } from "@/app/context/ShopCartContext";

type Props = {
  productId: string;
  productTitle: string;
  inStock: boolean;
};

export default function AddToCartButton({ productId, productTitle, inStock }: Props) {
  const { addToCart } = useShopCart();
  const prefersReducedMotion = useReducedMotion();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    const product = addToCart(productId);
    if (!product) return;

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 900);
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={!inStock}
      whileTap={prefersReducedMotion || !inStock ? undefined : { scale: 0.95 }}
      animate={
        prefersReducedMotion || !justAdded
          ? undefined
          : {
              boxShadow: [
                "0 0 0 0 rgba(34,211,238,0.45)",
                "0 0 0 10px rgba(34,211,238,0)",
              ],
            }
      }
      transition={{ duration: 0.45 }}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300 ${
        justAdded
          ? "bg-emerald-400 text-black"
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
    </motion.button>
  );
}
