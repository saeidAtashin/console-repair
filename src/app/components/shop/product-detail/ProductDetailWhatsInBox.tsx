import { Package } from "lucide-react";

type Props = {
  items: string[];
};

export default function ProductDetailWhatsInBox({ items }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <Package className="h-6 w-6 text-cyan-400" />
        <h3 className="text-xl font-black text-white">محتویات جعبه / بسته تحویلی</h3>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/30 px-4 py-3 text-sm text-zinc-300"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-xs text-cyan-300">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
