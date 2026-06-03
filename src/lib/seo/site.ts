export const SITE_NAME = "فیکس‌بازی | fix bazi";
export const SITE_TAGLINE =
  "fix bazi (فیکس‌بازی) - تعمیر تخصصی پلی‌استیشن و ایکس‌باکس با گارانتی و قطعات اورجینال";
export const SITE_LOCALE = "fa_IR";
/** Default social preview — use a real 1200×630 asset at /og.jpg when available. */
export const DEFAULT_OG_IMAGE = "/images/ps5-repair.webp";
export const SITE_PHONE = "+989107701704";
export const SITE_ADDRESS = {
  streetAddress: "تهران",
  addressLocality: "تهران",
  addressRegion: "تهران",
  addressCountry: "IR",
};

export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://fixbazi.ir";
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}
