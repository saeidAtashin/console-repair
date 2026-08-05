import { create } from "zustand";

import { DEFAULT_CALLIGRAPHY_FONT } from "./fonts";
import {
  createCalligraphyDocument,
  type CalligraphyAlign,
  type CalligraphyDocument,
} from "./types";

type CalligraphyState = {
  document: CalligraphyDocument;
  stageRef: React.RefObject<unknown> | null;
  setStageRef: (ref: React.RefObject<unknown> | null) => void;
  setText: (text: string) => void;
  setFontFamily: (fontFamily: string) => void;
  setFontSize: (fontSize: number) => void;
  setFill: (fill: string) => void;
  setAlign: (align: CalligraphyAlign) => void;
  setBackgroundColor: (color: string) => void;
  setName: (name: string) => void;
  loadDocument: (doc: CalligraphyDocument) => void;
  resetDocument: () => void;
  setPreviewUrl: (url: string) => void;
};

export const useCalligraphyStore = create<CalligraphyState>((set) => ({
  document: createCalligraphyDocument(),
  stageRef: null,
  setStageRef: (ref) => set({ stageRef: ref }),
  setText: (text) =>
    set((s) => ({ document: { ...s.document, text, updatedAt: new Date().toISOString() } })),
  setFontFamily: (fontFamily) =>
    set((s) => ({ document: { ...s.document, fontFamily, updatedAt: new Date().toISOString() } })),
  setFontSize: (fontSize) =>
    set((s) => ({ document: { ...s.document, fontSize, updatedAt: new Date().toISOString() } })),
  setFill: (fill) =>
    set((s) => ({ document: { ...s.document, fill, updatedAt: new Date().toISOString() } })),
  setAlign: (align) =>
    set((s) => ({ document: { ...s.document, align, updatedAt: new Date().toISOString() } })),
  setBackgroundColor: (backgroundColor) =>
    set((s) => ({
      document: { ...s.document, backgroundColor, updatedAt: new Date().toISOString() },
    })),
  setName: (name) =>
    set((s) => ({ document: { ...s.document, name, updatedAt: new Date().toISOString() } })),
  loadDocument: (doc) => set({ document: doc }),
  resetDocument: () =>
    set({
      document: createCalligraphyDocument({ fontFamily: DEFAULT_CALLIGRAPHY_FONT }),
    }),
  setPreviewUrl: (previewUrl) =>
    set((s) => ({ document: { ...s.document, previewUrl } })),
}));
