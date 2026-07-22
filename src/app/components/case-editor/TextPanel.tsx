"use client";

import { Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useEditorStore } from "@/lib/design/editor-store";
import type { TextLayer } from "@/lib/design/types";

const FONT_OPTIONS = [
  { value: "Vazirmatn", label: "وزیرمتن" },
  { value: "var(--font-Sorena-Normal)", label: "سورنا" },
  { value: "var(--font-pixel)", label: "پیکسل" },
  { value: "var(--Cristik)", label: "کریستیک" },
];

const COLOR_OPTIONS = [
  "#ffffff",
  "#06b6d4",
  "#f472b6",
  "#fbbf24",
  "#34d399",
  "#ef4444",
  "#000000",
];

export default function TextPanel() {
  const { addTextLayer, getSelectedLayer, updateLayer, removeLayer, moveLayer } =
    useEditorStore();
  const selected = getSelectedLayer();
  const textLayer = selected?.type === "text" ? (selected as TextLayer) : null;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => addTextLayer()}
        className="w-full rounded-xl bg-cyan-500 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-400"
      >
        افزودن متن
      </button>

      {textLayer ? (
        <div className="space-y-3 rounded-xl border border-border bg-card/60 p-4">
          <label className="block space-y-1">
            <span className="text-xs text-muted">متن</span>
            <textarea
              value={textLayer.text}
              onChange={(e) => updateLayer(textLayer.id, { text: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs text-muted">فونت</span>
            <select
              value={textLayer.fontFamily}
              onChange={(e) => updateLayer(textLayer.id, { fontFamily: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-xs text-muted">اندازه: {textLayer.fontSize}px</span>
            <input
              type="range"
              min={12}
              max={72}
              value={textLayer.fontSize}
              onChange={(e) =>
                updateLayer(textLayer.id, { fontSize: Number(e.target.value) })
              }
              className="w-full accent-cyan-500"
            />
          </label>

          <div className="space-y-1">
            <span className="text-xs text-muted">رنگ</span>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateLayer(textLayer.id, { fill: color })}
                  className={`h-7 w-7 rounded-full border-2 ${
                    textLayer.fill === color ? "border-cyan-400" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => moveLayer(textLayer.id, "up")}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border py-2 text-xs text-muted"
            >
              <ArrowUp size={14} /> جلو
            </button>
            <button
              type="button"
              onClick={() => moveLayer(textLayer.id, "down")}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border py-2 text-xs text-muted"
            >
              <ArrowDown size={14} /> عقب
            </button>
            <button
              type="button"
              onClick={() => removeLayer(textLayer.id)}
              className="rounded-lg border border-red-500/30 p-2 text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-xs text-muted">
          یک متن را انتخاب کنید یا متن جدید اضافه کنید
        </p>
      )}
    </div>
  );
}
