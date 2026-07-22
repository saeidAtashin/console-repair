"use client";

import { useEffect, useRef } from "react";
import { Stage, Layer, Text, Image as KonvaImage, Transformer, Group, Rect } from "react-konva";
import useImage from "use-image";
import type Konva from "konva";

import { PhoneBackKonvaLayers } from "@/app/components/case-wizard/PhoneBackKonva";
import {
  createCaseDesignClipFunc,
  createFallbackCaseDesignClipFunc,
  mapGeometryToCanvas,
} from "@/lib/cases/phone-back";
import { useEditorStore } from "@/lib/design/editor-store";
import type { DesignLayer, ImageLayer } from "@/lib/design/types";

type Props = {
  caseColor: string;
  caseMaterial: string;
  onStageRef?: (stage: Konva.Stage | null) => void;
  readOnly?: boolean;
};

export default function CaseCanvas({
  caseColor,
  caseMaterial,
  onStageRef,
  readOnly = false,
}: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const {
    document,
    meta,
    selectedLayerId,
    previewMode,
    selectLayer,
    updateLayer,
  } = useEditorStore();

  const width = meta?.canvasWidth ?? document.canvas.width;
  const height = meta?.canvasHeight ?? document.canvas.height;
  const scale = Math.min(280 / width, 480 / height);
  const isClear = caseMaterial === "clear";
  const model = meta?.model;
  const designClipFunc = model
    ? createCaseDesignClipFunc(mapGeometryToCanvas(model))
    : createFallbackCaseDesignClipFunc(width, height);

  useEffect(() => {
    if (stageRef.current) onStageRef?.(stageRef.current);
  }, [onStageRef]);

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    if (!transformer || !stage || readOnly || previewMode) {
      transformer?.nodes([]);
      return;
    }

    const selected = stage.findOne(`#${selectedLayerId}`);
    if (selected) {
      transformer.nodes([selected]);
      transformer.getLayer()?.batchDraw();
    } else {
      transformer.nodes([]);
    }
  }, [selectedLayerId, document.layers, readOnly, previewMode]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (readOnly || previewMode) return;
    if (e.target === e.target.getStage()) {
      selectLayer(null);
    }
  };

  const bodyFill = isClear ? "rgba(10,10,15,0.85)" : "#0a0a0f";

  return (
    <div
      className="mx-auto rounded-[2rem] p-3 shadow-2xl"
      style={{
        backgroundColor: isClear ? "rgba(255,255,255,0.06)" : caseColor,
        border: "2px solid rgba(255,255,255,0.12)",
      }}
    >
      <Stage
        ref={stageRef}
        width={width * scale}
        height={height * scale}
        scaleX={scale}
        scaleY={scale}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {model ? (
            <PhoneBackKonvaLayers
              model={model}
              bodyFill={bodyFill}
              showGuides={false}
              showCamera={false}
            />
          ) : (
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={bodyFill}
              cornerRadius={16}
            />
          )}

          <Group clipFunc={designClipFunc}>
            {document.layers.map((layer: DesignLayer) => {
              const commonHandlers = {
                onClick: () => !readOnly && !previewMode && selectLayer(layer.id),
                onTap: () => !readOnly && !previewMode && selectLayer(layer.id),
                onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
                  updateLayer(layer.id, { x: e.target.x(), y: e.target.y() });
                },
                onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
                  const node = e.target;
                  updateLayer(layer.id, {
                    x: node.x(),
                    y: node.y(),
                    rotation: node.rotation(),
                    scaleX: node.scaleX(),
                    scaleY: node.scaleY(),
                  });
                },
                draggable: !readOnly && !previewMode,
              };

              if (layer.type === "text") {
                return (
                  <Text
                    key={layer.id}
                    id={layer.id}
                    text={layer.text}
                    x={layer.x}
                    y={layer.y}
                    fontSize={layer.fontSize}
                    fontFamily={layer.fontFamily}
                    fill={layer.fill}
                    align={layer.align}
                    rotation={layer.rotation}
                    scaleX={layer.scaleX}
                    scaleY={layer.scaleY}
                    {...commonHandlers}
                  />
                );
              }

              return (
                <DesignImageLayer
                  key={layer.id}
                  layer={layer}
                  handlers={commonHandlers}
                />
              );
            })}
          </Group>

          {!previewMode && !readOnly && model ? (
            <PhoneBackKonvaLayers
              model={model}
              showBody={false}
              showLogo={false}
              showCamera={false}
              showGuides
            />
          ) : null}

          {model ? (
            <PhoneBackKonvaLayers
              model={model}
              showBody={false}
              showLogo={false}
              showGuides={false}
              showCamera
            />
          ) : null}

          {!readOnly && !previewMode ? (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 10 || newBox.height < 10) return oldBox;
                return newBox;
              }}
              rotateEnabled
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
                "middle-left",
                "middle-right",
              ]}
            />
          ) : null}
        </Layer>
      </Stage>
    </div>
  );
}

function DesignImageLayer({
  layer,
  handlers,
}: {
  layer: ImageLayer;
  handlers: Record<string, unknown>;
}) {
  const [image] = useImage(layer.src, "anonymous");
  return (
    <KonvaImage
      id={layer.id}
      image={image}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      rotation={layer.rotation}
      scaleX={layer.scaleX}
      scaleY={layer.scaleY}
      {...handlers}
    />
  );
}
