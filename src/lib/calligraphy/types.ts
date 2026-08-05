import { DEFAULT_CALLIGRAPHY_FONT } from "./fonts";

export type CalligraphyAlign = "left" | "center" | "right";

export type ExportTier = "free" | "hd-png" | "pdf";

export type CalligraphyDocument = {
  id: string;
  name: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  fill: string;
  align: CalligraphyAlign;
  backgroundColor: string;
  canvas: { width: number; height: number };
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export const DEFAULT_CANVAS = { width: 800, height: 600 } as const;

export const DEFAULT_CALLIGRAPHY_TEXT = "خوش‌نویسی فارسی";

export function createCalligraphyDocument(
  partial?: Partial<CalligraphyDocument>,
): CalligraphyDocument {
  const now = new Date().toISOString();
  return {
    id: partial?.id ?? generateDesignId(),
    name: partial?.name ?? "اثر جدید",
    text: partial?.text ?? DEFAULT_CALLIGRAPHY_TEXT,
    fontFamily: partial?.fontFamily ?? DEFAULT_CALLIGRAPHY_FONT,
    fontSize: partial?.fontSize ?? 72,
    fill: partial?.fill ?? "#1a1a2e",
    align: partial?.align ?? "center",
    backgroundColor: partial?.backgroundColor ?? "#faf8f5",
    canvas: partial?.canvas ?? { ...DEFAULT_CANVAS },
    previewUrl: partial?.previewUrl,
    createdAt: partial?.createdAt ?? now,
    updatedAt: partial?.updatedAt ?? now,
  };
}

export function generateDesignId(): string {
  return `calligraphy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
