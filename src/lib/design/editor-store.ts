"use client";

import { create } from "zustand";

import type { CaseType, PhoneModel } from "@/lib/cases/types";
import {
  createEmptyDesign,
  generateLayerId,
  type DesignDocument,
  type DesignLayer,
  type ImageLayer,
  type TextLayer,
} from "./types";

const MAX_HISTORY = 20;

type EditorMeta = {
  brandSlug: string;
  modelSlug: string;
  caseTypeSlug: string;
  caseType: CaseType;
  model: PhoneModel;
  canvasWidth: number;
  canvasHeight: number;
};

type EditorState = {
  document: DesignDocument;
  meta: EditorMeta | null;
  selectedLayerId: string | null;
  previewMode: boolean;
  history: DesignDocument[];
  historyIndex: number;
  init: (meta: EditorMeta) => void;
  loadDocument: (doc: DesignDocument, meta: EditorMeta) => void;
  setDescription: (description: string) => void;
  setName: (name: string) => void;
  selectLayer: (id: string | null) => void;
  setPreviewMode: (preview: boolean) => void;
  addTextLayer: (text?: string) => void;
  addImageLayer: (src: string, width: number, height: number, isSticker?: boolean) => void;
  updateLayer: (id: string, patch: Partial<DesignLayer>) => void;
  removeLayer: (id: string) => void;
  moveLayer: (id: string, direction: "up" | "down") => void;
  undo: () => void;
  redo: () => void;
  getSelectedLayer: () => DesignLayer | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

function pushHistory(state: EditorState, nextDoc: DesignDocument): Partial<EditorState> {
  const trimmed = state.history.slice(0, state.historyIndex + 1);
  const nextHistory = [...trimmed, structuredClone(nextDoc)].slice(-MAX_HISTORY);
  return {
    document: nextDoc,
    history: nextHistory,
    historyIndex: nextHistory.length - 1,
  };
}

function updateDoc(state: EditorState, updater: (doc: DesignDocument) => DesignDocument) {
  const nextDoc = updater(structuredClone(state.document));
  return pushHistory(state, nextDoc);
}

export const useEditorStore = create<EditorState>((set, get) => ({
  document: createEmptyDesign({
    brandSlug: "",
    modelSlug: "",
    caseTypeSlug: "",
    canvasWidth: 280,
    canvasHeight: 560,
  }),
  meta: null,
  selectedLayerId: null,
  previewMode: false,
  history: [],
  historyIndex: -1,

  init: (meta) => {
    const doc = createEmptyDesign({
      brandSlug: meta.brandSlug,
      modelSlug: meta.modelSlug,
      caseTypeSlug: meta.caseTypeSlug,
      canvasWidth: meta.canvasWidth,
      canvasHeight: meta.canvasHeight,
    });
    set({
      meta,
      document: doc,
      selectedLayerId: null,
      previewMode: false,
      history: [structuredClone(doc)],
      historyIndex: 0,
    });
  },

  loadDocument: (doc, meta) => {
    set({
      meta,
      document: structuredClone(doc),
      selectedLayerId: null,
      previewMode: false,
      history: [structuredClone(doc)],
      historyIndex: 0,
    });
  },

  setDescription: (description) => {
    set((state) => updateDoc(state, (doc) => ({ ...doc, description })));
  },

  setName: (name) => {
    set((state) => updateDoc(state, (doc) => ({ ...doc, name })));
  },

  selectLayer: (id) => set({ selectedLayerId: id }),

  setPreviewMode: (preview) => set({ previewMode: preview, selectedLayerId: preview ? null : get().selectedLayerId }),

  addTextLayer: (text = "متن شما") => {
    const { meta } = get();
    if (!meta) return;
    const layer: TextLayer = {
      id: generateLayerId(),
      type: "text",
      text,
      fontFamily: "Vazirmatn",
      fontSize: 28,
      fill: "#ffffff",
      align: "center",
      x: meta.canvasWidth / 2,
      y: meta.canvasHeight / 2,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    set((state) => {
      const next = updateDoc(state, (doc) => ({
        ...doc,
        layers: [...doc.layers, layer],
      }));
      return { ...next, selectedLayerId: layer.id };
    });
  },

  addImageLayer: (src, width, height, isSticker = false) => {
    const { meta } = get();
    if (!meta) return;
    const layer: ImageLayer = {
      id: generateLayerId(),
      type: "image",
      src,
      width,
      height,
      isSticker,
      x: meta.canvasWidth / 2 - width / 2,
      y: meta.canvasHeight / 2 - height / 2,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    set((state) => {
      const next = updateDoc(state, (doc) => ({
        ...doc,
        layers: [...doc.layers, layer],
      }));
      return { ...next, selectedLayerId: layer.id };
    });
  },

  updateLayer: (id, patch) => {
    set((state) =>
      updateDoc(state, (doc) => ({
        ...doc,
        layers: doc.layers.map((layer) =>
          layer.id === id ? ({ ...layer, ...patch } as DesignLayer) : layer,
        ),
      })),
    );
  },

  removeLayer: (id) => {
    set((state) => {
      const next = updateDoc(state, (doc) => ({
        ...doc,
        layers: doc.layers.filter((l) => l.id !== id),
      }));
      return {
        ...next,
        selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
      };
    });
  },

  moveLayer: (id, direction) => {
    set((state) =>
      updateDoc(state, (doc) => {
        const idx = doc.layers.findIndex((l) => l.id === id);
        if (idx === -1) return doc;
        const next = [...doc.layers];
        const swapIdx = direction === "up" ? idx + 1 : idx - 1;
        if (swapIdx < 0 || swapIdx >= next.length) return doc;
        [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
        return { ...doc, layers: next };
      }),
    );
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    set({
      historyIndex: newIndex,
      document: structuredClone(history[newIndex]),
      selectedLayerId: null,
    });
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({
      historyIndex: newIndex,
      document: structuredClone(history[newIndex]),
      selectedLayerId: null,
    });
  },

  getSelectedLayer: () => {
    const { selectedLayerId, document } = get();
    if (!selectedLayerId) return null;
    return document.layers.find((l) => l.id === selectedLayerId) ?? null;
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
