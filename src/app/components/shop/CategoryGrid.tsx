import Link from "next/link";
import { Gift } from "lucide-react";

type CategoryGridProps = {
  categories: {
    id: string;
    name: string;
    slug: string;
    description: string;
    productCount?: number;
  }[];
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/shop/${category.slug}`}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <Gift className="h-6 w-6" />
          </div>
          <h3 className="font-bold mb-2">{category.name}</h3>
          <p className="text-sm text-zinc-400 line-clamp-2">{category.description}</p>
          {category.productCount !== undefined && (
            <p className="mt-3 text-xs text-zinc-500">{category.productCount} محصول</p>
          )}
        </Link>
      ))}
    </div>
  );
}
