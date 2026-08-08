import {
  DEFAULT_USE_FONT,
  USE_FONT_OPTIONS,
  getUseFontOption,
  loadUseFonts,
} from "@/lib/fonts/use-fonts";

export type FontTier = "free" | "premium";

export type CalligraphyFontOption = {
  family: string;
  label: string;
  style: string;
  src: string;
  tier: FontTier;
};

export const CALLIGRAPHY_FONT_OPTIONS: CalligraphyFontOption[] =
  USE_FONT_OPTIONS.map((font) => ({
    family: font.family,
    label: font.label,
    style: "",
    src: font.src,
    tier: "free" as const,
  }));

export const DEFAULT_CALLIGRAPHY_FONT = DEFAULT_USE_FONT;

const LEGACY_CALLIGRAPHY_FONTS = new Set([
  "CalligraphyIranNastaliq",
  "CalligraphyAmiri",
  "CalligraphyScheherazade",
  "CalligraphyKatibeh",
]);

export function getFontOption(family: string): CalligraphyFontOption | undefined {
  return CALLIGRAPHY_FONT_OPTIONS.find((f) => f.family === family);
}

export function isPremiumFont(_family: string): boolean {
  return false;
}

export function normalizeCalligraphyFont(family: string): string {
  if (LEGACY_CALLIGRAPHY_FONTS.has(family)) return DEFAULT_CALLIGRAPHY_FONT;
  if (getUseFontOption(family)) return family;
  return DEFAULT_CALLIGRAPHY_FONT;
}

export function loadCalligraphyFonts(families?: string[]): Promise<void> {
  return loadUseFonts(families);
}

export function getTextOffsetX(
  align: "left" | "center" | "right",
  boxWidth: number,
): number {
  if (align === "center") return boxWidth / 2;
  if (align === "right") return boxWidth;
  return 0;
}

export function getDefaultTextBoxWidth(canvasWidth: number): number {
  return Math.round(canvasWidth * 0.9);
}
