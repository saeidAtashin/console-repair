"use client";

import { useRef, useState } from "react";

import AddToGameListButton from "@/app/components/game-install/AddToGameListButton";
import { useGameInstallList } from "@/app/context/GameInstallListContext";
import type { InstallCatalogGame } from "@/lib/game-install-catalog";

type Props = {
  game: InstallCatalogGame;
  consoleSlug: string;
  orderHref: string;
};

export default function InstallThisGameCta({
  game,
  consoleSlug,
  orderHref,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { addGameWithAnimation, isInList, isFlyActive } = useGameInstallList();
  const inList = isInList(game.id, consoleSlug);
  const [busy, setBusy] = useState(false);

  async function handlePrimary() {
    if (busy || isFlyActive) return;
    setBusy(true);
    try {
      if (!inList) {
        await addGameWithAnimation(game, consoleSlug, {
          sourceElement: ref.current,
        });
      }
      document.getElementById("game-install-order")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      if (orderHref.startsWith("#")) {
        window.location.hash = orderHref;
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div ref={ref} className="flex flex-col gap-3 sm:flex-row">
      <AddToGameListButton
        game={game}
        consoleSlug={consoleSlug}
        animationSourceRef={ref}
        className="h-14 rounded-2xl px-6 text-sm"
      />
      <button
        type="button"
        onClick={() => void handlePrimary()}
        disabled={busy || isFlyActive}
        className="inline-flex h-14 items-center justify-center rounded-2xl bg-cyan-500 px-6 text-sm font-black text-black transition hover:bg-cyan-400 disabled:opacity-50"
      >
        {inList
          ? "ادامه ثبت سفارش نصب"
          : "این بازی را روی کنسول من نصب کنید"}
      </button>
    </div>
  );
}
