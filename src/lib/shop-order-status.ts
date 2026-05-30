export type ShopOrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "online" | "cod";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export const SHOP_ORDER_STATUSES: ShopOrderStatus[] = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const SHOP_ORDER_STATUS_LABELS: Record<ShopOrderStatus, string> = {
  pending_payment: "در انتظار پرداخت",
  paid: "پرداخت شده",
  processing: "در حال آماده‌سازی",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  online: "پرداخت آنلاین (زرین‌پال)",
  cod: "پرداخت در محل",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "در انتظار",
  paid: "پرداخت شده",
  failed: "ناموفق",
  refunded: "بازگشت وجه",
};

export function isShopOrderStatus(value: string): value is ShopOrderStatus {
  return SHOP_ORDER_STATUSES.includes(value as ShopOrderStatus);
}

export function getShopOrderStatusLabel(status: string): string {
  return (
    SHOP_ORDER_STATUS_LABELS[status as ShopOrderStatus] ?? status
  );
}
