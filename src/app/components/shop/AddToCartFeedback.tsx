"use client";

import { useShopCart } from "@/app/context/ShopCartContext";
import ShopToast from "./ShopToast";

export default function AddToCartFeedback() {
  const { toastMessage, dismissAddToCartToast } = useShopCart();

  return <ShopToast message={toastMessage} onDismiss={dismissAddToCartToast} />;
}
