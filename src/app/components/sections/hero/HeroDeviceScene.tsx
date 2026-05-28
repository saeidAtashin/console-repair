"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { ArrowLeft } from "lucide-react";
import Tilt from "react-parallax-tilt";
import HeroQuickAccessButton from "./HeroQuickAccessButton";
import {
  consoleIds,
  consoleCatalog,
  resolveConsoleServicePath,
  type ConsoleId,
  type ConsoleServiceKind,
} from "../../../../lib/console-catalog";

const consoleImages: Record<ConsoleId, string> = {
  ps4: "/obj-console/PS4-service-center-in-Delhi.webp",
  ps5: "/obj-console/ps5-repair.webp",
  xbox: "/obj-console/Series_X_Digital_Edition_Layout.jpg",
};

const consoleOptions: { id: ConsoleId; iconSrc: string }[] = [
  { id: "ps5", iconSrc: "/icons/ps5.svg" },
  { id: "ps4", iconSrc: "/icons/ps4.svg" },
  { id: "xbox", iconSrc: "/icons/xbox.svg" },
];

const serviceOptions: { id: ConsoleServiceKind; label: string }[] = [
  { id: "game-install", label: "نصب بازی" },
  { id: "repair", label: "تعمیرات" },
  { id: "shop", label: "خرید" },
];

const PICKER_IMAGE_HEIGHT = 360;
const PICKER_IMAGE_HEIGHT_MOBILE = 210;
const PREVIEW_IMAGE_HEIGHT_MOBILE = 268;
const RAIL_WIDTH = 84;
const RAIL_WIDTH_SM = 72;
const MOBILE_CONSOLE_ROW_HEIGHT = 92;
const SERVICE_ROW_HEIGHT = 76;
const SERVICE_ROW_HEIGHT_MOBILE = 92;

const springSelect = { type: "spring" as const, stiffness: 400, damping: 30 };
const springBtn = { type: "spring" as const, stiffness: 260, damping: 18 };
const springSize = {
  type: "spring" as const,
  stiffness: 200,
  damping: 28,
  mass: 0.95,
};
const HERO_GUIDE_STORAGE_KEY = "hero-device-scene-guide-seen";

function usePreviewImageHeight(isMobile: boolean) {
  const [height, setHeight] = useState(
    isMobile ? PREVIEW_IMAGE_HEIGHT_MOBILE : PICKER_IMAGE_HEIGHT,
  );

  useEffect(() => {
    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqXl = window.matchMedia("(min-width: 1280px)");

    const update = () => {
      if (mqXl.matches) setHeight(480);
      else if (mqSm.matches) setHeight(420);
      else setHeight(PREVIEW_IMAGE_HEIGHT_MOBILE);
    };

    update();
    mqSm.addEventListener("change", update);
    mqXl.addEventListener("change", update);
    return () => {
      mqSm.removeEventListener("change", update);
      mqXl.removeEventListener("change", update);
    };
  }, []);

  return height;
}

function useRailWidth() {
  const [width, setWidth] = useState(RAIL_WIDTH_SM);

  useEffect(() => {
    const mqSm = window.matchMedia("(min-width: 640px)");
    const update = () => setWidth(mqSm.matches ? RAIL_WIDTH : RAIL_WIDTH_SM);
    update();
    mqSm.addEventListener("change", update);
    return () => mqSm.removeEventListener("change", update);
  }, []);

  return width;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

type ConsoleButtonProps = {
  id: ConsoleId;
  iconSrc: string;
  index: number;
  active: boolean;
  label: string;
  isPickerOpen: boolean;
  variant: "rail" | "grid";
  onSelect: (id: ConsoleId) => void;
};

function ConsolePickerButton({
  id,
  iconSrc,
  index,
  active,
  label,
  isPickerOpen,
  variant,
  onSelect,
}: ConsoleButtonProps) {
  const isRail = variant === "rail";

  return (
    <motion.button
      type="button"
      aria-pressed={active}
      tabIndex={isPickerOpen ? 0 : -1}
      initial={false}
      animate={{
        opacity: isPickerOpen ? 1 : 0,
        y: isPickerOpen ? 0 : isRail ? 14 : 10,
        scale: isPickerOpen ? 1 : 0.85,
      }}
      transition={{
        ...springBtn,
        delay: isPickerOpen ? 0.1 + index * 0.07 : 0,
      }}
      onClick={() => onSelect(id)}
      whileTap={{ scale: 0.96 }}
      className={`group relative flex min-h-[44px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-xl border backdrop-blur-md transition-[color,box-shadow] duration-300${
        isRail
          ? "w-[4.5rem] gap-1 px-1.5 py-2 text-[10px] font-semibold sm:w-[5.25rem] sm:gap-1.5 sm:py-2.5 sm:text-xs"
          : "gap-0.5 px-1 py-2.5 text-[11px] font-semibold leading-tight"
      } ${
        active
          ? "border-cyan-400/50 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.35)]"
          : "border-white/15 bg-black/50 text-zinc-300 active:border-cyan-400/35 active:text-zinc-100 sm:hover:border-cyan-400/35 sm:hover:text-zinc-100 sm:hover:shadow-[0_0_18px_rgba(34,211,238,0.12)]"
      }`}
    >
      {active && (
        <motion.span
          layoutId={`hero-console-select-${variant}`}
          className="absolute inset-0 rounded-xl border border-cyan-400/55 bg-cyan-500/25 shadow-[inset_0_0_24px_rgba(34,211,238,0.15)]"
          transition={springSelect}
        />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.22),transparent_65%)] opacity-0 transition-opacity duration-300 group-active:opacity-100 sm:group-hover:opacity-100"
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-cyan-400 transition-all duration-500 ${
          active ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
      <NextImage
        src={iconSrc}
        alt=""
        width={32}
        height={32}
        aria-hidden
        className={`relative z-10 shrink object-cover invert transition-all duration-300 ${
          isRail
            ? "h-20 w-12 sm:h-24 sm:w-14 sm:group-hover:scale-105"
            : "h-14 w-9"
        } ${
          active
            ? "opacity-100 drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]"
            : "opacity-75 sm:opacity-70 sm:group-hover:opacity-95"
        }`}
      />
      <span className="relative z-10 px-0.5 text-2xl -mt-4 text-cyan-300">
        {label}
      </span>
    </motion.button>
  );
}

export default function HeroDeviceScene() {
  const isMobile = useIsMobile();
  const previewHeight = usePreviewImageHeight(isMobile);
  const railWidth = useRailWidth();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.localStorage.getItem(HERO_GUIDE_STORAGE_KEY);
  });
  const [selectedConsole, setSelectedConsole] = useState<ConsoleId | null>(
    null,
  );
  const [selectedService, setSelectedService] =
    useState<ConsoleServiceKind | null>(null);

  const pickerHeight = isMobile
    ? PICKER_IMAGE_HEIGHT_MOBILE
    : PICKER_IMAGE_HEIGHT;
  const imageHeight = isPickerOpen ? pickerHeight : previewHeight;
  const glowSize = isPickerOpen
    ? isMobile
      ? 180
      : 320
    : Math.round(previewHeight * 0.79);
  const serviceRowHeight = isMobile
    ? SERVICE_ROW_HEIGHT_MOBILE
    : SERVICE_ROW_HEIGHT;
  const showSideRail = isPickerOpen && !isMobile;

  const currentPath = useMemo(() => {
    if (!selectedConsole || !selectedService) return null;
    return resolveConsoleServicePath(selectedConsole, selectedService);
  }, [selectedConsole, selectedService]);

  const activeImage = selectedConsole
    ? consoleImages[selectedConsole]
    : consoleImages.ps5;

  useEffect(() => {
    consoleIds.forEach((id) => {
      const img = new window.Image();
      img.src = consoleImages[id];
    });
  }, []);

  useEffect(() => {
    if (showGuide) {
      window.localStorage.setItem(HERO_GUIDE_STORAGE_KEY, "1");
    }
  }, [showGuide]);

  const centerLabel =
    selectedConsole && selectedService
      ? `${serviceOptions.find((s) => s.id === selectedService)?.label} ${consoleCatalog[selectedConsole].title}`
      : "";

  const togglePicker = () => setIsPickerOpen((prev) => !prev);
  const dismissGuide = () => setShowGuide(false);
  const selectConsole = useCallback(
    (id: ConsoleId) => setSelectedConsole(id),
    [],
  );

  const consoleButtons = (variant: "rail" | "grid") =>
    consoleOptions.map(({ id, iconSrc }, index) => (
      <ConsolePickerButton
        key={`${variant}-${id}`}
        id={id}
        iconSrc={iconSrc}
        index={index}
        active={selectedConsole === id}
        label={consoleCatalog[id].title}
        isPickerOpen={isPickerOpen}
        variant={variant}
        onSelect={selectConsole}
      />
    ));

  return (
    <motion.div
      initial={{ opacity: 0, x: 45 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative flex w-full items-start justify-center"
    >
      <div className="pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex">
        <div className="h-[600px] w-[600px] xl:h-[720px] xl:w-[720px] rounded-full border border-cyan-400/10" />
        <div className="absolute h-[500px] w-[500px] xl:h-[600px] xl:w-[600px] rounded-full border border-blue-400/10" />
        <div className="absolute h-[380px] w-[380px] xl:h-[480px] xl:w-[480px] rounded-full border border-white/5" />
      </div>

      <Tilt
        tiltEnable={!isMobile}
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        perspective={1400}
        scale={1.02}
        transitionSpeed={1400}
        glareEnable={!isMobile}
        glareMaxOpacity={0.14}
        glareColor="#9ad7ff"
        className="relative w-full max-w-[720px] xl:max-w-[820px]"
      >
        <div className="relative rounded-[22px] border border-white/10 bg-white/[0.04] p-3.5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:rounded-[30px] sm:p-5 sm:shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          <HeroQuickAccessButton
            onClick={togglePicker}
            isOpen={isPickerOpen}
            className="mb-2 sm:mb-3 sm:mt-[-10px]"
          />

          <div className="relative">
            <div className="flex w-full flex-col sm:flex-row-reverse sm:items-start sm:gap-4">
              {/* Desktop side rail */}
              <motion.div
                initial={false}
                animate={{
                  width: showSideRail ? railWidth : 0,
                  opacity: showSideRail ? 1 : 0,
                }}
                transition={springSize}
                className="z-20 hidden shrink-0 overflow-hidden sm:block"
                aria-hidden={!showSideRail}
              >
                <div
                  style={{ width: railWidth }}
                  className="flex flex-col justify-center gap-2 mb-2 sm:gap-2.5"
                >
                  {consoleButtons("rail")}
                </div>
              </motion.div>

              <div className="flex min-w-0 flex-1 flex-col">
                {/* Mobile horizontal console row */}
                <motion.div
                  initial={false}
                  animate={{
                    height:
                      isPickerOpen && isMobile ? MOBILE_CONSOLE_ROW_HEIGHT : 0,
                    opacity: isPickerOpen && isMobile ? 1 : 0,
                    marginBottom: isPickerOpen && isMobile ? 10 : 0,
                  }}
                  transition={springSize}
                  className="overflow-hidden sm:hidden"
                  aria-hidden={!isPickerOpen || !isMobile}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {consoleButtons("grid")}
                  </div>
                </motion.div>

                <motion.div
                  initial={false}
                  animate={{ height: imageHeight }}
                  transition={springSize}
                  className="relative w-full overflow-hidden rounded-[18px] border border-white/10 bg-[#07101f] sm:rounded-[26px]"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      width: glowSize,
                      height: glowSize,
                      opacity: 0.35,
                    }}
                    transition={springSize}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    style={{ background: "var(--brand)" }}
                  />

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={
                        selectedConsole
                          ? consoleCatalog[selectedConsole].title
                          : "کنسول بازی"
                      }
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>

                  <AnimatePresence>
                    {currentPath && isPickerOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 p-3 backdrop-blur-[2px] sm:bg-black/35 sm:p-0"
                      >
                        <Link
                          href={currentPath}
                          className="group flex max-w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/50 bg-cyan-500/20 px-4 py-3 text-center text-xs font-semibold leading-snug text-white shadow-[0_0_30px_rgba(34,211,238,0.35)] backdrop-blur-md transition active:bg-cyan-500/35 sm:max-w-none sm:px-6 sm:py-3.5 sm:text-base sm:hover:bg-cyan-500/35"
                        >
                          <span className="min-w-0">{centerLabel}</span>
                          <ArrowLeft className="h-4 w-4 shrink-0 transition group-active:-translate-x-1 sm:group-hover:-translate-x-1" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={false}
                  animate={{
                    height: isPickerOpen ? serviceRowHeight : 0,
                    opacity: isPickerOpen ? 1 : 0,
                    marginTop: isPickerOpen ? (isMobile ? 10 : 16) : 0,
                  }}
                  transition={springSize}
                  className="overflow-hidden"
                  aria-hidden={!isPickerOpen}
                >
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {serviceOptions.map(({ id, label }, index) => {
                      const active = selectedService === id;
                      return (
                        <motion.button
                          key={id}
                          type="button"
                          aria-pressed={active}
                          tabIndex={isPickerOpen ? 0 : -1}
                          initial={false}
                          animate={{
                            opacity: isPickerOpen ? 1 : 0,
                            y: isPickerOpen ? 0 : 18,
                            scale: isPickerOpen ? 1 : 0.88,
                          }}
                          transition={{
                            ...springBtn,
                            delay: isPickerOpen ? 0.2 + index * 0.06 : 0,
                          }}
                          onClick={() => setSelectedService(id)}
                          whileTap={{ scale: 0.96 }}
                          className={`group relative flex min-h-[44px] min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border px-1.5 py-3 text-center backdrop-blur-xl transition-[color,box-shadow] duration-300 sm:rounded-2xl sm:px-4 sm:py-3.5 ${
                            active
                              ? "border-cyan-400/50 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.28)]"
                              : "border-white/10 bg-white/[0.04] text-white active:border-cyan-400/30 sm:hover:border-cyan-400/30 sm:hover:shadow-[0_0_16px_rgba(34,211,238,0.1)]"
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="hero-service-select"
                              className="absolute inset-0 rounded-xl border border-cyan-400/40 bg-cyan-500/15 shadow-[inset_0_0_20px_rgba(34,211,238,0.12)] sm:rounded-2xl"
                              transition={springSelect}
                            />
                          )}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.2),transparent_55%)] opacity-0 transition-opacity duration-300 sm:rounded-2xl sm:group-hover:opacity-100"
                          />
                          <span className="relative z-10 text-xs font-semibold leading-tight transition-colors duration-300 sm:text-sm sm:group-hover:text-cyan-200">
                            {label}
                          </span>
                          <span
                            aria-hidden
                            className={`pointer-events-none absolute bottom-0 left-0 h-[2px] bg-cyan-400 transition-all duration-500 ${
                              active
                                ? "w-full opacity-100 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                : "w-0 opacity-0"
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
}
