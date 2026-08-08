"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Search,
} from "lucide-react";

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

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

function normalizeHex(value: string): string | null {
  const trimmed = value.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return HEX_COLOR_RE.test(withHash) ? withHash.toLowerCase() : null;
}

function ColorField({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange: (color: string) => void;
  ariaLabel: string;
}) {
  const displayValue = HEX_COLOR_RE.test(value) ? value : "#ffffff";
  const [editing, setEditing] = useState(false);
  const [hexDraft, setHexDraft] = useState(displayValue);

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={displayValue}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="h-9 w-12 cursor-pointer rounded-lg border border-border bg-background p-1"
      />
      <input
        type="text"
        value={editing ? hexDraft : displayValue}
        onChange={(e) => {
          const next = e.target.value;
          setHexDraft(next);
          const parsed = normalizeHex(next);
          if (parsed) onChange(parsed);
        }}
        onFocus={() => {
          setEditing(true);
          setHexDraft(displayValue);
        }}
        onBlur={() => setEditing(false)}
        dir="ltr"
        spellCheck={false}
        placeholder="#000000"
        aria-label={`${ariaLabel} hex`}
        className="w-28 rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
      />
    </div>
  );
}

function FontPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (family: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [fontQuery, setFontQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const currentLabel =
    CALLIGRAPHY_FONT_OPTIONS.find((f) => f.family === value)?.label ?? value;

  const filteredFonts = useMemo(() => {
    const q = fontQuery.trim().toLowerCase();
    const list = !q
      ? CALLIGRAPHY_FONT_OPTIONS
      : CALLIGRAPHY_FONT_OPTIONS.filter((font) =>
        font.label.toLowerCase().includes(q),
      );
    if (list.some((f) => f.family === value)) return list;
    const current = CALLIGRAPHY_FONT_OPTIONS.find((f) => f.family === value);
    return current ? [current, ...list] : list;
  }, [fontQuery, value]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  function handlePick(family: string) {
    onChange(family);
    setOpen(false);
    setFontQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-background shadow-xl"
          dir="rtl"
        >
          <div className="relative border-b border-border p-2">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              ref={searchRef}
              type="search"
              value={fontQuery}
              onChange={(e) => setFontQuery(e.target.value)}
              placeholder="جستجوی فونت…"
              dir="rtl"
              className="w-full rounded-lg border border-border bg-background py-2 pl-3 pr-9 text-sm text-foreground placeholder:text-muted"
            />
          </div>
          <ul role="listbox" className="max-h-72 overflow-y-auto p-1">
            {filteredFonts.map((font) => {
              const selected = font.family === value;
              return (
                <li key={font.family} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => handlePick(font.family)}
                    className={`w-full rounded-lg px-3 py-2 text-right text-sm transition ${selected
                      ? "bg-cyan-500/10 font-bold text-cyan-400"
                      : "text-foreground hover:bg-surface"
                      }`}
                  >
                    {font.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-border px-3 py-2 text-xs text-muted">
            {filteredFonts.length} از {CALLIGRAPHY_FONT_OPTIONS.length} فونت
          </p>
        </div>
      ) : null}
    </div>
  );
}

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
        <FontPicker
          value={document.fontFamily}
          onChange={(family) => void handleFontChange(family)}
        />
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
              className={`h-8 w-8 rounded-full border-2 transition ${document.fill === color
                ? "scale-110 border-cyan-500"
                : "border-border"
                }`}
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </div>
        <ColorField
          value={document.fill}
          onChange={setFill}
          ariaLabel="انتخاب رنگ متن"
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-bold text-foreground">پس‌زمینه</span>
        <div className="flex flex-wrap gap-2">
          {BG_OPTIONS.map((bg) => (
            <button
              key={bg.value}
              type="button"
              onClick={() => setBackgroundColor(bg.value)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${document.backgroundColor === bg.value
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                : "border-border text-muted hover:border-cyan-500/50"
                }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
        <ColorField
          value={
            document.backgroundColor === "transparent"
              ? "#ffffff"
              : document.backgroundColor
          }
          onChange={setBackgroundColor}
          ariaLabel="انتخاب رنگ پس‌زمینه"
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-bold text-foreground">تراز متن</span>
        <div className="flex gap-2">
          {(
            [
              { value: "left" as const, icon: AlignLeft, label: "راست" },
              { value: "center" as const, icon: AlignCenter, label: "وسط" },
              { value: "right" as const, icon: AlignRight, label: "چپ" },
            ] as const
          ).map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setAlign(value)}
              className={`flex flex-1 items-center justify-center gap-1 rounded-xl border py-2 text-sm transition ${document.align === value
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
