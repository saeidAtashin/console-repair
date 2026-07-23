"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import DesignSampleGrid from "@/app/components/designs/DesignSampleGrid";
import type { CaseTemplate } from "@/lib/design/types";

const PAGE_SIZE = 24;

type Props = {
  templates: CaseTemplate[];
};

export default function DesignsGalleryClient({ templates }: Props) {
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(templates.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);

  const pageTemplates = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return templates.slice(start, start + PAGE_SIZE);
  }, [templates, safePage]);

  return (
    <div className="space-y-6">
      <DesignSampleGrid templates={pageTemplates} linkMode priorityFirst />

      {pageCount > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted">
            نمایش {safePage * PAGE_SIZE + 1}–
            {Math.min((safePage + 1) * PAGE_SIZE, templates.length)} از {templates.length}{" "}
            طراحی
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition enabled:hover:border-cyan-500/50 disabled:opacity-40"
              aria-label="صفحه قبل"
            >
              <ChevronRight size={16} />
              قبلی
            </button>
            <span className="min-w-[4rem] text-center text-sm text-muted">
              {safePage + 1} / {pageCount}
            </span>
            <button
              type="button"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition enabled:hover:border-cyan-500/50 disabled:opacity-40"
              aria-label="صفحه بعد"
            >
              بعدی
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
