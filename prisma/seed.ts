import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "بسته هدیه گیمینگ",
    slug: "gift-boxes",
    description: "بسته‌های آماده و شیک برای هدیه دادن به گیمرها",
    sortOrder: 1,
  },
  {
    name: "دسته بازی",
    slug: "controllers",
    description: "گیم‌پدهای اورجینال و لوکس برای PS و Xbox",
    sortOrder: 2,
  },
  {
    name: "هدست و صدا",
    slug: "headsets",
    description: "هدست‌های گیمینگ با کیفیت صدای عالی",
    sortOrder: 3,
  },
  {
    name: "گیفت کارت",
    slug: "gift-cards",
    description: "گیفت کارت PlayStation و Xbox",
    sortOrder: 4,
  },
  {
    name: "اکسسوری",
    slug: "accessories",
    description: "لوازم جانبی کاربردی برای گیمرها",
    sortOrder: 5,
  },
];

const products = [
  {
    name: "بسته هدیه گیمینگ PS5",
    slug: "ps5-gift-box",
    shortDescription: "بسته کامل هدیه شامل گیم‌پد و اکسسوری",
    description:
      "بسته هدیه ویژه برای طرفداران PlayStation 5. شامل گیم‌پد DualSense، کاور محافظ و بسته‌بندی هدیه لوکس. مناسب تولد، سالگرد و مناسبت‌های خاص.",
    price: 8_500_000,
    compareAtPrice: 9_200_000,
    stock: 12,
    isFeatured: true,
    isGiftReady: true,
    giftNote: "بسته‌بندی هدیه رایگان با کارت تبریک",
    categorySlug: "gift-boxes",
  },
  {
    name: "بسته هدیه Xbox Series",
    slug: "xbox-gift-box",
    shortDescription: "ست هدیه کامل برای گیمر Xbox",
    description:
      "بسته هدیه شامل گیم‌پد Xbox Wireless، پایه شارژ و بسته‌بندی ویژه. هدیه‌ای ایده‌آل برای دوستان و خانواده.",
    price: 7_800_000,
    compareAtPrice: 8_400_000,
    stock: 8,
    isFeatured: true,
    isGiftReady: true,
    giftNote: "کارت تبریک شخصی‌سازی‌شده",
    categorySlug: "gift-boxes",
  },
  {
    name: "DualSense Midnight Black",
    slug: "dualsense-midnight-black",
    shortDescription: "گیم‌پد اورجینال PS5 رنگ مشکی",
    description:
      "دسته بازی DualSense اورجینال Sony با فیدبک لمسی و تریگرهای تطبیقی. مناسب هدیه برای دارندگان PS5.",
    price: 4_200_000,
    compareAtPrice: 4_500_000,
    stock: 20,
    isFeatured: true,
    isGiftReady: true,
    giftNote: "قابل بسته‌بندی هدیه",
    categorySlug: "controllers",
  },
  {
    name: "Xbox Wireless Controller",
    slug: "xbox-wireless-controller",
    shortDescription: "گیم‌پد بی‌سیم Xbox",
    description:
      "کنترلر بی‌سیم Xbox با طراحی ارگونومیک و سازگاری با PC و Xbox. هدیه‌ای عالی برای گیمرها.",
    price: 3_800_000,
    stock: 15,
    isFeatured: false,
    isGiftReady: true,
    giftNote: "",
    categorySlug: "controllers",
  },
  {
    name: "هدست Pulse 3D",
    slug: "pulse-3d-headset",
    shortDescription: "هدست 3D Audio برای PS5",
    description:
      "هدست Pulse 3D Wireless با پشتیبانی Tempest 3D AudioTech. تجربه صوتی فراگیر برای بازی‌های PS5.",
    price: 5_500_000,
    compareAtPrice: 6_000_000,
    stock: 10,
    isFeatured: true,
    isGiftReady: true,
    giftNote: "جعبه هدیه اختصاصی",
    categorySlug: "headsets",
  },
  {
    name: "هدست Xbox Stereo",
    slug: "xbox-stereo-headset",
    shortDescription: "هدست استریو Xbox",
    description:
      "هدست سبک و راحت Xbox با میکروفون قابل جمع‌شدن. مناسب چت آنلاین و بازی.",
    price: 2_900_000,
    stock: 18,
    isFeatured: false,
    isGiftReady: true,
    giftNote: "",
    categorySlug: "headsets",
  },
  {
    name: "گیفت کارت PSN ۵۰۰ هزار تومان",
    slug: "psn-gift-card-500k",
    shortDescription: "گیفت کارت PlayStation Store",
    description:
      "گیفت کارت ۵۰۰ هزار تومانی PlayStation Network. تحویل فوری کد دیجیتال. بهترین هدیه برای گیمر PS.",
    price: 500_000,
    stock: 50,
    isFeatured: true,
    isGiftReady: true,
    giftNote: "ارسال کد در کمتر از ۱ ساعت",
    categorySlug: "gift-cards",
  },
  {
    name: "گیفت کارت Xbox ۱ میلیون تومان",
    slug: "xbox-gift-card-1m",
    shortDescription: "گیفت کارت Microsoft Store",
    description:
      "گیفت کارت ۱ میلیون تومانی Xbox و Microsoft Store. تحویل دیجیتال سریع.",
    price: 1_000_000,
    stock: 40,
    isFeatured: false,
    isGiftReady: true,
    giftNote: "تحویل دیجیتال",
    categorySlug: "gift-cards",
  },
  {
    name: "پایه شارژ DualSense",
    slug: "dualsense-charging-dock",
    shortDescription: "پایه شارژ دوگانه گیم‌پد PS5",
    description:
      "پایه شارژ رسمی Sony برای دو گیم‌پد DualSense. هدیه‌ای کاربردی و شیک.",
    price: 1_800_000,
    stock: 25,
    isFeatured: false,
    isGiftReady: true,
    giftNote: "",
    categorySlug: "accessories",
  },
  {
    name: "کاور سیلیکونی گیم‌پد",
    slug: "controller-silicone-cover",
    shortDescription: "کاور محافظ سیلیکونی",
    description:
      "کاور سیلیکونی نرم با بافض anti-slip. سازگار با DualSense و Xbox Controller.",
    price: 350_000,
    stock: 60,
    isFeatured: false,
    isGiftReady: true,
    giftNote: "",
    categorySlug: "accessories",
  },
  {
    name: "ست LED برای Setup گیمینگ",
    slug: "gaming-led-kit",
    shortDescription: "نوار LED RGB برای میز گیمینگ",
    description:
      "ست نوار LED RGB با کنترل از راه دور. هدیه‌ای جذاب برای دکور اتاق گیمینگ.",
    price: 890_000,
    compareAtPrice: 990_000,
    stock: 30,
    isFeatured: true,
    isGiftReady: true,
    giftNote: "بسته‌بندی هدیه",
    categorySlug: "accessories",
  },
  {
    name: "کیف حمل کنسول",
    slug: "console-carry-case",
    shortDescription: "کیف محافظ PS5 / Xbox",
    description:
      "کیف سخت‌افزار مقاوم برای حمل ایمن کنسول و لوازم جانبی. مناسب سفر و جابجایی.",
    price: 1_200_000,
    stock: 14,
    isFeatured: false,
    isGiftReady: true,
    giftNote: "",
    categorySlug: "accessories",
  },
];

async function main() {
  console.log("Seeding gift shop data...");

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id]),
  );

  for (const p of products) {
    const categoryId = categoryMap[p.categorySlug];
    if (!categoryId) continue;

    const { categorySlug: _, ...productData } = p;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...productData, categoryId },
      create: { ...productData, categoryId },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
