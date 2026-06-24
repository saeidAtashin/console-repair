import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import BlogCheatSection from "@/app/components/blog/BlogCheatSection";
import BlogGameSectionBlock from "@/app/components/blog/BlogGameSection";
import BlogPostHero from "@/app/components/blog/BlogPostHero";
import FaqSection from "@/app/components/seo/FaqSection";
import PageShell from "@/app/components/seo/PageShell";
import { CtaButtonGroup } from "@/app/components/ui/cta";
import { blogPosts, getBlogPost } from "@/app/data/blog";
import { blogPostingJsonLd } from "@/lib/seo/jsonld";
import { createPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return createPageMetadata({
      title: "مقاله یافت نشد",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    type: "article",
    ogImage: post.coverImage,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const path = `/blog/${post.slug}`;

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 text-white">
      <PageShell
        currentPath={path}
        jsonLd={[
          blogPostingJsonLd({
            title: post.seoTitle ?? post.title,
            description: post.seoDescription ?? post.excerpt,
            path,
            coverImage: post.coverImage,
            publishedAt: post.publishedAt,
          }),
        ]}
        containerClassName="container mx-auto max-w-6xl px-6"
        className="container mx-auto max-w-6xl px-6 pb-12"
      >
        <BlogPostHero post={post} />

        <article className="prose prose-invert max-w-none">
          <div className="space-y-5 text-base leading-relaxed text-zinc-300">
            {post.intro.map((paragraph, index) => (
              <p key={`intro-${index}`}>{paragraph}</p>
            ))}
          </div>

          {post.sections.map((section, index) =>
            post.kind === "cheats" ? (
              <BlogCheatSection
                key={section.id}
                section={section}
                index={index}
              />
            ) : (
              <BlogGameSectionBlock
                key={section.id}
                section={section}
                index={index}
              />
            ),
          )}

          <div className="mt-14 space-y-5 border-t border-white/[0.06] pt-14 text-base leading-relaxed text-zinc-300">
            {post.body.map((paragraph, index) => (
              <p key={`body-${index}`}>{paragraph}</p>
            ))}
          </div>
        </article>

        {post.faqs && post.faqs.length > 0 ? (
          <FaqSection
            items={post.faqs.map((faq) => ({
              question: faq.question,
              answer: faq.answer,
            }))}
            className="py-16"
          />
        ) : null}

        <section className="border-t border-zinc-800 py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-cyan-400 transition hover:text-cyan-300"
            >
              <ChevronLeft className="h-4 w-4" />
              بازگشت به بلاگ
            </Link>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/services/game-install/ps5"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
              >
                نصب بازی PS5
              </Link>
              <Link
                href="/repair"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
              >
                ثبت سفارش تعمیر
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-cyan-500/20 bg-cyan-500/5 px-8 py-12 text-center">
          <h2 className="text-2xl font-black md:text-3xl">
            بازی‌های این مقاله را نصب کنید
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            با خدمات نصب بازی فیکس‌بازی، عناوین مورد علاقه را روی کنسول خود
            داشته باشید.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaButtonGroup
              repairHref="/services/game-install/ps5"
              repairLabel="مشاهده تعرفه نصب"
              secondary="tracking"
            />
          </div>
        </section>
      </PageShell>
    </main>
  );
}
