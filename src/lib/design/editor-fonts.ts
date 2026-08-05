import {
  DEFAULT_USE_FONT,
  USE_FONT_OPTIONS,
  getUseFontOption,
  loadUseFonts,
} from "@/lib/fonts/use-fonts";

export type EditorFontOption = {
  family: string;
  label: string;
  src: string;
};

/** Canvas-safe font family names from public/use-fonts. */
export const EDITOR_FONT_OPTIONS: EditorFontOption[] = USE_FONT_OPTIONS.map(
  (font) => ({
    family: font.family,
    label: font.label,
    src: font.src,
  }),
);

export const DEFAULT_EDITOR_FONT =
  EDITOR_FONT_OPTIONS[0]?.family ?? DEFAULT_USE_FONT;

const LEGACY_FONT_MAP: Record<string, string> = {
  Vazirmatn: DEFAULT_EDITOR_FONT,
  "var(--font-vazirmatn)": DEFAULT_EDITOR_FONT,
  "var(--font-Sorena-Normal)": DEFAULT_EDITOR_FONT,
  "var(--font-pixel)": DEFAULT_EDITOR_FONT,
  "var(--Cristik)": DEFAULT_EDITOR_FONT,
  CaseEditorVazirmatn: DEFAULT_EDITOR_FONT,
  CaseEditorSorena: DEFAULT_EDITOR_FONT,
  CaseEditorPixel: DEFAULT_EDITOR_FONT,
  CaseEditorCristik: DEFAULT_EDITOR_FONT,
};

export function normalizeFontFamily(value: string): string {
  if (LEGACY_FONT_MAP[value]) return LEGACY_FONT_MAP[value];
  if (getUseFontOption(value)) return value;
  return DEFAULT_EDITOR_FONT;
}

export function loadEditorFonts(families?: string[]): Promise<void> {
  return loadUseFonts(families);
}

export function getDefaultTextBoxWidth(canvasWidth: number): number {
  return Math.round(canvasWidth * 0.85);
}

export function getTextOffsetX(
  align: "left" | "center" | "right",
  boxWidth: number,
): number {
  if (align === "center") return boxWidth / 2;
  if (align === "right") return boxWidth;
  return 0;
}
