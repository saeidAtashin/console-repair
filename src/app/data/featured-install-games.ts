import type { FaqItem } from "@/app/components/seo/FaqSection";

export type FeaturedInstallGame = {
  /** Match catalog slug (after uniquify). */
  slugs?: string[];
  /** Case-insensitive substring match on the API game name. */
  nameIncludes?: string[];
  version?: string;
  dlc?: string;
  methodNotes?: string;
  stockNote?: string;
  paragraphs: string[];
  faqs?: FaqItem[];
};

export const FEATURED_INSTALL_GAMES: FeaturedInstallGame[] = [
  {
    slugs: ["grand-theft-auto-v", "gta-v", "gta-5"],
    nameIncludes: ["gta v", "gta 5", "grand theft auto v"],
    version: "نسخه فعلی کاتالوگ + آپدیت‌های موجود",
    dlc: "بسته به موجودی (مثلاً Story / Online)",
    methodNotes:
      "نصب اکانتی روی PS5؛ فضای SSD و نسخه دیجیتال/دیسک‌خور قبل از شروع بررسی می‌شود.",
    stockNote: "در صورت موجود بودن در کاتالوگ، همان روز قابل سفارش است.",
    paragraphs: [
      "نصب GTA V روی PS5 یکی از پرتقاضاترین سفارش‌های فیکس‌بازی است؛ عنوانی که هم کمپین داستانی و هم آنلاین را پوشش می‌دهد و برای کنسول تازه‌تعمیر یا تازه‌خریداری‌شده نقطه شروع خوبی است.",
      "حجم نصب بسته به نسخه و آپدیت‌ها متغیر است و روی SSD داخلی PS5 انجام می‌شود. قبل از شروع، فضای خالی و روش نصب (اکانتی) با شما هماهنگ می‌گردد.",
      "پس از نصب، اجرای منو، ورود به بازی و در صورت نیاز راهنمای اکانت بررسی می‌شود تا کنسول آماده بازی باشد.",
    ],
    faqs: [
      {
        question: "نصب GTA V روی PS5 چقدر طول می‌کشد؟",
        answer:
          "معمولاً چند ساعت؛ اگر آپدیت بزرگ در صف باشد ممکن است تا یک روز کاری طول بکشد.",
      },
      {
        question: "آیا GTA Online هم نصب می‌شود؟",
        answer:
          "در صورت موجود بودن در کاتالوگ و انتخاب شما، آنلاین هم قابل نصب است. محدودیت اکانت ظرفیتی قبل از سفارش توضیح داده می‌شود.",
      },
    ],
  },
  {
    slugs: ["red-dead-redemption-2", "rdr2"],
    nameIncludes: ["red dead redemption 2", "rdr2"],
    version: "نسخه کامل کاتالوگ",
    dlc: "بسته به موجودی",
    methodNotes: "نصب اکانتی؛ به‌خاطر حجم بالا فضای SSD بیشتری لازم است.",
    paragraphs: [
      "نصب Red Dead Redemption 2 روی PS5 به فضای ذخیره‌سازی قابل توجه و زمان نصب طولانی‌تر از عناوین متوسط نیاز دارد. این صفحه برای کسانی است که می‌خواهند نسخه کنسولی را بدون دردسر دانلود خانگی روی دستگاه‌شان داشته باشند.",
      "قبل از نصب، ظرفیت SSD و روش اکانت بررسی می‌شود. پس از اتمام، اجرای اولیه و ذخیره بازی تست می‌گردد.",
    ],
    faqs: [
      {
        question: "RDR2 روی PS5 دیجیتال هم نصب می‌شود؟",
        answer:
          "بله، مسیر نصب دیجیتال است. مدل دیسک‌خور هم از همین تعرفه اکانتی استفاده می‌کند مگر اینکه نصب از دیسک بخواهید.",
      },
    ],
  },
  {
    slugs: ["ea-sports-fc-26", "fc-26", "fifa-26"],
    nameIncludes: ["fc 26", "fc26", "fifa 26"],
    version: "FC 26 — بیلد موجود در کاتالوگ",
    dlc: "آپدیت‌های فصلی در صورت موجودی",
    methodNotes: "نصب اکانتی؛ برای آنلاین بودن محدودیت اکانت را بپرسید.",
    paragraphs: [
      "نصب FC 26 روی PS5 برای گیمرهایی است که می‌خواهند آخرین عنوان فوتبال را سریع روی کنسول داشته باشند؛ بدون انتظار دانلود شبانه.",
      "حجم و آپدیت‌های فصلی ممکن است زمان نصب را افزایش دهد. تعرفه نهایی پس از بررسی کنسول اعلام می‌شود.",
    ],
    faqs: [
      {
        question: "آپدیت FC 26 هم انجام می‌شود؟",
        answer:
          "آپدیت‌های موجود در زمان نصب اعمال می‌شود. پچ‌های بعدی پس از تحویل با خودتان است مگر اینکه سرویس جداگانه بخواهید.",
      },
    ],
  },
];

export function matchFeaturedInstallGame(
  name: string,
  slug: string,
): FeaturedInstallGame | undefined {
  const nameKey = name.toLowerCase();
  const slugKey = slug.toLowerCase();
  return FEATURED_INSTALL_GAMES.find((featured) => {
    if (featured.slugs?.some((s) => s === slugKey)) return true;
    return featured.nameIncludes?.some((fragment) => nameKey.includes(fragment));
  });
}
