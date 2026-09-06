export type DeviceKind = "console" | "controller";

export type QuestionType = "single" | "text" | "media";

export type Complexity = "simple" | "medium" | "complex";

export type Confidence = "low" | "medium" | "high";

export type Severity = "low" | "medium" | "high";

export type DiagnosisAction = "self-help" | "monitor" | "consult" | "repair";

export type ProblemFlag =
  | "liquid"
  | "misc"
  | "software"
  | "physical"
  | "skip-troubleshooting";

export type CapabilityKey =
  | "discDrive"
  | "hdmi"
  | "display"
  | "usb"
  | "wifi"
  | "ethernet"
  | "analogSticks"
  | "touchpad"
  | "vibration"
  | "battery"
  | "fan";

export type Capabilities = Record<CapabilityKey, boolean>;

export type Condition =
  | {
      field:
        | "entryGroupId"
        | "brandId"
        | "familyId"
        | "modelId"
        | "variantId"
        | "deviceId"
        | "categoryId"
        | "problemId"
        | "deviceKind";
      op: "eq" | "neq" | "in" | "notIn";
      value: string | string[];
    }
  | {
      field: "capability";
      key: CapabilityKey;
      op: "eq";
      value: boolean;
    }
  | {
      field: "answer";
      questionId: string;
      op: "eq" | "neq" | "in" | "notIn" | "answered" | "notAnswered";
      value?: string | string[];
    }
  | {
      field: "flag";
      op: "eq" | "neq";
      value: ProblemFlag;
    }
  | { all: Condition[] }
  | { any: Condition[] };

export type Option = {
  id: string;
  label: string;
  hint?: string;
};

export type Question = {
  id: string;
  priority: number;
  diagnosticValue: number;
  text: string;
  hint?: string;
  type: QuestionType;
  options?: Option[];
  conditions?: Condition[];
  optional?: boolean;
};

export type Answer = {
  questionId: string;
  optionId?: string;
  text?: string;
  mediaNote?: string;
};

export type CatalogVariant = {
  id: string;
  label: string;
  capabilityOverrides?: Partial<Capabilities>;
};

export type CatalogModel = {
  id: string;
  familyId: string;
  brandId: string;
  kind: DeviceKind;
  label: string;
  enabled: boolean;
  unknown?: boolean;
  capabilities: Capabilities;
  variants?: CatalogVariant[];
  sortOrder: number;
};

export type DiagnosisMode = "quick" | "full";

export type CatalogFamily = {
  id: string;
  brandId: string;
  entryGroupId: string;
  kind: DeviceKind;
  label: string;
  enabled: boolean;
  sortOrder: number;
  repairConsoleId?: "ps5" | "ps4" | "xbox";
  apiHints?: string[];
};

export type EntryGroup = {
  id: string;
  label: string;
  subtitle: string;
  kind: DeviceKind;
  brandId?: string;
  icon: string;
  emoji?: string;
  theme: "playstation" | "xbox" | "nintendo" | "gaming";
};

export type ProblemCategory = {
  id: string;
  label: string;
  emoji: string;
  hint?: string;
  deviceKinds: DeviceKind[];
  requiredCapability?: CapabilityKey;
  sortOrder: number;
  apiHints?: string[];
};

export type Problem = {
  id: string;
  categoryId: string;
  label: string;
  complexity: Complexity;
  flags?: ProblemFlag[];
  conditions?: Condition[];
  sortOrder: number;
};

export type TroubleshootingStep = {
  id: string;
  title: string;
  description: string;
  safe: true;
  requiresTools: false;
  conditions?: Condition[];
};

export type Cause = {
  id: string;
  label: string;
  summary: string;
  severity: Severity;
  defaultAction: DiagnosisAction;
  serviceId?: string;
};

export type Rule = {
  id: string;
  conditions: Condition[];
  causeId: string;
  weight: number;
  action?: DiagnosisAction;
};

export type DiagnosisService = {
  id: string;
  label: string;
  slug: string;
  href: string;
  conditions?: Condition[];
  specificity: number;
};

export type ResolvedDevice = {
  id: string;
  modelId: string;
  variantId?: string;
  familyId: string;
  brandId: string;
  kind: DeviceKind;
  model: string;
  variant?: string;
  label: string;
  unknown?: boolean;
  capabilities: Capabilities;
};

export type DiagnosisResult = {
  consoleBrand: string;
  consoleFamily: string;
  consoleModel: string;
  variant?: string;
  problemCategory: string;
  problem: string;
  symptoms: string[];
  likelyCauses: { id: string; label: string; summary: string }[];
  confidence: Confidence;
  severity: Severity;
  action: DiagnosisAction;
  actionLabel: string;
  service?: { id: string; label: string; href: string; slug: string };
  disclaimer: string;
  warning?: string;
  needsSpecialist: boolean;
};

export type DiagnosisSession = {
  entryGroupId?: string;
  brandId?: string;
  familyId?: string;
  modelId?: string;
  variantId?: string;
  mode?: DiagnosisMode;
  categoryId?: string;
  problemId?: string;
  answers: Answer[];
  troubleshootingDone?: boolean;
  troubleshootingResolved?: boolean;
  phase?: "flow" | "repair" | "success" | "resolved";
  trackingCode?: string;
};

export type DiagnosisCatalog = {
  entryGroups: EntryGroup[];
  brands: { id: string; label: string }[];
  families: CatalogFamily[];
  models: CatalogModel[];
  categories: ProblemCategory[];
  problems: Problem[];
  questions: Question[];
  troubleshooting: TroubleshootingStep[];
  causes: Cause[];
  rules: Rule[];
  services: DiagnosisService[];
};

export type PickOption = {
  id: string;
  label: string;
  hint?: string;
  emoji?: string;
  icon?: string;
};

export type WizardView =
  | {
      type: "pick";
      id:
        | "brand"
        | "family"
        | "model"
        | "variant"
        | "mode"
        | "category"
        | "problem";
      title: string;
      subtitle?: string;
      options: PickOption[];
    }
  | { type: "question"; question: Question }
  | { type: "troubleshooting"; steps: TroubleshootingStep[] }
  | { type: "result"; result: DiagnosisResult }
  | { type: "repair"; result: DiagnosisResult }
  | { type: "success"; trackingCode: string }
  | { type: "resolved" };
