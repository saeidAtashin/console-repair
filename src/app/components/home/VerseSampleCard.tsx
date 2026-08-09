"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import VerseSampleModal from "@/app/components/home/VerseSampleModal";
import { loadCalligraphyFonts } from "@/lib/calligraphy/fonts";
import {
  eraLabel,
  type SampleVerse,
} from "@/lib/calligraphy/sample-verses";
import { cn } from "@/lib/utils";

type Variant = "featured" | "compact";

type Props = {
  verse: SampleVerse;
  variant?: Variant;
  className?: string;
};

export default function VerseSampleCard({
  verse,
  variant = "compact",
  className,
}: Props) {
  const [fontReady, setFontReady] = useState(false);
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const featured = variant === "featured";

  useEffect(() => {
    let cancelled = false;
    void loadCalligraphyFonts([verse.fontFamily]).then(() => {
      if (!cancelled) setFontReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [verse.fontFamily]);

  function openModal() {
    setOpen(true);
  }

  return (
    <>
      <motion.article
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        role="button"
        tabIndex={0}
        aria-label={`باز کردن پیش‌نمایش تک‌بیت ${verse.author}`}
        onClick={openModal}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openModal();
          }
        }}
        className={cn(
          "group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-card/60 text-center shadow-[0_8px_32px_-8px_rgba(0,0,0,0.55)]",
          "transition duration-300 hover:-translate-y-1 hover:border-cyan-400/35 hover:shadow-[0_16px_48px_-12px_rgba(34,211,238,0.25)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
          featured ? "p-8 sm:p-10" : "p-5 sm:p-6",
          className,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-cyan-500/8 via-transparent to-transparent opacity-80"
          aria-hidden
        />

        <div className="relative mb-4 flex items-center justify-center gap-2">
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide",
              verse.era === "classic"
                ? "border-border bg-background/50 text-muted"
                : "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
            )}
          >
            {eraLabel(verse.era)}
          </span>
        </div>

        <blockquote
          className={cn(
            "relative flex flex-col gap-2 text-foreground",
            featured ? "gap-3" : "gap-1.5",
          )}
          style={{
            fontFamily: fontReady
              ? `"${verse.fontFamily}", var(--font-vazirmatn), sans-serif`
              : "var(--font-vazirmatn), sans-serif",
            lineHeight: verse.era === "classic" ? 2 : 1.7,
          }}
        >
          <p
            className={cn(
              "leading-[inherit]",
              featured ? "text-xl sm:text-2xl md:text-3xl" : "text-base sm:text-lg",
              verse.era === "classic" && "tracking-wide",
            )}
          >
            {verse.hemistich1}
          </p>
          <p
            className={cn(
              "leading-[inherit]",
              featured ? "text-xl sm:text-2xl md:text-3xl" : "text-base sm:text-lg",
              verse.era === "classic" && "tracking-wide",
            )}
          >
            {verse.hemistich2}
          </p>
        </blockquote>

        <footer className="relative mt-5">
          <cite className="not-italic text-sm font-bold text-muted">
            — {verse.author}
          </cite>
          <p className="mt-2 text-[11px] text-muted/80 opacity-0 transition group-hover:opacity-100">
            برای بزرگ‌نمایی کلیک کنید
          </p>
        </footer>
      </motion.article>

      {open ? (
        <VerseSampleModal verse={verse} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
