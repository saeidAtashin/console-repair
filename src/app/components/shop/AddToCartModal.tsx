"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";

import type { ShopProduct } from "@/lib/shop";

type Props = {
  open: boolean;
  product: ShopProduct | null;
  onClose: () => void;
};

export default function AddToCartModal({ open, product, onClose }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && product ? (
        <motion.div
          className="fixed inset-0 z-[210] flex items-center justify-center p-4"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
        >
          <button
            type="button"
            aria-label="بستن"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-to-cart-modal-title"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="absolute end-4 top-4 rounded-lg p-1 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              aria-label="بستن پنجره"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="80px"
                  className="object-contain p-3"
                />
              </div>
              <div className="pe-8">
                <h2 id="add-to-cart-modal-title" className="text-lg font-black text-white">
                  به سبد خرید اضافه شد
                </h2>
                <p className="mt-2 text-sm leading-7 text-zinc-400">{product.title}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/shop/cart"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-cyan-400"
              >
                <ShoppingBag className="h-4 w-4" />
                رفتن به سبد خرید
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-cyan-400/30 hover:text-white"
              >
                ادامه خرید
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
