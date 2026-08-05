"use client";

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

import {
  CALLIGRAPHY_FONT_OPTIONS,
  loadCalligraphyFonts,
} from "@/lib/calligraphy/fonts";
import { useCalligraphyStore } from "@/lib/calligraphy/store";

const COLOR_OPTIONS = [
  "#1a1a2e",
  "#2d1b0e",
  "#0f3460",
  "#7c2d12",
  "#14532d",
  "#ffffff",
  "#c9a227",
  "#8b0000",
];

const BG_OPTIONS = [
  { value: "#faf8f5", label: "کرم" },
  { value: "#ffffff", label: "سفید" },
  { value: "#1a1a2e", label: "سرمه‌ای" },
  { value: "#f5e6d3", label: "پوستی" },
  { value: "transparent", label: "شفاف" },
];

export default function TextControls() {
  const document = useCalligraphyStore((s) => s.document);
  const setText = useCalligraphyStore((s) => s.setText);
  const setFontFamily = useCalligraphyStore((s) => s.setFontFamily);
  const setFontSize = useCalligraphyStore((s) => s.setFontSize);
  const setFill = useCalligraphyStore((s) => s.setFill);
  const setAlign = useCalligraphyStore((s) => s.setAlign);
  const setBackgroundColor = useCalligraphyStore((s) => s.setBackgroundColor);

  async function handleFontChange(family: string) {
    await loadCalligraphyFonts([family]);
    setFontFamily(family);
  }

  return (
    <div className="space-y-5">
      <label className="block space-y-2">
        <span className="text-sm font-bold text-foreground">متن فارسی</span>
        <textarea
          value={document.text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          dir="rtl"
          placeholder="متن خود را بنویسید…"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-lg text-foreground placeholder:text-muted"
        />
      </label>

      <div className="space-y-2">
        <span className="text-sm font-bold text-foreground">فونت خوشنویسی</span>
        <div className="grid grid-cols-2 gap-2">
          {CALLIGRAPHY_FONT_OPTIONS.map((font) => (
            <button
              key={font.family}
              type="button"
              onClick={() => void handleFontChange(font.family)}
              className={`relative rounded-xl border px-3 py-3 text-right transition ${
                document.fontFamily === font.family
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-border bg-card/60 hover:border-cyan-500/50"
              }`}
            >
              <span className="block text-sm font-bold text-foreground">
                {font.label}
              </span>
              <span className="text-xs text-muted">{font.style}</span>
              {font.tier === "premium" ? (
                <span className="absolute left-2 top-2 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                  ویژه
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-bold text-foreground">
          اندازه فونت: {document.fontSize}px
        </span>
        <input
          type="range"
          min={24}
          max={160}
          value={document.fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-cyan-500"
        />
      </label>

      <div className="space-y-2">
        <span className="text-sm font-bold text-foreground">رنگ متن</span>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFill(color)}
              className={`h-8 w-8 rounded-full border-2 transition ${
                document.fill === color ? "border-cyan-500 scale-110" : "border-border"
              }`}
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-bold text-foreground">پس‌زمینه</span>
        <div className="flex flex-wrap gap-2">
          {BG_OPTIONS.map((bg) => (
            <button
              key={bg.value}
              type="button"
              onClick={() => setBackgroundColor(bg.value)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                document.backgroundColor === bg.value
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                  : "border-border text-muted hover:border-cyan-500/50"
              }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-bold text-foreground">تراز متن</span>
        <div className="flex gap-2">
          {(
            [
              { value: "right" as const, icon: AlignRight, label: "راست" },
              { value: "center" as const, icon: AlignCenter, label: "وسط" },
              { value: "left" as const, icon: AlignLeft, label: "چپ" },
            ] as const
          ).map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setAlign(value)}
              className={`flex flex-1 items-center justify-center gap-1 rounded-xl border py-2 text-sm transition ${
                document.align === value
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                  : "border-border text-muted hover:border-cyan-500/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
