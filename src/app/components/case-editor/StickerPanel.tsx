"use client";

import Image from "next/image";
import { useEditorStore } from "@/lib/design/editor-store";
import type { StickerPack } from "@/lib/cases/types";

type Props = {
  packs: StickerPack[];
};

export default function StickerPanel({ packs }: Props) {
  const { addImageLayer } = useEditorStore();

  return (
    <div className="space-y-4">
      {packs.map((pack) => (
        <div key={pack.id}>
          <p className="mb-2 text-xs font-semibold text-muted">{pack.name}</p>
          <div className="grid grid-cols-4 gap-2">
            {pack.stickers.map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                onClick={() =>
                  addImageLayer(sticker.src, sticker.width, sticker.height, true)
                }
                className="flex aspect-square items-center justify-center rounded-lg border border-border bg-card/60 p-2 transition hover:border-cyan-500/50"
                title={sticker.name}
              >
                <Image
                  src={sticker.src}
                  alt={sticker.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
