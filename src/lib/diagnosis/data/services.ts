import type { DiagnosisService } from "../types";

export const services: DiagnosisService[] = [
  {
    id: "ps5-hdmi",
    label: "تعمیر HDMI PS5",
    slug: "hdmi-repair",
    href: "/services/hdmi-repair",
    specificity: 60,
    conditions: [
      { field: "familyId", op: "eq", value: "playstation-5" },
      {
        any: [
          { field: "categoryId", op: "eq", value: "display" },
          { field: "problemId", op: "in", value: ["physical-hdmi", "display-hdmi-damaged"] },
        ],
      },
    ],
  },
  {
    id: "ps4-hdmi",
    label: "تعمیر HDMI PS4",
    slug: "hdmi-repair",
    href: "/services/hdmi-repair",
    specificity: 60,
    conditions: [
      { field: "familyId", op: "eq", value: "playstation-4" },
      {
        any: [
          { field: "categoryId", op: "eq", value: "display" },
          { field: "problemId", op: "in", value: ["physical-hdmi", "display-hdmi-damaged"] },
        ],
      },
    ],
  },
  {
    id: "hdmi",
    label: "تعمیر HDMI",
    slug: "hdmi-repair",
    href: "/services/hdmi-repair",
    specificity: 40,
    conditions: [
      { field: "capability", key: "hdmi", op: "eq", value: true },
      {
        any: [
          { field: "categoryId", op: "eq", value: "display" },
          { field: "problemId", op: "in", value: ["physical-hdmi", "display-hdmi-damaged"] },
        ],
      },
    ],
  },
  {
    id: "controller",
    label: "تعمیر دسته",
    slug: "controller-repair",
    href: "/services/controller-repair",
    specificity: 50,
    conditions: [
      {
        any: [
          { field: "categoryId", op: "eq", value: "controller" },
          { field: "deviceKind", op: "eq", value: "controller" },
        ],
      },
    ],
  },
  {
    id: "ps5",
    label: "تعمیر PS5",
    slug: "ps5-repair",
    href: "/services/ps5-repair",
    specificity: 20,
    conditions: [{ field: "familyId", op: "eq", value: "playstation-5" }],
  },
  {
    id: "ps4",
    label: "تعمیر PS4",
    slug: "ps4-repair",
    href: "/services/ps4-repair",
    specificity: 20,
    conditions: [{ field: "familyId", op: "eq", value: "playstation-4" }],
  },
  {
    id: "xbox",
    label: "تعمیر Xbox",
    slug: "xbox-repair",
    href: "/services/xbox-repair",
    specificity: 20,
    conditions: [{ field: "brandId", op: "eq", value: "microsoft" }],
  },
];
