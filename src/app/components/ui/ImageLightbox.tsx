"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";

export function getActiveIndex(container: HTMLDivElement, length: number) {
  const slideWidth = container.clientWidth;
  if (slideWidth <= 0) return 0;
  const center = container.scrollLeft + slideWidth / 2;
  return Math.min(length - 1, Math.max(0, Math.round(center / slideWidth)));
}

type Props = {
  images: string[];
  alt: string;
  initialIndex: number;
  onClose: () => void;
};

export default function ImageLightbox({
  images,
  alt,
  initialIndex,
  onClose,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const container = scrollRef.current;
    if (!container || images.length <= 1) return;

    const slideWidth = container.clientWidth;
    if (slideWidth > 0) {
      container.scrollLeft = initialIndex * slideWidth;
    }
  }, [images.length, initialIndex, mounted]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const updateActive = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    setActiveIndex(getActiveIndex(container, images.length));
  }, [images.length]);

  useEffect(() => {
    if (!mounted) return;
    const container = scrollRef.current;
    if (!container || images.length <= 1) return;

    updateActive();
    container.addEventListener("scroll", updateActive, { passive: true });
    return () => container.removeEventListener("scroll", updateActive);
  }, [images.length, updateActive, mounted]);

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

  const stopPropagation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="بستن"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-3"
        onClick={stopPropagation}
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="بستن"
          onClick={onClose}
          className="absolute -top-1 end-0 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-zinc-900/90 text-white shadow-lg transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:-top-2"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="relative h-[min(85vh,90vw)] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
          {images.length === 1 ? (
            <div className="relative h-full w-full">
              <Image
                src={images[0]}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 90vw, 1024px"
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <>
              <div
                ref={scrollRef}
                className="absolute inset-0 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="flex h-full">
                  {images.map((src, index) => (
                    <div
                      key={src}
                      className="relative h-full w-full shrink-0 snap-start"
                    >
                      <Image
                        src={src}
                        alt={
                          index === 0 ? alt : `${alt} — تصویر ${index + 1}`
                        }
                        fill
                        sizes="(max-width: 1024px) 90vw, 1024px"
                        className="object-contain"
                        priority={index === initialIndex}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {activeIndex > 0 ? (
                <button
                  type="button"
                  aria-label="تصویر قبلی"
                  onClick={() => scrollToIndex(activeIndex - 1)}
                  className="absolute start-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              ) : null}

              {activeIndex < images.length - 1 ? (
                <button
                  type="button"
                  aria-label="تصویر بعدی"
                  onClick={() => scrollToIndex(activeIndex + 1)}
                  className="absolute end-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
              ) : null}
            </>
          )}
        </div>

        {images.length > 1 ? (
          <div className="flex items-center gap-1.5" role="tablist" aria-label="تصاویر">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`تصویر ${index + 1}`}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "h-1.5 rounded-full transition",
                  index === activeIndex
                    ? "w-3 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
