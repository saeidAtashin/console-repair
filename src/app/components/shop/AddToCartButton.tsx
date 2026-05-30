"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

type Props = {
  productId: string;
  disabled?: boolean;
};

export default function AddToCartButton({ productId, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        setDone(true);
        window.dispatchEvent(new Event("cart-updated"));
        setTimeout(() => setDone(false), 2000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ShoppingCart className="h-5 w-5" />
      {loading ? "..." : done ? "اضافه شد!" : "افزودن به سبد خرید"}
    </button>
  );
}
