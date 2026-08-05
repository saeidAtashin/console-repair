export type FontTier = "free" | "premium";

export type CalligraphyFontOption = {
  family: string;
  label: string;
  style: string;
  src: string;
  tier: FontTier;
};

export const CALLIGRAPHY_FONT_OPTIONS: CalligraphyFontOption[] = [
  {
    family: "CalligraphyIranNastaliq",
    label: "ایران نستعلیق",
    style: "نستعلیق",
    src: "/fonts/calligraphy/IranNastaliq.ttf",
    tier: "free",
  },
  {
    family: "CalligraphyAmiri",
    label: "امیری",
    style: "نسخ",
    src: "/fonts/calligraphy/Amiri-Regular.ttf",
    tier: "free",
  },
  {
    family: "CalligraphyScheherazade",
    label: "شهرزاد",
    style: "نسخ سنتی",
    src: "/fonts/calligraphy/ScheherazadeNew-Regular.ttf",
    tier: "free",
  },
  {
    family: "CalligraphyKatibeh",
    label: "کتیبه",
    style: "خطاطی تزئینی",
    src: "/fonts/calligraphy/Katibeh-Regular.ttf",
    tier: "premium",
  },
];

export const DEFAULT_CALLIGRAPHY_FONT = CALLIGRAPHY_FONT_OPTIONS[0].family;

const loadedFamilies = new Set<string>();
let fontsLoading: Promise<void> | null = null;

export function getFontOption(family: string): CalligraphyFontOption | undefined {
  return CALLIGRAPHY_FONT_OPTIONS.find((f) => f.family === family);
}

export function isPremiumFont(family: string): boolean {
  return getFontOption(family)?.tier === "premium";
}

export function normalizeCalligraphyFont(family: string): string {
  const match = CALLIGRAPHY_FONT_OPTIONS.find((f) => f.family === family);
  return match?.family ?? DEFAULT_CALLIGRAPHY_FONT;
}

export function loadCalligraphyFonts(families?: string[]): Promise<void> {
  const toLoad =
    families ??
    CALLIGRAPHY_FONT_OPTIONS.map((f) => f.family);

  const pending = CALLIGRAPHY_FONT_OPTIONS.filter(
    (f) => toLoad.includes(f.family) && !loadedFamilies.has(f.family),
  );
  if (pending.length === 0) return Promise.resolve();
  if (fontsLoading) return fontsLoading;

  fontsLoading = (async () => {
    if (typeof document === "undefined") return;

    await Promise.all(
      pending.map(async ({ family, src }) => {
        if (loadedFamilies.has(family)) return;
        try {
          if (document.fonts.check(`16px "${family}"`)) {
            loadedFamilies.add(family);
            return;
          }
          const face = new FontFace(family, `url(${src})`);
          await face.load();
          document.fonts.add(face);
          loadedFamilies.add(family);
        } catch {
          // Font may be missing in dev
        }
      }),
    );
    fontsLoading = null;
  })();

  return fontsLoading;
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
