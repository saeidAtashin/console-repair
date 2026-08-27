"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { PickOption } from "@/lib/diagnosis";
import type { BrandTheme } from "@/lib/brand-theme";
import { cn } from "@/lib/utils";

type Props = {
  options: PickOption[];
  theme: BrandTheme;
  onSelect: (id: string) => void;
  columns?: "brands" | "default";
};

export default function OptionGrid({
  options,
  theme,
  onSelect,
  columns = "default",
}: Props) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === "brands"
          ? "grid-cols-2 sm:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2",
      )}
    >
      {options.map((option, index) => (
        <motion.button
          key={option.id}
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03, duration: 0.25 }}
          onClick={() => onSelect(option.id)}
          className={cn(
            "group relative flex min-h-[92px] items-center gap-4 overflow-hidden rounded-3xl border bg-white/5 px-5 py-5 text-right backdrop-blur-xl transition hover:bg-white/10",
            theme.border,
            theme.borderHover,
            columns === "brands" && "flex-col items-center justify-center py-7 text-center",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-linear-to-br to-transparent",
              theme.glow,
            )}
          />
          {option.emoji ? (
            <span className="relative z-10 text-3xl leading-none">{option.emoji}</span>
          ) : option.icon ? (
            <Image
              src={option.icon}
              alt=""
              width={56}
              height={56}
              className="relative z-10 h-14 w-14 object-contain invert"
            />
          ) : null}
          <span className="relative z-10 min-w-0">
            <span className="block text-lg font-bold text-white">{option.label}</span>
            {option.hint ? (
              <span className="mt-1 block text-sm leading-6 text-zinc-400">
                {option.hint}
              </span>
            ) : null}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
