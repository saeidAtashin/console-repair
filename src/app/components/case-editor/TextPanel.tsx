"use client";

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
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
  const { addTextLayer, getSelectedLayer, updateLayer, meta } = useEditorStore();
  const selected = getSelectedLayer();
  const textLayer = selected?.type === "text" ? (selected as TextLayer) : null;
  const canvasW = meta?.canvasWidth ?? 280;
  const canvasH = meta?.canvasHeight ?? 560;

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
            <span className="text-xs text-muted">تراز</span>
            <div className="flex gap-1">
              {(
                [
                  { value: "right" as const, icon: AlignRight },
                  { value: "center" as const, icon: AlignCenter },
                  { value: "left" as const, icon: AlignLeft },
                ] as const
              ).map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateLayer(textLayer.id, { align: value })}
                  className={`flex flex-1 items-center justify-center rounded-lg border py-2 ${
                    textLayer.align === value
                      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                      : "border-border text-muted"
                  }`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

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
              <input
                type="color"
                value={textLayer.fill}
                onChange={(e) => updateLayer(textLayer.id, { fill: e.target.value })}
                className="h-7 w-7 cursor-pointer rounded border border-border bg-transparent"
                title="رنگ دلخواه"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="text-xs text-muted">X</span>
              <input
                type="number"
                min={0}
                max={canvasW}
                value={Math.round(textLayer.x)}
                onChange={(e) =>
                  updateLayer(textLayer.id, { x: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-muted">Y</span>
              <input
                type="number"
                min={0}
                max={canvasH}
                value={Math.round(textLayer.y)}
                onChange={(e) =>
                  updateLayer(textLayer.id, { y: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
              />
            </label>
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
