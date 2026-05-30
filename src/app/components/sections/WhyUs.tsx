"use client";

import { ShieldCheck, Clock3, Ruler, BadgeCheck } from "lucide-react";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import FloatingBadge from "../ui/FloatingBadge";

const features = [
  {
    title: "قیمت روز بازار",
    description: "قیمت‌ها به‌روز و شفاف — بدون هزینه پنهان.",
    icon: <ShieldCheck size={32} />,
    badge: { label: "قیمت", value: "شفاف" },
  },
  {
    title: "تحویل سریع",
    description: "اکثر سفارشات در کوتاه‌ترین زمان تولید و تحویل می‌شوند.",
    icon: <Clock3 size={32} />,
    badge: { label: "زمان", value: "۱-۷ روز" },
  },
  {
    title: "دقت CNC",
    description: "برش و فرز با دقت میلی‌متری و تجهیزات حرفه‌ای.",
    icon: <Ruler size={32} />,
    badge: { label: "دقت", value: "mm" },
  },
  {
    title: "کیفیت تضمینی",
    description: "کنترل کیفیت قبل از تحویل هر سفارش.",
    icon: <BadgeCheck size={32} />,
    badge: { label: "کیفیت", value: "تضمین" },
  },
];

export default function WhyUs() {
  const ref = useRef(null);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { margin: "-80px" });

  return (
    <section ref={ref} className="relative py-32">
      <div className="container mx-auto px-6">
        <div className="mb-32 text-center">
          <span className="mb-4 inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-400">
            چرا ما؟
          </span>
          <h2 className="mb-6 text-5xl font-black text-white">
            چرا مشتری‌ها به ما اعتماد می‌کنند؟
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-zinc-400">
            تجربه در CNC، قیمت‌گذاری شفاف و پشتیبانی حرفه‌ای باعث شده مشتریان
            پروژه‌های خود را به ما بسپارند.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 mt-10">
          {features.map((feature, index) => {
            const isBottomRow = index === 0 || index === 3;
            return (
              <div key={feature.title} ref={cardRef} className="relative">
                <motion.div
                  initial={{ y: isBottomRow ? -40 : 40, opacity: 0 }}
                  animate={
                    inView
                      ? { y: isBottomRow ? 60 : -60, opacity: 1 }
                      : { y: isBottomRow ? -40 : 40, opacity: 0 }
                  }
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`absolute left-1/2 -translate-x-1/2 z-0 hidden md:block ${isBottomRow ? "-bottom-12 lg:-bottom-10" : "-top-12 lg:-top-10"}`}
                >
                  <FloatingBadge
                    label={feature.badge.label}
                    value={feature.badge.value}
                    className="border-orange-500/30 bg-black/40"
                    valueClassName="text-orange-400"
                  />
                </motion.div>
                <div className="relative z-10 rounded-3xl border border-zinc-800 bg-white/5 backdrop-blur-xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/40">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                    {feature.icon}
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="leading-7 text-zinc-400">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
