export const DISCLAIMER =
  "نتیجه این بررسی اولیه است و تشخیص قطعی پس از بررسی دستگاه انجام می‌شود.";

export const LIQUID_WARNING =
  "برای جلوگیری از آسیب بیشتر، دستگاه را خاموش کنید و به برق متصل نکنید.";

export const SPECIALIST_NEEDED = "نیازمند بررسی تخصصی";

export const PHYSICAL_NEEDED = "نیازمند بررسی فیزیکی";

export const ACTION_LABELS = {
  "self-help": "راهکار امن در خانه",
  monitor: "فعلاً تحت نظر",
  consult: "مشاوره و بررسی",
  repair: "بررسی تخصصی / تعمیر",
} as const;

export const CONFIDENCE_LABELS = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
} as const;

export const SEVERITY_LABELS = {
  low: "پایین",
  medium: "متوسط",
  high: "بالا",
} as const;

export const MODE_LABELS = {
  quick: "عیب‌یابی سریع",
  full: "اطلاعات کامل",
} as const;

export const PICK_COPY = {
  brand: {
    title: "کنسولت چیه؟",
    subtitle: "اول دستگاهت رو انتخاب کن تا دقیق‌تر راهنماییت کنیم.",
  },
  family: {
    title: "کدوم خانواده؟",
    subtitle: "نسل دستگاه را مشخص کن تا مدل‌های درست را نشان بدهیم.",
  },
  model: {
    title: "کدوم مدل؟",
    subtitle: "اگر مطمئن نیستی، همان گزینه «نمی‌دونم» را بزن؛ جریان متوقف نمی‌شود.",
  },
  variant: {
    title: "نسخه دستگاهت چیه؟",
    subtitle: "دیسک یا دیجیتال بودن روی سؤال‌های بعدی اثر دارد.",
  },
  mode: {
    title: "چطور بررسی کنیم؟",
    subtitle: "سریع به نتیجه احتمالی می‌رسی؛ کامل سؤال‌های دقیق‌تری می‌پرسد.",
  },
  category: {
    title: "چه مشکلی برای دستگاهت پیش اومده؟",
    subtitle: "فقط دسته‌هایی را می‌بینی که به همین مدل مربوط‌اند.",
  },
  problem: {
    title: "مشکل اصلی چیست؟",
    subtitle: "نزدیک‌ترین گزینه را بزن؛ جزئیات را بعداً می‌پرسیم.",
  },
} as const;

export const MODE_OPTIONS = [
  {
    id: "quick" as const,
    label: "عیب‌یابی سریع",
    hint: "چند سؤال کوتاه و نتیجه احتمالی زودتر.",
  },
  {
    id: "full" as const,
    label: "اطلاعات کامل",
    hint: "سؤال‌های دقیق‌تر برای بررسی مرحله‌به‌مرحله.",
  },
];
