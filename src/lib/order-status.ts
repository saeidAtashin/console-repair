import type { RepairStatus } from "@/lib/db";

export const ORDER_STATUS_LABELS: Record<RepairStatus, string> = {
  pending: "در انتظار بررسی",
  checking: "بررسی فایل",
  repairing: "در حال تولید",
  completed: "تحویل شده",
};

export const ORDER_TRACKING_STEPS: {
  status: RepairStatus;
  label: string;
  description: string;
}[] = [
  {
    status: "pending",
    label: "ثبت سفارش",
    description: "سفارش شما ثبت شد و در صف بررسی است.",
  },
  {
    status: "checking",
    label: "بررسی فایل",
    description: "فایل و مشخصات در حال بررسی برای استعلام قیمت.",
  },
  {
    status: "repairing",
    label: "در حال تولید",
    description: "سفارش در خط تولید CNC قرار دارد.",
  },
  {
    status: "completed",
    label: "تحویل",
    description: "سفارش آماده تحویل یا تحویل شده است.",
  },
];

export function getOrderStatusLabel(status: string): string {
  return (
    ORDER_STATUS_LABELS[status as RepairStatus] ?? status
  );
}
