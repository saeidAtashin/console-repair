import FadeUp from "@/app/components/animations/FadeUp";
import ServiceCard from "@/app/components/ui/ServiceCard";
import { services } from "@/app/data/services";

export default function Services() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="container mx-auto px-6">
        <FadeUp>
          <div className="mb-20 text-center">
            <span className="mb-4 inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 text-sm font-medium text-orange-400 backdrop-blur-xl">
              خدمات CNC
            </span>
            <h2 className="mb-6 text-4xl font-black text-white md:text-6xl">
              خدمات CNC و تولید
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
              برش MDF، لیزر، فرز CNC و تولید تابلو و دکور با قیمت روز بازار
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <FadeUp key={service.slug} delay={index * 0.08}>
              <div className="h-full">
                <ServiceCard
                  brand={service.brand}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  slug={service.slug}
                />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
