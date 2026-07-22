"use client";

import { useMemo } from "react";

import { useGameInstallList } from "@/app/context/GameInstallListContext";
import type { InstallListGame } from "@/lib/game-install-list";

export function useInstallGameList(consoleSlug: string): InstallListGame[] {
  const { itemsByConsole } = useGameInstallList();

  return useMemo(() => {
    const exact = itemsByConsole[consoleSlug];
    if (exact?.length) return exact;

    // Draft may be keyed under a sibling xbox slug.
    if (consoleSlug === "xbox-one" || consoleSlug === "xbox-series") {
      return (
        itemsByConsole["xbox-series"] ??
        itemsByConsole["xbox-one"] ??
        []
      );
    }

    return exact ?? [];
  }, [itemsByConsole, consoleSlug]);
}
