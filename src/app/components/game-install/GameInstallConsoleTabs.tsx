"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutGrid } from "lucide-react";

import {
  GAME_INSTALL_CONSOLE_META,
  GAME_INSTALL_CONSOLE_ORDER,
  gameInstallTabHref,
  type GameInstallConsoleFilter,
} from "@/lib/game-install-meta";
import { getGameInstallImage } from "@/lib/quick-access-images";

type Props = {
  activeConsole: GameInstallConsoleFilter;
};

export default function GameInstallConsoleTabs({ activeConsole }: Props) {
  const isAllConsoles = activeConsole === "all";

  return (
    <div className="mt-10 flex snap-x gap-3 overflow-x-auto pb-2">
      <Link
        href={gameInstallTabHref("all")}
        scroll={false}
        className={`min-w-[140px] shrink-0 rounded-2xl border px-4 py-3 text-start transition ${
          isAllConsoles
            ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300"
            : "border-white/10 bg-black/40 text-zinc-300 hover:border-cyan-400/30"
        }`}
      >
        <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          <LayoutGrid className="h-5 w-5" />
        </div>
        <p className="text-sm font-black">همه</p>
        <p className="text-xs text-zinc-400">تمام بازی‌ها</p>
      </Link>

      {GAME_INSTALL_CONSOLE_ORDER.map((slug) => {
        const tab = GAME_INSTALL_CONSOLE_META[slug];
        const active = slug === activeConsole;
        const imageSrc = getGameInstallImage(slug);

        return (
          <Link
            key={slug}
            href={gameInstallTabHref(slug)}
            scroll={false}
            className={`min-w-[140px] shrink-0 rounded-2xl border px-4 py-3 text-start transition ${
              active
                ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300"
                : "border-white/10 bg-black/40 text-zinc-300 hover:border-cyan-400/30"
            }`}
          >
            <div className="relative mb-2 h-9 w-9 overflow-hidden rounded-xl bg-white/10">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={tab.label}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              ) : null}
            </div>
            <p className="text-sm font-black">{tab.label}</p>
            <p className="text-xs text-zinc-400">{tab.title}</p>
          </Link>
        );
      })}
    </div>
  );
}
