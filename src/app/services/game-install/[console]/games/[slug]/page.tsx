import Link from "next/link";
import { notFound } from "next/navigation";

import FunnelNextStep from "@/app/components/funnel/FunnelNextStep";
import GameCard from "@/app/components/game-install/GameCard";
import GameInstallOrderFab from "@/app/components/game-install/GameInstallOrderFab";
import GameInstallOrderPanel from "@/app/components/game-install/GameInstallOrderPanel";
import InstallDeviceTypeBootstrap from "@/app/components/game-install/InstallDeviceTypeBootstrap";
import InstallThisGameCta from "@/app/components/game-install/InstallThisGameCta";
import FaqSection from "@/app/components/seo/FaqSection";
import OverviewSection from "@/app/components/seo/OverviewSection";
import PageShell from "@/app/components/seo/PageShell";
import JsonLd from "@/app/components/seo/JsonLd";
import { matchFeaturedInstallGame } from "@/app/data/featured-install-games";
import {
  formatInstallGameSize,
  getInstallCatalogConsoleLabel,
  hasInstallGamePrice,
  hasInstallGameSize,
  installGameDetailPath,
} from "@/lib/game-install-catalog";
import {
  buildInstallGameFaqs,
  buildInstallGameOverview,
  defaultInstallMethodLabel,
  estimateInstallDuration,
  getInstallGameBySlug,
} from "@/lib/game-install-game-page";
import { GAME_INSTALL_CONSOLE_META } from "@/lib/game-install-meta";
import { formatToman } from "@/lib/game-install-pricing";
import {
  consoleIdFromGameInstallSlug,
  gameInstallHrefForConsole,
} from "@/lib/repair-links";
import { webPageJsonLd } from "@/lib/seo/jsonld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site";

type Props = {
  params: Promise<{ console: string; slug: string }>;
};

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  // Do not prerender the full catalog at build time. Each page refetches the
  // catalog, so 600+ routes exceed CI's 60s static-generation timeout.
  // Pages are generated on demand (dynamicParams + ISR revalidate).
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { console: consoleSlug, slug } = await params;
  const meta = GAME_INSTALL_CONSOLE_META[consoleSlug];
  const path = installGameDetailPath(consoleSlug, slug);

  if (!meta) {
    return createPageMetadata({
      title: "صفحه یافت نشد",
      path,
      noIndex: true,
    });
  }

  const { game } = await getInstallGameBySlug(consoleSlug, slug);
  if (!game) {
    return createPageMetadata({
      title: "بازی یافت نشد",
      path,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `نصب ${game.name} روی ${meta.label}`,
    description: `نصب ${game.name} روی ${meta.label} در فیکس‌بازی — حجم، قیمت، مدت نصب و ثبت سفارش.`,
    path,
    keywords: [`نصب ${game.name}`, `نصب بازی ${meta.label}`, game.name],
  });
}

export default async function InstallGameDetailPage({ params }: Props) {
  const { console: consoleSlug, slug } = await params;
  const meta = GAME_INSTALL_CONSOLE_META[consoleSlug];
  if (!meta) notFound();

  const { game, related, deviceTypeId, fetchFailed } =
    await getInstallGameBySlug(consoleSlug, slug);

  if (fetchFailed && !game) {
    return (
      <main className="min-h-screen bg-[#050816] pt-24 text-white">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-red-200">
            بارگذاری اطلاعات بازی ناموفق بود. لطفاً بعداً دوباره تلاش کنید.
          </p>
        </div>
      </main>
    );
  }

  if (!game) notFound();

  const path = installGameDetailPath(consoleSlug, slug);
  const hubPath = `/services/game-install/${consoleSlug}`;
  const featured = matchFeaturedInstallGame(game.name, game.slug);
  const consoleLabel = meta.label;
  const methodLabel = featured?.methodNotes ?? defaultInstallMethodLabel(consoleSlug);
  const platform = getInstallCatalogConsoleLabel(game.console);
  const consoleId = consoleIdFromGameInstallSlug(consoleSlug);
  const overview = buildInstallGameOverview(game, consoleLabel);
  const faqs = buildInstallGameFaqs(game, consoleLabel);
  const pageTitle = `نصب ${game.name} روی ${consoleLabel}`;

  const specs = [
    {
      label: "حجم",
      value: hasInstallGameSize(game)
        ? formatInstallGameSize(game.size!)
        : "از کاتالوگ اعلام می‌شود",
    },
    { label: "پلتفرم", value: platform },
    { label: "نسخه", value: featured?.version ?? "نسخه موجود در کاتالوگ" },
    { label: "DLC", value: featured?.dlc ?? "بسته به موجودی کاتالوگ" },
    { label: "مدت نصب", value: estimateInstallDuration(game.size) },
    {
      label: "قیمت",
      value: hasInstallGamePrice(game)
        ? formatToman(game.price!)
        : "پس از بررسی اعلام می‌شود",
    },
    {
      label: "موجودی",
      value: featured?.stockNote ?? "موجود در کاتالوگ نصب",
    },
    { label: "روش نصب", value: methodLabel },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pageTitle,
    description: overview[0],
    url: absoluteUrl(path),
    areaServed: "IR",
    provider: { "@type": "LocalBusiness", name: "فیکس‌بازی" },
  };

  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-24 text-white">
      <InstallDeviceTypeBootstrap
        consoleSlug={consoleSlug}
        deviceTypeId={deviceTypeId}
      />
      <JsonLd data={[serviceSchema]} />
      <PageShell
        currentPath={path}
        jsonLd={webPageJsonLd({
          name: pageTitle,
          description: overview[0] ?? "",
          path,
        })}
        containerClassName="mx-auto max-w-5xl px-4 sm:px-6"
        className="mx-auto max-w-5xl px-4 pb-12 sm:px-6"
      >
        <Link
          href={`${hubPath}/games`}
          className="mb-6 inline-block text-sm text-zinc-500 transition hover:text-cyan-400"
        >
          ← لیست بازی‌های {consoleLabel}
        </Link>

        <p className="mb-3 text-sm font-bold text-cyan-300">
          نصب بازی {consoleLabel}
        </p>
        <h1 className="mb-4 text-4xl font-black leading-tight md:text-5xl">
          {pageTitle}
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-zinc-400">{game.name}</p>

        <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-xs text-zinc-500">{spec.label}</p>
              <p className="mt-1 text-sm font-bold leading-7 text-white">
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        <InstallThisGameCta
          game={game}
          consoleSlug={consoleSlug}
          orderHref="#game-install-order"
        />

        <OverviewSection
          title={`درباره نصب ${game.name}`}
          paragraphs={overview}
          className="border-t-0 py-12"
        />

        <FaqSection items={faqs} className="border-t-0 py-8" />

        <div className="my-10">
          <FunnelNextStep
            title="کنسول مشکل دارد؟ اول تعمیر"
            description="اگر دستگاه روشن نمی‌شود، تصویر ندارد یا HDMI خراب است، نصب بازی انجام نمی‌شود. اول تعمیر، بعد نصب."
            actions={[
              {
                href: consoleId
                  ? `/services/${consoleId === "xbox" ? "xbox-repair" : `${consoleId}-repair`}`
                  : "/services",
                label: `تعمیر ${consoleLabel}`,
                primary: true,
              },
              {
                href: gameInstallHrefForConsole(consoleId),
                label: "سایر بازی‌ها و پکیج‌ها",
              },
            ]}
          />
        </div>

        {related.length > 0 ? (
          <section className="mb-12" aria-labelledby="related-games-title">
            <h2 id="related-games-title" className="mb-6 text-2xl font-black">
              بازی‌های مرتبط برای نصب
            </h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {related.map((item) => (
                <li key={item.id}>
                  <GameCard
                    game={item}
                    consoleSlug={consoleSlug}
                    showAddButton
                    layout="grid"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <GameInstallOrderPanel
          consoleSlug={consoleSlug}
          consoleLabel={consoleLabel}
          variant="compact"
          suggestedNote={`نصب ${game.name} روی ${consoleLabel}`}
        />
        <GameInstallOrderFab consoleSlug={consoleSlug} />
      </PageShell>
    </main>
  );
}
