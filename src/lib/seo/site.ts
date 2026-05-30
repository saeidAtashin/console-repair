export const SITE_NAME = "کارگاه CNC | CNC Workshop";
export const SITE_TAGLINE =
  "خدمات CNC، برش لیزر، فرز و تولید محصولات چوب و MDF با قیمت روز بازار";
export const SITE_LOCALE = "fa_IR";
export const DEFAULT_OG_IMAGE = "/images/cnc/og-cnc.svg";
export const SITE_PHONE = "+989107701704";
export const SITE_ADDRESS = {
  streetAddress: "تهران، توپخانه پاساژ لیلا طبقه 4 واحد 21",
  addressLocality: "تهران",
  addressRegion: "تهران",
  addressCountry: "IR",
};

export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3002";
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}
