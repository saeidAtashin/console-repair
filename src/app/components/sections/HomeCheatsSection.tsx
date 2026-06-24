"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ChevronLeft, Eye } from "lucide-react";
import { useState } from "react";

import GameImageStrip from "@/app/components/ui/GameImageStrip";
import ConsoleTabIcon from "@/app/components/ui/ConsoleTabIcon";
import {
  cheatGamePath,
  cheatHubPath,
  getCheatGameImages,
  getFeaturedCheatGames,
  getSampleCheat,
} from "@/lib/blog-cheats";

const CONSOLE_META = {
  ps5: { label: "PS5", icon: "/icons/ps5.svg" },
  ps4: { label: "PS4", icon: "/icons/ps4.svg" },
  xbox: { label: "Xbox", icon: "/icons/xbox.svg" },
} as const;

function SpoilerCheatCard({
  gameSlug,
  name,
  console: gameConsole,
  images,
  sampleTitle,
  sampleCode,
}: {
  gameSlug: string;
  name: string;
  console: keyof typeof CONSOLE_META;
  images: string[];
  sampleTitle: string;
  sampleCode: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const consoleMeta = CONSOLE_META[gameConsole];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
      <div className="relative overflow-hidden">
        <GameImageStrip
          images={images}
          alt={name}
          sizes="(max-width: 768px) 100vw, 33vw"
          aspectClass="aspect-[16/10] w-full"
          imageClassName="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-[10px] font-bold text-zinc-200 backdrop-blur-sm">
          <ConsoleTabIcon src={consoleMeta.icon} className="h-3.5 w-3.5" />
          {consoleMeta.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold text-zinc-100">{name}</h3>

        <div className="relative mt-3 min-h-[88px]">
          <motion.div
            className="rounded-xl border border-white/10 bg-black/40 p-3"
            animate={
              revealed || prefersReducedMotion
                ? { filter: "blur(0px)", opacity: 1 }
                : { filter: "blur(8px)", opacity: 0.6 }
            }
            transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
          >
            <p className="text-xs font-semibold text-amber-300">{sampleTitle}</p>
            <code className="mt-1 block text-xs leading-relaxed text-cyan-300">
              {sampleCode}
            </code>
          </motion.div>

          {!revealed && !prefersReducedMotion ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl bg-zinc-950/70 text-sm font-semibold text-zinc-200 backdrop-blur-[2px] transition hover:bg-zinc-950/50"
            >
              <Eye className="h-5 w-5 text-violet-400" />
              نمایش چیت
            </button>
          ) : null}
        </div>

        <Link
          href={cheatGamePath(gameSlug)}
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
        >
          همه چیت‌های {name}
          <ChevronLeft className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

export default function HomeCheatsSection() {
  const featured = getFeaturedCheatGames();

  return (
    <section
      id="game-cheats"
      className="relative border-t border-white/5 bg-[#0505054c] py-24"
    >
      <div className="container mx-auto px-6">
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
          <p className="text-sm leading-relaxed text-amber-100/90">
            <span className="font-bold text-amber-300">هشدار اسپویلر: </span>
            نمایش چیت ممکن است تجربه بازی را تحت‌الشعاع قرار دهد. برای مشاهده
            روی هر کارت کلیک کنید.
          </p>
        </div>

        <div className="mb-12 text-right">
          <span className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-violet-400">
            Cheat Codes
          </span>
          <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">
            رمز و چیت{" "}
            <span className="bg-gradient-to-l from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              بازی‌های محبوب
            </span>
          </h2>
          <p className="max-w-2xl text-lg text-zinc-500">
            GTA، Minecraft، Sims و بیشتر — با reveal مدرن و لینک به صفحه اختصاصی
            هر بازی.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((game) => {
            const sample = getSampleCheat(game);
            if (!sample) return null;
            return (
              <SpoilerCheatCard
                key={game.gameSlug}
                gameSlug={game.gameSlug}
                name={game.name}
                console={game.console}
                images={getCheatGameImages(game)}
                sampleTitle={sample.title}
                sampleCode={sample.code}
              />
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={cheatHubPath()}
            className="inline-flex items-center gap-2 rounded-2xl border border-violet-500/40 bg-violet-500/15 px-8 py-4 text-base font-bold text-violet-200 transition hover:bg-violet-500/25"
          >
            مشاهده ۴۰ بازی با چیت کامل
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
