import { Suspense } from "react";
import { notFound } from "next/navigation";

import ShopPageClient from "@/app/shop/ShopPageClient";
import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  collectionPageJsonLd,
  itemListJsonLd,
  productOfferJsonLd,
} from "@/lib/seo/jsonld";
import {
  SHOP_CONSOLES,
  SHOP_CONSOLE_META,
  getProducts,
  type ShopConsole,
} from "@/lib/shop";

type Props = {
  params: Promise<{ console: string }>;
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

export default async function ShopConsolePage({ params }: Props) {
  const { console: consoleSlug } = await params;
  if (!SHOP_CONSOLES.includes(consoleSlug as ShopConsole)) notFound();

  const shopConsole = consoleSlug as ShopConsole;
  const meta = SHOP_CONSOLE_META[shopConsole];
  const products = getProducts({ console: shopConsole });
  const path = `/shop/${shopConsole}`;

  const title = `خرید ${meta.label}`;
  const description = `همه مدل های ${meta.label} در فروشگاه، شامل گزینه های نو و دست دوم تست شده.`;

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
          ...products.map((product) =>
            productOfferJsonLd({
              product,
              path: `/shop/${product.console}/${product.slug}`,
            }),
          ),
        ]}
        containerClassName="container mx-auto px-6"
        className="container mx-auto px-6 pb-14"
      >
        <h1 className="text-4xl font-black md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-400">{description}</p>
        <Suspense fallback={null}>
          <ShopPageClient defaultConsole={shopConsole} />
        </Suspense>
      </PageShell>
    </main>
  );
}
