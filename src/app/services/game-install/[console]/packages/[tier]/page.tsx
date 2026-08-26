import Link from "next/link";
import { notFound } from "next/navigation";

import FunnelNextStep from "@/app/components/funnel/FunnelNextStep";
import GameInstallOrderFab from "@/app/components/game-install/GameInstallOrderFab";
import GameInstallOrderPanel from "@/app/components/game-install/GameInstallOrderPanel";
import FaqSection from "@/app/components/seo/FaqSection";
import PageShell from "@/app/components/seo/PageShell";
import ServiceSchema from "@/app/components/schema/ServiceSchema";
import { GAME_INSTALL_CONSOLE_META } from "@/lib/game-install-meta";
import { getGameInstallContent } from "@/lib/game-install-content";
import { consoleIdFromGameInstallSlug } from "@/lib/repair-links";
import {
  GAME_INSTALL_PACKAGE_TIERS,
  GAME_INSTALL_PACKAGES,
  isGameInstallPackageTier,
  packagePageTitle,
} from "@/lib/game-install-packages";
import { formatRangeToman } from "@/lib/game-install-pricing";
import { webPageJsonLd } from "@/lib/seo/jsonld";
import { createPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ console: string; tier: string }>;
};

export function generateStaticParams() {
  return Object.keys(GAME_INSTALL_CONSOLE_META).flatMap((console) =>
    GAME_INSTALL_PACKAGE_TIERS.map((tier) => ({ console, tier })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { console: consoleSlug, tier } = await params;
  const meta = GAME_INSTALL_CONSOLE_META[consoleSlug];
  if (!meta || !isGameInstallPackageTier(tier)) {
    return createPageMetadata({
      title: "صفحه یافت نشد",
      path: `/services/game-install/${consoleSlug}/packages/${tier}`,
      noIndex: true,
    });
  }

  const pkg = GAME_INSTALL_PACKAGES[tier];
  const path = `/services/game-install/${consoleSlug}/packages/${tier}`;
  return createPageMetadata({
    title: packagePageTitle(consoleSlug, tier),
    description: `${pkg.description} تعرفه ${formatRangeToman(pkg.priceRange)}.`,
    path,
    keywords: [pkg.title, `نصب بازی ${meta.label}`, "پکیج نصب بازی"],
  });
}

export default async function GameInstallPackagePage({ params }: Props) {
  const { console: consoleSlug, tier } = await params;
  const meta = GAME_INSTALL_CONSOLE_META[consoleSlug];
  const content = getGameInstallContent(consoleSlug);

  if (!meta || !content || !isGameInstallPackageTier(tier)) notFound();

  const pkg = GAME_INSTALL_PACKAGES[tier];
  const hubPath = `/services/game-install/${consoleSlug}`;
  const path = `${hubPath}/packages/${tier}`;
  const gamesPath = `${hubPath}/games`;
  const title = packagePageTitle(consoleSlug, tier);

  const faqs = [
    {
      question: `${pkg.title} شامل چه بازی‌هایی است؟`,
      answer:
        tier === "economy"
          ? "عناوین به‌صورت تصادفی از موجودی کاتالوگ انتخاب می‌شوند و قابل انتخاب تک‌تک نیستند."
          : `شما ${pkg.gameCountHint} را از کاتالوگ ${meta.label} انتخاب می‌کنید.`,
    },
    {
      question: "قیمت نهایی کی اعلام می‌شود؟",
      answer: `بازه نمایشی ${formatRangeToman(pkg.priceRange)} است. مبلغ دقیق پس از بررسی کنسول و روش نصب اعلام می‌شود.`,
    },
    ...content.faqs.slice(0, 3),
  ];

  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-24 text-white">
      <ServiceSchema
        title={title}
        description={pkg.description}
        url={path}
      />
      <PageShell
        currentPath={path}
        jsonLd={webPageJsonLd({
          name: title,
          description: pkg.description,
          path,
        })}
        containerClassName="mx-auto max-w-4xl px-4 sm:px-6"
        className="mx-auto max-w-4xl px-4 pb-12 sm:px-6"
      >
        <Link
          href={hubPath}
          className="mb-6 inline-block text-sm text-zinc-500 transition hover:text-cyan-400"
        >
          ← بازگشت به {meta.title}
        </Link>

        <p className="mb-3 text-sm font-bold text-cyan-300">نصب بازی {meta.label}</p>
        <h1 className="mb-4 text-4xl font-black md:text-5xl">{pkg.title}</h1>
        <p className="mb-8 max-w-2xl text-lg leading-8 text-zinc-400">
          {pkg.description}
        </p>

        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-6">
            <p className="text-sm text-zinc-400">تعرفه تقریبی</p>
            <p className="mt-2 text-2xl font-black text-cyan-200">
              {formatRangeToman(pkg.priceRange)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-zinc-400">محتوای پکیج</p>
            <p className="mt-2 text-lg font-bold text-white">{pkg.gameCountHint}</p>
          </div>
        </div>

        <p className="mb-10 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm leading-7 text-amber-100">
          {pkg.notes}
        </p>

        <div className="mb-12 flex flex-wrap gap-4">
          {tier === "economy" ? (
            <a
              href="#game-install-order"
              className="inline-flex rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-black transition hover:bg-cyan-400"
            >
              {pkg.ctaLabel}
            </a>
          ) : (
            <Link
              href={gamesPath}
              className="inline-flex rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-black transition hover:bg-cyan-400"
            >
              {pkg.ctaLabel}
            </Link>
          )}
          <Link
            href={hubPath}
            className="inline-flex rounded-2xl border border-white/10 px-8 py-4 font-bold transition hover:border-cyan-400/40"
          >
            مشاهده همه تعرفه‌ها
          </Link>
        </div>

        <FaqSection items={faqs} className="border-t-0 py-8" />

        <div className="mb-10">
          <FunnelNextStep
            title="کنسول مشکل دارد؟ اول تعمیر"
            description="پکیج نصب روی دستگاه معیوب انجام نمی‌شود. اگر تصویر یا بوت مشکل دارد، مسیر تعمیر را ببینید."
            actions={[
              {
                href: `/services/${consoleIdFromGameInstallSlug(consoleSlug) === "xbox" ? "xbox-repair" : `${consoleIdFromGameInstallSlug(consoleSlug) ?? "ps5"}-repair`}`,
                label: `تعمیر ${meta.label}`,
                primary: true,
              },
              {
                href: hubPath,
                label: "تعرفه و کاتالوگ نصب",
              },
            ]}
          />
        </div>

        <div className="mt-10">
          <GameInstallOrderPanel
            consoleSlug={consoleSlug}
            consoleLabel={meta.label}
            variant="compact"
            suggestedNote={
              tier === "economy"
                ? `سفارش ${pkg.title} برای ${meta.label} — بازی‌ها تصادفی انتخاب شوند.`
                : `سفارش ${pkg.title} برای ${meta.label}.`
            }
          />
        </div>

        <GameInstallOrderFab consoleSlug={consoleSlug} />
      </PageShell>
    </main>
  );
}
