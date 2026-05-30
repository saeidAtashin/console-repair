import {
  Layers,
  Zap,
  Cog,
  PenTool,
  Puzzle,
  Signpost,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Brand } from "../../lib/brand-theme";

export interface Service {
  slug: string;
  brand: Brand;
  categoryTag: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  image: string;
  cover: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  estimatedTime: string;
  warranty: string;
  priceRange: string;
  features: string[];
  relatedProducts: { slug: string; title: string }[];
  processSteps: string[];
  faqs: { question: string; answer: string }[];
  layout: string;
}

export const services: Service[] = [
  {
    slug: "cnc-wood-cutting",
    layout: "A",
    brand: "wood",
    categoryTag: "برش چوب",
    title: "برش CNC چوب و MDF",
    shortTitle: "Wood Cutting",
    description:
      "برش دقیق MDF، HDF و چوب با دستگاه CNC و قیمت روز بازار.",
    longDescription:
      "خدمات برش CNC روی MDF، HDF و انواع چوب با دقت بالا. مناسب مبلمان، دکور، ماکت، بسته‌بندی و قطعات ساختاری. فایل DXF، SVG یا PDF ارسال کنید تا قیمت و زمان تحویل اعلام شود.",
    icon: Layers,
    image: "/images/cnc/mdf-cutting.svg",
    cover: "/images/cnc/mdf-cutting.svg",
    seoTitle: "برش CNC چوب و MDF | قیمت روز",
    seoDescription:
      "برش CNC MDF و چوب از ۱۵۰ هزار تومان. سفارش آنلاین با ارسال فایل.",
    keywords: ["برش cnc", "برش mdf", "cnc چوب", "قیمت برش mdf"],
    estimatedTime: "۱ تا ۵ روز کاری",
    warranty: "تضمین کیفیت برش",
    priceRange: "از ۱۵۰ هزار تومان",
    features: [
      "برش MDF 3 تا 25mm",
      "دقت میلی‌متری",
      "لبه تمیز و صاف",
      "تحویل سریع",
      "امکان تیراژ",
      "مشاوره فنی رایگان",
    ],
    relatedProducts: [
      { slug: "mdf-cutting-3mm", title: "برش MDF 3mm" },
      { slug: "mdf-cutting-8mm", title: "برش MDF 8mm" },
    ],
    processSteps: [
      "ارسال فایل و مشخصات",
      "بررسی و استعلام قیمت",
      "تأیید سفارش",
      "برش CNC",
      "کنترل کیفیت",
      "تحویل",
    ],
    faqs: [
      {
        question: "چه فایل‌هایی برای برش لازم است؟",
        answer: "DXF، SVG، PDF یا فایل vector. در صورت نداشتن فایل، طراحی با هزینه جداگانه انجام می‌شود.",
      },
      {
        question: "حداقل سفارش چقدر است؟",
        answer: "معمولاً حداقل یک برگه 60×120 سانتی‌متری یا معادل آن.",
      },
    ],
  },
  {
    slug: "laser-cutting",
    layout: "A",
    brand: "laser",
    categoryTag: "لیزر",
    title: "برش و حکاکی لیزر",
    shortTitle: "Laser Cutting",
    description:
      "برش و حکاکی لیزر روی MDF، چوب، اکریلیک و PVC.",
    longDescription:
      "برش و حکاکی با دستگاه لیزر CO2 برای پروژه‌های دکور، تابلو، هدیه و قطعات ظریف. دقت بالا، لبه تمیز و امکان اجرای طرح‌های پیچیده.",
    icon: Zap,
    image: "/images/cnc/laser-cutting.svg",
    cover: "/images/cnc/laser-cutting.svg",
    seoTitle: "برش و حکاکی لیزر | قیمت CNC",
    seoDescription:
      "برش لیزر MDF و اکریلیک از ۱۸۰ هزار تومان. حکاکی لیزر از ۲۵۰ هزار تومان.",
    keywords: ["برش لیزر", "حکاکی لیزر", "لیزر mdf", "لیزر اکریلیک"],
    estimatedTime: "۱ تا ۴ روز کاری",
    warranty: "تضمین کیفیت",
    priceRange: "از ۱۸۰ هزار تومان",
    features: [
      "برش MDF و اکریلیک",
      "حکاکی متن و لوگو",
      "حروف برجسته",
      "لبه براق",
      "طرح پیچیده",
      "سرعت بالا",
    ],
    relatedProducts: [
      { slug: "laser-acrylic-cutting", title: "برش لیزر اکریلیک" },
      { slug: "laser-engraving", title: "حکاکی لیزر" },
      { slug: "raised-letters-mdf", title: "حروف برجسته MDF" },
    ],
    processSteps: [
      "ارسال طرح",
      "بررسی جنس و ضخامت",
      "اعلام قیمت",
      "برش/حکاکی لیزر",
      "پرداخت نهایی",
      "تحویل",
    ],
    faqs: [
      {
        question: "روی چه جنس‌هایی کار می‌کنید؟",
        answer: "MDF، چوب، اکریلیک، PVC، چرم و برخی پارچه‌ها.",
      },
    ],
  },
  {
    slug: "cnc-milling",
    layout: "A",
    brand: "metal",
    categoryTag: "فرز CNC",
    title: "فرز CNC",
    shortTitle: "CNC Milling",
    description:
      "ماشین‌کاری، فرز CNC و تولید قطعات و پروتوتایپ.",
    longDescription:
      "خدمات فرز CNC برای قطعات صنعتی، قالب، پروفیل، پروتوتایپ و کارهای سه‌بعدی. روی MDF، چوب، PVC و آلومینیوم.",
    icon: Cog,
    image: "/images/cnc/milling.svg",
    cover: "/images/cnc/milling.svg",
    seoTitle: "فرز CNC | ماشین‌کاری CNC",
    seoDescription:
      "فرز CNC و پروتوتایپ از ۵۰۰ هزار تومان. استعلام بر اساس فایل STEP/DXF.",
    keywords: ["فرز cnc", "ماشین کاری cnc", "پروتوتایپ cnc"],
    estimatedTime: "۳ تا ۱۰ روز کاری",
    warranty: "کنترل کیفیت",
    priceRange: "از ۵۰۰ هزار تومان",
    features: [
      "فرز 3 محور",
      "پروتوتایپ",
      "قالب و پروفیل",
      "آلومینیوم و MDF",
      "دقت صنعتی",
      "مشاوره فنی",
    ],
    relatedProducts: [
      { slug: "industrial-prototype", title: "پروتوتایپ قطعه صنعتی" },
    ],
    processSteps: [
      "ارسال فایل STEP/DXF",
      "بررسی فنی",
      "استعلام قیمت",
      "برنامه‌ریزی CAM",
      "فرز CNC",
      "تحویل",
    ],
    faqs: [
      {
        question: "چه فایل‌هایی برای فرز لازم است؟",
        answer: "STEP، STL، DXF یا PDF با ابعاد دقیق.",
      },
    ],
  },
  {
    slug: "cnc-engraving",
    layout: "A",
    brand: "laser",
    categoryTag: "حکاکی",
    title: "حکاکی و تراش CNC",
    shortTitle: "CNC Engraving",
    description:
      "حکاکی و تراش CNC روی چوب، MDF و سطوح مختلف.",
    longDescription:
      "حکاکی و تراش با CNC برای تابلو، هدیه، قطعات دکور و شخصی‌سازی. مناسب متن، لوگو، نقش و الگوهای تزئینی.",
    icon: PenTool,
    image: "/images/cnc/laser-cutting.svg",
    cover: "/images/cnc/laser-cutting.svg",
    seoTitle: "حکاکی CNC | تراش CNC",
    seoDescription: "حکاکی و تراش CNC از ۲۵۰ هزار تومان.",
    keywords: ["حکاکی cnc", "تراش cnc", "حکاکی چوب"],
    estimatedTime: "۱ تا ۳ روز کاری",
    warranty: "تضمین کیفیت",
    priceRange: "از ۲۵۰ هزار تومان",
    features: [
      "حکاکی متن و لوگو",
      "تراش سه‌بعدی",
      "چوب و MDF",
      "جزئیات بالا",
      "شخصی‌سازی",
    ],
    relatedProducts: [
      { slug: "laser-engraving", title: "حکاکی لیزر" },
    ],
    processSteps: [
      "ارسال طرح",
      "انتخاب جنس",
      "حکاکی/تراش",
      "پرداخت",
      "تحویل",
    ],
    faqs: [],
  },
  {
    slug: "custom-parts",
    layout: "A",
    brand: "industrial",
    categoryTag: "سفارشی",
    title: "تولید قطعات سفارشی",
    shortTitle: "Custom Parts",
    description:
      "تولید قطعات دکور، صنعتی و پروتوتایپ بر اساس فایل شما.",
    longDescription:
      "هر قطعه سفارشی — از المان دکور تا قطعه صنعتی — با CNC تولید می‌شود. فایل طراحی ارسال کنید یا از مشاوره طراحی استفاده کنید.",
    icon: Puzzle,
    image: "/images/cnc/milling.svg",
    cover: "/images/cnc/milling.svg",
    seoTitle: "قطعات سفارشی CNC",
    seoDescription: "تولید قطعه سفارشی CNC از ۳۰۰ هزار تومان.",
    keywords: ["قطعه cnc", "تولید سفارشی cnc"],
    estimatedTime: "بر اساس پروژه",
    warranty: "کنترل کیفیت",
    priceRange: "از ۳۰۰ هزار تومان",
    features: [
      "سفارشی 100%",
      "MDF، چوب، PVC",
      "پروتوتایپ",
      "تیراژ",
      "طراحی فایل",
    ],
    relatedProducts: [
      { slug: "custom-decor-part", title: "قطعه دکوراتیو" },
      { slug: "industrial-prototype", title: "پروتوتایپ صنعتی" },
    ],
    processSteps: [
      "مشاوره",
      "طراحی/دریافت فایل",
      "استعلام",
      "تولید",
      "تحویل",
    ],
    faqs: [],
  },
  {
    slug: "signs-decor",
    layout: "A",
    brand: "wood",
    categoryTag: "دکور",
    title: "تابلو و محصولات دکور",
    shortTitle: "Signs & Decor",
    description:
      "تابلو، حروف برجسته، استند و محصولات دکوراتیو CNC.",
    longDescription:
      "طراحی و تولید تابلو مغازه، حروف برجسته MDF، استند، جاکلیدی و محصولات دکور با CNC و لیزر.",
    icon: Signpost,
    image: "/images/cnc/sign-decor.svg",
    cover: "/images/cnc/sign-decor.svg",
    seoTitle: "تابلو CNC | دکور CNC",
    seoDescription: "تابلو و دکور CNC از ۱۵۰ هزار تومان.",
    keywords: ["تابلو cnc", "حروف برجسته", "دکور cnc"],
    estimatedTime: "۲ تا ۷ روز کاری",
    warranty: "تضمین کیفیت",
    priceRange: "از ۱۵۰ هزار تومان",
    features: [
      "تابلو مغازه",
      "حروف برجسته",
      "استند و جاکلیدی",
      "رنگ‌آمیزی",
      "نصب",
    ],
    relatedProducts: [
      { slug: "wood-sign-cnc", title: "تابلو چوبی CNC" },
      { slug: "raised-letters-mdf", title: "حروف برجسته" },
      { slug: "key-holder-stand", title: "جاکلیدی CNC" },
    ],
    processSteps: [
      "انتخاب محصول یا طرح",
      "ابعاد و جنس",
      "تولید",
      "رنگ (در صورت نیاز)",
      "تحویل/نصب",
    ],
    faqs: [],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
