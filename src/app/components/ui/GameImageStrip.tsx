"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ImageLightbox, { getActiveIndex } from "@/app/components/ui/ImageLightbox";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  sizes: string;
  className?: string;
  aspectClass?: string;
  imageClassName?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
};

function StripImage({
  src,
  alt,
  sizes,
  imageClassName,
  priority,
  loading,
  fetchPriority,
  placeholder,
  blurDataURL,
}: {
  src: string;
  alt: string;
  sizes: string;
  imageClassName: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={imageClassName}
      priority={priority}
      loading={loading ?? (priority ? undefined : "lazy")}
      fetchPriority={fetchPriority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
    />
  );
}

type CarouselProps = Props & {
  onOpenLightbox: (index: number) => void;
};

function LazyCarousel({
  images,
  alt,
  sizes,
  aspectClass,
  className,
  imageClassName,
  priority,
  loading,
  fetchPriority,
  placeholder,
  blurDataURL,
  onOpenLightbox,
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(
    () => new Set([0]),
  );

  const updateVisibleSlides = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const nextActive = getActiveIndex(container, images.length);
    setActiveIndex(nextActive);

    setVisibleIndices((prev) => {
      const next = new Set(prev);
      next.add(nextActive);
      if (nextActive > 0) next.add(nextActive - 1);
      if (nextActive < images.length - 1) next.add(nextActive + 1);
      return next.size === prev.size &&
        [...next].every((i) => prev.has(i))
        ? prev
        : next;
    });
  }, [images.length]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateVisibleSlides();
    container.addEventListener("scroll", updateVisibleSlides, { passive: true });
    return () => container.removeEventListener("scroll", updateVisibleSlides);
  }, [updateVisibleSlides]);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const slideWidth = container.clientWidth;
    if (slideWidth <= 0) return;
    container.scrollTo({
      left: index * slideWidth,
      behavior: "smooth",
    });
  }, []);

  return (
    <div
      className={cn(
        "group/strip relative overflow-hidden bg-zinc-900",
        aspectClass,
        className,
      )}
    >
      <div
        ref={scrollRef}
        className="absolute inset-0 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex h-full">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className="relative h-full w-full shrink-0 snap-start cursor-zoom-in border-0 bg-transparent p-0 text-start"
              onClick={(event) => {
                event.stopPropagation();
                onOpenLightbox(index);
              }}
              aria-label={`بزرگ‌نمایی تصویر ${index + 1}`}
            >
              {visibleIndices.has(index) ? (
                <StripImage
                  src={src}
                  alt={index === 0 ? alt : `${alt} — تصویر ${index + 1}`}
                  sizes={sizes}
                  imageClassName={imageClassName ?? "object-cover"}
                  priority={priority && index === 0}
                  loading={index === 0 ? loading : "lazy"}
                  fetchPriority={priority && index === 0 ? fetchPriority : "low"}
                  placeholder={index === 0 ? placeholder : undefined}
                  blurDataURL={index === 0 ? blurDataURL : undefined}
                />
              ) : (
                <div className="h-full w-full bg-zinc-900" aria-hidden />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeIndex > 0 ? (
        <button
          type="button"
          aria-label="تصویر قبلی"
          onClick={(event) => {
            event.stopPropagation();
            scrollToIndex(activeIndex - 1);
          }}
          className="absolute start-1.5 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white opacity-100 backdrop-blur-sm transition hover:bg-black/70 sm:opacity-0 sm:group-hover/strip:opacity-100"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      ) : null}

      {activeIndex < images.length - 1 ? (
        <button
          type="button"
          aria-label="تصویر بعدی"
          onClick={(event) => {
            event.stopPropagation();
            scrollToIndex(activeIndex + 1);
          }}
          className="absolute end-1.5 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white opacity-100 backdrop-blur-sm transition hover:bg-black/70 sm:opacity-0 sm:group-hover/strip:opacity-100"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
      ) : null}

      <div
        className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1"
        role="tablist"
        aria-label="تصاویر"
      >
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`رفتن به تصویر ${index + 1}`}
            onClick={(event) => {
              event.stopPropagation();
              scrollToIndex(index);
            }}
            className={cn(
              "h-1.5 rounded-full transition",
              index === activeIndex
                ? "w-3 bg-white/90"
                : "w-1.5 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default function GameImageStrip({
  images,
  alt,
  sizes,
  className,
  aspectClass = "aspect-[3/4]",
  imageClassName = "object-cover",
  priority,
  loading,
  fetchPriority,
  placeholder,
  blurDataURL,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  const lightbox =
    lightboxIndex != null ? (
      <ImageLightbox
        images={images}
        alt={alt}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    ) : null;

  if (images.length === 1) {
    return (
      <>
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          aria-label={`بزرگ‌نمایی ${alt}`}
          className={cn(
            "relative block w-full cursor-zoom-in overflow-hidden border-0 bg-zinc-900 p-0 text-start",
            aspectClass,
            className,
          )}
        >
          <StripImage
            src={images[0]}
            alt={alt}
            sizes={sizes}
            imageClassName={imageClassName}
            priority={priority}
            loading={loading}
            fetchPriority={fetchPriority}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
          />
        </button>
        {lightbox}
      </>
    );
  }

  return (
    <>
      <LazyCarousel
        images={images}
        alt={alt}
        sizes={sizes}
        className={className}
        aspectClass={aspectClass}
        imageClassName={imageClassName}
        priority={priority}
        loading={loading}
        fetchPriority={fetchPriority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onOpenLightbox={setLightboxIndex}
      />
      {lightbox}
    </>
  );
}
