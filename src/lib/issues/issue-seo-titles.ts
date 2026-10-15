import type { Issue } from "@/app/data/issues";

type IssueSeo = {
  seoTitle: string;
  seoDescription: string;
};

/** Unique titles for issue pages that do not define seoTitle in issues.ts. */
export const ISSUE_SEO_BY_SLUG: Record<string, IssueSeo> = {
  "ps5-random-shutdown": {
    seoTitle: "خاموش شدن ناگهانی PS5 | علت و تعمیر",
    seoDescription:
      "اگر PS5 وسط بازی خاموش می‌شود معمولاً داغی، پاور یا مدار تغذیه مقصر است. علائم، علل و مسیر تعمیر را ببینید.",
  },
  "ps5-loud-fan-noise": {
    seoTitle: "صدای زیاد فن PS5 | سرویس خنک‌کننده پلی‌استیشن ۵",
    seoDescription:
      "صدای فن PS5 اغلب از گرد و خاک یا خمیر خشک است. علائم، سرویس فن و زمان تعمیر را بخوانید.",
  },
  "ps5-dualsense-controller-problem": {
    seoTitle: "خرابی دسته DualSense | تعمیر دسته PS5",
    seoDescription:
      "دریفت، دکمه، شارژ و تریگر DualSense را چطور تشخیص می‌دهیم و چه زمانی باید دسته را تعمیر کرد.",
  },
  "ps5-wifi-connection-problem": {
    seoTitle: "قطع شدن اینترنت PS5 | تعمیر وای‌فای پلی‌استیشن ۵",
    seoDescription:
      "اگر PS5 به PSN وصل نمی‌شود یا وای‌فای قطع می‌شود، علت می‌تواند تنظیمات یا ماژول شبکه باشد.",
  },
  "ps5-disc-drive-not-working": {
    seoTitle: "درایو دیسک PS5 کار نمی‌کند | تعمیر دیسک‌خوان",
    seoDescription:
      "دیسک خوانده نمی‌شود یا گیر می‌کند؟ علائم خرابی درایو PS5 و مسیر تعمیر مکانیزم و لنز.",
  },
  "ps4-not-turning-on": {
    seoTitle: "روشن نشدن PS4 | علت و تعمیر پلی‌استیشن ۴",
    seoDescription:
      "PS4 روشن نمی‌شود؟ پاور، مادربرد و نوسان برق رایج‌ترین علت‌ها هستند. علائم و مسیر تعمیر.",
  },
  "ps4-hdmi-port-damage": {
    seoTitle: "تعمیر HDMI پلی استیشن 4 | علت نداشتن تصویر PS4",
    seoDescription:
      "اگر PS4 تصویر ندارد یا No Signal می‌بینید، پورت HDMI ممکن است شکسته باشد. علائم و تعمیر سوکت.",
  },
  "ps4-loud-fan-noise": {
    seoTitle: "صدای زیاد فن PS4 | سرویس فن پلی‌استیشن ۴",
    seoDescription:
      "صدای زیاد فن PS4 معمولاً از گرد و خاک یا فرسودگی فن است. سرویس خنک‌کننده و زمان تعمیر.",
  },
  "ps4-overheating": {
    seoTitle: "داغ شدن پلی استیشن 4 | علت overheating PS4",
    seoDescription:
      "PS4 داغ می‌کند و خاموش می‌شود؟ علت فن، خمیر حرارتی و تهویه. علائم و سرویس تخصصی.",
  },
  "ps4-hard-drive-failure": {
    seoTitle: "خرابی هارد PS4 | تعمیر و تعویض هارد",
    seoDescription:
      "هارد PS4 صدا می‌دهد یا بازی‌ها لود نمی‌شوند. علائم خرابی و تعویض هارد با حفظ داده در صورت امکان.",
  },
  "ps4-wifi-connection-problem": {
    seoTitle: "قطع شدن اینترنت PS4 | تعمیر وای‌فای پلی‌استیشن ۴",
    seoDescription:
      "اتصال PS4 به اینترنت قطع یا ناپایدار است؟ تنظیمات شبکه و ماژول وای‌فای را بررسی می‌کنیم.",
  },
  "ps4-random-shutdown": {
    seoTitle: "خاموش شدن ناگهانی PS4 | علت و تعمیر",
    seoDescription:
      "خاموشی ناگهانی PS4 هنگام بازی اغلب به داغی یا پاور مربوط است. علائم و مسیر تعمیر.",
  },
  "ps4-safe-mode-error": {
    seoTitle: "ارور Safe Mode در PS4 | علت و تعمیر",
    seoDescription:
      "PS4 روی Safe Mode می‌ماند؟ علت می‌تواند سیستم‌عامل، هارد یا پاور باشد. راهنمای تعمیر.",
  },
  "xbox-not-turning-on": {
    seoTitle: "روشن نشدن Xbox | علت و تعمیر ایکس‌باکس",
    seoDescription:
      "Xbox Series یا One روشن نمی‌شود. پاور، آداپتور و مادربرد را چطور عیب‌یابی و تعمیر می‌کنیم.",
  },
  "xbox-hdmi-port-damage": {
    seoTitle: "تعمیر HDMI ایکس‌باکس | علت نداشتن تصویر Xbox",
    seoDescription:
      "Xbox تصویر ندارد یا سوکت HDMI لق است. علائم شکستگی پورت و تعویض سوکت با تست تصویر.",
  },
  "xbox-power-supply-problem": {
    seoTitle: "تعمیر پاور Xbox | علت روشن نشدن ایکس‌باکس",
    seoDescription:
      "پاور Xbox خراب شود دستگاه روشن نمی‌ماند. علائم منبع تغذیه Series و One و مسیر تعمیر.",
  },
  "xbox-loud-fan-noise": {
    seoTitle: "صدای زیاد فن Xbox | سرویس فن ایکس‌باکس",
    seoDescription:
      "صدای فن Xbox نشانه فشار حرارتی است. سرویس فن، خمیر و مسیر هوا را ببینید.",
  },
  "xbox-overheating": {
    seoTitle: "داغ شدن Xbox | علت overheating ایکس‌باکس",
    seoDescription:
      "Xbox داغ می‌کند و خاموش می‌شود. علت فن، گرد و خاک و سرویس حرارتی تخصصی.",
  },
  "xbox-hard-drive-failure": {
    seoTitle: "خرابی هارد Xbox | تعمیر حافظه ایکس‌باکس",
    seoDescription:
      "هارد یا SSD ایکس‌باکس خطا می‌دهد. علائم خرابی حافظه و مسیر تعمیر یا تعویض.",
  },
  "xbox-wifi-connection-problem": {
    seoTitle: "قطع شدن اینترنت Xbox | تعمیر وای‌فای ایکس‌باکس",
    seoDescription:
      "Xbox به شبکه وصل نمی‌شود یا قطع می‌شود. تنظیمات، آنتن و ماژول وای‌فای.",
  },
  "xbox-game-crashing": {
    seoTitle: "کرش بازی Xbox | علت بسته شدن بازی ایکس‌باکس",
    seoDescription:
      "بازی‌های Xbox کرش می‌کنند؟ حافظه، حرارت و نرم‌افزار را قبل از تعمیر سخت‌افزار چک می‌کنیم.",
  },
  "console-no-video-signal": {
    seoTitle: "کنسول تصویر ندارد | علت No Signal HDMI",
    seoDescription:
      "کنسول روشن است اما تلویزیون No Signal می‌دهد. کابل، پورت HDMI و مسیر تصویر.",
  },
  "console-screen-flickering": {
    seoTitle: "پرش تصویر کنسول | علت flickering HDMI",
    seoDescription:
      "تصویر کنسول می‌پرد یا قطع و وصل می‌شود. لق بودن سوکت HDMI و تعمیر پورت.",
  },
  "console-hdmi-port-broken": {
    seoTitle: "شکستگی پورت HDMI کنسول | تعویض سوکت",
    seoDescription:
      "سوکت HDMI کنسول شکسته یا کج شده. علائم آسیب فیزیکی و تعویض سوکت با BGA.",
  },
  "console-monitor-not-detected": {
    seoTitle: "کنسول مانیتور را نمی‌شناسد | علت HDMI",
    seoDescription:
      "مانیتور یا تلویزیون توسط کنسول شناسایی نمی‌شود. کابل، ورودی تصویر و پورت HDMI.",
  },
  "console-black-screen": {
    seoTitle: "صفحه سیاه کنسول | علت تصویر نداشتن",
    seoDescription:
      "صفحه سیاه با وجود روشن بودن کنسول. تفاوت مشکل نرم‌افزاری با خرابی HDMI.",
  },
  "console-hdmi-loose-port": {
    seoTitle: "لق بودن سوکت HDMI | تعمیر پورت شل",
    seoDescription:
      "کابل HDMI در پورت کنسول شل است و تصویر قطع می‌شود. تعمیر لحیم و تعویض سوکت.",
  },
  "controller-analog-drift": {
    seoTitle: "دریفت آنالوگ دسته | تعمیر joystick",
    seoDescription:
      "آنالوگ دسته خودبه‌خود حرکت می‌کند. علت فرسودگی ماژول و تعویض joystick.",
  },
  "controller-buttons-not-working": {
    seoTitle: "کار نکردن دکمه دسته بازی | تعمیر دکمه",
    seoDescription:
      "دکمه‌های دسته عمل نمی‌کنند یا گیر می‌کنند. علائم برد، لاستیک و تعویض دکمه.",
  },
  "controller-not-charging": {
    seoTitle: "شارژ نشدن دسته بازی | تعمیر درگاه شارژ",
    seoDescription:
      "دسته PS یا Xbox شارژ نمی‌شود. پورت USB، کابل و برد شارژ را چطور تعمیر می‌کنیم.",
  },
  "controller-connection-dropping": {
    seoTitle: "قطع شدن اتصال دسته | تعمیر بلوتوث دسته",
    seoDescription:
      "دسته بی‌سیم قطع می‌شود. باتری، آنتن بلوتوث و تداخل اتصال را بررسی می‌کنیم.",
  },
  "controller-analog-stick-broken": {
    seoTitle: "شکستگی آنالوگ دسته | تعویض joystick",
    seoDescription:
      "استیک آنالوگ شکسته یا کج شده. تعویض ماژول joystick و کالیبراسیون دسته.",
  },
};

export function resolveIssueSeo(issue: Issue): IssueSeo {
  const extra = ISSUE_SEO_BY_SLUG[issue.slug];
  return {
    seoTitle: issue.seoTitle ?? extra?.seoTitle ?? issue.title,
    seoDescription: issue.seoDescription ?? extra?.seoDescription ?? issue.description,
  };
}
