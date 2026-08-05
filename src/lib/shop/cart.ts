import {
  getCartItemKey,
  normalizeCartItem,
  type CalligraphyExportItem,
  type CartLineItem,
  type CustomCartLineItem,
  type ReadyCartLineItem,
} from "./types";

export { getCartItemKey } from "./types";

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

    return parsed
      .map(normalizeCartItem)
      .filter((item): item is CartLineItem => item !== null);
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
  return items.reduce((sum, item) => {
    if (item.kind === "calligraphy-export") {
      return sum + item.unitPrice;
    }
    if (item.kind === "custom") {
      return sum + item.unitPrice * item.qty;
    }
    return sum;
  }, 0);
}

export function addReadyToCart(
  items: CartLineItem[],
  productId: string,
): CartLineItem[] {
  const existing = items.find(
    (item) => item.kind === "ready" && item.productId === productId,
  );
  if (!existing) return [...items, { kind: "ready", productId, qty: 1 }];

  return items.map((item) =>
    item.kind === "ready" && item.productId === productId
      ? { ...item, qty: item.qty + 1 }
      : item,
  );
}

export function addCalligraphyExportToCart(
  items: CartLineItem[],
  exportItem: Omit<CalligraphyExportItem, "kind" | "qty">,
): CartLineItem[] {
  const key = `calligraphy:${exportItem.designId}:${exportItem.tier}`;
  const existing = items.find((item) => getCartItemKey(item) === key);
  if (existing) return items;

  return [...items, { kind: "calligraphy-export", ...exportItem, qty: 1 }];
}

export function addCustomToCart(
  items: CartLineItem[],
  custom: Omit<CustomCartLineItem, "kind" | "qty">,
): CartLineItem[] {
  const existing = items.find(
    (item) => item.kind === "custom" && item.designId === custom.designId,
  );
  if (!existing) return [...items, { kind: "custom", ...custom, qty: 1 }];

  return items.map((item) =>
    item.kind === "custom" && item.designId === custom.designId
      ? { ...item, qty: item.qty + 1 }
      : item,
  );
}

/** @deprecated use addReadyToCart */
export function addOrIncrementCartItem(
  items: CartLineItem[],
  productId: string,
): CartLineItem[] {
  return addReadyToCart(items, productId);
}

export function setCartItemQty(
  items: CartLineItem[],
  key: string,
  qty: number,
): CartLineItem[] {
  if (qty <= 0) return items.filter((item) => getCartItemKey(item) !== key);
  return items.map((item) => {
    if (getCartItemKey(item) !== key) return item;
    if (item.kind === "calligraphy-export") return item;
    return { ...item, qty };
  });
}

export function removeCartItem(items: CartLineItem[], key: string): CartLineItem[] {
  return items.filter((item) => getCartItemKey(item) !== key);
}

export type {
  CalligraphyExportItem,
  CartLineItem,
  CustomCartLineItem,
  ReadyCartLineItem,
};
