"use client";

import { useEffect } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";

import DesignImageLayerNode from "@/app/components/case-editor/DesignImageLayerNode";
import {
  getDefaultTextBoxWidth,
  getTextOffsetX,
  loadEditorFonts,
  normalizeFontFamily,
} from "@/lib/design/editor-fonts";
import type { CaseTemplate } from "@/lib/design/types";
import { isLayerVisible, type DesignLayer, type ImageLayer, type TextLayer } from "@/lib/design/types";

type Props = {
  template: CaseTemplate;
  className?: string;
  maxHeight?: number;
};

export default function DesignSamplePreview({
  template,
  className,
  maxHeight = 220,
}: Props) {
  const { width, height } = template.referenceCanvas;
  const scale = maxHeight / height;
  const displayWidth = width * scale;
  const displayHeight = height * scale;
  const visibleLayers = template.layers.filter(isLayerVisible);

  useEffect(() => {
    void loadEditorFonts();
  }, []);

  return (
    <div
      className={className}
      style={{ width: displayWidth, height: displayHeight }}
    >
      <Stage width={displayWidth} height={displayHeight} scaleX={scale} scaleY={scale}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="#0a0a0f"
            cornerRadius={16}
          />
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.moveTo(16, 0);
              ctx.lineTo(width - 16, 0);
              ctx.quadraticCurveTo(width, 0, width, 16);
              ctx.lineTo(width, height - 16);
              ctx.quadraticCurveTo(width, height, width - 16, height);
              ctx.lineTo(16, height);
              ctx.quadraticCurveTo(0, height, 0, height - 16);
              ctx.lineTo(0, 16);
              ctx.quadraticCurveTo(0, 0, 16, 0);
              ctx.closePath();
            }}
          >
            {visibleLayers.map((layer: DesignLayer) => {
              if (layer.type === "text") {
                const textLayer = layer as TextLayer;
                const boxWidth = textLayer.width ?? getDefaultTextBoxWidth(width);
                return (
                  <Text
                    key={textLayer.id}
                    text={textLayer.text}
                    x={textLayer.x}
                    y={textLayer.y}
                    width={boxWidth}
                    offsetX={getTextOffsetX(textLayer.align, boxWidth)}
                    fontSize={textLayer.fontSize}
                    fontFamily={normalizeFontFamily(textLayer.fontFamily)}
                    fill={textLayer.fill}
                    align={textLayer.align}
                    rotation={textLayer.rotation}
                    scaleX={textLayer.scaleX}
                    scaleY={textLayer.scaleY}
                  />
                );
              }

              return <DesignImageLayerNode key={layer.id} layer={layer as ImageLayer} />;
            })}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
