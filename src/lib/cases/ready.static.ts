import type { ReadyCase } from "./types";

export const READY_CASES: ReadyCase[] = [
  {
    id: "ready-001",
    slug: "galaxy-s24-ultra-space-nebula",
    title: "کهکشان فضایی — S24 Ultra",
    description: "طراحی کهکشانی با رنگ‌های بنفش و آبی روی قاب مات",
    brandSlug: "samsung",
    modelSlug: "galaxy-s24-ultra",
    caseTypeSlug: "matte",
    price: 1_150_000,
    compareAtPrice: 1_350_000,
    image: "/cases/ready/nebula.jpg",
    tags: ["محبوب", "فضایی"],
    inStock: true,
  },
  {
    id: "ready-002",
    slug: "iphone-15-pro-minimal-lines",
    title: "خطوط مینیمال — iPhone 15 Pro",
    description: "طراحی مینیمال با خطوط هندسی سفید روی قاب شفاف",
    brandSlug: "apple",
    modelSlug: "iphone-15-pro",
    caseTypeSlug: "clear",
    price: 990_000,
    image: "/cases/ready/minimal-lines.jpg",
    tags: ["مینیمال"],
    inStock: true,
  },
  {
    id: "ready-003",
    slug: "iphone-15-floral-bloom",
    title: "شکوفه گل — iPhone 15",
    description: "طراحی گل‌دار رنگارنگ با پس‌زمینه صورتی ملایم",
    brandSlug: "apple",
    modelSlug: "iphone-15",
    caseTypeSlug: "silicone",
    price: 870_000,
    image: "/cases/ready/floral.jpg",
    tags: ["گل", "زنانه"],
    inStock: true,
  },
  {
    id: "ready-004",
    slug: "galaxy-s24-cyber-grid",
    title: "شبکه سایبری — Galaxy S24",
    description: "طراحی سایبرپانک با شبکه نئونی سبز",
    brandSlug: "samsung",
    modelSlug: "galaxy-s24",
    caseTypeSlug: "glass",
    price: 1_180_000,
    image: "/cases/ready/cyber-grid.jpg",
    tags: ["گیمینگ", "نئون"],
    inStock: true,
  },
  {
    id: "ready-005",
    slug: "redmi-note-13-pro-marble-gold",
    title: "مرمر طلایی — Redmi Note 13 Pro",
    description: "بافت مرمر سفید با خطوط طلایی",
    brandSlug: "xiaomi",
    modelSlug: "redmi-note-13-pro",
    caseTypeSlug: "matte",
    price: 920_000,
    image: "/cases/ready/marble-gold.jpg",
    tags: ["لوکس"],
    inStock: true,
  },
  {
    id: "ready-006",
    slug: "poco-x6-pro-racing-stripes",
    title: "خطوط مسابقه — Poco X6 Pro",
    description: "طراحی اسپرت با خطوط قرمز و مشکی",
    brandSlug: "xiaomi",
    modelSlug: "poco-x6-pro",
    caseTypeSlug: "matte",
    price: 880_000,
    image: "/cases/ready/racing.jpg",
    tags: ["اسپرت"],
    inStock: true,
  },
];

export function getReadyCases(): ReadyCase[] {
  return READY_CASES;
}

export function getReadyCaseBySlug(slug: string): ReadyCase | undefined {
  return READY_CASES.find((c) => c.slug === slug);
}

export function getReadyCaseById(id: string): ReadyCase | undefined {
  return READY_CASES.find((c) => c.id === id);
}

export function getReadyCasesByModel(
  brandSlug: string,
  modelSlug: string,
): ReadyCase[] {
  return READY_CASES.filter(
    (c) => c.brandSlug === brandSlug && c.modelSlug === modelSlug,
  );
}

export function getModelsWithReadyCases(): {
  brandSlug: string;
  modelSlug: string;
}[] {
  const seen = new Set<string>();
  const result: { brandSlug: string; modelSlug: string }[] = [];

  for (const c of READY_CASES) {
    const key = `${c.brandSlug}/${c.modelSlug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ brandSlug: c.brandSlug, modelSlug: c.modelSlug });
  }

  return result;
}
