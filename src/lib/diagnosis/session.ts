import {
  autoVariantId,
  enabledFamilies,
  shouldSkipFamily,
  visibleCategories,
} from "./engine";
import type { Answer, DiagnosisCatalog, DiagnosisSession } from "./types";

export function applyEntryGroup(
  _session: DiagnosisSession,
  entryGroupId: string,
  catalog: DiagnosisCatalog,
): DiagnosisSession {
  const group = catalog.entryGroups.find((item) => item.id === entryGroupId);
  const next: DiagnosisSession = {
    answers: [],
    phase: "flow",
    entryGroupId,
    brandId: group?.brandId,
  };

  if (group && shouldSkipFamily(catalog, entryGroupId)) {
    const families = enabledFamilies(catalog, entryGroupId);
    if (families.length === 1) {
      next.familyId = families[0].id;
      next.brandId = families[0].brandId;
    }
  }

  return next;
}

export function applyFamily(
  session: DiagnosisSession,
  familyId: string,
  catalog: DiagnosisCatalog,
): DiagnosisSession {
  const family = catalog.families.find((item) => item.id === familyId);
  return {
    ...session,
    familyId,
    brandId: family?.brandId ?? session.brandId,
    modelId: undefined,
    variantId: undefined,
    categoryId: undefined,
    problemId: undefined,
    answers: [],
    troubleshootingDone: false,
    troubleshootingResolved: false,
    phase: "flow",
  };
}

export function applyModel(
  session: DiagnosisSession,
  modelId: string,
  catalog: DiagnosisCatalog,
): DiagnosisSession {
  const model = catalog.models.find((item) => item.id === modelId);
  const next: DiagnosisSession = {
    ...session,
    modelId,
    familyId: model?.familyId ?? session.familyId,
    brandId: model?.brandId ?? session.brandId,
    variantId: autoVariantId(model),
    categoryId: undefined,
    problemId: undefined,
    answers: [],
    troubleshootingDone: false,
    troubleshootingResolved: false,
    phase: "flow",
  };

  const categories = visibleCategories(next, catalog);
  if (categories.length === 1) {
    next.categoryId = categories[0].id;
  }

  return next;
}

export function applyVariant(
  session: DiagnosisSession,
  variantId: string,
  catalog: DiagnosisCatalog,
): DiagnosisSession {
  const next: DiagnosisSession = {
    ...session,
    variantId,
    categoryId: undefined,
    problemId: undefined,
    answers: [],
    troubleshootingDone: false,
    troubleshootingResolved: false,
    phase: "flow",
  };
  const categories = visibleCategories(next, catalog);
  if (categories.length === 1) {
    next.categoryId = categories[0].id;
  }
  return next;
}

export function applyCategory(
  session: DiagnosisSession,
  categoryId: string,
): DiagnosisSession {
  return {
    ...session,
    categoryId,
    problemId: undefined,
    answers: [],
    troubleshootingDone: false,
    troubleshootingResolved: false,
    phase: "flow",
  };
}

export function applyProblem(
  session: DiagnosisSession,
  problemId: string,
): DiagnosisSession {
  return {
    ...session,
    problemId,
    answers: [],
    troubleshootingDone: false,
    troubleshootingResolved: false,
    phase: "flow",
  };
}

export function applyAnswer(
  session: DiagnosisSession,
  answer: Answer,
): DiagnosisSession {
  return {
    ...session,
    answers: [
      ...session.answers.filter((item) => item.questionId !== answer.questionId),
      answer,
    ],
  };
}

export function applyTroubleshootingDone(
  session: DiagnosisSession,
  resolved: boolean,
): DiagnosisSession {
  return {
    ...session,
    troubleshootingDone: true,
    troubleshootingResolved: resolved,
    phase: resolved ? "resolved" : "flow",
  };
}

export function rewindSession(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
): DiagnosisSession {
  if (session.phase === "repair") {
    return { ...session, phase: "flow" };
  }
  if (session.phase === "resolved" || session.troubleshootingResolved) {
    return {
      ...session,
      phase: "flow",
      troubleshootingDone: false,
      troubleshootingResolved: false,
    };
  }
  if (session.troubleshootingDone) {
    return { ...session, troubleshootingDone: false };
  }
  if (session.answers.length > 0) {
    return { ...session, answers: session.answers.slice(0, -1) };
  }
  if (session.problemId) {
    return { ...session, problemId: undefined };
  }

  if (session.categoryId) {
    const withoutCategory = { ...session, categoryId: undefined };
    const autoCategory = visibleCategories(withoutCategory, catalog).length <= 1;
    if (!autoCategory) {
      return withoutCategory;
    }
  }

  if (session.variantId) {
    const model = catalog.models.find((item) => item.id === session.modelId);
    if ((model?.variants?.length ?? 0) > 1) {
      return {
        ...session,
        variantId: undefined,
        categoryId: undefined,
        problemId: undefined,
      };
    }
  }

  if (session.modelId) {
    return {
      ...session,
      modelId: undefined,
      variantId: undefined,
      categoryId: undefined,
      problemId: undefined,
    };
  }

  if (session.familyId) {
    if (session.entryGroupId && shouldSkipFamily(catalog, session.entryGroupId)) {
      const families = enabledFamilies(catalog, session.entryGroupId);
      if (families.length === 1) {
        return { answers: [], phase: "flow" };
      }
    }
    return {
      ...session,
      familyId: undefined,
      modelId: undefined,
      variantId: undefined,
      categoryId: undefined,
      problemId: undefined,
    };
  }

  return { answers: [], phase: "flow" };
}
