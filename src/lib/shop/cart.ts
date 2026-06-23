import { getProducts } from "./products";
import type { CartLineItem } from "./types";

export const SHOP_CART_STORAGE_KEY = "shop-cart-items";

function isValidQty(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export function readCartItems(): CartLineItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(SHOP_CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartLineItem =>
        !!item &&
        typeof item === "object" &&
        "productId" in item &&
        typeof item.productId === "string" &&
        "qty" in item &&
        isValidQty(item.qty),
    );
  } catch {
    return [];
  }
}

export function writeCartItems(items: CartLineItem[]): void {
  localStorage.setItem(SHOP_CART_STORAGE_KEY, JSON.stringify(items));
}

export function getCartCount(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function getCartSubtotal(items: CartLineItem[]): number {
  const products = getProducts();
  const productById = new Map(products.map((product) => [product.id, product]));

  return items.reduce((sum, item) => {
    const product = productById.get(item.productId);
    if (!product) return sum;
    return sum + product.price * item.qty;
  }, 0);
}

export function addOrIncrementCartItem(
  items: CartLineItem[],
  productId: string,
): CartLineItem[] {
  const existing = items.find((item) => item.productId === productId);
  if (!existing) return [...items, { productId, qty: 1 }];

  return items.map((item) =>
    item.productId === productId ? { ...item, qty: item.qty + 1 } : item,
  );
}

export function setCartItemQty(
  items: CartLineItem[],
  productId: string,
  qty: number,
): CartLineItem[] {
  if (qty <= 0) return items.filter((item) => item.productId !== productId);
  return items.map((item) => (item.productId === productId ? { ...item, qty } : item));
}

export function removeCartItem(
  items: CartLineItem[],
  productId: string,
): CartLineItem[] {
  return items.filter((item) => item.productId !== productId);
}
