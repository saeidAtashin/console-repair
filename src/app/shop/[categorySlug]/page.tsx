import { notFound } from "next/navigation";

import PageShell from "@/app/components/seo/PageShell";
import ProductCard from "@/app/components/shop/ProductCard";
import { createPageMetadata } from "@/lib/seo/metadata";
import { collectionPageJsonLd } from "@/lib/seo/jsonld";
import {
  getCategoryBySlug,
  listActiveCategories,
  listProducts,
  serializeProduct,
} from "@/lib/shop";

type Props = {
  params: Promise<{ categorySlug: string }>;
};

export async function generateStaticParams() {
  const categories = await listActiveCategories();
  return categories.map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return createPageMetadata({
      title: "دسته یافت نشد",
      path: `/shop/${categorySlug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: category.name,
    description: category.description || `خرید ${category.name} — فروشگاه هدیه فیکس‌بازی`,
    path: `/shop/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) notFound();

  const products = await listProducts({ categorySlug });
  const serialized = products.map((p) => serializeProduct({ ...p, images: p.images }));

  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-16 text-white">
      <PageShell
        currentPath={`/shop/${category.slug}`}
        jsonLd={collectionPageJsonLd({
          name: category.name,
          description: category.description,
          path: `/shop/${category.slug}`,
        })}
        containerClassName="container mx-auto max-w-7xl px-6"
      >
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-zinc-400 max-w-2xl">{category.description}</p>
          )}
        </div>

        {serialized.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-zinc-400">
            محصولی در این دسته وجود ندارد
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {serialized.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </PageShell>
    </main>
  );
}
