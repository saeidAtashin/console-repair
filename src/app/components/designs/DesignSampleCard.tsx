"use client";

import Link from "next/link";
import type { CaseTemplate } from "@/lib/design/types";
import DesignSamplePreview from "./DesignSamplePreview";

type Props = {
  template: CaseTemplate;
  onSelect?: (template: CaseTemplate) => void;
  href?: string;
};

export default function DesignSampleCard({ template, onSelect, href }: Props) {
  const content = (
    <>
      <div className="flex aspect-[1/2] items-center justify-center bg-background/50 p-3">
        <DesignSamplePreview template={template} maxHeight={180} />
      </div>
      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1">
          {template.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-sm font-bold text-foreground">{template.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted">{template.description}</p>
        <p className="mt-2 text-[10px] font-semibold text-cyan-400">
          {template.layers.length} لایه · هر مدل گوشی
        </p>
      </div>
    </>
  );

  const className =
    "group overflow-hidden rounded-2xl border border-border bg-card/60 text-right transition hover:border-cyan-500/50";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => onSelect?.(template)} className={className}>
      {content}
    </button>
  );
}
