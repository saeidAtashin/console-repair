"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

import GameCoverFallback from "@/app/components/game-install/GameCoverFallback";
import {
  formatInstallGameSize,
  positiveOrUndefined,
} from "@/lib/game-install-catalog";
import type { InstallListGame } from "@/lib/game-install-list";
import { formatToman } from "@/lib/game-install-pricing";
import { resolveGameImages } from "@/lib/game-images";
import { cn } from "@/lib/utils";

type Props = {
  game: InstallListGame;
  index: number;
  onRemove: (gameId: string) => void;
};

export default function InstallListGameItem({ game, index, onRemove }: Props) {
  const [imageLoading, setImageLoading] = useState(true);
  const { images, coverImage } = resolveGameImages({
    slug: game.slug,
    name: game.name,
    fallback: game.backgroundImage,
  });
  const imageSrc = images[0] ?? coverImage;
  const price = positiveOrUndefined(game.price);
  const size = positiveOrUndefined(game.size);

  return (
    <li className="group flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-2 transition hover:border-emerald-400/40 hover:bg-emerald-500/15">
      <div className="relative h-11 w-8 shrink-0 overflow-hidden rounded-md bg-zinc-900">
        {imageSrc ? (
          <>
            {imageLoading ? (
              <div
                className="absolute inset-0 z-[1] animate-pulse bg-gradient-to-br from-zinc-800 to-zinc-900"
                aria-hidden
              />
            ) : null}
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes="32px"
              className={cn(
                "object-cover transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100",
              )}
              onLoad={() => setImageLoading(false)}
            />
          </>
        ) : (
          <GameCoverFallback
            title={game.name}
            variant="compact"
            aspectClass="h-full w-full"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[11px] font-bold leading-tight text-zinc-100 sm:text-xs">
          <span className="me-1 text-emerald-400/80">
            {(index + 1).toLocaleString("fa-IR")}.
          </span>
          {game.name}
        </p>
        {game.custom ? (
          <span className="text-[9px] text-zinc-500">دلخواه</span>
        ) : price != null || size != null ? (
          <p className="mt-0.5 text-[9px] text-zinc-500">
            {price != null ? formatToman(price) : null}
            {price != null && size != null ? " · " : null}
            {size != null ? formatInstallGameSize(size) : null}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onRemove(game.id)}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/25"
        aria-label={`حذف ${game.name}`}
      >
        <Trash2 className="h-3 w-3" aria-hidden />
      </button>
    </li>
  );
}
