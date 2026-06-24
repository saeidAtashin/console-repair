import HomePage from "./components/HomePage";
import JsonLd from "./components/seo/JsonLd";
import { createPageMetadata } from "../lib/seo/metadata";
import { itemListJsonLd, webPageJsonLd } from "../lib/seo/jsonld";
import { getFeaturedCheatGames, cheatGamePath } from "../lib/blog-cheats";
import { getFeaturedProducts } from "../lib/shop";

const HOME_TITLE = "تعمیر تخصصی کنسول بازی | PS5، PS4 و Xbox";
const HOME_DESCRIPTION =
  "تعمیر تخصصی پلی‌استیشن 5، PS4، Xbox و دسته بازی با گارانتی، عیب‌یابی دقیق و تحویل سریع. خرید کنسول، لوازم جانبی و قطعات از فروشگاه — ثبت سفارش آنلاین و پیگیری وضعیت.";

const featuredProducts = getFeaturedProducts(6);

export const metadata = createPageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  keywords: [
    "تعمیر کنسول",
    "تعمیر ps5",
    "تعمیر ps4",
    "تعمیر xbox",
    "تعمیر hdmi کنسول",
    "تعمیر دسته ps5",
    "خرید ps5",
    "خرید ps4",
    "فروشگاه کنسول",
    "کنسول دست دوم",
    "لوازم جانبی ps5",
    "رمز بازی",
    "چیت ps5",
  ],
});

const featuredCheats = getFeaturedCheatGames();

const HOME_SCHEMA = [
  webPageJsonLd({
    name: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: "/",
  }),
  itemListJsonLd({
    name: "محصولات پیشنهادی فروشگاه",
    path: "/#store",
    items: featuredProducts.map((product) => ({
      name: product.title,
      url: `/shop/${product.console}/${product.slug}`,
    })),
  }),
  itemListJsonLd({
    name: "رمز و چیت بازی‌های محبوب",
    path: "/#game-cheats",
    items: featuredCheats.map((game) => ({
      name: `چیت ${game.name}`,
      url: cheatGamePath(game.gameSlug),
    })),
  }),
];

export default function Home() {
  return (
    <>
      <JsonLd data={HOME_SCHEMA} />
      <HomePage />
    </>
  );
}
