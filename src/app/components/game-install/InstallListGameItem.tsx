"use client";

import Image from "next/image";
import { Gamepad2, Trash2 } from "lucide-react";

import type { InstallListGame } from "@/lib/game-install-list";
import { resolveGameImages } from "@/lib/game-images";

type Props = {
  game: InstallListGame;
  index: number;
  onRemove: (gameId: string) => void;
};

export default function InstallListGameItem({ game, index, onRemove }: Props) {
  const { images, coverImage } = resolveGameImages({
    slug: game.slug,
    name: game.name,
    fallback: game.backgroundImage,
  });
  const imageSrc = images[0] ?? coverImage;

  return (
    <li className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-400/25 bg-emerald-500/10 transition hover:border-emerald-400/40 hover:bg-emerald-500/15">
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={game.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-800 to-zinc-950 text-zinc-500">
            <Gamepad2 className="h-8 w-8 opacity-60" aria-hidden />
            <span className="text-[10px] font-medium">بازی دلخواه</span>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent"
          aria-hidden
        />
        <span className="absolute start-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg bg-black/60 text-[11px] font-black text-emerald-300 backdrop-blur-sm">
          {(index + 1).toLocaleString("fa-IR")}
        </span>
        <button
          type="button"
          onClick={() => onRemove(game.id)}
          className="absolute end-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-400/30 bg-red-500/25 text-red-300 backdrop-blur-sm transition hover:bg-red-500/40 sm:bg-red-500/20 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
          aria-label={`حذف ${game.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <p className="line-clamp-2 text-xs font-bold leading-snug text-zinc-100 sm:text-sm">
          {game.name}
        </p>
        {game.custom ? (
          <span className="text-[10px] text-zinc-500">دلخواه</span>
        ) : null}
      </div>
    </li>
  );
}
