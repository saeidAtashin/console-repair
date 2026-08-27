import {
  conditionSpecificity,
  createContext,
  evaluateConditions,
} from "./conditions";
import {
  ACTION_LABELS,
  DISCLAIMER,
  LIQUID_WARNING,
  PHYSICAL_NEEDED,
  SPECIALIST_NEEDED,
} from "./copy";
import type {
  Answer,
  CatalogFamily,
  CatalogModel,
  Complexity,
  Confidence,
  DiagnosisAction,
  DiagnosisCatalog,
  DiagnosisMode,
  DiagnosisResult,
  DiagnosisSession,
  Problem,
  ProblemCategory,
  Question,
  ResolvedDevice,
  TroubleshootingStep,
} from "./types";

const BUDGET: Record<Complexity, { min: number; max: number }> = {
  simple: { min: 2, max: 4 },
  medium: { min: 4, max: 7 },
  complex: { min: 6, max: 10 },
};

const QUICK_BUDGET: Record<Complexity, { min: number; max: number }> = {
  simple: { min: 1, max: 2 },
  medium: { min: 2, max: 3 },
  complex: { min: 3, max: 4 },
};

export function emptySession(): DiagnosisSession {
  return { answers: [], phase: "flow" };
}

export function enabledFamilies(
  catalog: DiagnosisCatalog,
  entryGroupId: string,
): CatalogFamily[] {
  return catalog.families
    .filter((family) => family.enabled && family.entryGroupId === entryGroupId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function enabledModels(
  catalog: DiagnosisCatalog,
  familyId: string,
): CatalogModel[] {
  return catalog.models
    .filter((model) => model.enabled && model.familyId === familyId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function modelsForEntryGroup(
  catalog: DiagnosisCatalog,
  entryGroupId: string,
): CatalogModel[] {
  const familyIds = new Set(
    enabledFamilies(catalog, entryGroupId).map((family) => family.id),
  );
  return catalog.models
    .filter((model) => model.enabled && familyIds.has(model.familyId))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function shouldSkipFamily(
  catalog: DiagnosisCatalog,
  entryGroupId: string,
): boolean {
  const families = enabledFamilies(catalog, entryGroupId);
  if (families.length <= 1) return true;
  return families.every((family) => enabledModels(catalog, family.id).length <= 1);
}

export function resolveDevice(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): ResolvedDevice | null {
  if (!session.modelId) return null;
  const model = catalog.models.find((item) => item.id === session.modelId);
  if (!model) return null;

  const variant = model.variants?.find((item) => item.id === session.variantId);
  const family = catalog.families.find((item) => item.id === model.familyId);
  const capabilities = {
    ...model.capabilities,
    ...variant?.capabilityOverrides,
  };

  const variantLabel = variant?.label;
  const modelLabel = model.unknown
    ? `${family?.label ?? model.label} — مدل نامشخص`
    : model.label;
  const label = [modelLabel, variantLabel].filter(Boolean).join(" · ");

  return {
    id: variant ? `${model.id}-${variant.id}` : model.id,
    modelId: model.id,
    variantId: variant?.id,
    familyId: model.familyId,
    brandId: model.brandId,
    kind: model.kind,
    model: modelLabel,
    variant: variantLabel,
    label,
    unknown: model.unknown,
    capabilities,
  };
}

export function visibleCategories(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): ProblemCategory[] {
  const device = resolveDevice(session, catalog);
  if (!device) return [];

  const ctx = createContext(session, catalog, device);

  return catalog.categories
    .filter((category) => {
      if (!category.deviceKinds.includes(device.kind)) return false;
      if (
        category.requiredCapability &&
        !device.capabilities[category.requiredCapability]
      ) {
        return false;
      }
      return evaluateConditions(undefined, ctx);
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function visibleProblems(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): Problem[] {
  const device = resolveDevice(session, catalog);
  if (!device || !session.categoryId) return [];
  const ctx = createContext(session, catalog, device);

  return catalog.problems
    .filter((problem) => {
      if (problem.categoryId !== session.categoryId) return false;
      return evaluateConditions(problem.conditions, ctx);
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function questionBudget(
  problem: Problem | null,
  mode: DiagnosisMode = "full",
): { min: number; max: number } {
  const table = mode === "quick" ? QUICK_BUDGET : BUDGET;
  if (!problem) return table.medium;
  if (problem.flags?.includes("misc")) {
    return mode === "quick" ? { min: 1, max: 1 } : { min: 1, max: 2 };
  }
  if (problem.flags?.includes("liquid")) return { min: 3, max: 4 };
  if (problem.flags?.includes("skip-troubleshooting")) {
    return mode === "quick" ? { min: 1, max: 2 } : { min: 1, max: 3 };
  }
  return table[problem.complexity];
}

function questionScore(question: Question): number {
  return (
    question.diagnosticValue * 10 +
    conditionSpecificity(question.conditions) * 8 -
    question.priority
  );
}

export function selectNextQuestion(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): Question | null {
  const device = resolveDevice(session, catalog);
  const ctx = createContext(session, catalog, device);
  const problem = ctx.problem;
  if (!problem) return null;

  const budget = questionBudget(problem, session.mode ?? "full");
  const answered = new Set(session.answers.map((answer) => answer.questionId));
  if (session.answers.length >= budget.max) return null;

  const quick = session.mode === "quick";
  const candidates = catalog.questions
    .filter((question) => {
      if (answered.has(question.id)) return false;
      if (quick && question.optional) return false;
      return evaluateConditions(question.conditions, ctx);
    })
    .sort((a, b) => questionScore(b) - questionScore(a));

  if (candidates.length === 0) return null;

  if (session.answers.length >= budget.min) {
    const snapshot = evaluate(session, catalog);
    if (quick && snapshot.action !== "consult") {
      return null;
    }
    if (
      snapshot.confidence === "high" &&
      snapshot.action === "repair" &&
      !problem.flags?.includes("software")
    ) {
      return null;
    }
  }

  return candidates[0];
}

export function selectTroubleshooting(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): TroubleshootingStep[] {
  const device = resolveDevice(session, catalog);
  const ctx = createContext(session, catalog, device);
  if (ctx.problem?.flags?.includes("skip-troubleshooting")) return [];

  const steps = catalog.troubleshooting.filter((step) =>
    evaluateConditions(step.conditions, ctx),
  );
  if (session.mode === "quick") return steps.slice(0, 1);
  return steps;
}

function optionLabel(catalog: DiagnosisCatalog, answer: Answer): string {
  const question = catalog.questions.find((item) => item.id === answer.questionId);
  if (answer.text?.trim()) return answer.text.trim();
  if (answer.mediaNote?.trim()) return answer.mediaNote.trim();
  const option = question?.options?.find((item) => item.id === answer.optionId);
  return option?.label ?? answer.optionId ?? "";
}

export function symptomLines(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): string[] {
  return session.answers
    .map((answer) => {
      const question = catalog.questions.find((item) => item.id === answer.questionId);
      if (!question) return null;
      const value = optionLabel(catalog, answer);
      if (!value) return null;
      return `${question.text} ${value}`;
    })
    .filter((line): line is string => Boolean(line));
}

function pickService(session: DiagnosisSession, catalog: DiagnosisCatalog) {
  const device = resolveDevice(session, catalog);
  const ctx = createContext(session, catalog, device);
  const matches = catalog.services
    .filter((service) => evaluateConditions(service.conditions, ctx))
    .sort((a, b) => b.specificity - a.specificity);
  const best = matches[0];
  if (!best) return undefined;
  return {
    id: best.id,
    label: best.label,
    href: best.href,
    slug: best.slug,
  };
}

function confidenceFromScores(
  top: number,
  second: number,
  action: DiagnosisAction,
  flags: Problem["flags"],
): Confidence {
  if (flags?.includes("misc")) return "low";
  if (top <= 3) return "low";
  if (top >= 8 && top - second >= 3) return "high";
  if (action === "consult" && top < 7) return "low";
  if (top >= 5) return "medium";
  return "low";
}

export function evaluate(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): DiagnosisResult {
  const device = resolveDevice(session, catalog);
  const ctx = createContext(session, catalog, device);
  const problem = ctx.problem;
  const category = catalog.categories.find((item) => item.id === session.categoryId);
  const family = catalog.families.find((item) => item.id === device?.familyId);
  const brand = catalog.brands.find((item) => item.id === device?.brandId);

  const scores = new Map<string, { weight: number; action?: DiagnosisAction }>();

  for (const rule of catalog.rules) {
    if (!evaluateConditions(rule.conditions, ctx)) continue;
    const current = scores.get(rule.causeId) ?? { weight: 0, action: rule.action };
    current.weight += rule.weight;
    if (rule.action) current.action = rule.action;
    scores.set(rule.causeId, current);
  }

  const ranked = [...scores.entries()]
    .map(([causeId, value]) => ({ causeId, ...value }))
    .sort((a, b) => b.weight - a.weight);

  const fallback = catalog.causes.find((cause) => cause.id === "unclear")!;
  const topCause =
    catalog.causes.find((cause) => cause.id === ranked[0]?.causeId) ?? fallback;
  const topWeight = ranked[0]?.weight ?? 0;
  const secondWeight = ranked[1]?.weight ?? 0;

  let action: DiagnosisAction =
    ranked[0]?.action ?? topCause.defaultAction;
  if (problem?.flags?.includes("misc")) action = "consult";
  if (problem?.flags?.includes("liquid")) action = "repair";
  if (problem?.flags?.includes("physical") && topCause.id === "physical-internal") {
    action = "repair";
  }

  let confidence = confidenceFromScores(
    topWeight,
    secondWeight,
    action,
    problem?.flags,
  );
  if (session.mode === "quick" && confidence === "high") {
    confidence = "medium";
  }

  const likelyCauses = (ranked.length ? ranked.slice(0, 3) : [{ causeId: fallback.id }])
    .map((item) => catalog.causes.find((cause) => cause.id === item.causeId))
    .filter((cause): cause is NonNullable<typeof cause> => Boolean(cause))
    .map((cause) => ({
      id: cause.id,
      label: cause.label,
      summary: cause.summary,
    }));

  const needsSpecialist =
    action === "consult" ||
    (confidence === "low" && action !== "self-help") ||
    (Boolean(problem) &&
      session.answers.length >= questionBudget(problem, session.mode ?? "full").max &&
      confidence !== "high");

  let warning: string | undefined;
  if (problem?.flags?.includes("liquid")) {
    const stillOn = session.answers.find((answer) => answer.questionId === "liquid-still-on");
    if (stillOn?.optionId === "yes") warning = LIQUID_WARNING;
    else warning = LIQUID_WARNING;
  }
  if (problem?.flags?.includes("physical")) {
    warning = PHYSICAL_NEEDED;
  }

  return {
    consoleBrand: brand?.label ?? "",
    consoleFamily: family?.label ?? "",
    consoleModel: device?.model ?? "",
    variant: device?.variant,
    problemCategory: category?.label ?? "",
    problem: problem?.label ?? "",
    symptoms: symptomLines(session, catalog),
    likelyCauses: needsSpecialist && likelyCauses.length === 0
      ? [{ id: fallback.id, label: SPECIALIST_NEEDED, summary: fallback.summary }]
      : likelyCauses,
    confidence,
    severity: topCause.severity,
    action,
    actionLabel: ACTION_LABELS[action],
    service: pickService(session, catalog),
    disclaimer: DISCLAIMER,
    warning,
    needsSpecialist,
  };
}

export function shouldShowTroubleshooting(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): boolean {
  if (session.troubleshootingDone) return false;
  const steps = selectTroubleshooting(session, catalog);
  if (steps.length === 0) return false;
  const result = evaluate(session, catalog);
  const problem = catalog.problems.find((item) => item.id === session.problemId);
  if (session.mode === "quick" && !problem?.flags?.includes("software")) {
    return false;
  }
  if (problem?.flags?.includes("software")) return true;
  return result.action === "self-help" || result.action === "monitor";
}

export function pendingVariants(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
) {
  const model = catalog.models.find((item) => item.id === session.modelId);
  const variants = model?.variants ?? [];
  if (variants.length <= 1) return [];
  return variants;
}

export function autoVariantId(model: CatalogModel | undefined): string | undefined {
  if (!model?.variants) return undefined;
  if (model.variants.length === 1) return model.variants[0].id;
  return undefined;
}
