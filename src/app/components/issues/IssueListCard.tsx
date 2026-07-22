import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Gauge, Timer } from "lucide-react";

import type { Issue } from "@/app/data/issues";
import { getIssueImage } from "@/lib/quick-access-images";

const DIFFICULTY_LABELS = {
  easy: "آسان",
  medium: "متوسط",
  hard: "پیشرفته",
} as const;

const COST_LABELS = {
  low: "پایین",
  medium: "متوسط",
  high: "بالا",
} as const;

export type IssueListCardProps = {
  issue: Pick<
    Issue,
    | "slug"
    | "title"
    | "description"
    | "image"
    | "difficulty"
    | "repairTime"
    | "costLevel"
  >;
  className?: string;
};

export default function IssueListCard({
  issue,
  className = "",
}: IssueListCardProps) {
  const imageSrc = getIssueImage(issue.slug, issue.image);

  return (
    <Link
      href={`/issues/${issue.slug}`}
      className={`group flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-cyan-500/40 hover:bg-zinc-900 sm:gap-5 sm:p-5 ${className}`}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 sm:h-28 sm:w-28">
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="112px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold leading-snug text-white transition group-hover:text-cyan-200 sm:text-xl">
          {issue.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
          {issue.description}
        </p>

        {(issue.difficulty || issue.repairTime || issue.costLevel) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {issue.difficulty ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-300">
                <Gauge className="h-3 w-3 text-cyan-400" aria-hidden />
                {DIFFICULTY_LABELS[issue.difficulty]}
              </span>
            ) : null}
            {issue.repairTime ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-300">
                <Timer className="h-3 w-3 text-amber-400" aria-hidden />
                {issue.repairTime}
              </span>
            ) : null}
            {issue.costLevel ? (
              <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-300">
                هزینه: {COST_LABELS[issue.costLevel]}
              </span>
            ) : null}
          </div>
        )}

        <span className="mt-3 inline-flex items-center gap-1 text-sm text-cyan-400 transition group-hover:gap-2">
          مطالعه راهنما
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
