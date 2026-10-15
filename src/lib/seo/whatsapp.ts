import { inferRepairHrefFromPath } from "@/lib/repair-links";
import { absoluteUrl, SITE_BRAND, SITE_WHATSAPP_NUMBER } from "./site";

export type WhatsAppLinkInput = {
  pagePath?: string;
  repairHref?: string;
};

function withUtm(repairHref: string, pagePath: string): string {
  const url = new URL(absoluteUrl(repairHref));
  url.searchParams.set("utm_source", "whatsapp");
  url.searchParams.set("utm_medium", "site");
  url.searchParams.set("utm_campaign", "repair");
  url.searchParams.set("utm_content", pagePath);
  return url.toString();
}

export function buildWhatsAppUrl(input: WhatsAppLinkInput = {}): string {
  const pagePath = input.pagePath?.trim() || "/";
  const repairHref = input.repairHref?.trim() || inferRepairHrefFromPath(pagePath);
  const repairUrl = withUtm(repairHref, pagePath);
  const text = `سلام، از صفحه ${pagePath} در ${SITE_BRAND} آمدم. می‌خواهم درخواست تعمیر ثبت کنم: ${repairUrl}`;
  return `https://wa.me/${SITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
