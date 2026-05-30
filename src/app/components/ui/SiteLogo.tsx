"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  showText?: boolean;
};

export default function SiteLogo({
  className,
  imageClassName,
  textClassName,
  showText = true,
}: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group rounded-xl border border-orange-400/30 bg-orange-500/10 shadow-[0_0_18px_rgba(249,115,22,0.25)] transition-transform group-hover:scale-105 flex items-center gap-3",
        className,
      )}
    >
      {showText && (
        <div className={cn("text-right hidden p-2 sm:block", textClassName)}>
          <p className="text-[11px] font-mono text-orange-500 leading-none tracking-tight">
            CNC Workshop
          </p>
          <p className="mt-1 text-base font-black text-white leading-none">
            کارگاه<span className="text-orange-500"> CNC</span>
          </p>
        </div>
      )}

      <div
        className={cn(
          "relative h-11 w-11 overflow-hidden flex items-center justify-center bg-orange-500/20 rounded-lg",
          imageClassName,
        )}
      >
        <Image
          src="/images/cnc/milling.svg"
          alt="CNC logo"
          width={32}
          height={32}
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
