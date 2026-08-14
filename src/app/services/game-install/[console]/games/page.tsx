import Link from "next/link";
import { notFound } from "next/navigation";

import GameCatalogGrid from "@/app/components/game-install/GameCatalogGrid";
import GameInstallMethodPicker from "@/app/components/game-install/GameInstallMethodPicker";
import GameInstallOrderFab from "@/app/components/game-install/GameInstallOrderFab";
import GameInstallOrderPanel from "@/app/components/game-install/GameInstallOrderPanel";
import GameInstallPriceCalculator from "@/app/components/game-install/GameInstallPriceCalculator";
import InstallDeviceTypeBootstrap from "@/app/components/game-install/InstallDeviceTypeBootstrap";
import OverviewSection from "@/app/components/seo/OverviewSection";
import PageShell from "@/app/components/seo/PageShell";
import { webPageJsonLd } from "../../../../../lib/seo/jsonld";
import { createPageMetadata } from "../../../../../lib/seo/metadata";
import { GAME_INSTALL_CONSOLE_META } from "@/lib/game-install-meta";
import { getGameInstallContent } from "@/lib/game-install-content";
import { getInstallCatalogWithMeta } from "@/lib/game-install-catalog.server";

type Props = {
  params: Promise<{ console: string }>;
};

export function generateStaticParams() {
  return Object.keys(GAME_INSTALL_CONSOLE_META).map((console) => ({
    console,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { console: consoleSlug } = await params;
  const meta = GAME_INSTALL_CONSOLE_META[consoleSlug];
  const content = getGameInstallContent(consoleSlug);

  if (!meta) {
    return createPageMetadata({
      title: "صفحه یافت نشد",
      path: `/services/game-install/${consoleSlug}/games`,
      noIndex: true,
    });
  }

  const description =
    content?.gamesPageIntro[0]?.slice(0, 160) ??
    `لیست کامل بازی‌های ${meta.label} برای انتخاب و ثبت سفارش نصب.`;

  return createPageMetadata({
    title: `لیست بازی‌ها — ${meta.label}`,
    description,
    path: `/services/game-install/${consoleSlug}/games`,
    keywords: [meta.label, "نصب بازی", "لیست بازی"],
  });
}

export default async function GameListPage({ params }: Props) {
  const { console: consoleSlug } = await params;
  const meta = GAME_INSTALL_CONSOLE_META[consoleSlug];
  const content = getGameInstallContent(consoleSlug);

  if (!meta || !content) notFound();

  const hubPath = `/services/game-install/${consoleSlug}`;
  const listPath = `${hubPath}/games`;
  const { games: catalogGames, deviceTypeId, fetchFailed, hasMoreGames, totalCount } =
    await getInstallCatalogWithMeta(consoleSlug);
  const introParagraphs = content.gamesPageIntro;

  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-24 text-white">
      <InstallDeviceTypeBootstrap
        consoleSlug={consoleSlug}
        deviceTypeId={deviceTypeId}
      />
      <PageShell
        currentPath={listPath}
        jsonLd={webPageJsonLd({
          name: `لیست بازی‌ها — ${meta.label}`,
          description: introParagraphs[0] ?? "",
          path: listPath,
        })}
        containerClassName="mx-auto max-w-7xl px-4 sm:px-6"
        className="mx-auto max-w-7xl px-4 pb-8 sm:px-6"
      >
        <Link
          href={hubPath}
          className="mb-6 inline-block text-sm text-zinc-500 transition hover:text-cyan-400"
        >
          ← بازگشت به {meta.title}
        </Link>

        <h1 className="mb-2 text-3xl font-black md:text-4xl">
          لیست بازی‌ها
          <span className="text-zinc-500"> · {meta.label}</span>
        </h1>

        <OverviewSection paragraphs={introParagraphs} className="border-t-0 py-8" />

        <div className="mb-8 flex flex-wrap gap-3">
          <a
            href={`${hubPath}#game-install-games`}
            className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-cyan-400"
          >
            ثبت سفارش نصب بازی
          </a>
          <Link
            href={hubPath}
            className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-bold transition hover:border-cyan-400/40"
          >
            مشاهده تعرفه
          </Link>
        </div>

        <section className="mb-10 rounded-3xl border border-cyan-400/30 bg-cyan-500/5 p-6">
          <h2 className="mb-4 text-lg font-black">روش نصب</h2>
          <GameInstallMethodPicker consoleSlug={consoleSlug} />
        </section>

        {fetchFailed ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-10 text-center">
            <p className="text-red-200">
              بارگذاری لیست بازی‌ها ناموفق بود. لطفاً چند لحظه بعد دوباره
              تلاش کنید.
            </p>
          </div>
        ) : (
          <GameCatalogGrid
            consoleSlug={consoleSlug}
            consoleLabel={meta.label}
            games={catalogGames}
            deviceTypeId={deviceTypeId}
            hasMoreGames={hasMoreGames}
            totalCount={totalCount}
            showFullListLink={false}
          />
        )}

        <div className="my-10">
          <GameInstallPriceCalculator consoleSlug={consoleSlug} />
        </div>

        <GameInstallOrderPanel
          consoleSlug={consoleSlug}
          consoleLabel={meta.label}
          variant="compact"
        />

        <GameInstallOrderFab consoleSlug={consoleSlug} />
      </PageShell>
    </main>
  );
}
