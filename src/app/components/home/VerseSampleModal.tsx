"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Pencil, X } from "lucide-react";

import { loadCalligraphyFonts } from "@/lib/calligraphy/fonts";
import {
  eraLabel,
  verseStudioHref,
  type SampleVerse,
} from "@/lib/calligraphy/sample-verses";
import { cn } from "@/lib/utils";

type Props = {
  verse: SampleVerse;
  onClose: () => void;
};

export default function VerseSampleModal({ verse, onClose }: Props) {
  const [fontReady, setFontReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void loadCalligraphyFonts([verse.fontFamily]).then(() => {
      if (!cancelled) setFontReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [verse.fontFamily]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`پیش‌نمایش تک‌بیت ${verse.author}`}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" aria-hidden />

      <motion.div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-10"
        initial={
          prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 16 }
        }
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" aria-hidden />

        <div className="relative mb-6 flex items-center justify-between gap-3">
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
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-background/50 p-2 text-muted transition hover:border-cyan-500/40 hover:text-foreground"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        <blockquote
          className="relative flex flex-col gap-4 text-center text-foreground"
          style={{
            fontFamily: fontReady
              ? `"${verse.fontFamily}", var(--font-vazirmatn), sans-serif`
              : "var(--font-vazirmatn), sans-serif",
            lineHeight: verse.era === "classic" ? 2.1 : 1.8,
          }}
        >
          <p
            className={cn(
              "text-2xl leading-[inherit] sm:text-3xl md:text-4xl",
              verse.era === "classic" && "tracking-wide",
            )}
          >
            {verse.hemistich1}
          </p>
          <p
            className={cn(
              "text-2xl leading-[inherit] sm:text-3xl md:text-4xl",
              verse.era === "classic" && "tracking-wide",
            )}
          >
            {verse.hemistich2}
          </p>
        </blockquote>

        <cite className="relative mt-6 block text-center text-base font-bold not-italic text-muted">
          — {verse.author}
        </cite>

        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={verseStudioHref(verse)}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-cyan-400"
          >
            <Pencil className="h-4 w-4" />
            ویرایش در استودیو
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-6 py-3 text-sm font-bold text-foreground transition hover:border-cyan-500/50"
          >
            بستن
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
