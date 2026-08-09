export type VerseEra = "classic" | "contemporary";

export type SampleVerse = {
  id: string;
  hemistich1: string;
  hemistich2: string;
  author: string;
  era: VerseEra;
  fontFamily: string;
  featured?: boolean;
};

const CLASSIC_FONT = "UseFont_IranNastaliq";
const CONTEMPORARY_FONT_A = "UseFont_A_Aref_Graffiti";
const CONTEMPORARY_FONT_B = "UseFont_A_Fetne";

export const SAMPLE_VERSES: SampleVerse[] = [
  {
    id: "hafez-1",
    hemistich1: "اگر آن ترک شیرازی به دست آرد دل ما را",
    hemistich2: "به خال هندویش بخشم سمرقند و بخارا را",
    author: "حافظ",
    era: "classic",
    fontFamily: CLASSIC_FONT,
    featured: true,
  },
  {
    id: "saadi-1",
    hemistich1: "بنی‌آدم اعضای یک پیکرند",
    hemistich2: "که در آفرینش ز یک گوهرند",
    author: "سعدی",
    era: "classic",
    fontFamily: CLASSIC_FONT,
  },
  {
    id: "rumi-1",
    hemistich1: "بنمای رخ که باغ و گلستانم آرزوست",
    hemistich2: "بگشای لب که قند فراوانم آرزوست",
    author: "مولانا",
    era: "classic",
    fontFamily: CLASSIC_FONT,
  },
  {
    id: "khayyam-1",
    hemistich1: "برخیز و مخور غم جهان گذران",
    hemistich2: "بنشین و دمی به شادمانی گذران",
    author: "خیام",
    era: "classic",
    fontFamily: CLASSIC_FONT,
  },
  {
    id: "yas-1",
    hemistich1: "حرفمو می‌زنم از ته دل با صدای بلند",
    hemistich2: "تا وقتی که هستم، سکوت مال مرده‌هاست",
    author: "یاس",
    era: "contemporary",
    fontFamily: CONTEMPORARY_FONT_A,
  },
  {
    id: "googoosh-1",
    hemistich1: "منو ببخش اگه دیوونه‌ام هنوز",
    hemistich2: "عاشقتم همون‌طور که از اول بودم",
    author: "گوگوش",
    era: "contemporary",
    fontFamily: CONTEMPORARY_FONT_B,
  },
];

export const FEATURED_VERSE =
  SAMPLE_VERSES.find((v) => v.featured) ?? SAMPLE_VERSES[0];

export const GRID_VERSES = SAMPLE_VERSES.filter((v) => !v.featured);

export function eraLabel(era: VerseEra): string {
  return era === "classic" ? "کلاسیک" : "رپ / پاپ";
}

export function verseStudioText(verse: SampleVerse): string {
  return `${verse.hemistich1}\n${verse.hemistich2}`;
}

export function verseStudioHref(verse: SampleVerse): string {
  const params = new URLSearchParams({
    text: verseStudioText(verse),
    font: verse.fontFamily,
  });
  return `/studio?${params.toString()}`;
}
