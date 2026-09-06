import Link from "next/link";
import { notFound } from "next/navigation";

import FunnelNextStep from "@/app/components/funnel/FunnelNextStep";
import GameCatalogGrid from "@/app/components/game-install/GameCatalogGrid";
import GameInstallCheatsLink from "@/app/components/game-install/GameInstallCheatsLink";
import GameInstallMethodPicker from "@/app/components/game-install/GameInstallMethodPicker";
import GameInstallOrderFab from "@/app/components/game-install/GameInstallOrderFab";
import GameInstallOrderPanel from "@/app/components/game-install/GameInstallOrderPanel";
import GameInstallPriceCalculator from "@/app/components/game-install/GameInstallPriceCalculator";
import InstallDeviceTypeBootstrap from "@/app/components/game-install/InstallDeviceTypeBootstrap";
import FaqSection from "@/app/components/seo/FaqSection";
import OverviewSection from "@/app/components/seo/OverviewSection";
import PageShell from "@/app/components/seo/PageShell";
import TrustSignalsBar from "@/app/components/seo/TrustSignalsBar";
import ServiceSchema from "@/app/components/schema/ServiceSchema";
import { webPageJsonLd } from "../../../../lib/seo/jsonld";
import { createPageMetadata } from "../../../../lib/seo/metadata";
import { GAME_INSTALL_CONSOLE_META } from "@/lib/game-install-meta";
import {
  formatRangeToman,
  GAME_INSTALL_PRICE_DATA,
  GAME_INSTALL_SUMMARY_TABLE,
} from "@/lib/game-install-pricing";
import {
  GAME_INSTALL_PACKAGE_TIERS,
  GAME_INSTALL_PACKAGES,
  gameInstallPackagePath,
} from "@/lib/game-install-packages";
import { consoleIdFromGameInstallSlug } from "@/lib/repair-links";
import { getGameInstallContent } from "@/lib/game-install-content";
import { getInstallCatalogWithMeta } from "@/lib/game-install-catalog.server";

type Props = {
  params: Promise<{ console: string }>;
};

export const dynamic = "force-dynamic";

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
  const consoleId = consoleIdFromGameInstallSlug(consoleSlug);
  const { games: catalogGames, deviceTypeId, fetchFailed, hasMoreGames, totalCount } =
    await getInstallCatalogWithMeta(consoleSlug);
  const pricingSections = content.pricingSectionKeys.map(
    (key) => GAME_INSTALL_PRICE_DATA[key],
  );
  const jsonLdDescription = `تعرفه نصب بازی ${meta.label}: از نصب با اکانت ظرفیتی تا نصب آفلاین و خدمات جانبی.`;

  return (
    <main className="min-h-screen bg-[#050816] pt-24 text-white">
      <InstallDeviceTypeBootstrap
        consoleSlug={consoleSlug}
        deviceTypeId={deviceTypeId}
      />
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
        containerClassName="relative z-10 mx-auto max-w-7xl px-4 sm:px-6"
        className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-16"
      >
        <h1 className="mb-6 text-4xl font-black md:text-5xl">
          تعرفه نصب بازی {meta.label}
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-zinc-400">
          روش نصب را انتخاب کنید، بازی‌ها را به لیست اضافه کنید، برآورد قیمت را
          ببینید و سفارش را ثبت کنید.
        </p>

        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          {GAME_INSTALL_PACKAGE_TIERS.map((tier) => {
            const pkg = GAME_INSTALL_PACKAGES[tier];
            return (
              <Link
                key={tier}
                href={gameInstallPackagePath(consoleSlug, tier)}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/40"
              >
                <p className="text-sm font-bold text-cyan-300">{pkg.shortTitle}</p>
                <h2 className="mt-1 text-lg font-black">{pkg.title}</h2>
                <p className="mt-3 text-sm text-zinc-400">{pkg.gameCountHint}</p>
                <p className="mt-3 font-black text-cyan-200">
                  {formatRangeToman(pkg.priceRange)}
                </p>
              </Link>
            );
          })}
        </section>

        <section
          id="game-install-games"
          className="mb-12 scroll-mt-28 overflow-hidden rounded-3xl border-2 border-cyan-400/40 bg-gradient-to-b from-cyan-500/10 to-[#050816] shadow-[0_0_60px_-20px_rgba(34,211,238,0.35)]"
          aria-labelledby="game-catalog-title"
        >
          <div className="border-b border-cyan-400/20 bg-cyan-500/10 px-4 py-5 sm:px-6 md:px-8">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
              مرحله ۰
            </p>
            <h2 className="mb-4 text-lg font-black text-white">روش نصب</h2>
            <GameInstallMethodPicker consoleSlug={consoleSlug} />
          </div>

          <div className="border-b border-cyan-400/20 px-4 py-5 sm:px-6 md:px-8">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
              مرحله ۱
            </p>
            <h2 id="game-catalog-title" className="text-2xl font-black md:text-3xl">
              لیست بازی‌ها
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-300">
              {totalCount.toLocaleString("fa-IR")} بازی برای نصب روی{" "}
              {meta.label} — انتخاب کنید و به لیست سفارش اضافه کنید.
            </p>
          </div>

          <div className="px-4 py-6 sm:px-6 md:px-8">
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
              />
            )}
          </div>

          <div className="border-t border-cyan-400/20 px-4 py-6 sm:px-6 md:px-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-300">
              برآورد قیمت
            </p>
            <GameInstallPriceCalculator consoleSlug={consoleSlug} />
          </div>

          <div className="border-t border-cyan-400/20 bg-black/20 px-4 py-2 sm:px-6 md:px-8">
            <p className="py-3 text-xs font-bold uppercase tracking-wider text-emerald-300">
              مرحله ۲ — لیست سفارش و ثبت درخواست
            </p>
          </div>

          <div className="px-4 pb-4 sm:px-6 md:px-8">
            <GameInstallOrderPanel
              consoleSlug={consoleSlug}
              consoleLabel={meta.label}
              embedded
            />
          </div>
        </section>

        <GameInstallOrderFab consoleSlug={consoleSlug} />

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

        <TrustSignalsBar signals={content.trustSignals} className="py-8" />

        <FaqSection items={content.faqs} className="py-12" />

        <div className="mb-10">
          <FunnelNextStep
            title="کنسول روشن نمی‌شود یا تصویر ندارد؟"
            description="نصب بازی روی دستگاه معیوب انجام نمی‌شود. اگر HDMI، بوت یا تصویر مشکل دارد، اول تعمیر کنید."
            actions={[
              {
                href: consoleId
                  ? `/services/${consoleId === "xbox" ? "xbox-repair" : `${consoleId}-repair`}`
                  : "/services",
                label: `تعمیر ${meta.label}`,
                primary: true,
              },
              {
                href: `/consoles/${consoleId ?? "ps5"}/issues`,
                label: "مشاهده مشکلات رایج",
              },
            ]}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <a
            href="#game-install-games"
            className="inline-flex rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-black transition hover:bg-cyan-400"
          >
            انتخاب و ثبت سفارش نصب
          </a>
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
