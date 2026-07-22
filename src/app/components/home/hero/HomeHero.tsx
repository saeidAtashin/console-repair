import type { CaseTemplate } from "@/lib/design/types";
import HomeHeroBackground from "./HomeHeroBackground";
import HomeHeroContent from "./HomeHeroContent";
import HomeHeroVisual from "./HomeHeroVisual";

type Props = {
  templates: CaseTemplate[];
};

export default function HomeHero({ templates }: Props) {
  return (
    <section
      className="relative isolate overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-32"
      aria-labelledby="home-hero-heading"
    >
      <HomeHeroBackground />

      <div className="relative z-10 mx-auto w-full max-w-[1500px]">
        <div className="grid items-center gap-10 lg:min-h-[85vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-20">
          <div className="order-2 lg:order-1">
            <HomeHeroContent />
          </div>

          <div className="order-1 lg:order-2">
            <HomeHeroVisual templates={templates} />
          </div>
        </div>
      </div>
    </section>
  );
}
