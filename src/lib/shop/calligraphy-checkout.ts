import type { CartLineItem } from "./types";

const PENDING_UNLOCKS_KEY = "calligraphy-pending-unlocks";

export type PendingUnlock = {
  designId: string;
  tier: "hd-png" | "pdf";
};

export function savePendingUnlocks(items: CartLineItem[]): void {
  if (typeof window === "undefined") return;
  const unlocks: PendingUnlock[] = items
    .filter((item) => item.kind === "calligraphy-export")
    .map((item) => ({
      designId: item.designId,
      tier: item.tier,
    }));
  if (unlocks.length === 0) return;
  sessionStorage.setItem(PENDING_UNLOCKS_KEY, JSON.stringify(unlocks));
}

export function consumePendingUnlocks(): PendingUnlock[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(PENDING_UNLOCKS_KEY);
    sessionStorage.removeItem(PENDING_UNLOCKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as PendingUnlock[]) : [];
  } catch {
    return [];
  }
}

/** Serialize calligraphy-export items for remote API fallback */
export function serializeItemsForApi(items: CartLineItem[]): CartLineItem[] {
  return items.map((item) => {
    if (item.kind !== "calligraphy-export") return item;
    return {
      kind: "custom" as const,
      designId: item.designId,
      previewUrl: item.previewUrl,
      qty: 1,
      unitPrice: item.unitPrice,
      title: item.title,
      brandSlug: "calligraphy",
      modelSlug: item.tier,
      caseTypeSlug: item.fontFamily,
      description: JSON.stringify({
        type: "calligraphy-export",
        designId: item.designId,
        tier: item.tier,
        fontFamily: item.fontFamily,
      }),
    };
  });
}

export function isDigitalOnlyCart(items: CartLineItem[]): boolean {
  return items.length > 0 && items.every((item) => item.kind === "calligraphy-export");
}
