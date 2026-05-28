import Link from "next/link";
import { notFound } from "next/navigation";

import GameCatalogSections from "@/app/components/game-install/GameCatalogSections";
import PageShell from "@/app/components/seo/PageShell";
import { webPageJsonLd } from "../../../../lib/seo/jsonld";
import { createPageMetadata } from "../../../../lib/seo/metadata";
import { GAME_CATALOG_FILTER_IDS } from "@/lib/game-filters";
import {
  buildRepairHref,
  consoleIdFromGameInstallSlug,
} from "../../../../lib/repair-links";
import { GAME_INSTALL_CONSOLE_META } from "@/lib/game-install-meta";
import {
  fetchGameCatalogSections,
  isGameInstallConsole,
  type GameInstallConsole,
} from "@/lib/rawg";

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

  if (!meta) {
    return createPageMetadata({
      title: "صفحه یافت نشد",
      path: `/services/game-install/${consoleSlug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: meta.title,
    description: meta.description,
    path: `/services/game-install/${consoleSlug}`,
    keywords: [`نصب بازی ${meta.label}`, `خدمات ${meta.label}`],
  });
}

export default async function GameInstallPage({ params }: Props) {
  const { console: consoleSlug } = await params;
  const meta = GAME_INSTALL_CONSOLE_META[consoleSlug];

  if (!meta) notFound();

  const path = `/services/game-install/${consoleSlug}`;
  const repairHref = buildRepairHref({
    consoleId: consoleIdFromGameInstallSlug(consoleSlug),
  });

  let sections: Awaited<ReturnType<typeof fetchGameCatalogSections>> = [];
  let gamesError: string | null = null;

  if (isGameInstallConsole(consoleSlug)) {
    try {
      sections = await fetchGameCatalogSections(
        consoleSlug as GameInstallConsole,
        GAME_CATALOG_FILTER_IDS,
        12,
      );
    } catch {
      gamesError = "در حال حاضر امکان بارگذاری لیست بازی‌ها وجود ندارد.";
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] pt-24 text-white">
      <PageShell
        currentPath={path}
        jsonLd={webPageJsonLd({
          name: meta.title,
          description: meta.description,
          path,
        })}
        containerClassName="mx-auto max-w-7xl px-6"
      >
        <h1 className="mb-6 text-4xl font-black">{meta.title}</h1>
        <p className="mb-10 max-w-2xl text-lg text-zinc-400">
          {meta.description}
        </p>

        {gamesError ? (
          <p className="mb-10 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-amber-200">
            {gamesError}
          </p>
        ) : (
          <div className="mb-12">
            <GameCatalogSections
              consoleSlug={consoleSlug}
              sections={sections}
            />
          </div>
        )}

        <Link
          href={repairHref}
          className="inline-flex rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-black transition hover:bg-cyan-400"
        >
          ثبت درخواست
        </Link>
      </PageShell>
    </main>
  );
}
