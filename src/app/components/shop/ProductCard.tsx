import Link from "next/link";
import Image from "next/image";
import { Gift } from "lucide-react";

import { formatPriceToman } from "@/lib/format-price";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    shortDescription?: string;
    isGiftReady?: boolean;
    imageUrl?: string | null;
    stock?: number;
  };
  className?: string;
};

export default function ProductCard({ product, className }: ProductCardProps) {
  const outOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        "group block rounded-3xl border border-white/10 bg-white/5 overflow-hidden transition hover:border-cyan-400/30 hover:bg-white/[0.07]",
        outOfStock && "opacity-70",
        className,
      )}
    >
      <div className="relative aspect-square bg-black/30">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            <Gift className="h-12 w-12" />
          </div>
        )}
        {product.isGiftReady && (
          <span className="absolute top-3 right-3 rounded-full bg-cyan-500/90 px-3 py-1 text-xs font-bold text-black">
            مناسب هدیه
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold">
            ناموجود
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold line-clamp-2 mb-2">{product.name}</h3>
        {product.shortDescription && (
          <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{product.shortDescription}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="font-black text-cyan-400">{formatPriceToman(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-zinc-500 line-through">
              {formatPriceToman(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
