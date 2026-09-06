import type { ConsoleId } from "@/lib/console-catalog";
import { consoleIdFromDeviceName } from "@/lib/repair-links";
import {
  CONFIDENCE_LABELS,
  MODE_LABELS,
  SEVERITY_LABELS,
} from "./copy";
import { evaluate, resolveDevice } from "./engine";
import type { DiagnosisCatalog, DiagnosisSession } from "./types";

export type DiagnosisTransfer = {
  consoleBrand: string;
  consoleFamily: string;
  consoleModel: string;
  variant?: string;
  problemCategory: string;
  problem: string;
  symptoms: string[];
  answers: DiagnosisSession["answers"];
  diagnosisResult: string;
  confidence: string;
  recommendedService?: string;
  consoleId?: ConsoleId;
  description: string;
};

function mapConsoleId(
  catalog: DiagnosisCatalog,
  familyId?: string,
): ConsoleId | undefined {
  return catalog.families.find((family) => family.id === familyId)?.repairConsoleId;
}

export function buildDiagnosisTransfer(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): DiagnosisTransfer {
  const result = evaluate(session, catalog);
  const device = resolveDevice(session, catalog);
  const diagnosisResult = result.likelyCauses
    .map((cause) => `${cause.label}: ${cause.summary}`)
    .join("\n");

  const lines = [
    "--- نتیجه عیب‌یابی فیکس‌بازی ---",
    `دستگاه: ${result.consoleModel}${result.variant ? ` / ${result.variant}` : ""}`,
    `خانواده: ${result.consoleFamily}`,
    `مشکل: ${result.problemCategory} / ${result.problem}`,
    "",
    "علائم:",
    ...(result.symptoms.length
      ? result.symptoms.map((line) => `- ${line}`)
      : ["- ثبت نشده"]),
    "",
    "احتمال علت:",
    diagnosisResult || "- نیازمند بررسی تخصصی",
    `اطمینان: ${CONFIDENCE_LABELS[result.confidence]}`,
    `شدت: ${SEVERITY_LABELS[result.severity]}`,
    `اقدام: ${result.actionLabel}`,
    session.mode ? `مسیر بررسی: ${MODE_LABELS[session.mode]}` : "",
    result.service ? `سرویس پیشنهادی: ${result.service.label}` : "",
    result.warning ? `هشدار: ${result.warning}` : "",
    "",
    result.disclaimer,
  ].filter(Boolean);

  return {
    consoleBrand: result.consoleBrand,
    consoleFamily: result.consoleFamily,
    consoleModel: result.consoleModel,
    variant: result.variant,
    problemCategory: result.problemCategory,
    problem: result.problem,
    symptoms: result.symptoms,
    answers: session.answers,
    diagnosisResult,
    confidence: result.confidence,
    recommendedService: result.service?.label,
    consoleId: mapConsoleId(catalog, device?.familyId),
    description: lines.join("\n"),
  };
}

function normalizeHint(value: string): string {
  return value.toLowerCase().replace(/[\s_-]+/g, "");
}

function inferredConsoleId(deviceName: string): ConsoleId | undefined {
  const mapped = consoleIdFromDeviceName(deviceName);
  if (mapped) return mapped;

  const compact = normalizeHint(deviceName);
  const lower = deviceName.toLowerCase();
  if (
    compact.includes("playstation5") ||
    compact.includes("ps5") ||
    /play\s*station\s*5/.test(lower)
  ) {
    return "ps5";
  }
  if (
    compact.includes("playstation4") ||
    compact.includes("ps4") ||
    /play\s*station\s*4/.test(lower)
  ) {
    return "ps4";
  }
  if (compact.includes("xbox")) return "xbox";
  return undefined;
}

export function matchDeviceForDiagnosis(
  devices: { id: number; name: string }[],
  catalog: DiagnosisCatalog,
  session: DiagnosisSession,
): { id: number; name: string } | undefined {
  if (devices.length === 0) return undefined;

  const family = catalog.families.find((item) => item.id === session.familyId);
  const model = catalog.models.find((item) => item.id === session.modelId);
  const hints = [
    ...(family?.apiHints ?? []),
    family?.label,
    model?.label,
    session.familyId,
    session.modelId,
  ].filter((hint): hint is string => Boolean(hint));

  const scored = devices.map((device) => {
    const compact = normalizeHint(device.name);
    let score = 0;

    const inferred = inferredConsoleId(device.name);
    if (family?.repairConsoleId && inferred === family.repairConsoleId) {
      score += 12;
    }

    for (const hint of hints) {
      const needle = normalizeHint(hint);
      if (!needle) continue;
      if (compact.includes(needle) || needle.includes(compact)) {
        score += needle.length > 8 ? 6 : 4;
      }
    }

    return { device, score };
  });

  scored.sort((a, b) => b.score - a.score);
  if ((scored[0]?.score ?? 0) > 0) return scored[0].device;
  return devices[0];
}

export function matchProblemTypeForDiagnosis(
  types: { id: number; name: string }[],
  catalog: DiagnosisCatalog,
  session: DiagnosisSession,
): { id: number; name: string } | undefined {
  const hints =
    catalog.categories.find((category) => category.id === session.categoryId)
      ?.apiHints ?? [];
  if (hints.length === 0) return types[0];

  const scored = types.map((type) => {
    const name = type.name.toLowerCase();
    const score = hints.reduce(
      (sum, hint) => (name.includes(hint.toLowerCase()) ? sum + 1 : sum),
      0,
    );
    return { type, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return (scored[0]?.score ?? 0) > 0 ? scored[0].type : types[0];
}

export function appendRepairDetails(
  diagnosisDescription: string,
  extra: {
    city?: string;
    delivery?: string;
    notes?: string;
    hasPhoto?: boolean;
    hasVideo?: boolean;
  },
): string {
  const extras = [
    extra.city ? `شهر: ${extra.city}` : "",
    extra.delivery ? `روش تحویل: ${extra.delivery}` : "",
    extra.notes ? `توضیحات اضافه: ${extra.notes}` : "",
    extra.hasPhoto ? "عکس: ضمیمه شده (در مرورگر انتخاب شد)" : "",
    extra.hasVideo ? "ویدئو: ضمیمه شده (در مرورگر انتخاب شد)" : "",
  ].filter(Boolean);

  if (extras.length === 0) return diagnosisDescription;
  return `${diagnosisDescription}\n\n--- اطلاعات درخواست ---\n${extras.join("\n")}`;
}
