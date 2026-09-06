import type { TroubleshootingStep } from "../types";

export const troubleshooting: TroubleshootingStep[] = [
  {
    id: "power-cable",
    title: "تست کابل برق",
    description:
      "کابل برق را از دستگاه و پریز جدا کن، محکم وصل کن، و اگر ممکن است کابل دیگری امتحان کن. از چندراهی مشکوک استفاده نکن.",
    safe: true,
    requiresTools: false,
    conditions: [
      { field: "categoryId", op: "eq", value: "power" },
      { field: "flag", op: "neq", value: "skip-troubleshooting" },
    ],
  },
  {
    id: "power-outlet",
    title: "تست پریز",
    description:
      "دستگاه را مستقیم به یک پریز دیگر بزن. اگر با چندراهی استفاده می‌کنی، یک‌بار بدون آن تست کن.",
    safe: true,
    requiresTools: false,
    conditions: [
      { field: "categoryId", op: "eq", value: "power" },
      { field: "flag", op: "neq", value: "skip-troubleshooting" },
    ],
  },
  {
    id: "hdmi-cable",
    title: "تست کابل HDMI",
    description:
      "کابل HDMI را از دو طرف جدا و دوباره وصل کن. اگر کابل دیگری داری، همان را امتحان کن.",
    safe: true,
    requiresTools: false,
    conditions: [
      { field: "categoryId", op: "eq", value: "display" },
      { field: "capability", key: "hdmi", op: "eq", value: true },
    ],
  },
  {
    id: "other-tv",
    title: "تست تلویزیون دیگر",
    description:
      "اگر دسترسی داری، دستگاه را به یک تلویزیون یا مانیتور دیگر وصل کن تا معلوم شود مشکل از نمایشگر است یا کنسول.",
    safe: true,
    requiresTools: false,
    conditions: [
      { field: "categoryId", op: "eq", value: "display" },
      { field: "capability", key: "hdmi", op: "eq", value: true },
    ],
  },
  {
    id: "restart",
    title: "Restart امن",
    description:
      "دستگاه را کامل خاموش کن، چند ثانیه صبر کن، دوباره روشن کن. اگر منوی دستگاه باز می‌شود، یک‌بار از منو Restart بگیر.",
    safe: true,
    requiresTools: false,
    conditions: [
      {
        field: "categoryId",
        op: "in",
        value: ["software", "error", "storage", "audio", "network"],
      },
    ],
  },
  {
    id: "audio-settings",
    title: "بررسی تنظیمات صدا",
    description:
      "خروجی صدا را بین HDMI، دستگاه و Headset عوض کن و حجم سیستم را چک کن. اگر اخیراً تنظیمات عوض شده، به حالت پیش‌فرض برگردان.",
    safe: true,
    requiresTools: false,
    conditions: [{ field: "categoryId", op: "eq", value: "audio" }],
  },
  {
    id: "network-connection",
    title: "بررسی اتصال شبکه",
    description:
      "مودم را یک‌بار Restart کن، نزدیک‌تر به روتر شو، و اگر ممکن است یک‌بار با Hotspot موبایل تست کن.",
    safe: true,
    requiresTools: false,
    conditions: [{ field: "categoryId", op: "eq", value: "network" }],
  },
  {
    id: "storage-space",
    title: "بررسی فضای ذخیره‌سازی",
    description:
      "فضای خالی حافظه را چک کن. اگر پر است، چند بازی یا فایل را حذف کن و دوباره اجرا را تست کن.",
    safe: true,
    requiresTools: false,
    conditions: [
      { field: "categoryId", op: "in", value: ["storage", "software"] },
    ],
  },
  {
    id: "heat-placement",
    title: "بررسی فضای اطراف دستگاه",
    description:
      "کنسول را از فضای بسته بیرون بیاور، حداقل چند سانتی‌متر اطراف آن خالی باشد، و روی فرش نرم نگذار.",
    safe: true,
    requiresTools: false,
    conditions: [{ field: "categoryId", op: "eq", value: "overheating" }],
  },
  {
    id: "controller-reconnect",
    title: "بررسی اتصال دسته",
    description:
      "دسته را با کابل به کنسول وصل کن، یک‌بار از نو جفت کن، و اگر ممکن است با دسته دیگری تست کن.",
    safe: true,
    requiresTools: false,
    conditions: [
      { field: "categoryId", op: "eq", value: "controller" },
      {
        field: "problemId",
        op: "in",
        value: ["controller-no-connect", "controller-dropouts", "controller-usb"],
      },
    ],
  },
];
