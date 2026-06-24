import { Suspense } from "react";

import ShopCatalogGrid from "@/app/components/shop/ShopCatalogGrid";
import ShopCatalogSkeleton from "@/app/components/shop/ShopCatalogSkeleton";
import ShopConditionFilters from "@/app/components/shop/ShopConditionFilters";
import ShopConsoleTabs from "@/app/components/shop/ShopConsoleTabs";
import ShopPageSearch from "@/app/components/shop/ShopPageSearch";
import ShopServicesSection from "@/app/components/shop/ShopServicesSection";
import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import {
  getProducts,
  getProductsGrouped,
  getSearchResultProducts,
  parseShopPageParams,
} from "@/lib/shop";

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

type Props = {
  searchParams: Promise<{ q?: string; condition?: string }>;
};

export default async function ShopIndexPage({ searchParams }: Props) {
  const params = await searchParams;
  const { searchQuery, isSearchMode, condition } = parseShopPageParams(params);
  const initialQuery = params.q ?? "";

  const grouped = getProductsGrouped({
    condition: condition === "all" ? undefined : condition,
  });
  const searchResults = isSearchMode
    ? getSearchResultProducts(searchQuery, { limit: 48 })
    : [];

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
        ]}
        containerClassName="container mx-auto px-6"
        className="container mx-auto px-6 pb-14"
      >
        <h1 className="text-4xl font-black md:text-5xl">فروشگاه کنسول بازی</h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-400">{DESCRIPTION}</p>

        <Suspense fallback={<ShopCatalogSkeleton />}>
          <ShopPageSearch initialQuery={initialQuery} basePath={PATH} />
        </Suspense>

        {!isSearchMode ? (
          <Suspense fallback={null}>
            <ShopConditionFilters value={condition} basePath={PATH} />
          </Suspense>
        ) : null}

        {!isSearchMode ? (
          <ShopConsoleTabs activeConsole="all" condition={condition} />
        ) : null}

        {isSearchMode ? (
          <ShopCatalogGrid
            mode="search"
            searchQuery={searchQuery}
            searchResults={searchResults}
          />
        ) : (
          <ShopCatalogGrid
            mode="browse"
            grouped={grouped}
            activeConsole="all"
            condition={condition}
          />
        )}

        <ShopServicesSection />
      </PageShell>
    </main>
  );
}
