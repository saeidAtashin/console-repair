import { Suspense } from "react";
import { notFound } from "next/navigation";

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
  SHOP_CONSOLES,
  SHOP_CONSOLE_META,
  getProducts,
  getProductsGrouped,
  getSearchResultProducts,
  parseShopPageParams,
  type ShopConsole,
} from "@/lib/shop";

type Props = {
  params: Promise<{ console: string }>;
  searchParams: Promise<{ q?: string; condition?: string }>;
};

export function generateStaticParams() {
  return SHOP_CONSOLES.map((console) => ({ console }));
}

export async function generateMetadata({ params }: Props) {
  const { console: consoleSlug } = await params;
  if (!SHOP_CONSOLES.includes(consoleSlug as ShopConsole)) {
    return createPageMetadata({
      title: "صفحه یافت نشد",
      path: `/shop/${consoleSlug}`,
      noIndex: true,
    });
  }

  const shopConsole = consoleSlug as ShopConsole;
  const meta = SHOP_CONSOLE_META[shopConsole];
  const path = `/shop/${shopConsole}`;

  return createPageMetadata({
    title: `خرید ${meta.label}`,
    description: `مدل های نو و دست دوم ${meta.label} با تست سلامت و پشتیبانی فنی.`,
    path,
    keywords: [`خرید ${meta.label}`, `${meta.label} دست دوم`, `${meta.label} نو`],
  });
}

export default async function ShopConsolePage({ params, searchParams }: Props) {
  const [{ console: consoleSlug }, queryParams] = await Promise.all([
    params,
    searchParams,
  ]);

  if (!SHOP_CONSOLES.includes(consoleSlug as ShopConsole)) notFound();

  const shopConsole = consoleSlug as ShopConsole;
  const meta = SHOP_CONSOLE_META[shopConsole];
  const products = getProducts({ console: shopConsole });
  const path = `/shop/${shopConsole}`;
  const { searchQuery, isSearchMode, condition } = parseShopPageParams(queryParams);
  const initialQuery = queryParams.q ?? "";

  const title = `خرید ${meta.label}`;
  const description = `همه مدل های ${meta.label} در فروشگاه، شامل گزینه های نو و دست دوم تست شده.`;

  const grouped = getProductsGrouped({
    console: shopConsole,
    condition: condition === "all" ? undefined : condition,
  });
  const searchResults = isSearchMode
    ? getSearchResultProducts(searchQuery, { limit: 48 })
    : [];

  return (
    <main className="min-h-screen bg-[#050816] pt-24 text-white">
      <PageShell
        currentPath={path}
        jsonLd={[
          collectionPageJsonLd({
            name: title,
            description,
            path,
          }),
          itemListJsonLd({
            name: title,
            path,
            items: products.map((product) => ({
              name: product.title,
              url: `/shop/${product.console}/${product.slug}`,
            })),
          }),
        ]}
        containerClassName="container mx-auto px-6"
        className="container mx-auto px-6 pb-14"
      >
        <h1 className="text-4xl font-black md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-400">{description}</p>

        <Suspense fallback={<ShopCatalogSkeleton />}>
          <ShopPageSearch initialQuery={initialQuery} basePath={path} />
        </Suspense>

        {!isSearchMode ? (
          <Suspense fallback={null}>
            <ShopConditionFilters value={condition} basePath={path} />
          </Suspense>
        ) : null}

        {!isSearchMode ? (
          <ShopConsoleTabs activeConsole={shopConsole} condition={condition} />
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
            activeConsole={shopConsole}
            condition={condition}
          />
        )}

        <ShopServicesSection />
      </PageShell>
    </main>
  );
}
