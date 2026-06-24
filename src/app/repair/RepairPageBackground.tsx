"use client";

import { cn } from "@/lib/utils";
import { useRepairTheme } from "./RepairThemeContext";

export default function RepairPageBackground() {
  const theme = useRepairTheme();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden transition-[opacity] duration-700"
      aria-hidden
    >
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-b transition-[background] duration-700",
          theme.pageWash,
        )}
      />

      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-cover opacity-[0.12]" />

      <div
        className={cn(
          "absolute left-1/2 top-16 h-96 w-96 -translate-x-1/2 rounded-full bg-linear-to-b blur-3xl opacity-45 transition-[background] duration-700",
          theme.glow,
        )}
      />

      <div
        className={cn(
          "absolute -left-28 top-1/4 h-80 w-80 rounded-full blur-3xl opacity-35 transition-[background] duration-700",
          theme.ambient,
        )}
      />

      <div
        className={cn(
          "absolute -right-24 top-[38%] h-72 w-72 rounded-full blur-3xl opacity-30 transition-[background] duration-700",
          theme.ambient,
        )}
      />

      <div
        className={cn(
          "absolute -bottom-36 left-1/4 h-96 w-96 rounded-full blur-3xl opacity-25 transition-[background] duration-700",
          theme.ambient,
        )}
      />

      <div
        className={cn(
          "absolute bottom-0 left-1/2 h-72 w-[36rem] max-w-[120vw] -translate-x-1/2 rounded-full bg-linear-to-t blur-3xl opacity-30 transition-[background] duration-700",
          theme.glow,
        )}
      />
    </div>
  );
}
