export const SITE_NAME = "خوشنویسی آنلاین";
export const SITE_TAGLINE =
  "تبدیل متن فارسی به خوشنویسی با فونت‌های نستعلیق، نسخ و خطاطی — پیش‌نمایش رایگان و دانلود با کیفیت بالا";
export const SITE_LOCALE = "fa_IR";
export const DEFAULT_OG_IMAGE = "/banner.webp";
export const SITE_PHONE = "+989107701704";
export const SITE_ADDRESS = {
  streetAddress: "تهران",
  addressLocality: "تهران",
  addressRegion: "تهران",
  addressCountry: "IR",
};

export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://casekadeh.ir";
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}
