"use client";

import { memo, useEffect, useRef } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";
import type Konva from "konva";

import {
  getDefaultTextBoxWidth,
  getTextOffsetX,
  loadCalligraphyFonts,
  normalizeCalligraphyFont,
} from "@/lib/calligraphy/fonts";
import { useCalligraphyStore } from "@/lib/calligraphy/store";
import { useElementSize } from "@/lib/design/use-element-size";

type Props = {
  onStageReady?: (stage: Konva.Stage) => void;
};

function CalligraphyCanvas({ onStageReady }: Props) {
  const document = useCalligraphyStore((s) => s.document);
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const setStageRef = useCalligraphyStore((s) => s.setStageRef);
  const { width: containerWidth } = useElementSize(containerRef);

  const { canvas, text, fontFamily, fontSize, fill, align, backgroundColor } =
    document;
  const boxWidth = getDefaultTextBoxWidth(canvas.width);
  const scale = containerWidth > 0 ? containerWidth / canvas.width : 1;
  const displayHeight = canvas.height * scale;

  useEffect(() => {
    void loadCalligraphyFonts([fontFamily]);
  }, [fontFamily]);

  useEffect(() => {
    setStageRef(stageRef as React.RefObject<unknown>);
    return () => setStageRef(null);
  }, [setStageRef]);

  useEffect(() => {
    const stage = stageRef.current;
    if (stage && onStageReady) {
      onStageReady(stage);
    }
  }, [onStageReady, scale]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-2xl border border-border shadow-lg"
      style={{ height: displayHeight || "auto" }}
    >
      <Stage
        ref={stageRef}
        width={canvas.width}
        height={canvas.height}
        scaleX={scale}
        scaleY={scale}
        style={{ width: containerWidth || "100%", height: displayHeight }}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvas.width}
            height={canvas.height}
            fill={backgroundColor === "transparent" ? "#faf8f5" : backgroundColor}
          />
          <Text
            x={canvas.width / 2}
            y={canvas.height / 2}
            offsetX={getTextOffsetX(align, boxWidth)}
            offsetY={fontSize / 2}
            text={text || " "}
            fontFamily={normalizeCalligraphyFont(fontFamily)}
            fontSize={fontSize}
            fill={fill}
            align={align}
            width={boxWidth}
            direction="rtl"
            verticalAlign="middle"
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default memo(CalligraphyCanvas);
