import type { ConsoleId } from "@/lib/console-catalog";
import { TOPIC_CLUSTERS } from "@/lib/seo/topic-clusters";
import { formatRangeToman, type PriceRange } from "@/lib/game-install-pricing";

export type LandingProblemChip = {
  label: string;
  href: string;
};

export type LandingWhyPoint = {
  title: string;
  detail: string;
};

export type LandingPriceRow = {
  title: string;
  href: string;
  range: PriceRange;
  note: string;
};

export type LandingStep = {
  title: string;
  detail: string;
};

export type LandingSample = {
  src: string;
  caption: string;
};

export type LandingTestimonial = {
  name: string;
  text: string;
};

export type ConsoleLandingContent = {
  headline: string;
  intro: string;
  problems: LandingProblemChip[];
  otherHref: string;
  why: LandingWhyPoint[];
  prices: LandingPriceRow[];
  samples: LandingSample[];
  steps: LandingStep[];
  testimonials: LandingTestimonial[];
};

const WHY_FIXBAZI: LandingWhyPoint[] = [
  {
    title: "عیب‌یابی تخصصی",
    detail: "قبل از هر تعمیر، علت ریشه‌ای با ابزار دقیق مشخص می‌شود.",
  },
  {
    title: "قطعات اصلی",
    detail: "HDMI، فن، پاور و قطعات حیاتی از منابع معتبر تأمین می‌شوند.",
  },
  {
    title: "ضمانت تعمیر",
    detail: "۳۰ روز ضمانت تست؛ اگر همان ایراد برگردد رفع مجدد انجام می‌شود.",
  },
  {
    title: "تست کامل",
    detail: "روشن شدن، تصویر، دما و اجرای بازی قبل از تحویل بررسی می‌شود.",
  },
  {
    title: "پیگیری آنلاین",
    detail: "با کد پذیرش، وضعیت تعمیر را لحظه‌ای از صفحه پیگیری می‌بینید.",
  },
];

const SHARED_STEPS: LandingStep[] = [
  {
    title: "ثبت درخواست",
    detail: "فرم را پر می‌کنید یا تماس می‌گیرید؛ پیک یا مراجعه حضوری هماهنگ می‌شود.",
  },
  {
    title: "پذیرش",
    detail: "دستگاه ثبت می‌شود و کد پذیرش برای پیگیری آنلاین در اختیارتان قرار می‌گیرد.",
  },
  {
    title: "عیب‌یابی",
    detail: "تکنسین علت دقیق را پیدا می‌کند؛ بدون حدس و بدون باز کردن بی‌مورد.",
  },
  {
    title: "اعلام هزینه",
    detail: "برآورد شفاف اعلام می‌شود و تا تأیید شما هیچ تعمیری شروع نمی‌شود.",
  },
  {
    title: "تعمیر",
    detail: "قطعه معیوب با قطعه اصلی یا معادل استاندارد تعمیر یا تعویض می‌شود.",
  },
  {
    title: "تست",
    detail: "بعد از مونتاژ، تصویر، دما، بوت و بازی روی دستگاه تست می‌شود.",
  },
  {
    title: "تحویل",
    detail: "دستگاه با ضمانت ۳۰ روزه تحویل می‌شود و وضعیت در پیگیری به «آماده تحویل» می‌رسد.",
  },
];

function chip(label: string, slug: string): LandingProblemChip {
  return { label, href: `/issues/${slug}` };
}

export const CONSOLE_LANDING: Record<ConsoleId, ConsoleLandingContent> = {
  ps5: {
    headline: TOPIC_CLUSTERS.ps5.cityHeadline,
    intro:
      "تعمیر تخصصی پلی‌استیشن ۵ در تهران با عیب‌یابی دقیق، قطعات اصلی، ضمانت ۳۰ روزه و پیگیری آنلاین از پذیرش تا تحویل.",
    problems: [
      chip("روشن نمی‌شود", "ps5-not-turning-on"),
      chip("تصویر ندارد", "ps5-no-video"),
      chip("HDMI خراب", "ps5-hdmi-port-damage"),
      chip("داغ می‌کند", "ps5-overheating"),
      chip("خاموش می‌شود", "ps5-random-shutdown"),
      chip("دیسک نمی‌خواند", "ps5-disc-drive-not-working"),
      chip("مشکل دسته", "ps5-dualsense-controller-problem"),
    ],
    otherHref: "/consoles/ps5/issues",
    why: WHY_FIXBAZI,
    prices: [
      {
        title: "سرویس فن و داغی",
        href: "/issues/ps5-overheating",
        range: { min: 800000, max: 1500000 },
        note: "تمیزکاری، خمیر حرارتی، تست دما",
      },
      {
        title: "تعمیر HDMI",
        href: "/issues/ps5-hdmi-port-damage",
        range: { min: 1200000, max: 2800000 },
        note: "تعویض سوکت و تست تصویر ۴K",
      },
      {
        title: "روشن نشدن / پاور",
        href: "/issues/ps5-power-supply-problem",
        range: { min: 1000000, max: 3200000 },
        note: "پس از عیب‌یابی اعلام دقیق",
      },
      {
        title: "تعمیر مادربرد",
        href: "/issues/ps5-motherboard-repair",
        range: { min: 2500000, max: 6500000 },
        note: "BGA و قطعات حیاتی برد",
      },
      {
        title: "درایو دیسک",
        href: "/issues/ps5-disc-drive-not-working",
        range: { min: 1500000, max: 3500000 },
        note: "سرویس یا تعویض مکانیزم",
      },
      {
        title: "دریفت DualSense",
        href: "/issues/controller-dualsense-drift",
        range: { min: 300000, max: 800000 },
        note: "تعویض آنالوگ و کالیبراسیون",
      },
    ],
    samples: [
      { src: "/ps5repair/ps5-repair1.jpg", caption: "تعمیر برد و بوت PS5" },
      { src: "/ps5repair/ps5-repair2.webp", caption: "عیب‌یابی روشن نشدن" },
      { src: "/ps5repair/ps5repair1.webp", caption: "مونتاژ و تست نهایی" },
      { src: "/ps5repair/ps5-fan.jpg", caption: "سرویس فن و سیستم خنک‌کننده" },
    ],
    steps: SHARED_STEPS,
    testimonials: [
      {
        name: "علی رضایی",
        text: "PS5 تصویر نداشت؛ HDMI عوض شد و همان هفته با ضمانت تحویل گرفتم. وضعیت را از کد پذیرش هم می‌دیدم.",
      },
      {
        name: "نگار محمدی",
        text: "دستگاه داغ می‌کرد و وسط بازی خاموش می‌شد. بعد از سرویس فن کاملاً پایدار شد.",
      },
      {
        name: "محمد کریمی",
        text: "دریفت DualSense درست شد و هزینه را قبل از تعمیر گفتند. شفاف و سریع.",
      },
    ],
  },
  ps4: {
    headline: TOPIC_CLUSTERS.ps4.cityHeadline,
    intro:
      "تعمیر PS4 Slim و Pro در تهران: HDMI، پاور، فن، هارد و Safe Mode با قطعات باکیفیت و پیگیری آنلاین.",
    problems: [
      chip("روشن نمی‌شود", "ps4-not-turning-on"),
      chip("HDMI خراب", "ps4-hdmi-port-damage"),
      chip("داغ می‌کند", "ps4-overheating"),
      chip("صدای فن", "ps4-loud-fan-noise"),
      chip("خاموش می‌شود", "ps4-random-shutdown"),
      chip("هارد خراب", "ps4-hard-drive-failure"),
      chip("Safe Mode", "ps4-safe-mode-error"),
    ],
    otherHref: "/consoles/ps4/issues",
    why: WHY_FIXBAZI,
    prices: [
      {
        title: "سرویس فن و داغی",
        href: "/issues/ps4-overheating",
        range: { min: 600000, max: 1200000 },
        note: "تمیزکاری و تعویض خمیر",
      },
      {
        title: "تعمیر HDMI",
        href: "/issues/ps4-hdmi-port-damage",
        range: { min: 900000, max: 2200000 },
        note: "تعویض سوکت و تست تصویر",
      },
      {
        title: "روشن نشدن / پاور",
        href: "/issues/ps4-power-supply-problem",
        range: { min: 800000, max: 2500000 },
        note: "تست پاور و مدار تغذیه",
      },
      {
        title: "تعویض هارد",
        href: "/issues/ps4-hard-drive-failure",
        range: { min: 700000, max: 2000000 },
        note: "نصب سیستم‌عامل پس از تعویض",
      },
      {
        title: "Safe Mode",
        href: "/issues/ps4-safe-mode-error",
        range: { min: 600000, max: 1800000 },
        note: "نرم‌افزار و سپس سخت‌افزار",
      },
      {
        title: "دریفت DualShock",
        href: "/issues/controller-dualshock-drift",
        range: { min: 250000, max: 650000 },
        note: "تعویض آنالوگ",
      },
    ],
    samples: [
      { src: "/ps4repair/fan1.png", caption: "سرویس فن PS4" },
      { src: "/ps4repair/fan2.png", caption: "تمیزکاری هیت‌سینک" },
      { src: "/ps4repair/fan3.png", caption: "مونتاژ و تست بوت" },
    ],
    steps: SHARED_STEPS,
    testimonials: [
      {
        name: "حسین نوری",
        text: "PS4 Pro وسط بازی خاموش می‌شد. سرویس فن انجام شد و صدا هم کم شد.",
      },
      {
        name: "سارا احمدی",
        text: "هارد خراب بود؛ تعویض کردند و بازی‌ها را هم برگرداندند.",
      },
      {
        name: "پارسا کاظمی",
        text: "هزینه را شفاف گفتند و تا تأیید من تعمیر شروع نشد.",
      },
    ],
  },
  xbox: {
    headline: TOPIC_CLUSTERS.xbox.cityHeadline,
    intro:
      "تعمیر Xbox Series X|S و Xbox One در تهران: HDMI، پاور، فن و هارد با ضمانت تست و پیگیری وضعیت.",
    problems: [
      chip("روشن نمی‌شود", "xbox-not-turning-on"),
      chip("HDMI خراب", "xbox-hdmi-port-damage"),
      chip("مشکل پاور", "xbox-power-supply-problem"),
      chip("داغ می‌کند", "xbox-overheating"),
      chip("صدای فن", "xbox-loud-fan-noise"),
      chip("هارد خراب", "xbox-hard-drive-failure"),
      chip("کرش بازی", "xbox-game-crashing"),
    ],
    otherHref: "/consoles/xbox/issues",
    why: WHY_FIXBAZI,
    prices: [
      {
        title: "سرویس فن و داغی",
        href: "/issues/xbox-overheating",
        range: { min: 700000, max: 1400000 },
        note: "گردگیری و تست حرارتی",
      },
      {
        title: "تعمیر HDMI",
        href: "/issues/xbox-hdmi-port-damage",
        range: { min: 1000000, max: 2600000 },
        note: "تعویض سوکت تصویر",
      },
      {
        title: "تعمیر پاور",
        href: "/issues/xbox-power-supply-problem",
        range: { min: 900000, max: 2800000 },
        note: "منبع تغذیه داخلی یا آداپتور",
      },
      {
        title: "خرابی هارد",
        href: "/issues/xbox-hard-drive-failure",
        range: { min: 800000, max: 2200000 },
        note: "تعویض حافظه و نصب سیستم",
      },
      {
        title: "کرش بازی",
        href: "/issues/xbox-game-crashing",
        range: { min: 700000, max: 1800000 },
        note: "نرم‌افزار یا حافظه",
      },
    ],
    samples: [
      { src: "/xboxrepair/xboxfanrepair.png", caption: "سرویس فن Xbox" },
      { src: "/xboxrepair/xboxfanrepair1.jpg", caption: "عیب‌یابی داغی" },
      { src: "/xboxrepair/xboxfanrepair2.png", caption: "بررسی پاور" },
      { src: "/xboxrepair/xboxfanrepair3.png", caption: "تست نهایی بوت" },
    ],
    steps: SHARED_STEPS,
    testimonials: [
      {
        name: "رضا مرادی",
        text: "Xbox Series X تصویر نمی‌داد. HDMI تعمیر شد و ۴K پایدار برگشت.",
      },
      {
        name: "مینا شریفی",
        text: "پاور خراب بود؛ هزینه را گفتند، تأیید کردم و دو روزه آماده شد.",
      },
      {
        name: "کیانوش فتحی",
        text: "پیگیری آنلاین خیلی کمک کرد. می‌دانستم دستگاه در چه مرحله‌ای است.",
      },
    ],
  },
};

export function formatLandingPrice(range: PriceRange): string {
  return formatRangeToman(range);
}

export function getConsoleLanding(id: ConsoleId): ConsoleLandingContent {
  return CONSOLE_LANDING[id];
}
