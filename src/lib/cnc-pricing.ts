export type PriceRange = {
  min: number;
  max: number;
};

type PriceItem = {
  label: string;
  priceRangeToman: PriceRange;
  note?: string;
};

export const CNC_PRICE_DATA = {
  woodCutting: {
    title: "برش CNC چوب و MDF",
    notes: "قیمت بر اساس ضخامت، جنس و متراژ محاسبه می‌شود.",
    items: [
      {
        label: "برش MDF 3mm (هر m²)",
        priceRangeToman: { min: 150000, max: 250000 },
      },
      {
        label: "برش MDF 8mm (هر m²)",
        priceRangeToman: { min: 200000, max: 350000 },
      },
      {
        label: "برش MDF 16mm (هر m²)",
        priceRangeToman: { min: 300000, max: 450000 },
      },
      {
        label: "برش چوب روسی (هر m²)",
        priceRangeToman: { min: 350000, max: 550000 },
      },
    ] as PriceItem[],
  },
  laserCutting: {
    title: "برش و حکاکی لیزر",
    notes: "قیمت وابسته به جنس، ضخامت و پیچیدگی طرح است.",
    items: [
      {
        label: "برش لیزر MDF (هر m²)",
        priceRangeToman: { min: 180000, max: 300000 },
      },
      {
        label: "برش لیزر اکریلیک (هر m²)",
        priceRangeToman: { min: 200000, max: 400000 },
      },
      {
        label: "حکاکی لیزر (هر m²)",
        priceRangeToman: { min: 250000, max: 500000 },
      },
      {
        label: "حروف برجسته MDF (هر حرف)",
        priceRangeToman: { min: 500000, max: 1200000 },
      },
    ] as PriceItem[],
  },
  decorProducts: {
    title: "محصولات دکور و تابلو",
    notes: "قیمت نهایی پس از بررسی فایل و ابعاد اعلام می‌شود.",
    items: [
      {
        label: "تابلو چوبی CNC",
        priceRangeToman: { min: 800000, max: 3500000 },
      },
      {
        label: "استند / جاکلیدی CNC",
        priceRangeToman: { min: 150000, max: 450000 },
      },
      {
        label: "قطعه دکوراتیو سفارشی",
        priceRangeToman: { min: 300000, max: 2000000 },
      },
      {
        label: "پروتوتایپ قطعه صنعتی",
        priceRangeToman: { min: 500000, max: 5000000 },
      },
    ] as PriceItem[],
  },
  additionalServices: {
    title: "خدمات جانبی",
    items: [
      {
        label: "طراحی فایل (CAD/SVG)",
        priceRangeToman: { min: 200000, max: 800000 },
      },
      {
        label: "رنگ‌آمیزی و پوشش",
        priceRangeToman: { min: 150000, max: 600000 },
      },
      {
        label: "مونتاژ و مونتاژ نهایی",
        priceRangeToman: { min: 100000, max: 500000 },
      },
    ] as PriceItem[],
  },
} as const;

export type CncPriceTabId = "wood" | "laser" | "decor";

export const CNC_PRICE_TABS: {
  id: CncPriceTabId;
  label: string;
  dataKey: keyof typeof CNC_PRICE_DATA;
}[] = [
  { id: "wood", label: "برش چوب", dataKey: "woodCutting" },
  { id: "laser", label: "لیزر", dataKey: "laserCutting" },
  { id: "decor", label: "دکور", dataKey: "decorProducts" },
];

export function formatTomanRange(range: PriceRange): string {
  const fmt = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
      : `${Math.round(n / 1000)}K`;
  return `${fmt(range.min)} - ${fmt(range.max)}`;
}

export function formatTomanPrice(amount: number): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}
