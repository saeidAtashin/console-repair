"use client";

import { useShopCart } from "@/app/context/ShopCartContext";
import AddToCartModal from "./AddToCartModal";
import ShopToast from "./ShopToast";

export default function AddToCartFeedback() {
  const {
    toastMessage,
    dismissAddToCartToast,
    isAddToCartModalOpen,
    lastAddedProduct,
    closeAddToCartModal,
  } = useShopCart();

  return (
    <>
      <ShopToast message={toastMessage} onDismiss={dismissAddToCartToast} />
      <AddToCartModal
        open={isAddToCartModalOpen}
        product={lastAddedProduct}
        onClose={closeAddToCartModal}
      />
    </>
  );
}
