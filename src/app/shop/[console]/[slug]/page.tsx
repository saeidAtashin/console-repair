import { notFound } from "next/navigation";

import FAQSchema from "@/app/components/schema/FAQSchema";
import ProductDetailClient from "@/app/components/shop/product-detail/ProductDetailClient";
import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  itemListJsonLd,
  productOfferJsonLd,
  webPageJsonLd,
} from "@/lib/seo/jsonld";
import {
  SHOP_CONSOLES,
  SHOP_CONSOLE_META,
  buildProductDetail,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  type ShopConsole,
} from "@/lib/shop";

type Props = {
  params: Promise<{ console: string; slug: string }>;
};

export function generateStaticParams() {
  return getProducts().map((product) => ({
    console: product.console,
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { console: consoleSlug, slug } = await params;
  if (!SHOP_CONSOLES.includes(consoleSlug as ShopConsole)) {
    return createPageMetadata({
      title: "صفحه یافت نشد",
      path: `/shop/${consoleSlug}/${slug}`,
      noIndex: true,
    });
  }

  const product = getProductBySlug(consoleSlug as ShopConsole, slug);
  if (!product) {
    return createPageMetadata({
      title: "صفحه یافت نشد",
      path: `/shop/${consoleSlug}/${slug}`,
      noIndex: true,
    });
  }

  const detail = buildProductDetail(product);

  return createPageMetadata({
    title: product.title,
    description: detail.summary,
    path: `/shop/${product.console}/${product.slug}`,
    keywords: [product.title, `خرید ${SHOP_CONSOLE_META[product.console].label}`],
  });
}

export default async function ShopProductDetailPage({ params }: Props) {
  const { console: consoleSlug, slug } = await params;
  if (!SHOP_CONSOLES.includes(consoleSlug as ShopConsole)) notFound();

  const product = getProductBySlug(consoleSlug as ShopConsole, slug);
  if (!product) notFound();

  const detail = buildProductDetail(product);
  const related = getRelatedProducts(product);
  const path = `/shop/${product.console}/${product.slug}`;

  return (
    <main className="min-h-screen bg-[#050816] pt-24 text-white">
      {detail.faqs.length > 0 ? <FAQSchema items={detail.faqs} /> : null}
      <PageShell
        currentPath={path}
        jsonLd={[
          webPageJsonLd({
            name: product.title,
            description: detail.summary,
            path,
          }),
          productOfferJsonLd({ product, path, description: detail.summary }),
          itemListJsonLd({
            name: `محصولات مرتبط ${SHOP_CONSOLE_META[product.console].label}`,
            path,
            items: related.map((entry) => ({
              name: entry.title,
              url: `/shop/${entry.console}/${entry.slug}`,
            })),
          }),
        ]}
        containerClassName="container mx-auto px-6"
        className="container mx-auto px-6 pb-14"
      >
        <ProductDetailClient product={product} detail={detail} related={related} />
      </PageShell>
    </main>
  );
}
