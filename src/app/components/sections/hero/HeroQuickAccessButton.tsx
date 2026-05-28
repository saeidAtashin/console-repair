"use client";

import { motion } from "framer-motion";
import { ChevronDown, MousePointer2, Sparkles } from "lucide-react";

type HeroQuickAccessButtonProps = {
  onClick: () => void;
  isOpen?: boolean;
  className?: string;
};

const TAP_LOOP = {
  duration: 3.2,
  times: [0, 0.36, 0.46, 0.54, 0.72, 1] as number[],
  ease: "easeInOut" as const,
};

export default function HeroQuickAccessButton({
  onClick,
  isOpen = false,
  className = "",
}: HeroQuickAccessButtonProps) {
  return (
    <motion.button
      type="button"
      aria-expanded={isOpen}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`group flex w-full min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-transparent px-3 py-2.5 text-xl sorenanormal text-blue-500 transition-[color,border-color,background-color] hover:border-blue-400/20 hover:bg-blue-500/5 hover:text-blue-400 sm:min-h-0 sm:justify-start sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-2xl sm:hover:bg-transparent ${className}`}
    >
      <motion.span
        animate={{ rotate: [0, 14, -12, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        className="shrink-0 text-blue-400 transition-colors group-hover:text-cyan-300"
      >
        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
      </motion.span>

      <span className="relative inline-flex items-center px-2 py-1">
        <motion.span
          animate={{ scale: [1, 1, 0.95, 1.04, 1] }}
          transition={{ repeat: Infinity, ...TAP_LOOP }}
          className="relative z-[1] leading-none"
        >
          دسترسی سریع
        </motion.span>

        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400/60 bg-cyan-400/10"
          animate={{ scale: [0, 0, 1.6, 2.4], opacity: [0, 0, 0.55, 0] }}
          transition={{ repeat: Infinity, ...TAP_LOOP }}
        />

        <motion.span
          aria-hidden
          className="pointer-events-none absolute z-10 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.55)] scale-x-[-1]"
          style={{ top: "-0.35rem", insetInlineEnd: "-0.15rem" }}
          animate={{
            x: [5, -70, -70, -70, 5],
            y: [-5, 15, 15, 15, -5],
            scale: [1, 1, 0.78, 1, 1],
            opacity: [0.35, 1, 1, 1, 0.35],
          }}
          transition={{ repeat: Infinity, ...TAP_LOOP }}
        >
          <MousePointer2
            className="h-5 w-5 sm:h-6 sm:w-6"
            strokeWidth={2.25}
            fill="currentColor"
            fillOpacity={0.15}
          />
        </motion.span>
      </span>

      <ChevronDown
        aria-hidden
        className={`ms-auto h-4 w-4 shrink-0 text-blue-400/80 transition-transform duration-300 sm:hidden ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </motion.button>
  );
}
