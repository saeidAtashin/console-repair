import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AddToCartButton from "@/app/components/shop/AddToCartButton";
import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  itemListJsonLd,
  productOfferJsonLd,
  webPageJsonLd,
} from "@/lib/seo/jsonld";
import {
  PRODUCT_CATEGORY_LABELS,
  SHOP_CONSOLES,
  SHOP_CONSOLE_META,
  formatToman,
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

  return createPageMetadata({
    title: product.title,
    description: `${product.title} با قیمت ${formatToman(product.price)} در فروشگاه کنسول.`,
    path: `/shop/${product.console}/${product.slug}`,
    keywords: [product.title, `خرید ${SHOP_CONSOLE_META[product.console].label}`],
  });
}

export default async function ShopProductDetailPage({ params }: Props) {
  const { console: consoleSlug, slug } = await params;
  if (!SHOP_CONSOLES.includes(consoleSlug as ShopConsole)) notFound();

  const product = getProductBySlug(consoleSlug as ShopConsole, slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const path = `/shop/${product.console}/${product.slug}`;

  return (
    <main className="min-h-screen bg-[#050816] pt-24 text-white">
      <PageShell
        currentPath={path}
        jsonLd={[
          webPageJsonLd({
            name: product.title,
            description: product.highlights?.join(" - ") ?? product.title,
            path,
          }),
          productOfferJsonLd({ product, path }),
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
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="relative h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-10"
            />
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <h1 className="text-3xl font-black md:text-4xl">{product.title}</h1>
            <p className="mt-4 text-zinc-400">
              {product.category === "console"
                ? `وضعیت دستگاه: ${product.condition === "new" ? "نو" : "دست دوم تست شده"}`
                : `دسته: ${PRODUCT_CATEGORY_LABELS[product.category]}`}
            </p>
            <div className="mt-6">
              {product.compareAtPrice ? (
                <p className="text-zinc-500 line-through">
                  {formatToman(product.compareAtPrice)}
                </p>
              ) : null}
              <p className="text-2xl font-black text-cyan-300">
                {formatToman(product.price)}
              </p>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-zinc-300">
              {product.highlights?.map((item) => <li key={item}>- {item}</li>)}
            </ul>
            <div className="mt-7">
              <AddToCartButton
                productId={product.id}
                productTitle={product.title}
                inStock={product.inStock}
              />
            </div>
            <Link
              href={`/shop/${product.console}`}
              className="mt-4 inline-flex text-sm text-cyan-400 hover:text-cyan-300"
            >
              بازگشت به محصولات {SHOP_CONSOLE_META[product.console].label}
            </Link>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-2xl font-black">محصولات مرتبط</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/shop/${entry.console}/${entry.slug}`}
                  className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 transition hover:border-cyan-400/30"
                >
                  <p className="font-bold text-white">{entry.title}</p>
                  <p className="mt-2 text-sm text-cyan-300">{formatToman(entry.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </PageShell>
    </main>
  );
}
