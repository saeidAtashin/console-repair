import { BadgeCheck, Clock3, ShieldCheck, Wrench } from "lucide-react";

export type TrustSignal = {
  icon?: "clock" | "shield" | "price" | "expert";
  label: string;
  value: string;
};

const ICONS = {
  clock: Clock3,
  shield: ShieldCheck,
  price: BadgeCheck,
  expert: Wrench,
} as const;

type Props = {
  signals: TrustSignal[];
  className?: string;
};

export default function TrustSignalsBar({ signals, className = "" }: Props) {
  return (
    <section
      className={`border-t border-white/10 py-16 ${className}`}
      aria-label="مزایای خدمات"
    >
      <div className="container mx-auto px-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {signals.map((signal, index) => {
            const Icon = ICONS[signal.icon ?? "shield"];
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6"
              >
                <Icon className="mb-3 h-6 w-6 text-cyan-400" />
                <p className="text-sm text-zinc-400">{signal.label}</p>
                <p className="mt-1 font-bold leading-7">{signal.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
