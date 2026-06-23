import Link from "next/link";

import { formatToman, type ShopProduct } from "@/lib/shop";

type Props = {
  products: ShopProduct[];
};

export default function ProductDetailRelated({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-white/10 pt-16">
      <h2 className="text-2xl font-black text-white">محصولات مرتبط</h2>
      <p className="mt-2 text-zinc-400">گزینه‌های مشابه که ممکن است برای شما جالب باشند</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {products.map((entry) => (
          <Link
            key={entry.id}
            href={`/shop/${entry.console}/${entry.slug}`}
            className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 transition hover:border-cyan-400/30 hover:bg-zinc-900/60"
          >
            <p className="font-bold text-white">{entry.title}</p>
            <p className="mt-2 text-sm text-cyan-300">{formatToman(entry.price)}</p>
            {!entry.inStock ? (
              <span className="mt-2 inline-block text-xs text-red-300">ناموجود</span>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
