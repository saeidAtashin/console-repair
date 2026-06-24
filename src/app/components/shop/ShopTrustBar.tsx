import { ShieldCheck, Timer, Wrench } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "تضمین تست سلامت" },
  { icon: Timer, label: "تحویل سریع" },
  { icon: Wrench, label: "پشتیبانی فنی پس از خرید" },
] as const;

export default function ShopTrustBar() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {TRUST_ITEMS.map((item) => (
        <div
          key={item.label}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-200"
        >
          <item.icon className="h-4 w-4 text-cyan-400" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
