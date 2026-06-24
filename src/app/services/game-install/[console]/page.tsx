import Link from "next/link";
import { notFound } from "next/navigation";

import GameCatalogSections from "@/app/components/game-install/GameCatalogSections";
import GameInstallCheatsLink from "@/app/components/game-install/GameInstallCheatsLink";
import FaqSection from "@/app/components/seo/FaqSection";
import OverviewSection from "@/app/components/seo/OverviewSection";
import PageShell from "@/app/components/seo/PageShell";
import TrustSignalsBar from "@/app/components/seo/TrustSignalsBar";
import ServiceSchema from "@/app/components/schema/ServiceSchema";
import { webPageJsonLd } from "../../../../lib/seo/jsonld";
import { createPageMetadata } from "../../../../lib/seo/metadata";
import {
  buildRepairHref,
  consoleIdFromGameInstallSlug,
} from "../../../../lib/repair-links";
import { GAME_INSTALL_CONSOLE_META } from "@/lib/game-install-meta";
import {
  formatRangeToman,
  GAME_INSTALL_PRICE_DATA,
  GAME_INSTALL_SUMMARY_TABLE,
} from "@/lib/game-install-pricing";
import { getGameInstallContent } from "@/lib/game-install-content";
import {
  fetchGameCatalogSections,
  isGameInstallConsole,
  type GameInstallConsole,
} from "@/lib/rawg";
import { GAME_CATALOG_FILTER_IDS } from "@/lib/game-filters";

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
      path: `/services/game-install/${consoleSlug}`,
      noIndex: true,
    });
  }

  const description =
    content?.overview[0]?.slice(0, 160) ??
    `لیست کامل هزینه نصب بازی روی ${meta.label} شامل نصب اکانتی، پکیج اقتصادی و خدمات جانبی.`;

  return createPageMetadata({
    title: `تعرفه نصب بازی ${meta.label}`,
    description,
    path: `/services/game-install/${consoleSlug}`,
    keywords: [
      `تعرفه نصب بازی ${meta.label}`,
      `قیمت نصب بازی ${meta.label}`,
      `نصب بازی ${meta.label}`,
    ],
  });
}

export default async function GameInstallPage({ params }: Props) {
  const { console: consoleSlug } = await params;
  const meta = GAME_INSTALL_CONSOLE_META[consoleSlug];
  const content = getGameInstallContent(consoleSlug);

  if (!meta || !content) notFound();

  const path = `/services/game-install/${consoleSlug}`;
  const repairHref = buildRepairHref({
    consoleId: consoleIdFromGameInstallSlug(consoleSlug),
  });
  const pricingSections = content.pricingSectionKeys.map(
    (key) => GAME_INSTALL_PRICE_DATA[key],
  );
  const jsonLdDescription = `تعرفه نصب بازی ${meta.label}: از نصب با اکانت ظرفیتی تا نصب آفلاین و خدمات جانبی.`;

  let catalogSections: Awaited<
    ReturnType<typeof fetchGameCatalogSections>
  > = [];

  if (isGameInstallConsole(consoleSlug)) {
    try {
      catalogSections = await fetchGameCatalogSections(
        consoleSlug as GameInstallConsole,
        GAME_CATALOG_FILTER_IDS,
        12,
      );
    } catch {
      catalogSections = [];
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] pt-24 text-white">
      <ServiceSchema
        title={`نصب بازی ${meta.label}`}
        description={jsonLdDescription}
        url={path}
      />

      <PageShell
        currentPath={path}
        jsonLd={webPageJsonLd({
          name: `تعرفه نصب بازی ${meta.label}`,
          description: jsonLdDescription,
          path,
        })}
        containerClassName="relative z-10 mx-auto max-w-5xl px-6"
        className="relative z-10 mx-auto max-w-5xl px-6 pb-16"
      >
        <h1 className="mb-6 text-4xl font-black md:text-5xl">
          تعرفه نصب بازی {meta.label}
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-zinc-400">
          هزینه‌ها به نوع نصب، تعداد بازی و وضعیت کنسول بستگی دارد. بازه‌های زیر
          برای {meta.label} ارائه می‌شوند.
        </p>

        <OverviewSection
          paragraphs={content.overview}
          className="border-t-0 py-0"
        />

        <GameInstallCheatsLink consoleSlug={consoleSlug} />

        <section className="mb-10 grid gap-4 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-6 sm:grid-cols-2 xl:grid-cols-5">
          {GAME_INSTALL_SUMMARY_TABLE.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <p className="mb-2 text-sm text-zinc-300">{item.label}</p>
              <p className="font-extrabold leading-7 text-cyan-300">
                {formatRangeToman(item.range)}
              </p>
            </div>
          ))}
        </section>

        <section className="mb-12 grid gap-6 lg:grid-cols-2">
          {pricingSections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="mb-4 text-xl font-black">{section.title}</h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-1 rounded-xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-zinc-200">{item.label}</span>
                    <span className="font-bold leading-7 text-cyan-300">
                      {formatRangeToman(item.priceRangeToman)}
                    </span>
                  </div>
                ))}
              </div>
              {"notes" in section && section.notes ? (
                <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  {section.notes}
                </p>
              ) : null}
            </article>
          ))}
        </section>

        <section className="mb-12" aria-labelledby="install-process-title">
          <h2 id="install-process-title" className="mb-6 text-2xl font-black">
            مراحل نصب
          </h2>
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {content.processSteps.map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <span className="mb-2 block font-mono text-sm text-cyan-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-semibold leading-7">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {catalogSections.length > 0 ? (
          <section className="mb-12" aria-labelledby="game-catalog-title">
            <h2 id="game-catalog-title" className="mb-6 text-2xl font-black">
              پیشنهاد بازی برای {meta.label}
            </h2>
            <GameCatalogSections
              consoleSlug={consoleSlug}
              sections={catalogSections}
            />
          </section>
        ) : null}

        <TrustSignalsBar signals={content.trustSignals} className="py-8" />

        <FaqSection items={content.faqs} className="py-12" />

        <div className="flex flex-wrap gap-4">
          <Link
            href={repairHref}
            className="inline-flex rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-black transition hover:bg-cyan-400"
          >
            ثبت درخواست نصب بازی
          </Link>
          <Link
            href="/services"
            className="inline-flex rounded-2xl border border-white/10 px-8 py-4 font-bold transition hover:border-cyan-400/40"
          >
            بازگشت به خدمات
          </Link>
        </div>
      </PageShell>
    </main>
  );
}
