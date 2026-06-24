"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  ShoppingBag,
  Sparkles,
  Truck,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type BannerAlign = "right" | "center";

type BannerSlide = {
  image: string;
  tag: string;
  title: string;
  highlight: string;
  subtitle: string;
  chips: string[];
  href: string;
  label: string;
  align: BannerAlign;
  accent: string;
  glow: string;
  icon: LucideIcon;
};

const BANNER_SLIDES: BannerSlide[] = [
  {
    image: "/images/banner1.png",
    tag: "خدمات تخصصی",
    title: "تعمیرات",
    highlight: "تخصصی",
    subtitle: "PS5، PS4 و Xbox با عیب‌یابی دقیق و ضمانت واقعی",
    chips: ["تحویل سریع", "قطعات اصلی", "گارانتی خدمات"],
    href: "/repair",
    label: "ثبت درخواست تعمیر",
    align: "right",
    accent: "from-cyan-300 via-sky-400 to-blue-500",
    glow: "bg-cyan-400/20",
    icon: Gamepad2,
  },
  {
    image: "/images/banner2.png",
    tag: "ارسال فوری",
    title: "تحویل کالا",
    highlight: "در منزل",
    subtitle: "سریع‌ترین زمان ممکن — بدون دردسر، مستقیم تا درب منزل",
    chips: ["پیک اختصاصی", "پیگیری لحظه‌ای", "بسته‌بندی امن"],
    href: "/repair",
    label: "همین حالا سفارش بده",
    align: "right",
    accent: "from-violet-300 via-fuchsia-400 to-cyan-400",
    glow: "bg-violet-400/20",
    icon: Truck,
  },
  {
    image: "/images/banner3.png",
    tag: "فروشگاه آنلاین",
    title: "کنسول و",
    highlight: "لوازم جانبی",
    subtitle: "خرید مطمئن با مشاوره رایگان و ارسال به سراسر کشور",
    chips: ["PS5 / PS4", "دسته بازی", "لوازم جانبی"],
    href: "/shop",
    label: "رفتن به فروشگاه",
    align: "center",
    accent: "from-amber-200 via-orange-300 to-cyan-400",
    glow: "bg-amber-400/20",
    icon: ShoppingBag,
  },
];

const AUTO_PLAY_MS = 5500;
const EASE = [0.22, 1, 0.36, 1] as const;

function makeVariants(
  prefersReducedMotion: boolean | null,
  hidden: Record<string, number>,
  visible: Record<string, number>,
  delay = 0,
): Variants | undefined {
  if (prefersReducedMotion) return undefined;
  return {
    hidden,
    visible: {
      ...visible,
      transition: { duration: 0.65, delay, ease: EASE },
    },
  };
}

function BannerCta({
  href,
  label,
  prefersReducedMotion,
  delay,
  align,
}: {
  href: string;
  label: string;
  prefersReducedMotion: boolean | null;
  delay: number;
  align: BannerAlign;
}) {
  return (
    <motion.div
      variants={makeVariants(
        prefersReducedMotion,
        { opacity: 0, y: 36, scale: 0.88, rotate: -2 },
        { opacity: 1, y: 0, scale: 1, rotate: 0 },
        delay,
      )}
      initial={prefersReducedMotion ? false : "hidden"}
      animate="visible"
      className={cn(
        "mt-6 sm:mt-8",
        align === "center" ? "flex justify-center" : "flex justify-end",
      )}
    >
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: [0, -4, 0],
                boxShadow: [
                  "0 10px 40px rgba(59,130,246,0.35), 0 0 24px rgba(34,211,238,0.2)",
                  "0 16px 55px rgba(34,211,238,0.45), 0 0 36px rgba(34,211,238,0.35)",
                  "0 10px 40px rgba(59,130,246,0.35), 0 0 24px rgba(34,211,238,0.2)",
                ],
              }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
        className="rounded-2xl"
      >
        <Link
          href={href}
          className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500/90 px-6 py-3.5 text-base font-bold text-white shadow-[0_10px_40px_rgba(59,130,246,0.35)] transition duration-300 hover:scale-[1.05] sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
        >
          <span className="absolute inset-0 -translate-x-[120%] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)] transition duration-700 group-hover:translate-x-[120%]" />
          <motion.span
            animate={
              prefersReducedMotion ? undefined : { x: [0, -3, 0] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            }
            className="relative z-10"
          >
            {label}
          </motion.span>
          <motion.span
            animate={
              prefersReducedMotion ? undefined : { x: [0, -4, 0] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }
            }
            className="relative z-10"
          >
            <ArrowLeft className="h-5 w-5 opacity-90" />
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

type BannerContentProps = {
  slide: BannerSlide;
  prefersReducedMotion: boolean | null;
};

function BannerContent({ slide, prefersReducedMotion }: BannerContentProps) {
  const isCentered = slide.align === "center";
  const Icon = slide.icon;

  return (
    <div
      className={cn(
        "absolute inset-0 flex px-5 sm:px-8 md:px-12 lg:px-16",
        isCentered
          ? "items-center justify-center"
          : "items-center justify-end",
      )}
    >
      <motion.div
        key={slide.image}
        variants={makeVariants(
          prefersReducedMotion,
          { opacity: 0, scale: 0.9, y: 24 },
          { opacity: 1, scale: 1, y: 0 },
          0,
        )}
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        className={cn("relative z-10 w-full max-w-lg", isCentered && "mx-auto")}
      >
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -12, 0] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }
          className="relative"
        >
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { scale: [1, 1.08, 1], opacity: [0.5, 0.75, 0.5] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }
            className={cn(
              "pointer-events-none absolute -inset-4 rounded-[32px] blur-3xl",
              slide.glow,
            )}
            aria-hidden
          />

          <div className="relative overflow-hidden rounded-[26px] border border-white/15 bg-black/45 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl sm:rounded-[30px] sm:p-7 md:p-8">
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_40%,rgba(34,211,238,0.07))]"
              aria-hidden
            />

            <motion.div
              variants={makeVariants(
                prefersReducedMotion,
                { opacity: 0, x: isCentered ? 0 : 40, y: isCentered ? -20 : 0 },
                { opacity: 1, x: 0, y: 0 },
                0.08,
              )}
              initial={prefersReducedMotion ? false : "hidden"}
              animate="visible"
              className={cn(
                "mb-4 flex items-center gap-3",
                isCentered ? "justify-center" : "justify-end",
              )}
            >
              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                }
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 shadow-[0_0_24px_rgba(34,211,238,0.15)]",
                  slide.glow,
                )}
              >
                <Icon className="h-5 w-5 text-cyan-200" aria-hidden />
              </motion.div>

              <motion.span
                variants={makeVariants(
                  prefersReducedMotion,
                  { opacity: 0, scale: 0.8 },
                  { opacity: 1, scale: 1 },
                  0.18,
                )}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-cyan-100 sm:text-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
                {slide.tag}
              </motion.span>
            </motion.div>

            <div
              className={cn(
                "space-y-1",
                isCentered ? "text-center" : "text-right",
              )}
            >
              <motion.h2
                variants={makeVariants(
                  prefersReducedMotion,
                  { opacity: 0, x: isCentered ? 0 : 48, filter: "blur(8px)" },
                  { opacity: 1, x: 0, filter: "blur(0px)" },
                  0.22,
                )}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
                className="text-2xl font-black leading-tight text-white sm:text-3xl md:text-[2.1rem]"
              >
                {slide.title}{" "}
                <motion.span
                  variants={makeVariants(
                    prefersReducedMotion,
                    { opacity: 0, y: 20, scale: 0.9 },
                    { opacity: 1, y: 0, scale: 1 },
                    0.38,
                  )}
                  initial={prefersReducedMotion ? false : "hidden"}
                  animate="visible"
                  className={cn(
                    "inline-block bg-gradient-to-l bg-clip-text text-transparent animate-gradient-x bg-[length:220%_220%]",
                    slide.accent,
                  )}
                >
                  {slide.highlight}
                </motion.span>
              </motion.h2>

              <motion.p
                variants={makeVariants(
                  prefersReducedMotion,
                  { opacity: 0, x: isCentered ? 0 : -32, y: 12 },
                  { opacity: 1, x: 0, y: 0 },
                  0.48,
                )}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
                className="text-sm leading-7 text-zinc-300/90 sm:text-base"
              >
                {slide.subtitle}
              </motion.p>
            </div>

            <motion.div
              variants={makeVariants(
                prefersReducedMotion,
                { opacity: 0 },
                { opacity: 1 },
                0.55,
              )}
              initial={prefersReducedMotion ? false : "hidden"}
              animate="visible"
              className={cn(
                "mt-4 flex flex-wrap gap-2 sm:mt-5",
                isCentered ? "justify-center" : "justify-end",
              )}
            >
              {slide.chips.map((chip, index) => (
                <motion.span
                  key={chip}
                  variants={makeVariants(
                    prefersReducedMotion,
                    { opacity: 0, y: 18, scale: 0.85 },
                    { opacity: 1, y: 0, scale: 1 },
                    0.6 + index * 0.1,
                  )}
                  initial={prefersReducedMotion ? false : "hidden"}
                  animate="visible"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.06, y: -2 }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200 backdrop-blur-sm sm:text-sm"
                >
                  {chip}
                </motion.span>
              ))}
            </motion.div>

            <BannerCta
              href={slide.href}
              label={slide.label}
              prefersReducedMotion={prefersReducedMotion}
              delay={0.78}
              align={slide.align}
            />
          </div>

          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, -8, 0], x: [0, 4, 0] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            }
            className="pointer-events-none absolute -top-3 start-4 hidden rounded-xl border border-cyan-400/20 bg-black/50 px-3 py-2 text-[10px] font-bold text-cyan-200 backdrop-blur-md sm:block"
            aria-hidden
          >
            فیکس‌بازی
          </motion.div>

          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, 10, 0], rotate: [0, -4, 0] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }
            className="pointer-events-none absolute -bottom-2 end-6 hidden rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-[10px] font-semibold text-violet-200 backdrop-blur-md sm:block"
            aria-hidden
          >
            ★ پیشنهاد ویژه
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function HomeBannerCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }, []);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const timer = window.setInterval(goNext, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [goNext, isPaused, prefersReducedMotion]);

  const slide = BANNER_SLIDES[activeIndex];
  const isCentered = slide.align === "center";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="بنرهای اصلی"
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div
        className="relative h-[280px] w-full sm:h-[380px] md:h-[460px] lg:h-[500px]"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.image}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute inset-0"
              animate={
                prefersReducedMotion
                  ? undefined
                  : { scale: [1, 1.06, 1] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 9, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <Image
                src={slide.image}
                alt={`${slide.title} ${slide.highlight}`}
                fill
                priority={activeIndex === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>

            <div
              className={cn(
                "absolute inset-0",
                isCentered
                  ? "bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.28)_55%,transparent_100%)]"
                  : "bg-gradient-to-l from-black/80 via-black/40 to-transparent",
              )}
            />

            <BannerContent
              slide={slide}
              prefersReducedMotion={prefersReducedMotion}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={goPrev}
        aria-label="اسلاید قبلی"
        className="absolute start-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-black/60 sm:start-5 sm:h-11 sm:w-11"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      <button
        type="button"
        onClick={goNext}
        aria-label="اسلاید بعدی"
        className="absolute end-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-black/60 sm:end-5 sm:h-11 sm:w-11"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {BANNER_SLIDES.map((item, index) => (
          <button
            key={item.image}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`رفتن به اسلاید ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              index === activeIndex
                ? "w-7 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                : "w-2.5 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </section>
  );
}
