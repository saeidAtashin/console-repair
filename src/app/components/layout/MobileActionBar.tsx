"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, Wrench } from "lucide-react";

import {
  SITE_TEL_HREF,
  SITE_WHATSAPP_URL,
} from "@/lib/seo/site";

const HIDDEN_PREFIXES = [
  "/admin",
  "/dashboard",
  "/login",
  "/register",
  "/auth",
];

export function shouldHideMobileActionBar(pathname: string) {
  return HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function MobileActionBar() {
  const pathname = usePathname();

  if (shouldHideMobileActionBar(pathname)) return null;

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-90 border-t border-white/10 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
        aria-label="دسترسی سریع موبایل"
      >
        <div className="grid grid-cols-3">
          <a
            href={SITE_TEL_HREF}
            className="flex min-h-14 flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-bold text-zinc-200 touch-manipulation"
          >
            <Phone size={20} className="text-cyan-400" aria-hidden />
            تماس
          </a>
          <a
            href={SITE_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-bold text-zinc-200 touch-manipulation"
          >
            <MessageCircle size={20} className="text-emerald-400" aria-hidden />
            واتساپ
          </a>
          <Link
            href="/repair"
            className="flex min-h-14 flex-col items-center justify-center gap-1 bg-linear-to-t from-blue-600/40 to-cyan-500/20 px-2 py-2 text-xs font-bold text-white touch-manipulation"
          >
            <Wrench size={20} className="text-cyan-300" aria-hidden />
            ثبت تعمیر
          </Link>
        </div>
      </nav>
      <div
        className="h-[calc(3.5rem+env(safe-area-inset-bottom))] lg:hidden"
        aria-hidden
      />
    </>
  );
}
