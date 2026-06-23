import { Suspense } from "react";

import ShopPageClient from "./ShopPageClient";
import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  collectionPageJsonLd,
  itemListJsonLd,
  productOfferJsonLd,
} from "@/lib/seo/jsonld";
import { getProducts } from "@/lib/shop";

const PATH = "/shop";
const TITLE = "فروشگاه کنسول بازی";
const DESCRIPTION =
  "خرید کنسول PS5، PS4، Xbox One و Xbox Series به‌همراه ابزار، لوازم جانبی و قطعات مرتبط — نو یا دست‌دوم تست‌شده.";
const products = getProducts();

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "خرید ps5",
    "خرید ps4",
    "خرید xbox series",
    "خرید xbox one",
    "کنسول دست دوم",
    "لوازم جانبی ps5",
    "دسته بازی xbox",
  ],
});

export default function ShopIndexPage() {
  return (
    <main className="min-h-screen bg-[#050816] pt-24 text-white">
      <PageShell
        currentPath={PATH}
        jsonLd={[
          collectionPageJsonLd({ name: TITLE, description: DESCRIPTION, path: PATH }),
          itemListJsonLd({
            name: TITLE,
            path: PATH,
            items: products.map((product) => ({
              name: product.title,
              url: `/shop/${product.console}/${product.slug}`,
            })),
          }),
          ...products.map((product) =>
            productOfferJsonLd({
              product,
              path: `/shop/${product.console}/${product.slug}`,
            }),
          ),
        ]}
        containerClassName="container mx-auto px-6"
      >
        <h1 className="text-4xl font-black md:text-5xl">فروشگاه کنسول بازی</h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-400">{DESCRIPTION}</p>
        <Suspense fallback={null}>
          <ShopPageClient />
        </Suspense>
      </PageShell>
    </main>
  );
}
