import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Clock } from "lucide-react";

import FadeUp from "@/app/components/animations/FadeUp";
import BlogIndexHero from "@/app/components/blog/BlogIndexHero";
import FaqSection from "@/app/components/seo/FaqSection";
import PageShell from "@/app/components/seo/PageShell";
import TrustSignalsBar from "@/app/components/seo/TrustSignalsBar";
import { CtaButtonGroup } from "@/app/components/ui/cta";
import { blogPosts, BLOG_INDEX_DESCRIPTION } from "@/app/data/blog";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { createPageMetadata } from "@/lib/seo/metadata";

const PATH = "/blog";
const TITLE = "بلاگ بازی و راهنمای گیمینگ";

const BLOG_INDEX_FAQS = [
  {
    question: "بلاگ فیکس‌بازی چه موضوعاتی دارد؟",
    answer:
      "راهنمای بهترین بازی‌های PS5 و Xbox، رمز و چیت بازی، نکات نصب بازی، مقایسه ژانرها و پیشنهادهای تخصصی برای گیمرهای ایرانی.",
  },
  {
    question: "آیا مقاله رمز و چیت بازی دارید؟",
    answer:
      "بله. مقاله «رمز و چیت ۴۰ بازی برتر» شامل کدهای تقلب GTA V، Red Dead 2، Minecraft، Sims 4 و بازی‌های دیگر با دستور فعال‌سازی برای PS5 و Xbox است.",
  },
  {
    question: "آیا می‌توانم بازی‌های معرفی‌شده را نصب کنم؟",
    answer:
      "بله. از خدمات نصب بازی فیکس‌بازی برای PS5، PS4 و Xbox استفاده کنید — بازی‌ها نصب و تست می‌شوند.",
  },
];

const TRUST_SIGNALS = [
  { label: "مقالات تخصصی", value: `${blogPosts.length}+` },
  { label: "بازی معرفی‌شده", value: "۳۰+" },
  { label: "پشتیبانی نصب", value: "۲۴/۷" },
];

export const metadata = createPageMetadata({
  title: TITLE,
  description: BLOG_INDEX_DESCRIPTION,
  path: PATH,
  keywords: [
    "بلاگ بازی",
    "بهترین بازی ps5",
    "راهنمای گیمینگ",
    "نصب بازی ps5",
    "بازی xbox",
    "لیست بازی",
    "رمز بازی",
    "چیت ps5",
  ],
});

function totalGameCount() {
  return blogPosts.reduce((sum, post) => {
    return (
      sum +
      post.sections.reduce((sectionSum, section) => sectionSum + section.games.length, 0)
    );
  }, 0);
}

export default function BlogIndexPage() {
  const gameCount = totalGameCount();

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 text-white">
      <PageShell
        currentPath={PATH}
        jsonLd={[
          collectionPageJsonLd({
            name: TITLE,
            description: BLOG_INDEX_DESCRIPTION,
            path: PATH,
          }),
          itemListJsonLd({
            name: TITLE,
            path: PATH,
            items: blogPosts.map((post) => ({
              name: post.title,
              url: `/blog/${post.slug}`,
            })),
          }),
        ]}
        containerClassName="container mx-auto max-w-6xl px-6"
        className="container mx-auto max-w-6xl px-6 pb-12"
      >
        <BlogIndexHero postCount={blogPosts.length} gameCount={gameCount} />

        <section aria-labelledby="blog-posts-heading" className="mt-4">
          <h2 id="blog-posts-heading" className="sr-only">
            مقالات بلاگ
          </h2>
          <ul className="grid gap-6 md:grid-cols-2">
            {blogPosts.map((post, index) => {
              const publishedLabel = new Date(post.publishedAt).toLocaleDateString(
                "fa-IR",
                { year: "numeric", month: "long", day: "numeric" },
              );

              return (
                <li key={post.slug}>
                  <FadeUp delay={index * 0.1}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group blog-tilt-frame blog-card-3d flex h-full flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-zinc-900/50 transition hover:-translate-y-1 hover:border-cyan-500/40"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"
                          aria-hidden
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <time dateTime={post.publishedAt}>{publishedLabel}</time>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" aria-hidden />
                            {post.readTimeMinutes} دقیقه
                          </span>
                        </div>
                        <h3 className="mt-3 text-xl font-bold leading-snug group-hover:text-cyan-300">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
                          {post.excerpt}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-400">
                          مطالعه مقاله
                          <ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  </FadeUp>
                </li>
              );
            })}
          </ul>
        </section>

        <TrustSignalsBar signals={TRUST_SIGNALS} className="mt-16" />

        <FaqSection items={BLOG_INDEX_FAQS} className="py-16" />

        <section className="border-t border-zinc-800 py-16">
          <div className="rounded-[32px] border border-cyan-500/20 bg-cyan-500/5 px-8 py-12 text-center">
            <h2 className="text-3xl font-black">آماده نصب بازی روی کنسول؟</h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              بازی‌های معرفی‌شده در بلاگ را با بهترین قیمت و گارانتی روی PS5، PS4
              یا Xbox نصب کنید.
            </p>
            <div className="mt-8 flex justify-center">
              <CtaButtonGroup
                repairHref="/services/game-install/ps5"
                repairLabel="تعرفه نصب بازی"
                secondary="tracking"
              />
            </div>
          </div>
        </section>
      </PageShell>
    </main>
  );
}
