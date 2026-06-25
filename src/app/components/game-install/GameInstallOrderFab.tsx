"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

import GameInstallListCountBadge from "@/app/components/game-install/GameInstallListCountBadge";
import { useGameInstallList } from "@/app/context/GameInstallListContext";
import { useInstallGameList } from "@/app/hooks/useInstallGameList";

type Props = {
  consoleSlug: string;
  targetId?: string;
  label?: string;
};

const receiveTransition = {
  duration: 0.45,
  times: [0, 0.2, 0.55, 1],
  ease: "easeOut" as const,
};

export default function GameInstallOrderFab({
  consoleSlug,
  targetId = "game-install-order",
  label = "ثبت سفارش نصب",
}: Props) {
  const games = useInstallGameList(consoleSlug);
  const { listBounce } = useGameInstallList();

  if (games.length === 0) return null;

  return (
    <motion.a
      href={`#${targetId}`}
      animate={listBounce ? { scale: [1, 0.96, 1.04, 1] } : { scale: 1 }}
      transition={listBounce ? receiveTransition : { duration: 0.2 }}
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500 px-6 py-3.5 text-sm font-bold text-black shadow-[0_8px_32px_-4px_rgba(34,211,238,0.55)] transition hover:bg-cyan-400 hover:shadow-[0_12px_40px_-4px_rgba(34,211,238,0.65)]"
    >
      <ShoppingCart className="h-4 w-4" aria-hidden />
      <span>{label}</span>
      <GameInstallListCountBadge className="relative rounded-full bg-black/20 px-2 py-0.5 text-xs">
        {games.length.toLocaleString("fa-IR")}
      </GameInstallListCountBadge>
    </motion.a>
  );
}
