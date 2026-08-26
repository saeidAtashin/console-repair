import HomePage from "./components/HomePage";
import JsonLd from "./components/seo/JsonLd";
import { createPageMetadata } from "../lib/seo/metadata";
import { itemListJsonLd, webPageJsonLd } from "../lib/seo/jsonld";
import {
  cheatGamePath,
  getCheatGameImages,
  getFeaturedCheatGames,
  getSampleCheat,
} from "../lib/blog-cheats";
import type { FeaturedCheatCardProps } from "./components/sections/HomeCheatsSectionClient";
import { SHOP_ENABLED, getFeaturedProducts } from "../lib/shop";

const HOME_TITLE = "تعمیر تخصصی کنسول بازی | PS5، PS4 و Xbox";
const HOME_DESCRIPTION =
  "تعمیر تخصصی پلی‌استیشن 5، PS4، Xbox و دسته بازی با گارانتی، عیب‌یابی دقیق و تحویل سریع. ثبت سفارش آنلاین تعمیر و پیگیری وضعیت.";

const featuredProducts = SHOP_ENABLED ? getFeaturedProducts(6) : [];

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
    "رمز بازی",
    "چیت ps5",
  ],
});

const featuredCheats = getFeaturedCheatGames();

const featuredCheatCards: FeaturedCheatCardProps[] = featuredCheats
  .map((game) => {
    const sample = getSampleCheat(game);
    if (!sample) return null;
    return {
      gameSlug: game.gameSlug,
      name: game.name,
      console: game.console,
      images: getCheatGameImages(game),
      sampleTitle: sample.title,
      sampleCode: sample.code,
    };
  })
  .filter((card): card is FeaturedCheatCardProps => card !== null);

const HOME_SCHEMA = [
  webPageJsonLd({
    name: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: "/",
  }),
  ...(SHOP_ENABLED
    ? [
        itemListJsonLd({
          name: "محصولات پیشنهادی فروشگاه",
          path: "/#store",
          items: featuredProducts.map((product) => ({
            name: product.title,
            url: `/shop/${product.console}/${product.slug}`,
          })),
        }),
      ]
    : []),
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
      <HomePage featuredCheatCards={featuredCheatCards} />
    </>
  );
}
