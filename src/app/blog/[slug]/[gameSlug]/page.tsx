import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import BlogCheatGameBlock from "@/app/components/blog/BlogCheatGameBlock";
import PageShell from "@/app/components/seo/PageShell";
import { getBlogPost } from "@/app/data/blog";
import {
  cheatGamePath,
  cheatHubPath,
  CHEAT_POST_SLUG,
  gameInstallHref,
  generateGameSeo,
  getAllCheatGames,
  getCheatGame,
  getCheatGameCoverImage,
} from "@/lib/blog-cheats";
import {
  blogPostingJsonLd,
  faqPageJsonLd,
  howToJsonLd,
} from "@/lib/seo/jsonld";
import { createPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string; gameSlug: string }>;
};

export function generateStaticParams() {
  return getAllCheatGames().map((game) => ({
    slug: CHEAT_POST_SLUG,
    gameSlug: game.gameSlug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, gameSlug } = await params;
  if (slug !== CHEAT_POST_SLUG) {
    return createPageMetadata({
      title: "مقاله یافت نشد",
      path: `/blog/${slug}/${gameSlug}`,
      noIndex: true,
    });
  }

  const game = getCheatGame(gameSlug);
  if (!game) {
    return createPageMetadata({
      title: "بازی یافت نشد",
      path: `/blog/${slug}/${gameSlug}`,
      noIndex: true,
    });
  }

  const seo = generateGameSeo(game);
  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: cheatGamePath(gameSlug),
    keywords: seo.keywords,
    type: "article",
    ogImage: getCheatGameCoverImage(game),
    ogImageWidth: 800,
    ogImageHeight: 1067,
  });
}

export default async function BlogCheatGamePage({ params }: Props) {
  const { slug, gameSlug } = await params;

  if (slug !== CHEAT_POST_SLUG) notFound();

  const post = getBlogPost(slug);
  const game = getCheatGame(gameSlug);
  if (!post || !game) notFound();

  const path = cheatGamePath(gameSlug);
  const seo = generateGameSeo(game);
  const installHref = gameInstallHref(game.console);
  const coverImage = getCheatGameCoverImage(game);

  const faqItems =
    game.cheats?.slice(0, 5).map((cheat) => ({
      question: `چیت ${cheat.title} در ${game.name} چیست؟`,
      answer: `${cheat.code} — ${cheat.effect}`,
    })) ?? [];

  const howToSteps = game.cheatActivation
    ? [game.cheatActivation]
    : [
        `کنسول ${game.console === "ps5" ? "PS5" : game.console === "ps4" ? "PS4" : "Xbox"} را روشن کنید.`,
        `بازی ${game.name} را اجرا کنید.`,
        "کدهای چیت را از جدول زیر وارد کنید.",
      ];

  const jsonLd: Record<string, unknown>[] = [
    blogPostingJsonLd({
      title: seo.title,
      description: seo.description,
      path,
      coverImage,
      publishedAt: post.publishedAt,
    }),
  ];

  if (faqItems.length > 0) {
    jsonLd.push(faqPageJsonLd(faqItems));
  }

  jsonLd.push(
    howToJsonLd({
      name: `نحوه وارد کردن چیت ${game.name}`,
      description: `راهنمای فعال‌سازی کدهای تقلب ${game.name}`,
      path,
      steps: howToSteps,
    }),
  );

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 text-white">
      <PageShell
        currentPath={path}
        jsonLd={jsonLd}
        containerClassName="container mx-auto max-w-4xl px-6"
        className="container mx-auto max-w-4xl px-6 pb-12"
      >
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <Link href="/blog" className="transition hover:text-cyan-400">
            بلاگ
          </Link>
          <span>/</span>
          <Link href={cheatHubPath()} className="transition hover:text-cyan-400">
            رمز و چیت
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{game.name}</span>
        </nav>

        <header className="mb-8">
          <p className="mb-2 text-sm text-violet-400">{game.sectionTitle}</p>
          <h1 className="text-3xl font-black md:text-4xl">
            چیت و رمز {game.name}
          </h1>
          <p className="mt-3 text-lg text-zinc-400">{game.highlight}</p>
        </header>

        <BlogCheatGameBlock
          game={game}
          postSlug={slug}
          showDetailLink={false}
          showInstallLink
        />

        <section className="mt-10 flex flex-wrap gap-3">
          <Link
            href={cheatHubPath()}
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
          >
            <ChevronLeft className="h-4 w-4" />
            همه چیت‌ها
          </Link>
          <Link
            href={installHref}
            className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
          >
            نصب {game.name}
          </Link>
          <Link
            href={`${cheatHubPath()}#${game.sectionId}`}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-violet-500/40 hover:text-violet-300"
          >
            بازی‌های مشابه
          </Link>
        </section>
      </PageShell>
    </main>
  );
}
