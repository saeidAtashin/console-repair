import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gift } from "lucide-react";

import PageShell from "@/app/components/seo/PageShell";
import AddToCartButton from "@/app/components/shop/AddToCartButton";
import ProductCard from "@/app/components/shop/ProductCard";
import { formatPriceToman } from "@/lib/format-price";
import { createPageMetadata } from "@/lib/seo/metadata";
import { productJsonLd } from "@/lib/seo/jsonld";
import {
  getProductBySlug,
  getRelatedProducts,
  listProducts,
  serializeProduct,
} from "@/lib/shop";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return createPageMetadata({
      title: "محصول یافت نشد",
      path: `/product/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: product.name,
    description: product.shortDescription || product.description,
    path: `/product/${product.slug}`,
    ogImage: product.images[0]?.url,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId);
  const path = `/product/${product.slug}`;
  const mainImage = product.images[0]?.url;

  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-16 text-white">
      <PageShell
        currentPath={path}
        jsonLd={productJsonLd({
          name: product.name,
          description: product.shortDescription || product.description,
          path,
          price: product.price,
          image: mainImage,
          inStock: product.stock > 0,
        })}
        containerClassName="container mx-auto max-w-7xl px-6"
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-600">
                  <Gift className="h-20 w-20" />
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1).map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square overflow-hidden rounded-2xl border border-white/10"
                  >
                    <Image src={img.url} alt={img.alt} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.isGiftReady && (
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-2 text-sm text-cyan-300">
                <Gift className="h-4 w-4" />
                مناسب هدیه
              </span>
            )}
            <h1 className="text-4xl font-black mb-4">{product.name}</h1>
            {product.category && (
              <Link
                href={`/shop/${product.category.slug}`}
                className="text-sm text-cyan-400 hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-3xl font-black text-cyan-400">
                {formatPriceToman(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg text-zinc-500 line-through">
                  {formatPriceToman(product.compareAtPrice)}
                </span>
              )}
            </div>
            <p className="mt-4 text-zinc-400">{product.shortDescription}</p>
            <p className="mt-2 text-sm text-zinc-500">
              {product.stock > 0 ? `${product.stock} عدد موجود` : "ناموجود"}
            </p>

            <div className="mt-8">
              <AddToCartButton productId={product.id} disabled={product.stock <= 0} />
            </div>

            {product.giftNote && (
              <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-cyan-200">
                {product.giftNote}
              </div>
            )}

            <div className="mt-8 prose prose-invert max-w-none">
              <h2 className="text-xl font-bold mb-3">توضیحات</h2>
              <p className="text-zinc-300 whitespace-pre-line leading-8">{product.description}</p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">محصولات مرتبط</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={serializeProduct({ ...p, images: p.images })}
                />
              ))}
            </div>
          </section>
        )}
      </PageShell>
    </main>
  );
}
