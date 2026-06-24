import Link from "next/link";
import { notFound } from "next/navigation";

import GameListGrid from "@/app/components/game-install/GameListGrid";
import GamePagination from "@/app/components/game-install/GamePagination";
import OverviewSection from "@/app/components/seo/OverviewSection";
import PageShell from "@/app/components/seo/PageShell";
import { webPageJsonLd } from "../../../../../lib/seo/jsonld";
import { createPageMetadata } from "../../../../../lib/seo/metadata";
import {
  GAME_FILTER_IDS,
  GAME_FILTERS,
  getGameFilter,
  gameListPath,
  isGameFilter,
  type GameFilterId,
} from "@/lib/game-filters";
import { GAME_INSTALL_CONSOLE_META } from "@/lib/game-install-meta";
import {
  getGameInstallContent,
} from "@/lib/game-install-content";
import {
  buildRepairHref,
  consoleIdFromGameInstallSlug,
} from "../../../../../lib/repair-links";
import {
  fetchGamesByConsole,
  isGameInstallConsole,
  type GameInstallConsole,
} from "@/lib/rawg";

const PAGE_SIZE = 24;

type Props = {
  params: Promise<{ console: string }>;
  searchParams: Promise<{ filter?: string; page?: string }>;
};

export function generateStaticParams() {
  return Object.keys(GAME_INSTALL_CONSOLE_META).map((console) => ({
    console,
  }));
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { console: consoleSlug } = await params;
  const { filter: filterParam = "best", page: pageParam } = await searchParams;
  const meta = GAME_INSTALL_CONSOLE_META[consoleSlug];
  const filter = getGameFilter(filterParam) ?? GAME_FILTERS.best;
  const page = Math.max(1, Number(pageParam ?? "1") || 1);

  if (!meta) {
    return createPageMetadata({
      title: "صفحه یافت نشد",
      path: `/services/game-install/${consoleSlug}/games`,
      noIndex: true,
    });
  }

  const path = gameListPath(consoleSlug, filter.id, page);
  const content = getGameInstallContent(consoleSlug);
  const filterIntro = content?.filterIntros[filter.id as GameFilterId];
  const description =
    filterIntro ??
    `${filter.description} برای ${meta.label}`;

  return createPageMetadata({
    title: `${filter.label} — ${meta.label}`,
    description,
    path,
    keywords: [filter.label, meta.label, "نصب بازی"],
    noIndex: page > 1,
  });
}

export default async function GameListPage({ params, searchParams }: Props) {
  const { console: consoleSlug } = await params;
  const sp = await searchParams;
  const meta = GAME_INSTALL_CONSOLE_META[consoleSlug];
  const content = getGameInstallContent(consoleSlug);

  if (!meta || !content || !isGameInstallConsole(consoleSlug)) notFound();

  const filterParam = sp.filter ?? "best";
  if (!isGameFilter(filterParam)) notFound();

  const filter = GAME_FILTERS[filterParam];
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const consoleId = consoleSlug as GameInstallConsole;
  const hubPath = `/services/game-install/${consoleSlug}`;
  const listPath = gameListPath(consoleSlug, filterParam, page);
  const repairHref = buildRepairHref({
    consoleId: consoleIdFromGameInstallSlug(consoleSlug),
  });
  const filterIntro = content.filterIntros[filterParam] ?? filter.description;
  const introParagraphs = [
    ...content.gamesPageIntro,
    filterIntro,
  ];

  let games: Awaited<ReturnType<typeof fetchGamesByConsole>>["games"] = [];
  let totalCount = 0;
  let hasNext = false;
  let loadError: string | null = null;

  try {
    const result = await fetchGamesByConsole(consoleId, {
      filter: filterParam,
      page,
      pageSize: PAGE_SIZE,
    });
    games = result.games;
    totalCount = result.count;
    hasNext = result.hasNext;
  } catch {
    loadError = "دریافت لیست بازی‌ها با خطا مواجه شد.";
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-[#050816] pt-24 text-white p-10">
      <PageShell
        currentPath={listPath}
        jsonLd={webPageJsonLd({
          name: `${filter.label} — ${meta.label}`,
          description: filterIntro,
          path: listPath,
        })}
        containerClassName="mx-auto max-w-7xl px-6"
      >
        <Link
          href={hubPath}
          className="mb-6 inline-block text-sm text-zinc-500 transition hover:text-cyan-400"
        >
          ← بازگشت به {meta.title}
        </Link>

        <h1 className="mb-2 text-3xl font-black md:text-4xl">
          {filter.label}
          <span className="text-zinc-500"> · {meta.label}</span>
        </h1>

        <OverviewSection paragraphs={introParagraphs} className="border-t-0 py-8" />

        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href={repairHref}
            className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-cyan-400"
          >
            ثبت درخواست نصب
          </Link>
          <Link
            href={hubPath}
            className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-bold transition hover:border-cyan-400/40"
          >
            مشاهده تعرفه
          </Link>
        </div>

        <nav
          className="mb-10 flex flex-wrap gap-2"
          aria-label="دسته‌بندی بازی‌ها"
        >
          {GAME_FILTER_IDS.map((id) => {
            const active = id === filterParam;
            return (
              <Link
                key={id}
                href={gameListPath(consoleSlug, id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-cyan-500 text-black"
                    : "border border-white/10 text-zinc-300 hover:border-cyan-400/30"
                }`}
              >
                {GAME_FILTERS[id].label}
              </Link>
            );
          })}
        </nav>

        {loadError ? (
          <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-amber-200">
            {loadError}
          </p>
        ) : (
          <>
            <GameListGrid games={games} totalCount={totalCount} />
            <GamePagination
              consoleSlug={consoleSlug}
              filter={filterParam}
              page={page}
              hasNext={hasNext}
              totalPages={totalPages}
            />
          </>
        )}
      </PageShell>
    </main>
  );
}
