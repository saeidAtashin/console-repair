import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import PageShell from "@/app/components/seo/PageShell";
import FAQSchema from "@/app/components/schema/FAQSchema";
import {
  products,
  getProduct,
  formatProductPrice,
} from "@/app/data/products";
import { brandThemes } from "@/lib/brand-theme";
import { buildOrderHref } from "@/lib/order-links";
import { webPageJsonLd } from "@/lib/seo/jsonld";
import { createPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return createPageMetadata({
      title: "محصول یافت نشد",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/products/${product.slug}`,
    keywords: product.keywords,
    ogImage: product.image,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const theme = brandThemes[product.brand];
  const productPath = `/products/${product.slug}`;
  const orderHref = buildOrderHref({ productSlug: product.slug });

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      {product.faqs.length > 0 && <FAQSchema items={product.faqs} />}

      <PageShell
        currentPath={productPath}
        jsonLd={webPageJsonLd({
          name: product.seoTitle,
          description: product.seoDescription,
          path: productPath,
        })}
        containerClassName="container mx-auto px-6"
      >
        <section className="relative overflow-hidden border-b border-white/10">
          <div
            className={`absolute inset-0 bg-linear-to-b ${theme.glow} via-transparent to-transparent`}
          />

          <div className="container mx-auto grid items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <div className="relative z-10">
              <div
                className={`mb-5 inline-flex items-center rounded-full border px-4 py-2 text-sm ${theme.border} ${theme.bg} ${theme.primary}`}
              >
                قیمت روز بازار
              </div>

              <h1 className="text-4xl font-black leading-tight md:text-5xl">
                {product.title}
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
                {product.longDescription}
              </p>

              <p className="mt-6 text-2xl font-black text-orange-400">
                {formatProductPrice(product)}
              </p>
              {product.priceNote && (
                <p className="mt-2 text-sm text-zinc-500">{product.priceNote}</p>
              )}

              <Link
                href={orderHref}
                className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 text-lg font-black text-black transition hover:bg-orange-400"
              >
                ثبت سفارش
                <ChevronLeft size={20} />
              </Link>
            </div>

            <div className="relative">
              <div
                className={`absolute -inset-5 rounded-[40px] ${theme.bg} blur-3xl`}
              />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900 aspect-[4/3]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <h2 className="text-2xl font-black">ویژگی‌ها</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {product.features.map((f) => (
              <li
                key={f}
                className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-zinc-300"
              >
                {f}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-black">جنس‌های قابل سفارش</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.materials.map((m) => (
              <span
                key={m}
                className="rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-200"
              >
                {m}
              </span>
            ))}
          </div>
        </section>

        {product.faqs.length > 0 && (
          <section className="border-t border-white/10 bg-zinc-950">
            <div className="container mx-auto px-6 py-16">
              <h2 className="mb-8 text-2xl font-black">سوالات متداول</h2>
              <div className="space-y-4">
                {product.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="rounded-2xl border border-white/10 bg-black/40 p-6"
                  >
                    <summary className="cursor-pointer font-bold">
                      {faq.question}
                    </summary>
                    <p className="mt-4 text-zinc-400">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </PageShell>
    </main>
  );
}
