import { Gamepad2 } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  className?: string;
  aspectClass?: string;
  variant?: "card" | "compact";
};

export default function GameCoverFallback({
  title,
  className,
  aspectClass = "aspect-[3/4]",
  variant = "card",
}: Props) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-950/90 via-zinc-900 to-violet-950/80",
        aspectClass,
        className,
      )}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden
      />
      <Gamepad2
        className={cn(
          "pointer-events-none absolute text-white/10",
          isCompact ? "h-8 w-8" : "h-16 w-16",
        )}
        aria-hidden
      />
      <p
        className={cn(
          "relative z-[1] line-clamp-3 px-3 text-center font-black leading-tight text-white/95",
          isCompact
            ? "text-[8px] sm:text-[9px]"
            : "text-base sm:text-lg md:text-xl",
        )}
      >
        {title}
      </p>
    </div>
  );
}
