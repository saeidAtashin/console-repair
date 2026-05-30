import { Brand } from "../../lib/brand-theme";

export type ProductCategory = "wood" | "laser" | "milling" | "decor";

export interface Product {
  slug: string;
  category: ProductCategory;
  brand: Brand;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  image: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  priceFrom: number;
  priceTo?: number;
  priceUnit: string;
  priceNote?: string;
  features: string[];
  materials: string[];
  faqs: { question: string; answer: string }[];
}

export const productCategories: {
  id: ProductCategory;
  title: string;
  description: string;
}[] = [
  {
    id: "wood",
    title: "برش چوب و MDF",
    description: "محصولات برش CNC روی MDF و چوب",
  },
  {
    id: "laser",
    title: "برش و حکاکی لیزر",
    description: "برش لیزر و حکاکی روی MDF، اکریلیک و چوب",
  },
  {
    id: "milling",
    title: "فرز و قطعات صنعتی",
    description: "قطعات ماشین‌کاری شده و پروتوتایپ",
  },
  {
    id: "decor",
    title: "تابلو و دکور",
    description: "محصولات دکوراتیو و تابلو CNC",
  },
];

export const products: Product[] = [
  {
    slug: "mdf-cutting-3mm",
    category: "wood",
    brand: "wood",
    title: "برش MDF 3mm",
    shortTitle: "MDF 3mm",
    description: "برش دقیق MDF 3 میلی‌متری با دستگاه CNC",
    longDescription:
      "برش MDF 3mm با دقت بالا برای پروژه‌های دکور، ماکت، بسته‌بندی و قطعات سبک. فایل DXF، SVG یا PDF ارسال کنید تا قیمت نهایی محاسبه شود.",
    image: "/images/cnc/mdf-cutting.svg",
    seoTitle: "برش MDF 3mm | قیمت روز CNC",
    seoDescription:
      "برش CNC MDF 3mm با قیمت از ۱۵۰ هزار تومان به ازای m². سفارش آنلاین با ارسال فایل.",
    keywords: ["برش mdf", "برش cnc mdf", "قیمت برش mdf"],
    priceFrom: 150000,
    priceTo: 250000,
    priceUnit: "هر m²",
    features: ["دقت بالا", "لبه تمیز", "تحویل سریع"],
    materials: ["MDF 3mm", "HDF 3mm"],
    faqs: [
      {
        question: "حداقل سفارش چقدر است؟",
        answer: "حداقل سفارش معمولاً یک برگه 60×120 سانتی‌متری است.",
      },
    ],
  },
  {
    slug: "mdf-cutting-8mm",
    category: "wood",
    brand: "wood",
    title: "برش MDF 8mm",
    shortTitle: "MDF 8mm",
    description: "برش MDF 8 میلی‌متری برای مبلمان، دکور و ساخت",
    longDescription:
      "برش MDF 8mm مناسب پروژه‌های مبلمان، کابینت، دکور دیواری و قطعات ساختاری. قیمت بر اساس متراژ و پیچیدگی طرح.",
    image: "/images/cnc/mdf-cutting.svg",
    seoTitle: "برش MDF 8mm | قیمت CNC",
    seoDescription: "برش CNC MDF 8mm از ۲۰۰ هزار تومان به ازای m².",
    keywords: ["برش mdf 8mm", "cnc mdf"],
    priceFrom: 200000,
    priceTo: 350000,
    priceUnit: "هر m²",
    features: ["ضخامت 8mm", "لبه صاف", "امکان حکاکی"],
    materials: ["MDF 8mm", "MDF 10mm"],
    faqs: [],
  },
  {
    slug: "wood-sign-cnc",
    category: "decor",
    brand: "wood",
    title: "تابلو چوبی CNC",
    shortTitle: "تابلو چوبی",
    description: "تابلو چوبی و MDF با حکاکی و برش CNC",
    longDescription:
      "طراحی و تولید تابلو چوبی، MDF و HDF برای مغازه، دفتر، منزل و رویداد. شامل حکاکی متن، لوگو و برش شکل.",
    image: "/images/cnc/sign-decor.svg",
    seoTitle: "تابلو چوبی CNC | قیمت تابلو",
    seoDescription: "تابلو چوبی CNC از ۸۰۰ هزار تومان. سفارش با فایل یا مشاوره طراحی.",
    keywords: ["تابلو cnc", "تابلو چوبی", "حروف برجسته"],
    priceFrom: 800000,
    priceTo: 3500000,
    priceUnit: "هر عدد",
    priceNote: "بسته به ابعاد و پیچیدگی",
    features: ["حکاکی متن و لوگو", "رنگ‌آمیزی", "نصب"],
    materials: ["MDF", "چوب روسی", "HDF"],
    faqs: [
      {
        question: "آیا طراحی هم انجام می‌دهید؟",
        answer: "بله، طراحی فایل با هزینه جداگانه انجام می‌شود.",
      },
    ],
  },
  {
    slug: "raised-letters-mdf",
    category: "decor",
    brand: "laser",
    title: "حروف برجسته MDF",
    shortTitle: "حروف برجسته",
    description: "حروف برجسته MDF و PVC برای تابلو و دکور",
    longDescription:
      "تولید حروف برجسته با برش CNC و لیزر برای تابلو مغازه، دکور دیواری و استند. قیمت به ازای هر حرف یا مجموعه.",
    image: "/images/cnc/sign-decor.svg",
    seoTitle: "حروف برجسته MDF | قیمت CNC",
    seoDescription: "حروف برجسته MDF از ۵۰۰ هزار تومان به ازای حرف.",
    keywords: ["حروف برجسته", "حروف mdf", "تابلو مغازه"],
    priceFrom: 500000,
    priceTo: 1200000,
    priceUnit: "هر حرف",
    features: ["برش دقیق", "لبه تمیز", "امکان رنگ"],
    materials: ["MDF", "PVC", "اکریلیک"],
    faqs: [],
  },
  {
    slug: "laser-acrylic-cutting",
    category: "laser",
    brand: "laser",
    title: "برش لیزر اکریلیک",
    shortTitle: "لیزر اکریلیک",
    description: "برش و حکاکی لیزر روی اکریلیک شفاف و رنگی",
    longDescription:
      "برش لیزر اکریلیک برای استند، تابلو، قطعات دکور و پروتوتایپ. ضخامت‌های 2 تا 10 میلی‌متری.",
    image: "/images/cnc/laser-cutting.svg",
    seoTitle: "برش لیزر اکریلیک | قیمت",
    seoDescription: "برش لیزر اکریلیک از ۲۰۰ هزار تومان به ازای m².",
    keywords: ["برش لیزر اکریلیک", "لیزر cnc"],
    priceFrom: 200000,
    priceTo: 400000,
    priceUnit: "هر m²",
    features: ["لبه براق", "دقت میلی‌متری", "طرح پیچیده"],
    materials: ["اکریلیک شفاف", "اکریلیک رنگی"],
    faqs: [],
  },
  {
    slug: "laser-engraving",
    category: "laser",
    brand: "laser",
    title: "حکاکی لیزر",
    shortTitle: "حکاکی لیزر",
    description: "حکاکی متن، لوگو و نقش روی چوب، MDF و اکریلیک",
    longDescription:
      "حکاکی لیزر برای هدیه، تابلو، قطعات دکور و شخصی‌سازی. مناسب چوب، MDF، چرم و اکریلیک.",
    image: "/images/cnc/laser-cutting.svg",
    seoTitle: "حکاکی لیزر | قیمت CNC",
    seoDescription: "حکاکی لیزر از ۲۵۰ هزار تومان به ازای m².",
    keywords: ["حکاکی لیزر", "حکاکی cnc"],
    priceFrom: 250000,
    priceTo: 500000,
    priceUnit: "هر m²",
    features: ["جزئیات بالا", "سرعت مناسب", "بدون تماس"],
    materials: ["MDF", "چوب", "اکریلیک", "چرم"],
    faqs: [],
  },
  {
    slug: "custom-decor-part",
    category: "decor",
    brand: "industrial",
    title: "قطعه دکوراتیو سفارشی",
    shortTitle: "قطعه دکور",
    description: "تولید قطعات دکوراتیو سفارشی با CNC",
    longDescription:
      "هر قطعه دکوراتیو بر اساس فایل شما — از جاکلیدی و استند تا المان‌های دکور دیواری و میز.",
    image: "/images/cnc/sign-decor.svg",
    seoTitle: "قطعه دکور CNC سفارشی",
    seoDescription: "تولید قطعه دکور CNC از ۳۰۰ هزار تومان. استعلام بر اساس فایل.",
    keywords: ["قطعه cnc", "دکور cnc"],
    priceFrom: 300000,
    priceTo: 2000000,
    priceUnit: "استعلام",
    priceNote: "قیمت پس از بررسی فایل",
    features: ["سفارشی", "MDF و چوب", "رنگ‌آمیزی"],
    materials: ["MDF", "چوب", "HDF"],
    faqs: [],
  },
  {
    slug: "key-holder-stand",
    category: "decor",
    brand: "wood",
    title: "استند و جاکلیدی CNC",
    shortTitle: "جاکلیدی",
    description: "استند، جاکلیدی و محصولات کوچک CNC",
    longDescription:
      "تولید جاکلیدی، استند موبایل، جامدادی و محصولات کوچک دکوراتیو با برش CNC.",
    image: "/images/cnc/sign-decor.svg",
    seoTitle: "جاکلیدی CNC | استند CNC",
    seoDescription: "جاکلیدی و استند CNC از ۱۵۰ هزار تومان.",
    keywords: ["جاکلیدی cnc", "استند cnc"],
    priceFrom: 150000,
    priceTo: 450000,
    priceUnit: "هر عدد",
    features: ["طرح آماده یا سفارشی", "MDF و چوب", "تحویل سریع"],
    materials: ["MDF 3mm", "MDF 8mm", "چوب"],
    faqs: [],
  },
  {
    slug: "industrial-prototype",
    category: "milling",
    brand: "metal",
    title: "پروتوتایپ قطعه صنعتی",
    shortTitle: "پروتوتایپ",
    description: "فرز CNC و تولید پروتوتایپ قطعات",
    longDescription:
      "ماشین‌کاری و فرز CNC برای پروتوتایپ، قالب، پروفیل و قطعات صنعتی. استعلام بر اساس فایل STEP/DXF.",
    image: "/images/cnc/milling.svg",
    seoTitle: "پروتوتایپ CNC | فرز CNC",
    seoDescription: "پروتوتایپ و فرز CNC از ۵۰۰ هزار تومان. استعلام فنی.",
    keywords: ["فرز cnc", "پروتوتایپ cnc", "ماشین کاری"],
    priceFrom: 500000,
    priceTo: 5000000,
    priceUnit: "استعلام",
    priceNote: "وابسته به جنس و پیچیدگی",
    features: ["دقت صنعتی", "چوب و آلومینیوم", "فایل STEP/DXF"],
    materials: ["MDF", "آلومینیوم", "PVC", "چوب"],
    faqs: [
      {
        question: "چه فایل‌هایی قبول می‌کنید؟",
        answer: "DXF، SVG، PDF، STEP و STL.",
      },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function formatProductPrice(product: Product): string {
  const from = new Intl.NumberFormat("fa-IR").format(product.priceFrom);
  if (product.priceTo) {
    const to = new Intl.NumberFormat("fa-IR").format(product.priceTo);
    return `از ${from} تا ${to} ${product.priceUnit}`;
  }
  return `از ${from} ${product.priceUnit}`;
}
