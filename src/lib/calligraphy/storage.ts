import type { CalligraphyDocument } from "./types";

const STORAGE_KEY = "calligraphy-saved-works";

export function readSavedWorks(): CalligraphyDocument[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CalligraphyDocument[]) : [];
  } catch {
    return [];
  }
}

export function saveWork(doc: CalligraphyDocument): CalligraphyDocument {
  const works = readSavedWorks();
  const idx = works.findIndex((w) => w.id === doc.id);
  const updated = { ...doc, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    works[idx] = updated;
  } else {
    works.unshift(updated);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(works.slice(0, 50)));
  return updated;
}

export function deleteWork(id: string): void {
  const works = readSavedWorks().filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
}

export function getWorkById(id: string): CalligraphyDocument | undefined {
  return readSavedWorks().find((w) => w.id === id);
}
