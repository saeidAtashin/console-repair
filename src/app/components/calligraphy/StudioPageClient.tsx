"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Save, RotateCcw } from "lucide-react";
import type Konva from "konva";

import TextControls from "@/app/components/calligraphy/TextControls";
import ExportPanel from "@/app/components/calligraphy/ExportPanel";
import { loadCalligraphyFonts } from "@/lib/calligraphy/fonts";
import { saveWork } from "@/lib/calligraphy/storage";
import { useCalligraphyStore } from "@/lib/calligraphy/store";
import { exportCalligraphyPng } from "@/lib/calligraphy/export";

const CalligraphyCanvas = dynamic(
  () => import("@/app/components/calligraphy/CalligraphyCanvas"),
  { ssr: false, loading: () => <CanvasSkeleton /> },
);

function CanvasSkeleton() {
  return (
    <div className="aspect-[4/3] w-full animate-pulse rounded-2xl border border-border bg-card/40" />
  );
}

export default function StudioPageClient() {
  const document = useCalligraphyStore((s) => s.document);
  const setName = useCalligraphyStore((s) => s.setName);
  const resetDocument = useCalligraphyStore((s) => s.resetDocument);
  const [stage, setStage] = useState<Konva.Stage | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void loadCalligraphyFonts();
  }, []);

  const handleStageReady = useCallback((s: Konva.Stage) => {
    setStage(s);
  }, []);

  async function handleSave() {
    if (stage) {
      const previewUrl = await exportCalligraphyPng(stage, "free");
      saveWork({ ...document, previewUrl });
    } else {
      saveWork(document);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    useCalligraphyStore.getState().resetDocument();
    setStage(null);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground">استودیو خوشنویسی</h1>
          <p className="mt-2 text-muted">
            متن فارسی خود را بنویسید، فونت خوشنویسی انتخاب کنید و دانلود کنید
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void handleSave()}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground transition hover:border-cyan-500/50"
          >
            <Save className="h-4 w-4" />
            {saved ? "ذخیره شد!" : "ذخیره"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold text-muted transition hover:border-red-500/50 hover:text-red-400"
          >
            <RotateCcw className="h-4 w-4" />
            جدید
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs text-muted">نام اثر</span>
            <input
              type="text"
              value={document.name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground"
            />
          </label>
          <CalligraphyCanvas onStageReady={handleStageReady} />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <TextControls />
          </div>
          <ExportPanel stage={stage} />
        </div>
      </div>
    </div>
  );
}
