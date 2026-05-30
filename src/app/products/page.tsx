import Link from "next/link";
import Image from "next/image";
import PageShell from "@/app/components/seo/PageShell";
import {
  products,
  productCategories,
  formatProductPrice,
  type ProductCategory,
} from "@/app/data/products";
import { createPageMetadata } from "@/lib/seo/metadata";
import { webPageJsonLd } from "@/lib/seo/jsonld";
import { buildOrderHref } from "@/lib/order-links";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata() {
  return createPageMetadata({
    title: "محصولات CNC | قیمت روز بازار",
    description:
      "محصولات CNC شامل برش MDF، تابلو، حروف برجسته، لیزر و دکور با قیمت روز.",
    path: "/products",
    keywords: ["محصولات cnc", "قیمت mdf", "تابلو cnc"],
  });
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory = category as ProductCategory | undefined;
  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <PageShell
      currentPath="/products"
      jsonLd={webPageJsonLd({
        name: "محصولات CNC",
        description: "کاتالوگ محصولات CNC با قیمت روز بازار",
        path: "/products",
      })}
      className="min-h-screen bg-black pt-24 text-white"
      containerClassName="container mx-auto px-6 py-12"
    >
      <h1 className="text-4xl font-black">محصولات CNC</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        محصولات آماده و سفارشی با قیمت روز بازار — برای سفارش، روی هر محصول
        کلیک کنید.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            !activeCategory
              ? "bg-orange-500 text-black"
              : "border border-white/15 bg-white/5 text-zinc-300 hover:border-orange-400/40"
          }`}
        >
          همه
        </Link>
        {productCategories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.id}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === c.id
                ? "bg-orange-500 text-black"
                : "border border-white/15 bg-white/5 text-zinc-300 hover:border-orange-400/40"
            }`}
          >
            {c.title}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 transition hover:border-orange-400/40"
          >
            <div className="relative aspect-[4/3] bg-zinc-800">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover opacity-90 transition group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold">{product.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                {product.description}
              </p>
              <p className="mt-3 text-orange-400 font-bold">
                {formatProductPrice(product)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
