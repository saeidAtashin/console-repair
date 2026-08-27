import type {
  Answer,
  Capabilities,
  Condition,
  DiagnosisCatalog,
  DiagnosisSession,
  Problem,
  ProblemFlag,
  ResolvedDevice,
} from "./types";

export type EvaluationContext = {
  session: DiagnosisSession;
  device: ResolvedDevice | null;
  problem: Problem | null;
  answers: Map<string, Answer>;
};

export function answersMap(session: DiagnosisSession): Map<string, Answer> {
  return new Map(session.answers.map((answer) => [answer.questionId, answer]));
}

function matchesScalar(
  actual: string | undefined,
  op: "eq" | "neq" | "in" | "notIn",
  value: string | string[],
): boolean {
  if (op === "eq") {
    return actual === value;
  }
  if (op === "neq") {
    return actual !== value;
  }
  const list = Array.isArray(value) ? value : [value];
  if (op === "in") {
    return actual != null && list.includes(actual);
  }
  return actual == null || !list.includes(actual);
}

function matchesCapability(
  capabilities: Capabilities | null,
  key: keyof Capabilities,
  expected: boolean,
): boolean {
  if (!capabilities) return false;
  return capabilities[key] === expected;
}

function matchesAnswer(
  answers: Map<string, Answer>,
  questionId: string,
  op: "eq" | "neq" | "in" | "notIn" | "answered" | "notAnswered",
  value?: string | string[],
): boolean {
  const answer = answers.get(questionId);

  if (op === "answered") return Boolean(answer);
  if (op === "notAnswered") return !answer;

  const selected = answer?.optionId;
  if (op === "eq") return selected === value;
  if (op === "neq") return selected !== value;

  const list = Array.isArray(value) ? value : value != null ? [value] : [];
  if (op === "in") return selected != null && list.includes(selected);
  return selected == null || !list.includes(selected);
}

function matchesFlag(
  flags: ProblemFlag[] | undefined,
  op: "eq" | "neq",
  value: ProblemFlag,
): boolean {
  const has = flags?.includes(value) ?? false;
  return op === "eq" ? has : !has;
}

export function evaluateCondition(
  condition: Condition,
  ctx: EvaluationContext,
): boolean {
  if ("all" in condition) {
    return condition.all.every((item) => evaluateCondition(item, ctx));
  }
  if ("any" in condition) {
    return condition.any.some((item) => evaluateCondition(item, ctx));
  }

  const { session, device, problem, answers } = ctx;

  switch (condition.field) {
    case "entryGroupId":
      return matchesScalar(session.entryGroupId, condition.op, condition.value);
    case "brandId":
      return matchesScalar(
        session.brandId ?? device?.brandId,
        condition.op,
        condition.value,
      );
    case "familyId":
      return matchesScalar(
        session.familyId ?? device?.familyId,
        condition.op,
        condition.value,
      );
    case "modelId":
      return matchesScalar(
        session.modelId ?? device?.modelId,
        condition.op,
        condition.value,
      );
    case "variantId":
      return matchesScalar(
        session.variantId ?? device?.variantId,
        condition.op,
        condition.value,
      );
    case "deviceId":
      return matchesScalar(device?.id, condition.op, condition.value);
    case "categoryId":
      return matchesScalar(session.categoryId, condition.op, condition.value);
    case "problemId":
      return matchesScalar(session.problemId, condition.op, condition.value);
    case "deviceKind":
      return matchesScalar(device?.kind, condition.op, condition.value);
    case "capability":
      return matchesCapability(device?.capabilities ?? null, condition.key, condition.value);
    case "answer":
      return matchesAnswer(
        answers,
        condition.questionId,
        condition.op,
        condition.value,
      );
    case "flag":
      return matchesFlag(problem?.flags, condition.op, condition.value);
    default:
      return false;
  }
}

export function evaluateConditions(
  conditions: Condition[] | undefined,
  ctx: EvaluationContext,
): boolean {
  if (!conditions || conditions.length === 0) return true;
  return conditions.every((condition) => evaluateCondition(condition, ctx));
}

export function conditionSpecificity(conditions: Condition[] | undefined): number {
  if (!conditions) return 0;

  return conditions.reduce((sum, condition) => {
    if ("all" in condition) return sum + conditionSpecificity(condition.all);
    if ("any" in condition) return sum + conditionSpecificity(condition.any) * 0.5;
    if (condition.field === "answer") return sum + 3;
    if (condition.field === "problemId") return sum + 4;
    if (condition.field === "categoryId") return sum + 2;
    if (condition.field === "capability") return sum + 2;
    if (condition.field === "flag") return sum + 2;
    return sum + 1;
  }, 0);
}

export function createContext(
  session: DiagnosisSession,
  catalog: DiagnosisCatalog,
  device: ResolvedDevice | null,
): EvaluationContext {
  const problem =
    catalog.problems.find((item) => item.id === session.problemId) ?? null;

  return {
    session,
    device,
    problem,
    answers: answersMap(session),
  };
}
