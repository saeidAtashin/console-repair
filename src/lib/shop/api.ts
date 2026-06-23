import { ApiError, apiRequest } from "@/lib/api-client";
import type { ShopOrderPayload, ShopOrderResponse, ShopProduct } from "./types";

type ShopProductsResponse = {
  products: ShopProduct[];
};

export async function fetchShopProducts(): Promise<ShopProduct[]> {
  const response = await apiRequest<ShopProductsResponse>("/api/shop/products", {
    auth: false,
  });
  return response.products;
}

export async function submitShopOrder(
  payload: ShopOrderPayload,
): Promise<ShopOrderResponse> {
  try {
    return await apiRequest<ShopOrderResponse>("/api/shop/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status >= 500) {
      return {
        orderCode: `LOCAL-${Date.now().toString().slice(-8)}`,
      };
    }
    if (error instanceof TypeError) {
      return {
        orderCode: `LOCAL-${Date.now().toString().slice(-8)}`,
      };
    }
    throw error;
  }
}
