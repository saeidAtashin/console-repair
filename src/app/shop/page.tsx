import PageShell from "@/app/components/seo/PageShell";
import CategoryGrid from "@/app/components/shop/CategoryGrid";
import ProductCard from "@/app/components/shop/ProductCard";
import { createPageMetadata } from "@/lib/seo/metadata";
import { collectionPageJsonLd } from "@/lib/seo/jsonld";
import {
  listActiveCategories,
  listProducts,
  serializeProduct,
} from "@/lib/shop";

export const metadata = createPageMetadata({
  title: "فروشگاه هدیه",
  description: "خرید آنلاین محصولات گیمینگ مناسب هدیه — بسته هدیه، گیم‌پد، هدست و گیفت کارت",
  path: "/shop",
  keywords: ["فروشگاه هدیه", "هدیه گیمینگ", "گیفت کارت", "گیم‌پد"],
});

export default async function ShopPage() {
  const [categories, products] = await Promise.all([
    listActiveCategories(),
    listProducts(),
  ]);

  const serialized = products.map((p) =>
    serializeProduct({
      ...p,
      images: p.images,
    }),
  );

  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-16 text-white">
      <PageShell
        currentPath="/shop"
        jsonLd={collectionPageJsonLd({
          name: "فروشگاه هدیه",
          description: "محصولات گیمینگ مناسب هدیه",
          path: "/shop",
        })}
        containerClassName="container mx-auto max-w-7xl px-6"
      >
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-4">فروشگاه هدیه</h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            محصولات منتخب گیمینگ با بسته‌بندی هدیه — مناسب تولد، مناسبت‌ها و SURPRISE
            دوستان گیمر
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">دسته‌بندی‌ها</h2>
          <CategoryGrid
            categories={categories.map((c) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              description: c.description,
              productCount: c._count.products,
            }))}
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">همه محصولات</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {serialized.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </PageShell>
    </main>
  );
}
