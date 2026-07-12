import Link from "next/link";
import { formatToman } from "@/lib/shop/format";
import type { ReadyCase } from "@/lib/cases/types";

type Props = {
  product: ReadyCase;
};

export default function ReadyCaseCard({ product }: Props) {
  return (
    <Link
      href={`/cases/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 transition hover:border-cyan-500/40"
    >
      <div
        className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900"
        style={{
          backgroundImage: product.image.startsWith("/cases/ready/")
            ? undefined
            : undefined,
        }}
      >
        <div className="flex h-full items-center justify-center p-6">
          <div
            className="h-40 w-20 rounded-[1.5rem] border-2 border-white/20 shadow-xl"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
            }}
          />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-1">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-bold text-white group-hover:text-cyan-400">{product.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{product.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-bold text-cyan-400">{formatToman(product.price)}</span>
          {product.compareAtPrice ? (
            <span className="text-xs text-zinc-600 line-through">
              {formatToman(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
