import Konva from "konva";

import type { ImageBlendMode, ImageEffectPreset, ImageLayer } from "./types";

export function blendModeToKonva(
  mode?: ImageBlendMode,
): GlobalCompositeOperation {
  switch (mode) {
    case "multiply":
      return "multiply";
    case "screen":
      return "screen";
    case "overlay":
      return "overlay";
    case "darken":
      return "darken";
    case "lighten":
      return "lighten";
    default:
      return "source-over";
  }
}

export const BLEND_MODE_OPTIONS: { value: ImageBlendMode; label: string }[] = [
  { value: "normal", label: "عادی" },
  { value: "multiply", label: "ضرب" },
  { value: "screen", label: "صفحه" },
  { value: "overlay", label: "روی هم" },
  { value: "darken", label: "تیره‌تر" },
  { value: "lighten", label: "روشن‌تر" },
];

export const EFFECT_OPTIONS: { value: ImageEffectPreset; label: string }[] = [
  { value: "none", label: "بدون افکت" },
  { value: "grayscale", label: "سیاه‌وسفید" },
  { value: "blur", label: "محو" },
  { value: "brighten", label: "روشن‌تر" },
  { value: "contrast", label: "کنتراست" },
  { value: "sepia", label: "سپیا" },
];

function effectIntensity(layer: ImageLayer): number {
  return (layer.effectIntensity ?? 50) / 100;
}

export function applyImageLayerFilters(node: Konva.Image, layer: ImageLayer): void {
  const effect = layer.effect ?? "none";

  if (effect === "none") {
    node.clearCache();
    node.filters([]);
    return;
  }

  const intensity = effectIntensity(layer);
  const filters = [];

  switch (effect) {
    case "grayscale":
      filters.push(Konva.Filters.Grayscale);
      break;
    case "blur":
      filters.push(Konva.Filters.Blur);
      node.blurRadius(Math.max(1, Math.round(intensity * 20)));
      break;
    case "brighten":
      filters.push(Konva.Filters.Brighten);
      node.brightness(intensity * 0.6);
      break;
    case "contrast":
      filters.push(Konva.Filters.Contrast);
      node.contrast(intensity * 100);
      break;
    case "sepia":
      filters.push(Konva.Filters.Sepia);
      break;
    default:
      break;
  }

  if (filters.length === 0) {
    node.clearCache();
    node.filters([]);
    return;
  }

  node.filters(filters);
  node.cache();
}
