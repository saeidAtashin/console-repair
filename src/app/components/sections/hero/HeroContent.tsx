"use client";

import { motion } from "framer-motion";
import HeroFeatures from "./HeroFeatures";
import HeroCtaButtons from "./HeroCtaButtons";

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 1, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <motion.div
        initial={{ opacity: 1, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="mb-6 inline-flex items-center gap-3 rounded-full border border-orange-400/20 bg-white/5 px-4 py-2 backdrop-blur-xl"
      >
        <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_14px_#f97316]" />
        <span className="text-sm font-medium text-orange-200/90">
          کارگاه CNC — قیمت روز بازار
        </span>
      </motion.div>

      <div className="max-w-3xl">
        <motion.h1
          initial={{ opacity: 1, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="font-black sorenanormal leading-[1.05] tracking-tight text-white text-[clamp(2.8rem,5vw,4.5rem)]"
        >
          خدمات CNC
          <span className="mt-2 block text-zinc-200 sorenanormal">
            و تولید محصولات
          </span>
          <span className="mt-3 block sorenanormal bg-[linear-gradient(90deg,#fb923c,#f97316,#fdba74,#fb923c)] bg-[length:220%_220%] bg-clip-text text-transparent animate-gradient-x">
            دقیق، سریع، حرفه‌ای
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 1, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl"
        >
          برش CNC چوب و MDF، برش و حکاکی لیزر، فرز CNC و تولید تابلو و محصولات
          دکور — با قیمت‌های به‌روز و امکان ثبت سفارش آنلاین.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 1, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7 }}
      >
        <HeroFeatures />
      </motion.div>

      <motion.div
        initial={{ opacity: 1, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.7 }}
      >
        <HeroCtaButtons />
      </motion.div>
    </motion.div>
  );
}
