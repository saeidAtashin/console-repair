import Link from "next/link";

import type { TopicCluster } from "@/lib/seo/topic-clusters";
import { cn } from "@/lib/utils";

type Props = {
  cluster: TopicCluster;
  currentHref: string;
  className?: string;
};

export default function TopicClusterNav({
  cluster,
  currentHref,
  className,
}: Props) {
  const items = [
    { title: cluster.pillarTitle, href: cluster.pillarHref },
    ...cluster.pages,
  ];

  return (
    <nav
      aria-label={`کلاستر موضوعی ${cluster.pillarTitle}`}
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8",
        className,
      )}
    >
      <p className="text-sm font-semibold text-cyan-300">راهنمای تخصصی</p>
      <h2 className="mt-2 text-2xl font-black text-white">
        {cluster.pillarTitle}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
        همه صفحات این موضوع به هم لینک شده‌اند؛ از صفحه اصلی تعمیر تا مشکلات
        رایج و قیمت تقریبی.
      </p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {items.map((item) => {
          const active = item.href === currentHref;
          return (
            <li key={item.href}>
              {active ? (
                <span className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-sm font-bold text-cyan-200">
                  {item.title}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="inline-flex rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200 transition hover:border-cyan-400/40 hover:text-white"
                >
                  {item.title}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
