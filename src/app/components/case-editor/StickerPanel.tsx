"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEditorStore } from "@/lib/design/editor-store";
import type { StickerPack } from "@/lib/cases/types";

const DESIGNED_PACK_ID = "designed";
const COLLAPSIBLE_THRESHOLD = 20;

type Props = {
  packs: StickerPack[];
  compact?: boolean;
};

function StickerGrid({
  pack,
  onSelect,
}: {
  pack: StickerPack;
  onSelect: (src: string, width: number, height: number) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {pack.stickers.map((sticker) => (
        <button
          key={sticker.id}
          type="button"
          onClick={() => onSelect(sticker.src, sticker.width, sticker.height)}
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
  );
}

export default function StickerPanel({ packs, compact }: Props) {
  const addImageLayer = useEditorStore((s) => s.addImageLayer);
  const [expandedPacks, setExpandedPacks] = useState<Record<string, boolean>>({});

  const handleSelect = (src: string, width: number, height: number) => {
    addImageLayer(src, width, height, true);
  };

  const togglePack = (packId: string) => {
    setExpandedPacks((prev) => ({ ...prev, [packId]: !prev[packId] }));
  };

  const isPackExpanded = (pack: StickerPack) => {
    if (pack.stickers.length <= COLLAPSIBLE_THRESHOLD) return true;
    return expandedPacks[pack.id] ?? pack.id !== DESIGNED_PACK_ID;
  };

  return (
    <div
      className={
        compact
          ? "max-h-52 overflow-y-auto overscroll-contain"
          : "h-full min-h-0 overflow-y-auto overscroll-contain"
      }
    >
      <div className="space-y-4 pr-1">
        {packs.map((pack) => {
          const expanded = isPackExpanded(pack);
          const collapsible = pack.stickers.length > COLLAPSIBLE_THRESHOLD;

          return (
            <div key={pack.id}>
              <div className="sticky top-0 z-10 mb-2 flex items-center justify-between gap-2 bg-card/95 py-1 backdrop-blur-sm">
                <p className="text-xs font-semibold text-muted">{pack.name}</p>
                {collapsible ? (
                  <button
                    type="button"
                    onClick={() => togglePack(pack.id)}
                    className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] text-cyan-400 transition hover:bg-cyan-500/10"
                  >
                    {expanded ? (
                      <>
                        بستن
                        <ChevronUp size={12} />
                      </>
                    ) : (
                      <>
                        {pack.stickers.length} استیکر
                        <ChevronDown size={12} />
                      </>
                    )}
                  </button>
                ) : null}
              </div>
              {expanded ? (
                <StickerGrid pack={pack} onSelect={handleSelect} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
