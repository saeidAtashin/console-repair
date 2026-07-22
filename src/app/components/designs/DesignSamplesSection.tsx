"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import ApplyTemplateWizard from "@/app/components/designs/ApplyTemplateWizard";
import DesignSampleGrid from "@/app/components/designs/DesignSampleGrid";
import type { CaseTemplate } from "@/lib/design/types";

type Props = {
  templates: CaseTemplate[];
  limit?: number;
  title?: string;
  description?: string;
  showViewAll?: boolean;
  linkMode?: boolean;
  initialBrandSlug?: string;
  initialModelSlug?: string;
};

export default function DesignSamplesSection({
  templates,
  limit,
  title = "طراحی‌های آماده",
  description = "روی هر مدل گوشی قابل استفاده — انتخاب کنید، مدل را مشخص کنید و ویرایش کنید",
  showViewAll = true,
  linkMode = false,
  initialBrandSlug,
  initialModelSlug,
}: Props) {
  const [activeTemplate, setActiveTemplate] = useState<CaseTemplate | null>(null);

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-black text-foreground">
            <Sparkles size={24} className="text-cyan-400" />
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        {showViewAll ? (
          <Link href="/designs" className="shrink-0 text-sm text-cyan-400 hover:underline">
            مشاهده همه
          </Link>
        ) : null}
      </div>

      <DesignSampleGrid
        templates={templates}
        limit={limit}
        linkMode={linkMode}
        onSelect={linkMode ? undefined : setActiveTemplate}
      />

      {activeTemplate ? (
        <ApplyTemplateWizard
          template={activeTemplate}
          open
          onClose={() => setActiveTemplate(null)}
          initialBrandSlug={initialBrandSlug}
          initialModelSlug={initialModelSlug}
        />
      ) : null}
    </>
  );
}
