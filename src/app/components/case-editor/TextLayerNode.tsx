"use client";

import { memo, useEffect, useState } from "react";
import { Group, Label, Tag, Text } from "react-konva";

import {
  getDefaultTextBoxWidth,
  getTextOffsetX,
  loadEditorFonts,
  normalizeFontFamily,
} from "@/lib/design/editor-fonts";
import type { TextLayer } from "@/lib/design/types";

type Props = {
  layer: TextLayer;
  canvasWidth: number;
  handlers?: Record<string, unknown>;
};

function TextLayerNode({ layer, canvasWidth, handlers }: Props) {
  const boxWidth = layer.width ?? getDefaultTextBoxWidth(canvasWidth);
  const padding = layer.padding ?? 8;
  const cornerRadius = layer.cornerRadius ?? 0;
  const normalizedFont = normalizeFontFamily(layer.fontFamily);
  const [fontEpoch, setFontEpoch] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void loadEditorFonts([normalizedFont]).then(() => {
      if (!cancelled) setFontEpoch((n) => n + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [normalizedFont]);

  return (
    <Group
      id={layer.id}
      x={layer.x}
      y={layer.y}
      offsetX={getTextOffsetX(layer.align, boxWidth)}
      rotation={layer.rotation}
      scaleX={layer.scaleX}
      scaleY={layer.scaleY}
      {...handlers}
    >
      <Label x={0} y={0}>
        {layer.backgroundFill ? (
          <Tag fill={layer.backgroundFill} cornerRadius={cornerRadius} />
        ) : null}
        <Text
          key={`${normalizedFont}-${fontEpoch}`}
          text={layer.text}
          fontFamily={normalizedFont}
          fontSize={layer.fontSize}
          fill={layer.fill}
          align={layer.align}
          width={boxWidth}
          padding={padding}
          direction="rtl"
        />
      </Label>
    </Group>
  );
}

export default memo(TextLayerNode);
