import { STATIC_SHOP_PRODUCTS } from "./products.static";
import type { ProductCondition, ShopConsole, ShopProduct } from "./types";

type ProductFilters = {
  console?: ShopConsole;
  condition?: ProductCondition;
  inStockOnly?: boolean;
};

export function getProducts(filters: ProductFilters = {}): ShopProduct[] {
  return STATIC_SHOP_PRODUCTS.filter((product) => {
    if (filters.console && product.console !== filters.console) return false;
    if (filters.condition && product.condition !== filters.condition) return false;
    if (filters.inStockOnly && !product.inStock) return false;
    return true;
  });
}

export function getProductBySlug(
  consoleSlug: ShopConsole,
  slug: string,
): ShopProduct | undefined {
  return STATIC_SHOP_PRODUCTS.find(
    (product) => product.console === consoleSlug && product.slug === slug,
  );
}

export function getRelatedProducts(
  product: ShopProduct,
  limit = 3,
): ShopProduct[] {
  return STATIC_SHOP_PRODUCTS.filter(
    (entry) => entry.console === product.console && entry.id !== product.id,
  ).slice(0, limit);
}
