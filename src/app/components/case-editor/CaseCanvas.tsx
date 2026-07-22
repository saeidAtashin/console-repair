"use client";

import { useCallback, useEffect, useRef } from "react";
import { Stage, Layer, Text, Transformer, Group, Rect } from "react-konva";
import type Konva from "konva";

import { PhoneBackKonvaLayers } from "@/app/components/case-wizard/PhoneBackKonva";
import {
  createCaseDesignClipFunc,
  createFallbackCaseDesignClipFunc,
  mapGeometryToCanvas,
} from "@/lib/cases/phone-back";
import { useEditorStore } from "@/lib/design/editor-store";
import {
  getDefaultTextBoxWidth,
  getTextOffsetX,
  normalizeFontFamily,
} from "@/lib/design/editor-fonts";
import { isLayerVisible, type DesignLayer, type TextLayer } from "@/lib/design/types";
import DesignImageLayerNode from "@/app/components/case-editor/DesignImageLayerNode";

type Props = {
  caseColor: string;
  caseMaterial: string;
  onStageRef?: (stage: Konva.Stage | null) => void;
  readOnly?: boolean;
};

type TouchGesture = {
  layerId: string;
  startDistance: number;
  startAngle: number;
  startScaleX: number;
  startScaleY: number;
  startRotation: number;
};

function touchDistance(t1: Touch, t2: Touch): number {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.hypot(dx, dy);
}

function touchAngle(t1: Touch, t2: Touch): number {
  return (Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * 180) / Math.PI;
}

export default function CaseCanvas({
  caseColor,
  caseMaterial,
  onStageRef,
  readOnly = false,
}: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const touchGestureRef = useRef<TouchGesture | null>(null);
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

  const visibleLayers = document.layers.filter(isLayerVisible);

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

    const selected = selectedLayerId ? stage.findOne(`#${selectedLayerId}`) : null;
    if (selected && selectedLayerId) {
      const layer = document.layers.find((l) => l.id === selectedLayerId);
      if (layer && isLayerVisible(layer)) {
        transformer.nodes([selected]);
        transformer.getLayer()?.batchDraw();
      } else {
        transformer.nodes([]);
      }
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

  const handleTouchStart = useCallback(
    (layerId: string, e: Konva.KonvaEventObject<TouchEvent>) => {
      if (readOnly || previewMode) return;
      const touches = e.evt.touches;
      if (touches.length !== 2) return;

      const layer = document.layers.find((l) => l.id === layerId);
      if (!layer) return;

      e.evt.preventDefault();
      selectLayer(layerId);
      touchGestureRef.current = {
        layerId,
        startDistance: touchDistance(touches[0], touches[1]),
        startAngle: touchAngle(touches[0], touches[1]),
        startScaleX: layer.scaleX,
        startScaleY: layer.scaleY,
        startRotation: layer.rotation,
      };
    },
    [document.layers, previewMode, readOnly, selectLayer],
  );

  const handleTouchMove = useCallback(
    (layerId: string, e: Konva.KonvaEventObject<TouchEvent>) => {
      const gesture = touchGestureRef.current;
      if (!gesture || gesture.layerId !== layerId) return;

      const touches = e.evt.touches;
      if (touches.length !== 2) return;

      e.evt.preventDefault();
      const dist = touchDistance(touches[0], touches[1]);
      const angle = touchAngle(touches[0], touches[1]);
      const scaleFactor = dist / gesture.startDistance;
      const rotationDelta = angle - gesture.startAngle;

      updateLayer(layerId, {
        scaleX: gesture.startScaleX * scaleFactor,
        scaleY: gesture.startScaleY * scaleFactor,
        rotation: gesture.startRotation + rotationDelta,
      });
    },
    [updateLayer],
  );

  const handleTouchEnd = useCallback(() => {
    touchGestureRef.current = null;
  }, []);

  const bodyFill = isClear ? "rgba(10,10,15,0.85)" : "#0a0a0f";

  return (
    <div
      className="mx-auto rounded-[2rem] p-3 shadow-2xl"
      style={{
        backgroundColor: isClear ? "rgba(255,255,255,0.06)" : caseColor,
        border: "2px solid rgba(255,255,255,0.12)",
        touchAction: "none",
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
        onTouchEnd={handleTouchEnd}
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
            {visibleLayers.map((layer: DesignLayer) => {
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
                onTouchStart: (e: Konva.KonvaEventObject<TouchEvent>) =>
                  handleTouchStart(layer.id, e),
                onTouchMove: (e: Konva.KonvaEventObject<TouchEvent>) =>
                  handleTouchMove(layer.id, e),
                draggable: !readOnly && !previewMode,
              };

              if (layer.type === "text") {
                const textLayer = layer as TextLayer;
                const boxWidth = textLayer.width ?? getDefaultTextBoxWidth(width);
                return (
                  <Text
                    key={`${textLayer.id}-${textLayer.text}-${textLayer.fontFamily}-${textLayer.fontSize}-${textLayer.align}`}
                    id={textLayer.id}
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
                    {...commonHandlers}
                  />
                );
              }

              return (
                <DesignImageLayerNode
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
              padding={8}
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
