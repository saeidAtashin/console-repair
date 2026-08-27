import { MODE_OPTIONS, PICK_COPY } from "./copy";
import {
  enabledFamilies,
  enabledModels,
  evaluate,
  modelsForEntryGroup,
  pendingVariants,
  resolveDevice,
  selectNextQuestion,
  selectTroubleshooting,
  shouldShowTroubleshooting,
  shouldSkipFamily,
  visibleCategories,
  visibleProblems,
} from "./engine";
import type {
  DiagnosisCatalog,
  DiagnosisSession,
  PickOption,
  WizardView,
} from "./types";

export function getWizardView(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): WizardView {
  if (session.phase === "repair") {
    return { type: "repair", result: evaluate(session, catalog) };
  }
  if (session.phase === "success") {
    return { type: "success", trackingCode: session.trackingCode ?? "" };
  }
  if (session.phase === "resolved" || session.troubleshootingResolved) {
    return { type: "resolved" };
  }

  if (!session.entryGroupId) {
    return {
      type: "pick",
      id: "brand",
      ...PICK_COPY.brand,
      options: catalog.entryGroups.map((group) => ({
        id: group.id,
        label: group.label,
        hint: group.subtitle,
        icon: group.icon,
        emoji: group.emoji,
      })),
    };
  }

  if (!session.familyId && !shouldSkipFamily(catalog, session.entryGroupId)) {
    return {
      type: "pick",
      id: "family",
      ...PICK_COPY.family,
      options: enabledFamilies(catalog, session.entryGroupId).map((family) => ({
        id: family.id,
        label: family.label,
      })),
    };
  }

  if (!session.modelId) {
    const models = session.familyId
      ? enabledModels(catalog, session.familyId)
      : modelsForEntryGroup(catalog, session.entryGroupId);
    return {
      type: "pick",
      id: "model",
      ...PICK_COPY.model,
      options: models.map((model) => ({
        id: model.id,
        label: model.label,
      })),
    };
  }

  const variants = pendingVariants(session, catalog);
  if (variants.length > 0 && !session.variantId) {
    return {
      type: "pick",
      id: "variant",
      ...PICK_COPY.variant,
      options: variants.map((variant) => ({
        id: variant.id,
        label: variant.label,
      })),
    };
  }

  if (resolveDevice(session, catalog) && !session.mode) {
    return {
      type: "pick",
      id: "mode",
      ...PICK_COPY.mode,
      options: MODE_OPTIONS.map((option) => ({
        id: option.id,
        label: option.label,
        hint: option.hint,
      })),
    };
  }

  const device = resolveDevice(session, catalog);
  if (device && !session.categoryId) {
    const categories = visibleCategories(session, catalog);
    return {
      type: "pick",
      id: "category",
      ...PICK_COPY.category,
      options: categories.map(
        (category): PickOption => ({
          id: category.id,
          label: category.label,
          hint: category.hint,
          emoji: category.emoji,
        }),
      ),
    };
  }

  if (!session.problemId) {
    return {
      type: "pick",
      id: "problem",
      ...PICK_COPY.problem,
      options: visibleProblems(session, catalog).map((problem) => ({
        id: problem.id,
        label: problem.label,
      })),
    };
  }

  const question = selectNextQuestion(session, catalog);
  if (question) {
    return { type: "question", question };
  }

  if (shouldShowTroubleshooting(session, catalog)) {
    return {
      type: "troubleshooting",
      steps: selectTroubleshooting(session, catalog),
    };
  }

  return { type: "result", result: evaluate(session, catalog) };
}

export function progressPercent(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): number {
  const view = getWizardView(session, catalog);
  const stages = [
    "brand",
    "family",
    "model",
    "variant",
    "mode",
    "category",
    "problem",
    "question",
    "troubleshooting",
    "result",
    "repair",
    "success",
    "resolved",
  ];
  const current =
    view.type === "pick"
      ? view.id
      : view.type;
  const index = Math.max(stages.indexOf(current), 0);
  return Math.round(((index + 1) / stages.length) * 100);
}
