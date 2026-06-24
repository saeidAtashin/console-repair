"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AddToCartFeedback from "@/app/components/shop/AddToCartFeedback";
import FlyToCartAnimator from "@/app/components/shop/FlyToCartAnimator";
import {
  addOrIncrementCartItem,
  getCartCount,
  getCartSubtotal,
  getProductById,
  getProducts,
  readCartItems,
  removeCartItem,
  setCartItemQty,
  writeCartItems,
  type CartLineItem,
  type ShopProduct,
} from "@/lib/shop";
import {
  getVisibleCartRect,
  prefersReducedMotion,
  CART_RECEIVE_DURATION_MS,
  type FlyToCartVariant,
} from "@/lib/shop/fly-to-cart";

export type FlyAnimationState = {
  product: ShopProduct;
  fromRect: DOMRect;
  variant: FlyToCartVariant;
};

export type AddToCartOptions = {
  sourceElement?: HTMLElement | null;
  variant?: FlyToCartVariant;
};

type ShopCartContextValue = {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
  toastMessage: string | null;
  flyAnimation: FlyAnimationState | null;
  flyingProductId: string | null;
  cartBounce: boolean;
  isFlyActive: boolean;
  addToCart: (productId: string, options?: AddToCartOptions) => ShopProduct | null;
  incrementQty: (productId: string) => void;
  decrementQty: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  dismissAddToCartToast: () => void;
  completeFlyAnimation: () => void;
};

const ShopCartContext = createContext<ShopCartContextValue | null>(null);

function sanitizeItems(items: CartLineItem[]): CartLineItem[] {
  const validIds = new Set(getProducts().map((product) => product.id));
  return items.filter((item) => validIds.has(item.productId));
}

export function ShopCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [flyAnimation, setFlyAnimation] = useState<FlyAnimationState | null>(null);
  const [cartBounce, setCartBounce] = useState(false);
  const bounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flyActiveRef = useRef(false);

  useEffect(() => {
    setItems(sanitizeItems(readCartItems()));
  }, []);

  useEffect(() => {
    writeCartItems(items);
  }, [items]);

  useEffect(() => {
    flyActiveRef.current = flyAnimation !== null;
  }, [flyAnimation]);

  useEffect(() => {
    return () => {
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    };
  }, []);

  const dismissAddToCartToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const triggerCartBounce = useCallback(() => {
    setCartBounce(true);
    if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    bounceTimerRef.current = setTimeout(() => {
      setCartBounce(false);
      bounceTimerRef.current = null;
    }, CART_RECEIVE_DURATION_MS);
  }, []);

  const completeFlyAnimation = useCallback(() => {
    flyActiveRef.current = false;
    setFlyAnimation(null);
    triggerCartBounce();
  }, [triggerCartBounce]);

  const showAddToCartFeedback = useCallback(
    (product: ShopProduct, options?: AddToCartOptions) => {
      if (prefersReducedMotion()) {
        setToastMessage(`${product.title} به سبد خرید اضافه شد`);
        return;
      }

      const sourceElement = options?.sourceElement;
      if (!sourceElement) {
        setToastMessage(`${product.title} به سبد خرید اضافه شد`);
        return;
      }

      const cartRect = getVisibleCartRect();
      if (!cartRect) {
        setToastMessage(`${product.title} به سبد خرید اضافه شد`);
        return;
      }

      setFlyAnimation({
        product,
        fromRect: sourceElement.getBoundingClientRect(),
        variant: options.variant ?? "card",
      });
      flyActiveRef.current = true;
    },
    [],
  );

  const value = useMemo<ShopCartContextValue>(
    () => ({
      items,
      itemCount: getCartCount(items),
      subtotal: getCartSubtotal(items),
      toastMessage,
      flyAnimation,
      flyingProductId: flyAnimation?.product.id ?? null,
      cartBounce,
      isFlyActive: flyAnimation !== null,
      addToCart: (productId, options) => {
        if (flyActiveRef.current) return null;

        const product = getProductById(productId);
        if (!product || !product.inStock) return null;

        setItems((prev) => addOrIncrementCartItem(prev, productId));
        showAddToCartFeedback(product, options);
        return product;
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
      dismissAddToCartToast,
      completeFlyAnimation,
    }),
    [
      items,
      toastMessage,
      flyAnimation,
      cartBounce,
      dismissAddToCartToast,
      completeFlyAnimation,
      showAddToCartFeedback,
    ],
  );

  return (
    <ShopCartContext.Provider value={value}>
      {children}
      <FlyToCartAnimator />
      <AddToCartFeedback />
    </ShopCartContext.Provider>
  );
}

export function useShopCart() {
  const context = useContext(ShopCartContext);
  if (!context) {
    throw new Error("useShopCart must be used within ShopCartProvider");
  }
  return context;
}
