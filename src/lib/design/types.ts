export type DesignLayerBase = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
};

export type TextLayer = DesignLayerBase & {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  fill: string;
  align: "left" | "center" | "right";
};

export type ImageLayer = DesignLayerBase & {
  type: "image";
  src: string;
  width: number;
  height: number;
  isSticker?: boolean;
};

export type DesignLayer = TextLayer | ImageLayer;

export type DesignDocument = {
  id?: string;
  shareToken?: string;
  name?: string;
  brandSlug: string;
  modelSlug: string;
  caseTypeSlug: string;
  description?: string;
  layers: DesignLayer[];
  canvas: { width: number; height: number };
  previewUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SavedDesign = DesignDocument & {
  id: string;
  shareToken: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export function createEmptyDesign(input: {
  brandSlug: string;
  modelSlug: string;
  caseTypeSlug: string;
  canvasWidth: number;
  canvasHeight: number;
}): DesignDocument {
  return {
    brandSlug: input.brandSlug,
    modelSlug: input.modelSlug,
    caseTypeSlug: input.caseTypeSlug,
    layers: [],
    canvas: { width: input.canvasWidth, height: input.canvasHeight },
    description: "",
  };
}

export function generateLayerId(): string {
  return `layer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateShareToken(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
