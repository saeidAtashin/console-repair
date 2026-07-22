const STORAGE_KEY = "guest_uid";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getGuestUid(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && UUID_RE.test(raw)) return raw;
  } catch {
    /* ignore */
  }
  return null;
}

/** Get existing guest UUID or create and persist one. */
export function getOrCreateGuestUid(): string {
  const existing = getGuestUid();
  if (existing) return existing;

  const uid = createUuid();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, uid);
    } catch {
      /* ignore */
    }
  }
  return uid;
}

export function clearGuestUid(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
