"use client";

import { useMemo } from "react";

import { useElementSize } from "@/lib/design/use-element-size";
import type { RefObject } from "react";

const DEFAULT_MAX_WIDTH = 280;
const DEFAULT_MAX_HEIGHT = 480;

export function useCanvasDisplaySize(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const { width, height } = useElementSize(containerRef);

  return useMemo(() => {
    if (!enabled || width <= 0 || height <= 0) {
      return { width: DEFAULT_MAX_WIDTH, height: DEFAULT_MAX_HEIGHT };
    }

    const padding = 24;
    const availableWidth = Math.max(160, width - padding);
    const availableHeight = Math.max(240, height - padding);
    const isWide = width >= 500;

    return {
      width: Math.min(availableWidth, isWide ? 340 : 320),
      height: Math.min(availableHeight, 680),
    };
  }, [enabled, width, height]);
}
