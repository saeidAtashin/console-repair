import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import GameCatalogGrid from "@/app/components/game-install/GameCatalogGrid";
import GameInstallConsoleTabs from "@/app/components/game-install/GameInstallConsoleTabs";
import GameInstallMethodPicker from "@/app/components/game-install/GameInstallMethodPicker";
import GameInstallOrderFab from "@/app/components/game-install/GameInstallOrderFab";
import GameInstallOrderPanel from "@/app/components/game-install/GameInstallOrderPanel";
import GameInstallPriceCalculator from "@/app/components/game-install/GameInstallPriceCalculator";
import InstallDeviceTypeBootstrap from "@/app/components/game-install/InstallDeviceTypeBootstrap";
import PageShell from "@/app/components/seo/PageShell";
import { getAllInstallCatalogWithMeta } from "@/lib/game-install-catalog.server";
import {
  GAME_INSTALL_CONSOLE_META,
  GAME_INSTALL_CONSOLE_ORDER,
  parseGameInstallConsoleFilter,
} from "@/lib/game-install-meta";
import { collectionPageJsonLd } from "@/lib/seo/jsonld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getGameInstallImage } from "@/lib/quick-access-images";

const PATH = "/services/game-install";
const TITLE = "نصب بازی";
const DESCRIPTION =
  "لیست کامل بازی‌های قابل نصب برای PS4، PS5، Xbox One و Xbox Series — جستجو، انتخاب و ثبت سفارش نصب.";

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "نصب بازی",
    "لیست بازی ps5",
    "لیست بازی ps4",
    "نصب بازی xbox",
    "قیمت نصب بازی",
  ],
});

type Props = {
  searchParams: Promise<{ console?: string }>;
};

export default async function GameInstallIndexPage({ searchParams }: Props) {
  const params = await searchParams;
  const consoleFilter = parseGameInstallConsoleFilter(params.console);
  const isAllConsoles = consoleFilter === "all";
  const activeConsoleSlug = isAllConsoles ? undefined : consoleFilter;
  const activeMeta = activeConsoleSlug
    ? GAME_INSTALL_CONSOLE_META[activeConsoleSlug]
    : undefined;

  const { games: catalogGames, deviceTypeId, fetchFailed } =
    await getAllInstallCatalogWithMeta(activeConsoleSlug);
  const consoleLabel = activeMeta?.label ?? "همه کنسول‌ها";

  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-24 text-white">
      {activeConsoleSlug ? (
        <InstallDeviceTypeBootstrap
          consoleSlug={activeConsoleSlug}
          deviceTypeId={deviceTypeId}
        />
      ) : null}
      <PageShell
        currentPath={PATH}
        jsonLd={collectionPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: PATH,
        })}
        containerClassName="mx-auto max-w-7xl px-4 sm:px-6"
        className="mx-auto max-w-7xl px-4 pb-8 sm:px-6"
      >
        <h1 className="text-4xl font-black md:text-5xl">لیست بازی‌ها</h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-400">{DESCRIPTION}</p>

        <GameInstallConsoleTabs activeConsole={consoleFilter} />

        <section className="mt-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black md:text-3xl">
                {isAllConsoles ? "همه بازی‌ها" : `بازی‌های ${activeMeta?.label}`}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {catalogGames.length.toLocaleString("fa-IR")} بازی
                {isAllConsoles
                  ? " — برای ثبت سفارش، کنسول خود را از تب‌های بالا انتخاب کنید."
                  : " — انتخاب کنید و به لیست سفارش اضافه کنید."}
              </p>
            </div>
          </div>

          <GameCatalogGrid
            consoleSlug={activeConsoleSlug ?? ""}
            consoleLabel={consoleLabel}
            games={catalogGames}
            showFullListLink={false}
            fetchFailed={fetchFailed}
          />
        </section>

        {isAllConsoles ? (
          <section
            className="mt-14 border-t border-white/10 pt-14"
            aria-labelledby="game-install-consoles-title"
          >
            <h2 id="game-install-consoles-title" className="mb-8 text-2xl font-black">
              تعرفه نصب بازی بر اساس کنسول
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {GAME_INSTALL_CONSOLE_ORDER.map((slug) => {
                const meta = GAME_INSTALL_CONSOLE_META[slug];
                const imageSrc = getGameInstallImage(slug);

                return (
                  <Link
                    key={slug}
                    href={`/services/game-install/${slug}`}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 transition hover:border-cyan-400/30"
                  >
                    {imageSrc ? (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={meta.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      </div>
                    ) : null}
                    <div className="p-6">
                      <h3 className="text-lg font-bold">{meta.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-zinc-400">
                        {meta.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm text-cyan-400">
                        مشاهده تعرفه
                        <ChevronLeft className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : (
          <>
            <section className="mt-10 rounded-3xl border border-cyan-400/30 bg-cyan-500/5 p-6">
              <h2 className="mb-4 text-lg font-black">روش نصب</h2>
              <GameInstallMethodPicker consoleSlug={activeConsoleSlug!} />
            </section>

            <div className="my-10">
              <GameInstallPriceCalculator consoleSlug={activeConsoleSlug!} />
            </div>

            <GameInstallOrderPanel
              consoleSlug={activeConsoleSlug!}
              consoleLabel={activeMeta!.label}
              variant="compact"
            />

            <GameInstallOrderFab consoleSlug={activeConsoleSlug!} />
          </>
        )}
      </PageShell>
    </main>
  );
}
