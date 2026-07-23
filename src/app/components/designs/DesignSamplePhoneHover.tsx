"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { PhoneBackSvg } from "@/app/components/case-wizard/PhoneBackSvg";
import { getModelBySlug } from "@/lib/cases/brands.static";
import { designedAssetUrl } from "@/lib/designed-assets";
import type { CaseTemplate } from "@/lib/design/types";
import { cn } from "@/lib/utils";

const HOVER_IPHONE_MODELS = [
  { brandSlug: "apple", modelSlug: "iphone-16-pro" },
  { brandSlug: "apple", modelSlug: "iphone-15-pro" },
  { brandSlug: "apple", modelSlug: "iphone-14-pro" },
  { brandSlug: "apple", modelSlug: "iphone-13" },
  { brandSlug: "apple", modelSlug: "iphone-12" },
] as const;

const designImageClassName = "h-full w-full object-cover object-center";

const slideTransition = {
  duration: 5,
  ease: "easeInOut" as const,
};

function hashTemplateId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function pickHoverIphoneModel(templateId: string) {
  const index = hashTemplateId(templateId) % HOVER_IPHONE_MODELS.length;
  const pick = HOVER_IPHONE_MODELS[index];
  return getModelBySlug(pick.brandSlug, pick.modelSlug);
}

type Props = {
  template: CaseTemplate;
  className?: string;
  active?: boolean;
};

type TrackSize = {
  trackW: number;
  trackH: number;
  phoneW: number;
};

export default function DesignSamplePhoneHover({
  template,
  className,
  active = false,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<TrackSize>({ trackW: 200, trackH: 160, phoneW: 56 });
  const prefersReducedMotion = useReducedMotion();
  const model = pickHoverIphoneModel(template.id);
  const thumbnailSrc = designedAssetUrl(template.thumbnail);

  useEffect(() => {
    if (!model) return;

    const track = trackRef.current;
    const phone = phoneRef.current;
    if (!track || !phone) return;

    const update = () => {
      setSize({
        trackW: track.clientWidth,
        trackH: track.clientHeight,
        phoneW: phone.offsetWidth,
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    ro.observe(phone);
    return () => ro.disconnect();
  }, [model]);

  if (!model) {
    return null;
  }

  const maxSlide = Math.max(0, size.trackW - size.phoneW);
  const shouldAnimate = active && maxSlide > 0 && !prefersReducedMotion;
  const centeredX = maxSlide / 2;

  const phoneX = !active ? 0 : shouldAnimate ? [0, maxSlide, 0] : centeredX;
  const syncX = !active ? 0 : shouldAnimate ? [0, -maxSlide, 0] : -centeredX;

  return (
    <div
      ref={trackRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <Image
        src={thumbnailSrc}
        alt=""
        width={280}
        height={560}
        className={cn("absolute inset-0", designImageClassName)}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        loading="lazy"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-background/10"
        aria-hidden
      />

      <motion.div
        ref={phoneRef}
        className="absolute left-0 top-1/2 z-[1] w-14 shrink-0 sm:w-16"
        style={{ y: "-50%" }}
        animate={{ x: phoneX }}
        transition={{
          ...slideTransition,
          repeat: shouldAnimate ? Infinity : 0,
        }}
      >
        <div
          className="pointer-events-none absolute -inset-5 rounded-full bg-violet-500/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -inset-3 rounded-[1.5rem] bg-cyan-400/30 blur-xl dark:bg-cyan-500/20"
          aria-hidden
        />

        <div
          className="relative rounded-[1.1rem] border border-border/70 bg-gradient-to-b from-zinc-100/80 to-zinc-200/40 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:from-zinc-900/80 dark:to-zinc-950/60"
          style={{ aspectRatio: `${model.canvasWidth}/${model.canvasHeight}` }}
        >
          <div className="absolute inset-[3px] overflow-hidden rounded-[0.85rem] bg-[#0a0a0f]">
            <motion.div
              className="absolute left-0 top-1/2"
              style={{ width: size.trackW, height: size.trackH, y: "-50%" }}
              animate={{ x: syncX }}
              transition={{
                ...slideTransition,
                repeat: shouldAnimate ? Infinity : 0,
              }}
            >
              <Image
                src={thumbnailSrc}
                alt=""
                width={280}
                height={560}
                className={designImageClassName}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
            </motion.div>
          </div>

          <PhoneBackSvg
            model={model}
            className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-md"
            bodyFill="transparent"
            showCamera
          />

          <div
            className="pointer-events-none absolute inset-0 rounded-[0.85rem] bg-gradient-to-tr from-white/10 via-transparent to-cyan-300/10"
            aria-hidden
          />
        </div>
      </motion.div>
    </div>
  );
}
