"use client";

import { Check, ListPlus } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";

import { useGameInstallList } from "@/app/context/GameInstallListContext";
import type { InstallCatalogGame } from "@/lib/game-install-catalog";

type Props = {
  game: InstallCatalogGame;
  consoleSlug: string;
  className?: string;
  animationSourceRef?: RefObject<HTMLElement | null>;
};

export default function AddToGameListButton({
  game,
  consoleSlug,
  className = "",
  animationSourceRef,
}: Props) {
  const { addGameWithAnimation, removeGame, isInList, isFlyActive } =
    useGameInstallList();
  const [inList, setInList] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setInList(isInList(game.id, consoleSlug));
  }, [isInList, game.id, consoleSlug]);

  async function handleClick() {
    if (busy || isFlyActive) return;
    setBusy(true);
    try {
      if (inList) {
        await removeGame(game.id, consoleSlug);
        setInList(false);
        return;
      }

      const added = await addGameWithAnimation(game, consoleSlug, {
        sourceElement: animationSourceRef?.current,
      });
      if (added) {
        setInList(true);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1200);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={busy || isFlyActive}
      className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-xs font-bold transition disabled:opacity-50 ${
        inList
          ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25"
          : "border-cyan-400/30 bg-cyan-500/10 text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-500/20"
      } ${className}`}
    >
      {inList || justAdded ? (
        <>
          <Check className="h-3.5 w-3.5" aria-hidden />
          {justAdded ? "اضافه شد" : "در لیست"}
        </>
      ) : (
        <>
          <ListPlus className="h-3.5 w-3.5" aria-hidden />
          {busy ? "در حال افزودن..." : "اضافه به لیست"}
        </>
      )}
    </button>
  );
}
