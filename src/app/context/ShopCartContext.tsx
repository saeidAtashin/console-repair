"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AddToCartFeedback from "@/app/components/shop/AddToCartFeedback";
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

type ShopCartContextValue = {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
  lastAddedProduct: ShopProduct | null;
  isAddToCartModalOpen: boolean;
  toastMessage: string | null;
  addToCart: (productId: string) => ShopProduct | null;
  incrementQty: (productId: string) => void;
  decrementQty: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  closeAddToCartModal: () => void;
  dismissAddToCartToast: () => void;
};

const ShopCartContext = createContext<ShopCartContextValue | null>(null);

function sanitizeItems(items: CartLineItem[]): CartLineItem[] {
  const validIds = new Set(getProducts().map((product) => product.id));
  return items.filter((item) => validIds.has(item.productId));
}

export function ShopCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [lastAddedProduct, setLastAddedProduct] = useState<ShopProduct | null>(null);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setItems(sanitizeItems(readCartItems()));
  }, []);

  useEffect(() => {
    writeCartItems(items);
  }, [items]);

  const closeAddToCartModal = useCallback(() => {
    setIsAddToCartModalOpen(false);
  }, []);

  const dismissAddToCartToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const showAddToCartFeedback = useCallback((product: ShopProduct) => {
    setLastAddedProduct(product);
    setToastMessage(`${product.title} به سبد خرید اضافه شد`);
    setIsAddToCartModalOpen(true);
  }, []);

  const value = useMemo<ShopCartContextValue>(
    () => ({
      items,
      itemCount: getCartCount(items),
      subtotal: getCartSubtotal(items),
      lastAddedProduct,
      isAddToCartModalOpen,
      toastMessage,
      addToCart: (productId) => {
        const product = getProductById(productId);
        if (!product || !product.inStock) return null;

        setItems((prev) => addOrIncrementCartItem(prev, productId));
        showAddToCartFeedback(product);
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
      closeAddToCartModal,
      dismissAddToCartToast,
    }),
    [
      items,
      lastAddedProduct,
      isAddToCartModalOpen,
      toastMessage,
      closeAddToCartModal,
      dismissAddToCartToast,
      showAddToCartFeedback,
    ],
  );

  return (
    <ShopCartContext.Provider value={value}>
      {children}
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
