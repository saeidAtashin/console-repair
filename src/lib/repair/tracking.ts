import type { RepairStatus } from "@/lib/repair-status";

export type TrackingStepKey =
  | "accepted"
  | "diagnosis"
  | "awaiting_confirm"
  | "repairing"
  | "testing"
  | "ready";

export type TrackingStepTone = "green" | "yellow" | "blue" | "purple";

export type TrackingStepDef = {
  key: TrackingStepKey;
  title: string;
  description: string;
  tone: TrackingStepTone;
};

export const TRACKING_STEPS: TrackingStepDef[] = [
  {
    key: "accepted",
    title: "پذیرش شد",
    description: "دستگاه در سیستم ثبت و پذیرش شده است.",
    tone: "green",
  },
  {
    key: "diagnosis",
    title: "عیب‌یابی",
    description: "تکنسین در حال بررسی علت دقیق خرابی است.",
    tone: "green",
  },
  {
    key: "awaiting_confirm",
    title: "منتظر تأیید مشتری",
    description: "هزینه اعلام شده و منتظر تأیید شما برای شروع تعمیر هستیم.",
    tone: "yellow",
  },
  {
    key: "repairing",
    title: "در حال تعمیر",
    description: "قطعات در حال تعویض یا تعمیر تخصصی هستند.",
    tone: "blue",
  },
  {
    key: "testing",
    title: "تست نهایی",
    description: "دستگاه بعد از تعمیر در حال تست کامل است.",
    tone: "purple",
  },
  {
    key: "ready",
    title: "آماده تحویل",
    description: "تعمیر تمام شده و دستگاه آماده تحویل است.",
    tone: "green",
  },
];

export type TrackedRepair = {
  trackingCode: string;
  name: string;
  phone: string;
  device: string;
  issue: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  estimatedPrice?: number | null;
  finalPrice?: number | null;
  adminNote?: string | null;
};

export type TrackingStepState = "done" | "active" | "upcoming";

/** -1 = registered but not accepted yet; 0–5 = timeline index; 6 = delivered (all done). */
export function timelineIndexForStatus(status: string): number {
  const normalized = status.trim().toUpperCase();

  switch (normalized) {
    case "PENDING":
      return -1;
    case "ACCEPTED":
      return 1;
    case "WAITING_FOR_PART":
      return 2;
    case "IN_PROGRESS":
      return 3;
    case "DONE":
      return 5;
    case "DELIVERED":
      return 6;
    case "CANCELED":
      return -2;
    default:
      break;
  }

  const legacy = status.trim().toLowerCase() as RepairStatus;
  if (legacy === "pending") return -1;
  if (legacy === "checking") return 1;
  if (legacy === "repairing") return 3;
  if (legacy === "completed") return 5;

  return -1;
}

export function isCanceledStatus(status: string): boolean {
  return status.trim().toUpperCase() === "CANCELED";
}

export function getTrackingStepState(
  stepIndex: number,
  currentIndex: number,
): TrackingStepState {
  if (currentIndex >= TRACKING_STEPS.length) return "done";
  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "active";
  return "upcoming";
}

export function normalizeAcceptanceCode(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/^FB[-–—\s]*/i, "")
    .replace(/\s+/g, "");
}

export function formatLastUpdate(iso: string, now = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const time = date.toLocaleTimeString("fa-IR", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const todayKey = toTehranYmd(now);
  const dateKey = toTehranYmd(date);
  if (dateKey === todayKey) return `امروز ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateKey === toTehranYmd(yesterday)) return `دیروز ${time}`;

  const day = date.toLocaleDateString("fa-IR", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `${day} ${time}`;
}

function toTehranYmd(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Tehran" });
}

type TrackedRepairSource = {
  id?: number;
  name: string;
  phone_number: string;
  problem_type: number;
  device_type: number;
  description: string;
  status: string;
  estimated_price?: number | null;
  final_price?: number | null;
  admin_note?: string | null;
  created_at?: string;
  updated_at?: string;
};

export function toTrackedRepair(
  item: TrackedRepairSource,
  deviceNames: Map<number, string>,
  problemNames: Map<number, string>,
  fallbackIndex = 0,
): TrackedRepair {
  const trackingCode =
    item.id != null ? String(item.id) : `${item.phone_number}-${fallbackIndex}`;
  const createdAt = item.created_at ?? "";
  const updatedAt = item.updated_at ?? createdAt;

  return {
    trackingCode,
    name: item.name,
    phone: item.phone_number,
    device: deviceNames.get(item.device_type) ?? String(item.device_type),
    issue: problemNames.get(item.problem_type) ?? String(item.problem_type),
    description: item.description,
    status: item.status,
    createdAt,
    updatedAt,
    estimatedPrice: item.estimated_price,
    finalPrice: item.final_price,
    adminNote: item.admin_note,
  };
}
