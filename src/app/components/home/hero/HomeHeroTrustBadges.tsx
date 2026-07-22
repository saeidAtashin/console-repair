import { Palette, Smartphone, Sparkles, Truck } from "lucide-react";

import { HERO_TRUST_BADGES, type HeroTrustIcon } from "./hero.constants";

const ICONS: Record<HeroTrustIcon, typeof Palette> = {
  Palette,
  Sparkles,
  Truck,
  Smartphone,
};

export default function HomeHeroTrustBadges() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="مزایای قاب‌کده">
      {HERO_TRUST_BADGES.map((badge) => {
        const Icon = ICONS[badge.icon];
        return (
          <li
            key={badge.label}
            className="flex items-center gap-2.5 rounded-2xl border border-border bg-card/50 px-3.5 py-3 backdrop-blur-xl transition hover:border-cyan-500/30 hover:bg-card/70 dark:bg-white/[0.03]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-xs font-semibold leading-snug text-foreground sm:text-sm">
              {badge.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
