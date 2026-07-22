import Konva from "konva";

import type {
  ImageBlendMode,
  ImageEffectType,
  ImageLayer,
  ImageLayerEffect,
} from "./types";

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
  { value: "normal", label: "عادی (Normal)" },
  { value: "multiply", label: "ضرب (Multiply)" },
  { value: "screen", label: "صفحه (Screen)" },
  { value: "overlay", label: "روی هم (Overlay)" },
  { value: "darken", label: "تیره‌تر (Darken)" },
  { value: "lighten", label: "روشن‌تر (Lighten)" },
];

export const EFFECT_TYPE_OPTIONS: { value: ImageEffectType; label: string }[] = [
  { value: "grayscale", label: "سیاه‌وسفید (Grayscale)" },
  { value: "blur", label: "محو (Blur)" },
  { value: "brighten", label: "روشن‌تر (Brighten)" },
  { value: "contrast", label: "کنتراست (Contrast)" },
  { value: "sepia", label: "سپیا (Sepia)" },
];

export function getEffectTypeLabel(type: ImageEffectType): string {
  return EFFECT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

export function effectSupportsIntensity(type: ImageEffectType): boolean {
  return type === "blur" || type === "brighten" || type === "contrast";
}

export function getImageLayerEffects(layer: ImageLayer): ImageLayerEffect[] {
  if (layer.effects !== undefined) {
    return layer.effects;
  }

  const legacy = layer.effect;
  if (legacy && legacy !== "none") {
    return [
      {
        id: "legacy-effect",
        type: legacy,
        intensity: layer.effectIntensity ?? 50,
      },
    ];
  }

  return [];
}

function effectIntensityValue(effect: ImageLayerEffect): number {
  return (effect.intensity ?? 50) / 100;
}

export function applyImageLayerFilters(node: Konva.Image, layer: ImageLayer): void {
  const effects = getImageLayerEffects(layer);

  if (effects.length === 0) {
    node.clearCache();
    node.filters([]);
    return;
  }

  const filters = [];

  for (const effect of effects) {
    const intensity = effectIntensityValue(effect);

    switch (effect.type) {
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
  }

  if (filters.length === 0) {
    node.clearCache();
    node.filters([]);
    return;
  }

  node.filters(filters);
  node.cache();
}

export function serializeImageLayerEffects(layer: ImageLayer): string {
  return JSON.stringify(getImageLayerEffects(layer));
}
