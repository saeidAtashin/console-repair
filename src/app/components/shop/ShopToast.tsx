"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type Props = {
  message: string | null;
  onDismiss: () => void;
};

const TOAST_DURATION_MS = 2500;

export default function ShopToast({ message, onDismiss }: Props) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-6 start-6 z-[220] flex max-w-sm items-center gap-3 rounded-2xl border border-cyan-400/30 bg-zinc-950/95 px-4 py-3 text-sm text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400" aria-hidden />
          <span>{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
