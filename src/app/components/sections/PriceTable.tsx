"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const CONSOLE_TABS = [
  { id: "ps4", label: "PS4", href: "/services/game-install/ps4" },
  { id: "ps5", label: "PS5", href: "/services/game-install/ps5" },
  { id: "xbox", label: "Xbox", href: "/services/game-install/xbox-series" },
] as const;

type ConsoleTab = (typeof CONSOLE_TABS)[number]["id"];

const GAME_INSTALL_BY_CONSOLE: Record<
  ConsoleTab,
  {
    title: string;
    description: string;
    highlights: { title: string; range: string }[];
  }
> = {
  ps4: {
    title: "تعرفه نصب بازی PS4",
    description:
      "PS4 بیشترین تنوع روش نصب را دارد؛ از نصب اکانتی تا نصب آفلاین کپی خور.",
    highlights: [
      { title: "تک بازی (اکانتی)", range: "1.5M - 3.5M" },
      { title: "پکیج 5 بازی", range: "5M - 9M" },
      { title: "نصب آفلاین (کپی خور)", range: "250K - 350K" },
      { title: "پکیج کپی خور", range: "3M - 10M" },
    ],
  },
  ps5: {
    title: "تعرفه نصب بازی PS5",
    description:
      "روی PS5 تمرکز اصلی روی نصب اکانتی و پکیج‌های انتخابی یا اقتصادی است.",
    highlights: [
      { title: "تک بازی", range: "1.5M - 3.5M" },
      { title: "پکیج 5 بازی", range: "5M - 9M" },
      { title: "پکیج 10 بازی", range: "3.5M - 12M" },
      { title: "پکیج اقتصادی", range: "4M - 9M" },
    ],
  },
  xbox: {
    title: "تعرفه نصب بازی Xbox",
    description:
      "هزینه نصب Xbox وابسته به اکانت Microsoft، Game Pass و تعداد بازی است.",
    highlights: [
      { title: "تک بازی", range: "1.5M - 3M" },
      { title: "پکیج 5 تا 10 بازی", range: "4M - 10M" },
      { title: "راه اندازی اکانت", range: "200K - 500K" },
      { title: "انتقال دیتا", range: "300K - 800K" },
    ],
  },
};

const PriceTable = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("ps5");
  const activeData = useMemo(
    () => GAME_INSTALL_BY_CONSOLE[activeTab],
    [activeTab],
  );
  const activeHref = CONSOLE_TABS.find((tab) => tab.id === activeTab)?.href;

  return (
    <div className="container mx-auto px-6">
      <section className="mt-10 overflow-hidden rounded-3xl border border-cyan-400/30 bg-linear-to-br from-cyan-500/10 via-blue-500/5 to-violet-500/10 p-6 md:p-8">
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            {CONSOLE_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ml-4 ${
                    isActive
                      ? "bg-cyan-400 text-black"
                      : "border border-white/15 bg-white/5 text-zinc-200 hover:border-cyan-300/40 hover:text-cyan-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <Link
              href={activeHref ?? "/services/game-install/ps5"}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-300"
            >
              مشاهده تعرفه کامل
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 md:p-5">
          <p className="text-lg font-black text-white">{activeData.title}</p>
          <p className="mt-2 text-sm text-zinc-300">{activeData.description}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {activeData.highlights.map((item) => (
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
      </section>
    </div>
  );
};

export default PriceTable;
