import Link from "next/link";

import { GAME_FILTERS, GAME_FILTER_IDS, type GameFilterId } from "@/lib/game-filters";
import { gameListPath } from "@/lib/game-filters";

type Props = {
  consoleSlug: string;
  active?: GameFilterId;
};

export default function GameInstallFilterBar({ consoleSlug, active }: Props) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Link
        href={`/services/game-install/${consoleSlug}/games`}
        className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
          !active
            ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
            : "border-white/10 text-zinc-400 hover:border-cyan-400/30 hover:text-white"
        }`}
      >
        همه
      </Link>
      {GAME_FILTER_IDS.map((id) => {
        const filter = GAME_FILTERS[id];
        const isActive = active === id;
        return (
          <Link
            key={id}
            href={gameListPath(consoleSlug, id)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
              isActive
                ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
                : "border-white/10 text-zinc-400 hover:border-cyan-400/30 hover:text-white"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
