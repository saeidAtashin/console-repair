import { APPLE_PHONE_MODELS } from "./apple/models";
import { computeCanvasSize } from "./phone-back";
import type { CaseType, PhoneBrand, PhoneModel } from "./types";

export const PHONE_BRANDS: PhoneBrand[] = [
  {
    slug: "apple",
    name: "اپل",
    nameEn: "Apple",
    logo: "/cases/brands/apple.svg",
  },
  {
    slug: "samsung",
    name: "سامسونگ",
    nameEn: "Samsung",
    logo: "/cases/brands/samsung.svg",
  },
  {
    slug: "xiaomi",
    name: "شیائومی",
    nameEn: "Xiaomi",
    logo: "/cases/brands/xiaomi.svg",
  },
  {
    slug: "huawei",
    name: "هواوی",
    nameEn: "Huawei",
    logo: "/cases/brands/huawei.svg",
  },
];

export const PHONE_MODELS: PhoneModel[] = [
  ...APPLE_PHONE_MODELS,
  {
    slug: "galaxy-s24-ultra",
    brandSlug: "samsung",
    name: "گلکسی S24 Ultra",
    nameEn: "Galaxy S24 Ultra",
    image: "/cases/models/galaxy-s24-ultra.svg",
    ...computeCanvasSize(79.0, 162.3, 290),
    widthMm: 79.0,
    heightMm: 162.3,
  },
  {
    slug: "galaxy-s24",
    brandSlug: "samsung",
    name: "گلکسی S24",
    nameEn: "Galaxy S24",
    image: "/cases/models/galaxy-s24.svg",
    ...computeCanvasSize(70.6, 147.0),
    widthMm: 70.6,
    heightMm: 147.0,
  },
  {
    slug: "galaxy-a54",
    brandSlug: "samsung",
    name: "گلکسی A54",
    nameEn: "Galaxy A54",
    image: "/cases/models/galaxy-a54.svg",
    ...computeCanvasSize(76.7, 158.2, 275),
    widthMm: 76.7,
    heightMm: 158.2,
  },
  {
    slug: "redmi-note-13-pro",
    brandSlug: "xiaomi",
    name: "ردمی نوت ۱۳ پرو",
    nameEn: "Redmi Note 13 Pro",
    image: "/cases/models/redmi-note-13-pro.svg",
    ...computeCanvasSize(74.2, 161.1),
    widthMm: 74.2,
    heightMm: 161.1,
  },
  {
    slug: "poco-x6-pro",
    brandSlug: "xiaomi",
    name: "Poco X6 Pro",
    nameEn: "Poco X6 Pro",
    image: "/cases/models/poco-x6-pro.svg",
    ...computeCanvasSize(74.3, 160.5),
    widthMm: 74.3,
    heightMm: 160.5,
  },
  {
    slug: "p60-pro",
    brandSlug: "huawei",
    name: "P60 Pro",
    nameEn: "P60 Pro",
    image: "/cases/models/p60-pro.svg",
    ...computeCanvasSize(74.8, 161.0),
    widthMm: 74.8,
    heightMm: 161.0,
  },
];

export const CASE_TYPES: CaseType[] = [
  {
    slug: "clear",
    name: "قاب شفاف",
    description: "نمایش کامل رنگ گوشی با محافظت ضد ضربه",
    price: 890_000,
    customizationFee: 150_000,
    color: "#e8f4fc",
    material: "clear",
  },
  {
    slug: "matte",
    name: "قاب مات",
    description: "سطح مات ضد لغزش، مناسب چاپ اختصاصی",
    price: 950_000,
    customizationFee: 150_000,
    color: "#2a2a2e",
    material: "matte",
  },
  {
    slug: "glass",
    name: "قاب شیشه‌ای",
    description: "پوشش شیشه‌ای براق با لبه سیلیکونی",
    price: 1_050_000,
    customizationFee: 180_000,
    color: "#1a1a2e",
    material: "glass",
  },
  {
    slug: "silicone",
    name: "قاب سیلیکونی",
    description: "نرم و انعطاف‌پذیر، محافظت عالی",
    price: 750_000,
    customizationFee: 120_000,
    color: "#3b3b45",
    material: "silicone",
  },
  {
    slug: "leather",
    name: "قاب چرمی",
    description: "چرم مصنوعی با بافت لوکس",
    price: 1_200_000,
    customizationFee: 200_000,
    color: "#4a3728",
    material: "leather",
  },
];

export function getBrandBySlug(slug: string): PhoneBrand | undefined {
  return PHONE_BRANDS.find((b) => b.slug === slug);
}

export function getModelsByBrand(brandSlug: string): PhoneModel[] {
  return PHONE_MODELS.filter((m) => m.brandSlug === brandSlug);
}

export function getModelBySlug(brandSlug: string, modelSlug: string): PhoneModel | undefined {
  return PHONE_MODELS.find(
    (m) => m.brandSlug === brandSlug && m.slug === modelSlug,
  );
}

export function getCaseTypeBySlug(slug: string): CaseType | undefined {
  return CASE_TYPES.find((c) => c.slug === slug);
}

export function getCaseTotalPrice(caseType: CaseType, customized: boolean): number {
  return caseType.price + (customized ? caseType.customizationFee : 0);
}
