import type { ProductFeature } from "@/lib/shop";
import type { Brand } from "@/lib/brand-theme";
import { brandThemes } from "@/lib/brand-theme";
import { Sparkles } from "lucide-react";

type Props = {
  overview: string[];
  features: ProductFeature[];
  brand: Brand;
};

export default function ProductDetailOverview({ overview, features, brand }: Props) {
  const theme = brandThemes[brand];

  return (
    <div className="space-y-10">
      <div className="space-y-5">
        {overview.map((paragraph, index) => (
          <p key={index} className="leading-9 text-zinc-300">
            {paragraph}
          </p>
        ))}
      </div>

      <div>
        <h3 className="mb-6 text-xl font-black text-white">ویژگی‌های کلیدی</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 transition hover:border-white/20"
            >
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className={`h-4 w-4 ${theme.primary}`} />
                <h4 className="font-bold text-white">{feature.title}</h4>
              </div>
              <p className="text-sm leading-7 text-zinc-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
