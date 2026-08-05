"use client";

import { useMemo, useState } from "react";
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
  const [fontQuery, setFontQuery] = useState("");

  const filteredFonts = useMemo(() => {
    const q = fontQuery.trim().toLowerCase();
    const list = !q
      ? CALLIGRAPHY_FONT_OPTIONS
      : CALLIGRAPHY_FONT_OPTIONS.filter((font) =>
          font.label.toLowerCase().includes(q),
        );
    if (list.some((f) => f.family === document.fontFamily)) return list;
    const current = CALLIGRAPHY_FONT_OPTIONS.find(
      (f) => f.family === document.fontFamily,
    );
    return current ? [current, ...list] : list;
  }, [fontQuery, document.fontFamily]);

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
        <input
          type="search"
          value={fontQuery}
          onChange={(e) => setFontQuery(e.target.value)}
          placeholder="جستجوی فونت…"
          dir="rtl"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted"
        />
        <select
          value={document.fontFamily}
          onChange={(e) => void handleFontChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
        >
          {filteredFonts.map((font) => (
            <option key={font.family} value={font.family}>
              {font.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted">
          {filteredFonts.length} از {CALLIGRAPHY_FONT_OPTIONS.length} فونت
        </p>
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
