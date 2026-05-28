import { GAME_INSTALL_CONSOLE_META } from "@/lib/game-install-meta";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const GAME_INSTALL_HIGHLIGHTS = [
  { title: "تک بازی", range: "1.5M - 3.5M" },
  { title: "پکیج 5 بازی", range: "5M - 9M" },
  { title: "پکیج 10 بازی", range: "3.5M - 12M" },
  { title: "نصب کپی خور (تک)", range: "250K - 350K" },
] as const;

const PriceTable = () => {
  return (
    <div>
      <section className="mt-10 overflow-hidden rounded-3xl border border-cyan-400/30 bg-linear-to-br from-cyan-500/10 via-blue-500/5 to-violet-500/10 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black md:text-3xl">
              خلاصه نصب بازی کنسول
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-300">
              اگر دنبال نصب بازی هستید، این بازه‌ها پرتقاضاترین گزینه‌ها هستند.
              برای مشاهده تعرفه کامل، مدل کنسول خود را انتخاب کنید.
            </p>
          </div>
          <Link
            href="/services/game-install/ps5"
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-300"
          >
            مشاهده تعرفه کامل
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {GAME_INSTALL_HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >
              <p className="text-sm text-zinc-300">{item.title}</p>
              <p className="mt-1 text-lg font-black text-cyan-300">
                {item.range}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {Object.entries(GAME_INSTALL_CONSOLE_META).map(([slug, meta]) => (
            <Link
              key={slug}
              href={`/services/game-install/${slug}`}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:border-cyan-300/40 hover:text-cyan-200"
            >
              تعرفه {meta.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PriceTable;
