import Link from "next/link";
import { ChevronLeft, Star } from "lucide-react";

import GameImageStrip from "@/app/components/ui/GameImageStrip";
import ConsoleTabIcon from "@/app/components/ui/ConsoleTabIcon";
import type { BlogGame } from "@/app/data/blog";
import { cheatGamePath, gameInstallHref } from "@/lib/blog-cheats-paths";
import { resolveGameImages } from "@/lib/game-images";
import { cn } from "@/lib/utils";

const CONSOLE_META = {
  ps5: { label: "PS5", icon: "/icons/ps5.svg", color: "text-blue-400" },
  ps4: { label: "PS4", icon: "/icons/ps4.svg", color: "text-indigo-400" },
  xbox: { label: "Xbox", icon: "/icons/xbox.svg", color: "text-green-400" },
} as const;

const PLATFORM_LABEL = {
  ps5: "PS5",
  ps4: "PS4",
  xbox: "Xbox",
  all: "همه",
} as const;

type Props = {
  game: BlogGame;
  index?: number;
  postSlug?: string;
  showDetailLink?: boolean;
  showInstallLink?: boolean;
};

export default function BlogCheatGameBlock({
  game,
  index = 0,
  postSlug,
  showDetailLink = true,
  showInstallLink = true,
}: Props) {
  const consoleMeta = CONSOLE_META[game.console];
  const anchorId = game.slug ?? `game-${index}`;
  const detailHref = game.slug ? cheatGamePath(game.slug) : undefined;
  const installHref = gameInstallHref(game.console);
  const isDetailPage = !showDetailLink;
  const { images } = resolveGameImages({
    slug: game.slug,
    name: game.name,
    fallback: game.coverImage,
  });

  return (
    <article
      id={anchorId}
      className={cn(
        "scroll-mt-28 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02]",
        !isDetailPage && "[content-visibility:auto] [contain-intrinsic-size:auto_320px]",
      )}
      aria-labelledby={`cheat-game-${anchorId}`}
    >
      {isDetailPage ? (
        <GameImageStrip
          images={images}
          alt={game.name}
          sizes="(max-width: 768px) 100vw, 896px"
          aspectClass="aspect-[16/10] w-full"
          priority
          fetchPriority="high"
        />
      ) : null}

      <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-start">
        {!isDetailPage ? (
          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
            <GameImageStrip
              images={images}
              alt={game.name}
              sizes="64px"
              aspectClass="h-full w-full"
              className="absolute inset-0"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h3
            id={`cheat-game-${anchorId}`}
            className="text-lg font-bold text-zinc-100 md:text-xl"
          >
            {game.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 px-2 py-0.5 font-bold",
                consoleMeta.color,
              )}
            >
              <ConsoleTabIcon src={consoleMeta.icon} className="h-3 w-3" />
              {consoleMeta.label}
            </span>
            <span>{game.genre}</span>
            <span className="inline-flex items-center gap-0.5 text-amber-400">
              <Star className="h-3 w-3 fill-amber-400" aria-hidden />
              {game.rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {game.highlight}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {showDetailLink && detailHref ? (
              <Link
                href={detailHref}
                className="inline-flex items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20"
              >
                صفحه کامل چیت
                <ChevronLeft className="h-3 w-3" />
              </Link>
            ) : null}
            {showInstallLink ? (
              <Link
                href={installHref}
                className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                نصب روی {consoleMeta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {game.cheatActivation ? (
        <div className="border-b border-white/[0.06] bg-amber-500/5 px-5 py-3">
          <p className="text-sm leading-relaxed text-amber-200/90">
            <span className="font-bold text-amber-300">نحوه فعال‌سازی: </span>
            {game.cheatActivation}
          </p>
        </div>
      ) : null}

      {game.cheats && game.cheats.length > 0 ? (
        <div className="overflow-x-auto px-5 py-4">
          <table
            className="w-full min-w-[480px] text-sm"
            aria-label={`جدول چیت ${game.name}`}
          >
            <thead>
              <tr className="border-b border-white/10 text-start text-xs text-zinc-500">
                <th className="pb-2 pe-4 font-semibold">نام</th>
                <th className="pb-2 pe-4 font-semibold">کد</th>
                <th className="pb-2 pe-4 font-semibold">اثر</th>
                <th className="pb-2 font-semibold">پلتفرم</th>
              </tr>
            </thead>
            <tbody>
              {game.cheats.map((cheat, cheatIndex) => (
                <tr
                  key={`${anchorId}-cheat-${cheatIndex}`}
                  className="border-b border-white/[0.04] last:border-0"
                >
                  <td className="py-2.5 pe-4 font-medium text-zinc-200">
                    {cheat.title}
                  </td>
                  <td className="py-2.5 pe-4">
                    <code className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-xs text-cyan-300">
                      {cheat.code}
                    </code>
                  </td>
                  <td className="py-2.5 pe-4 text-zinc-400">{cheat.effect}</td>
                  <td className="py-2.5 text-zinc-500">
                    {cheat.platform
                      ? PLATFORM_LABEL[cheat.platform]
                      : PLATFORM_LABEL.all}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {game.secrets && game.secrets.length > 0 ? (
        <div className="border-t border-white/[0.06] px-5 py-4">
          <h4 className="mb-3 text-sm font-bold text-violet-300">
            ترفندها و رمزهای مخفی
          </h4>
          <ul className="space-y-2">
            {game.secrets.map((secret, secretIndex) => (
              <li
                key={`${anchorId}-secret-${secretIndex}`}
                className="flex gap-2 text-sm leading-relaxed text-zinc-400"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                {secret}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {showDetailLink && detailHref && postSlug ? (
        <div className="border-t border-white/[0.06] px-5 py-3 text-end">
          <Link
            href={detailHref}
            className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            مشاهده صفحه اختصاصی چیت {game.name} ←
          </Link>
        </div>
      ) : null}
    </article>
  );
}
