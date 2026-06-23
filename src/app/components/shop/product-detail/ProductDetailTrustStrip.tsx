import { ShieldCheck, Timer, Wrench, RotateCcw } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "تست سلامت" },
  { icon: Timer, label: "تحویل سریع" },
  { icon: Wrench, label: "پشتیبانی فنی" },
  { icon: RotateCcw, label: "ضمانت بازگشت" },
] as const;

type Props = {
  accentClass?: string;
};

export default function ProductDetailTrustStrip({ accentClass = "text-cyan-400" }: Props) {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {TRUST_ITEMS.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/50 px-4 py-3"
        >
          <item.icon className={`h-5 w-5 shrink-0 ${accentClass}`} />
          <span className="text-sm font-medium text-zinc-200">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
