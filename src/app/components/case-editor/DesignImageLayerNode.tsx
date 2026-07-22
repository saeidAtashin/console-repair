"use client";

import { useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import type Konva from "konva";

import {
  applyImageLayerFilters,
  blendModeToKonva,
} from "@/lib/design/image-layer-filters";
import type { ImageLayer } from "@/lib/design/types";

type Props = {
  layer: ImageLayer;
  handlers?: Record<string, unknown>;
};

export default function DesignImageLayerNode({ layer, handlers }: Props) {
  const [image] = useImage(layer.src, "anonymous");
  const imageRef = useRef<Konva.Image>(null);

  useEffect(() => {
    const node = imageRef.current;
    if (!node || !image) return;

    applyImageLayerFilters(node, layer);
    node.getLayer()?.batchDraw();
  }, [
    image,
    layer.src,
    layer.width,
    layer.height,
    layer.effect,
    layer.effectIntensity,
    layer.scaleX,
    layer.scaleY,
  ]);

  return (
    <KonvaImage
      ref={imageRef}
      id={layer.id}
      image={image}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      rotation={layer.rotation}
      scaleX={layer.scaleX}
      scaleY={layer.scaleY}
      opacity={layer.opacity ?? 1}
      globalCompositeOperation={blendModeToKonva(layer.blendMode)}
      {...handlers}
    />
  );
}
