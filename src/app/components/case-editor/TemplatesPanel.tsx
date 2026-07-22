"use client";

import Image from "next/image";
import { useState } from "react";

import {
  getAllTemplates,
} from "@/lib/cases/templates.static";
import { useEditorStore } from "@/lib/design/editor-store";
import type { CaseTemplate } from "@/lib/design/types";

type Props = {
  brandSlug: string;
  modelSlug: string;
  caseTypeSlug: string;
};

export default function TemplatesPanel({ brandSlug: _brandSlug, modelSlug: _modelSlug, caseTypeSlug: _caseTypeSlug }: Props) {
  const { document, loadTemplate } = useEditorStore();
  const [confirmTemplate, setConfirmTemplate] = useState<CaseTemplate | null>(null);

  const displayTemplates = getAllTemplates();

  function applyTemplate(template: CaseTemplate, replace: boolean) {
    loadTemplate(template, replace);
    setConfirmTemplate(null);
  }

  function handleSelect(template: CaseTemplate) {
    if (document.layers.length > 0) {
      setConfirmTemplate(template);
    } else {
      applyTemplate(template, true);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">
        از قالب‌های از پیش طراحی‌شده استفاده کنید و آن‌ها را ویرایش کنید.
      </p>

      {displayTemplates.length === 0 ? (
        <p className="text-center text-xs text-muted">قالب‌های بیشتر به زودی اضافه می‌شوند.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {displayTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleSelect(template)}
              className="overflow-hidden rounded-xl border border-border bg-card/60 text-right transition hover:border-cyan-500/50"
            >
              <div className="flex aspect-square items-center justify-center bg-background/50 p-4">
                <Image
                  src={template.thumbnail}
                  alt={template.title}
                  width={64}
                  height={64}
                  className="h-16 w-16 object-contain opacity-80"
                />
              </div>
              <div className="border-t border-border px-3 py-2">
                <p className="text-xs font-semibold text-foreground">{template.title}</p>
                <p className="text-[10px] text-muted">{template.layers.length} لایه</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {confirmTemplate ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-bold text-foreground">جایگزینی طراحی فعلی؟</p>
            <p className="mt-2 text-xs text-muted">
              لایه‌های فعلی حفظ شوند یا با قالب «{confirmTemplate.title}» جایگزین شوند؟
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => applyTemplate(confirmTemplate, true)}
                className="rounded-xl bg-cyan-500 py-2 text-sm font-bold text-black"
              >
                جایگزین کامل
              </button>
              <button
                type="button"
                onClick={() => applyTemplate(confirmTemplate, false)}
                className="rounded-xl border border-border py-2 text-sm text-foreground"
              >
                افزودن به لایه‌های فعلی
              </button>
              <button
                type="button"
                onClick={() => setConfirmTemplate(null)}
                className="py-2 text-xs text-muted"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
