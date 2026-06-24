import Image from "next/image";

import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  sizes: string;
  className?: string;
  aspectClass?: string;
  imageClassName?: string;
};

export default function GameImageStrip({
  images,
  alt,
  sizes,
  className,
  aspectClass = "aspect-[3/4]",
  imageClassName = "object-cover",
}: Props) {
  if (images.length === 0) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-zinc-900 text-xs text-zinc-600",
          aspectClass,
          className,
        )}
      >
        بدون تصویر
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={cn("relative overflow-hidden bg-zinc-900", aspectClass, className)}>
        <Image
          src={images[0]}
          alt={alt}
          fill
          sizes={sizes}
          className={imageClassName}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-zinc-900", aspectClass, className)}>
      <div className="absolute inset-0 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex h-full">
          {images.map((src, index) => (
            <div
              key={src}
              className="relative h-full w-full shrink-0 snap-start"
            >
              <Image
                src={src}
                alt={index === 0 ? alt : `${alt} — تصویر ${index + 1}`}
                fill
                sizes={sizes}
                className={imageClassName}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1"
        aria-hidden
      >
        {images.map((src, index) => (
          <span
            key={src}
            className={cn(
              "h-1.5 rounded-full bg-white/40",
              index === 0 ? "w-3 bg-white/80" : "w-1.5",
            )}
          />
        ))}
      </div>
    </div>
  );
}
