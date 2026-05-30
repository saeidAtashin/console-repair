export type Brand = "wood" | "metal" | "laser" | "industrial";

export const brandThemes: Record<
  Brand,
  {
    primary: string;
    bg: string;
    border: string;
    glow: string;
  }
> = {
  wood: {
    primary: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-400/30",
    glow: "from-amber-500/20",
  },
  metal: {
    primary: "text-zinc-300",
    bg: "bg-zinc-500/10",
    border: "border-zinc-400/30",
    glow: "from-zinc-500/20",
  },
  laser: {
    primary: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-400/30",
    glow: "from-orange-500/20",
  },
  industrial: {
    primary: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-400/30",
    glow: "from-orange-500/20",
  },
};
