import type { DiagnosisCatalog } from "../types";
import { categories } from "./categories";
import { causes } from "./causes";
import { brands, entryGroups, families } from "./catalog";
import { models } from "./models";
import { problems } from "./problems";
import { questions } from "./questions";
import { rules } from "./rules";
import { services } from "./services";
import { troubleshooting } from "./troubleshooting";

export const diagnosisCatalog: DiagnosisCatalog = {
  entryGroups,
  brands,
  families,
  models,
  categories,
  problems,
  questions,
  troubleshooting,
  causes,
  rules,
  services,
};

export {
  brands,
  categories,
  causes,
  entryGroups,
  families,
  models,
  problems,
  questions,
  rules,
  services,
  troubleshooting,
};
