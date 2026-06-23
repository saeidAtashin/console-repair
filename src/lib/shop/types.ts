export const SHOP_CONSOLES = ["ps4", "ps5", "xbox-one", "xbox-series"] as const;

export type ShopConsole = (typeof SHOP_CONSOLES)[number];
export type ProductCondition = "new" | "used";
export type ProductCategory = "console" | "tools" | "accessories";

export type ShopProduct = {
  id: string;
  slug: string;
  title: string;
  console: ShopConsole;
  category: ProductCategory;
  condition: ProductCondition;
  price: number;
  compareAtPrice?: number;
  image: string;
  storage?: string;
  edition?: string;
  inStock: boolean;
  badges?: string[];
  highlights?: string[];
  searchTerms?: string[];
};

export type CartLineItem = {
  productId: string;
  qty: number;
};

export type ShopOrderPayload = {
  name: string;
  phone: string;
  note?: string;
  items: CartLineItem[];
};

export type ShopOrderResponse = {
  orderCode: string;
};
