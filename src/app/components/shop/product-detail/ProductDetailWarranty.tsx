import { ShieldCheck, Truck } from "lucide-react";

type Section = { title: string; items: string[] };

type Props = {
  warranty: Section;
  delivery: Section;
};

export default function ProductDetailWarranty({ warranty, delivery }: Props) {
  return (
    <div className="space-y-4">
      <details
        open
        className="group rounded-2xl border border-white/10 bg-zinc-900/40 p-6"
      >
        <summary className="flex cursor-pointer items-center gap-3 font-bold text-white marker:content-none">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />
          {warranty.title}
        </summary>
        <ul className="mt-4 space-y-3">
          {warranty.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-7 text-zinc-400">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              {item}
            </li>
          ))}
        </ul>
      </details>

      <details className="group rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
        <summary className="flex cursor-pointer items-center gap-3 font-bold text-white marker:content-none">
          <Truck className="h-5 w-5 text-cyan-400" />
          {delivery.title}
        </summary>
        <ul className="mt-4 space-y-3">
          {delivery.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-7 text-zinc-400">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              {item}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
