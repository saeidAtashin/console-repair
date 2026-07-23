"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useEditorStore } from "@/lib/design/editor-store";
import type { StickerPack } from "@/lib/cases/types";

const PAGE_SIZE = 10;

type Props = {
  packs: StickerPack[];
};

function findScrollParent(element: HTMLElement | null): HTMLElement | null {
  let el = element?.parentElement ?? null;
  while (el) {
    const { overflowY } = getComputedStyle(el);
    if (overflowY === "auto" || overflowY === "scroll") return el;
    el = el.parentElement;
  }
  return null;
}

export default function StickerPanel({ packs }: Props) {
  const addImageLayer = useEditorStore((s) => s.addImageLayer);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollRootRef = useRef<HTMLElement | null>(null);

  const stickers = packs.flatMap((pack) => pack.stickers);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadMore = useCallback(() => {
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, stickers.length));
  }, [stickers.length]);

  useEffect(() => {
    scrollRootRef.current = findScrollParent(containerRef.current);
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [stickers.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || visibleCount >= stickers.length) return;

    const root = scrollRootRef.current ?? findScrollParent(containerRef.current);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { root, rootMargin: "120px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, stickers.length, visibleCount]);

  const visibleStickers = stickers.slice(0, visibleCount);

  const handleSelect = (src: string, width: number, height: number) => {
    addImageLayer(src, width, height, true);
  };

  if (stickers.length === 0) {
    return (
      <p className="text-center text-xs text-muted">طراحی آماده‌ای موجود نیست.</p>
    );
  }

  return (
    <div ref={containerRef}>
      <p className="mb-3 text-xs font-semibold text-foreground">طراحی‌های آماده</p>
      <div className="grid grid-cols-4 gap-2">
        {visibleStickers.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            onClick={() => handleSelect(sticker.src, sticker.width, sticker.height)}
            className="flex aspect-square items-center justify-center rounded-lg border border-border bg-card/60 p-2 transition hover:border-cyan-500/50"
            title={sticker.name}
          >
            <Image
              src={sticker.src}
              alt={sticker.name}
              width={40}
              height={40}
              loading="lazy"
              className="h-10 w-10 object-contain"
            />
          </button>
        ))}
      </div>

      {visibleCount < stickers.length ? (
        <div ref={sentinelRef} className="mt-3 flex flex-col items-center gap-2 py-2">
          <p className="text-[10px] text-muted">در حال بارگذاری…</p>
          <button
            type="button"
            onClick={loadMore}
            className="rounded-lg border border-border px-3 py-1.5 text-[10px] text-muted transition hover:border-cyan-500/50 hover:text-cyan-400"
          >
            نمایش {Math.min(PAGE_SIZE, stickers.length - visibleCount)} مورد بیشتر
          </button>
        </div>
      ) : (
        <p className="mt-3 text-center text-[10px] text-muted">
          {stickers.length} طراحی
        </p>
      )}
    </div>
  );
}
