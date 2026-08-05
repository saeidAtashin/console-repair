import type { ExportTier } from "./types";

const STORAGE_KEY = "calligraphy-export-unlocks";

export type ExportUnlock = {
  designId: string;
  tier: "hd-png" | "pdf";
  unlockedAt: string;
  orderId?: string;
};

function readUnlocks(): ExportUnlock[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as ExportUnlock[]) : [];
  } catch {
    return [];
  }
}

function writeUnlocks(unlocks: ExportUnlock[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocks));
}

export function isExportUnlocked(
  designId: string,
  tier: "hd-png" | "pdf",
): boolean {
  return readUnlocks().some(
    (u) => u.designId === designId && u.tier === tier,
  );
}

export function unlockExport(
  designId: string,
  tier: "hd-png" | "pdf",
  orderId?: string,
): void {
  const unlocks = readUnlocks();
  const key = `${designId}:${tier}`;
  const exists = unlocks.some((u) => `${u.designId}:${u.tier}` === key);
  if (exists) return;

  unlocks.push({
    designId,
    tier,
    unlockedAt: new Date().toISOString(),
    orderId,
  });
  writeUnlocks(unlocks);
}

export function unlockFromCartItems(
  items: Array<{ designId: string; tier: "hd-png" | "pdf" }>,
  orderId?: string,
): void {
  for (const item of items) {
    unlockExport(item.designId, item.tier, orderId);
  }
}

export function getUnlockedExports(designId?: string): ExportUnlock[] {
  const all = readUnlocks();
  if (!designId) return all;
  return all.filter((u) => u.designId === designId);
}

export function canDownloadTier(
  designId: string,
  tier: ExportTier,
): boolean {
  if (tier === "free") return true;
  return isExportUnlocked(designId, tier);
}
