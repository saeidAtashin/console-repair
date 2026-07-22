import { Truck } from "lucide-react";

import { HERO_BADGE } from "./hero.constants";

export default function HomeHeroBadge() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/20 bg-card/60 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-xl dark:border-cyan-400/25 dark:bg-white/[0.04]">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300">
        <Truck className="h-3.5 w-3.5" aria-hidden />
      </span>
      <span>{HERO_BADGE}</span>
    </div>
  );
}
