import FadeUp from "@/app/components/animations/FadeUp";
import { Layers, Zap, Cog, PenTool, Puzzle, Signpost } from "lucide-react";

const services = [
  {
    title: "برش CNC چوب و MDF",
    desc: "برش دقیق MDF، HDF و چوب با دستگاه CNC.",
    icon: <Layers className="text-amber-400" size={32} />,
    tag: "Wood",
  },
  {
    title: "برش و حکاکی لیزر",
    desc: "برش و حکاکی روی MDF، اکریلیک و چوب.",
    icon: <Zap className="text-orange-400" size={32} />,
    tag: "Laser",
  },
  {
    title: "فرز CNC",
    desc: "ماشین‌کاری، قالب‌سازی و پروتوتایپ.",
    icon: <Cog className="text-zinc-300" size={32} />,
    tag: "Milling",
  },
  {
    title: "حکاکی و تراش CNC",
    desc: "حکاکی متن، لوگو و تزئینات.",
    icon: <PenTool className="text-orange-300" size={32} />,
    tag: "Engrave",
  },
  {
    title: "قطعات سفارشی",
    desc: "تولید قطعات دکور و صنعتی بر اساس فایل.",
    icon: <Puzzle className="text-amber-300" size={32} />,
    tag: "Custom",
  },
  {
    title: "تابلو و دکور",
    desc: "تابلو، حروف برجسته و محصولات دکوراتیو.",
    icon: <Signpost className="text-orange-400" size={32} />,
    tag: "Decor",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative py-24 bg-[#0505054c]">
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="container relative mx-auto px-6">
        <div className="mb-20 text-right">
          <span className="mb-4 inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 uppercase tracking-widest">
            CNC Workshop / خدمات
          </span>
          <h2 className="mb-6 text-5xl font-black text-white leading-tight">
            لیست کامل{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-400 to-amber-600">
              خدمات CNC
            </span>
          </h2>
          <p className="max-w-2xl text-zinc-500 text-lg">
            از برش MDF تا تولید تابلو و قطعات صنعتی — با قیمت روز بازار.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <FadeUp key={index} delay={index * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 p-8 backdrop-blur-md transition-all duration-500 hover:border-orange-500/50">
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange-500/10 blur-[80px] transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                  <div className="mb-2 text-xs font-mono text-zinc-500 uppercase tracking-tighter">
                    {service.tag}
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">
                    {service.desc}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-all duration-700 group-hover:w-full" />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
