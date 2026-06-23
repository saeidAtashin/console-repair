"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  addOrIncrementCartItem,
  getCartCount,
  getCartSubtotal,
  getProducts,
  readCartItems,
  removeCartItem,
  setCartItemQty,
  writeCartItems,
  type CartLineItem,
} from "@/lib/shop";

type ShopCartContextValue = {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (productId: string) => void;
  incrementQty: (productId: string) => void;
  decrementQty: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const ShopCartContext = createContext<ShopCartContextValue | null>(null);

function sanitizeItems(items: CartLineItem[]): CartLineItem[] {
  const validIds = new Set(getProducts().map((product) => product.id));
  return items.filter((item) => validIds.has(item.productId));
}

export function ShopCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);

  useEffect(() => {
    setItems(sanitizeItems(readCartItems()));
  }, []);

  useEffect(() => {
    writeCartItems(items);
  }, [items]);

  const value = useMemo<ShopCartContextValue>(
    () => ({
      items,
      itemCount: getCartCount(items),
      subtotal: getCartSubtotal(items),
      addToCart: (productId) => {
        setItems((prev) => addOrIncrementCartItem(prev, productId));
      },
      incrementQty: (productId) => {
        setItems((prev) => addOrIncrementCartItem(prev, productId));
      },
      decrementQty: (productId) => {
        setItems((prev) => {
          const current = prev.find((item) => item.productId === productId);
          const nextQty = (current?.qty ?? 0) - 1;
          return setCartItemQty(prev, productId, nextQty);
        });
      },
      removeItem: (productId) => {
        setItems((prev) => removeCartItem(prev, productId));
      },
      clearCart: () => setItems([]),
    }),
    [items],
  );

  return (
    <ShopCartContext.Provider value={value}>{children}</ShopCartContext.Provider>
  );
}

export function useShopCart() {
  const context = useContext(ShopCartContext);
  if (!context) {
    throw new Error("useShopCart must be used within ShopCartProvider");
  }
  return context;
}
