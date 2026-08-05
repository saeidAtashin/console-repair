import type { ExportTier } from "./types";
import { isPremiumFont } from "./fonts";

export const EXPORT_PRICES: Record<"hd-png" | "pdf", number> = {
  "hd-png": 49_000,
  pdf: 79_000,
};

export const PREMIUM_FONT_EXPORT_PRICE = 29_000;

export function getExportPrice(
  tier: "hd-png" | "pdf",
  fontFamily: string,
): number {
  const base = EXPORT_PRICES[tier];
  if (isPremiumFont(fontFamily)) {
    return base + PREMIUM_FONT_EXPORT_PRICE;
  }
  return base;
}

export function getExportTierLabel(tier: ExportTier): string {
  switch (tier) {
    case "free":
      return "پیش‌نمایش رایگان (واترمارک)";
    case "hd-png":
      return "PNG با کیفیت بالا";
    case "pdf":
      return "فایل PDF";
    default:
      return tier;
  }
}

export function getExportTierDescription(tier: ExportTier): string {
  switch (tier) {
    case "free":
      return "دانلود رایگان با واترمارک و کیفیت استاندارد";
    case "hd-png":
      return "بدون واترمارک، رزولوشن ۳ برابر، مناسب چاپ";
    case "pdf":
      return "فایل PDF بدون واترمارک، مناسب چاپ حرفه‌ای";
    default:
      return "";
  }
}
