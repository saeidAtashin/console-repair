import type { ConsoleId } from "@/lib/console-catalog";
import {
  CONFIDENCE_LABELS,
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
