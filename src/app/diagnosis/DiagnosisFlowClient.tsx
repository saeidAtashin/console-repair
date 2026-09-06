"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";

import GamingBackground from "@/app/components/ui/GamingBackground";
import { brandThemes, type BrandTheme } from "@/lib/brand-theme";
import {
  applyAnswer,
  applyCategory,
  applyEntryGroup,
  applyFamily,
  applyMode,
  applyModel,
  applyProblem,
  applyTroubleshootingDone,
  applyVariant,
  diagnosisCatalog,
  emptySession,
  getWizardView,
  progressPercent,
  rewindSession,
  type DiagnosisSession,
} from "@/lib/diagnosis";
import { cn } from "@/lib/utils";

import DiagnosisProgress from "./components/DiagnosisProgress";
import OptionGrid from "./components/OptionGrid";
import QuestionView from "./components/QuestionView";
import RepairStep from "./components/RepairStep";
import ResultView from "./components/ResultView";
import SuccessView from "./components/SuccessView";
import TroubleshootingView from "./components/TroubleshootingView";

const STORAGE_KEY = "fixbazi-diagnosis-v2";

const THEMES: Record<string, BrandTheme> = {
  playstation: brandThemes.playstation,
  xbox: brandThemes.xbox,
  nintendo: {
    primary: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-400/30",
    borderHover: "hover:border-red-400/40",
    glow: "from-red-500/20",
    ambient: "bg-red-600/10",
    pageWash: "from-red-600/12 via-transparent to-red-950/25",
    submit:
      "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]",
  },
  gaming: brandThemes.gaming,
};

function themeForSession(session: DiagnosisSession): BrandTheme {
  const group = diagnosisCatalog.entryGroups.find(
    (item) => item.id === session.entryGroupId,
  );
  return THEMES[group?.theme ?? "gaming"] ?? brandThemes.gaming;
}

function canGoBack(session: DiagnosisSession): boolean {
  return Boolean(
    session.entryGroupId ||
      session.phase === "repair" ||
      session.phase === "resolved" ||
      session.troubleshootingDone,
  );
}

export default function DiagnosisFlowClient() {
  const [session, setSession] = useState<DiagnosisSession>(emptySession);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DiagnosisSession;
        if (parsed && Array.isArray(parsed.answers)) {
          setSession(parsed);
        }
      }
    } catch {
      // ignore stored session
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session, hydrated]);

  const view = useMemo(
    () => getWizardView(session, diagnosisCatalog),
    [session],
  );
  const theme = themeForSession(session);
  const progress = progressPercent(session, diagnosisCatalog);

  const title =
    view.type === "pick"
      ? view.title
      : view.type === "question"
        ? view.question.text
        : view.type === "troubleshooting"
          ? "چند تست ساده و امن"
          : view.type === "result"
            ? "نتیجه بررسی اولیه"
            : view.type === "repair"
              ? "ثبت درخواست تعمیر"
              : view.type === "success"
                ? "درخواست ثبت شد"
                : "بررسی تمام شد";

  const subtitle =
    view.type === "pick"
      ? view.subtitle
      : view.type === "question"
        ? view.question.hint
        : view.type === "troubleshooting"
          ? "FixBazi اول چیزهای ساده را چک می‌کند."
          : view.type === "result"
            ? "این یک تشخیص اولیه است، نه نظر قطعی تعمیرکار."
            : view.type === "repair"
              ? "فقط اطلاعات تماس و تحویل مانده."
              : view.type === "resolved"
                ? "اگر دوباره چیزی پیش آمد، همین‌جا برگرد."
                : undefined;

  const handlePick = (id: string) => {
    if (view.type !== "pick") return;
    setSession((current) => {
      switch (view.id) {
        case "brand":
          return applyEntryGroup(current, id, diagnosisCatalog);
        case "family":
          return applyFamily(current, id, diagnosisCatalog);
        case "model":
          return applyModel(current, id, diagnosisCatalog);
        case "variant":
          return applyVariant(current, id, diagnosisCatalog);
        case "mode":
          return applyMode(current, id === "quick" ? "quick" : "full");
        case "category":
          return applyCategory(current, id);
        case "problem":
          return applyProblem(current, id);
        default:
          return current;
      }
    });
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#030510] text-white">
      <GamingBackground />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-linear-to-b",
          theme.pageWash,
        )}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-6">
        <p className={cn("mb-3 text-sm font-bold", theme.primary)}>
          FixBazi در حال بررسی دستگاه توست
        </p>
        <DiagnosisProgress
          value={progress}
          theme={theme}
          label={
            view.type === "question"
              ? `سؤال ${(session.answers.length ?? 0) + 1}`
              : "مراحل بررسی"
          }
        />

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black leading-snug md:text-4xl">{title}</h1>
            {subtitle ? (
              <p className="mt-3 max-w-xl text-base leading-8 text-zinc-400">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={
              view.type === "pick"
                ? view.id
                : view.type === "question"
                  ? view.question.id
                  : view.type
            }
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
          >
            {view.type === "pick" ? (
              <OptionGrid
                options={view.options}
                theme={theme}
                onSelect={handlePick}
                columns={view.id === "brand" ? "brands" : "default"}
              />
            ) : null}

            {view.type === "question" ? (
              <QuestionView
                question={view.question}
                theme={theme}
                onAnswer={(payload) =>
                  setSession((current) =>
                    applyAnswer(current, {
                      questionId: view.question.id,
                      ...payload,
                    }),
                  )
                }
              />
            ) : null}

            {view.type === "troubleshooting" ? (
              <TroubleshootingView
                steps={view.steps}
                theme={theme}
                onResolved={() =>
                  setSession((current) => applyTroubleshootingDone(current, true))
                }
                onContinue={() =>
                  setSession((current) => applyTroubleshootingDone(current, false))
                }
              />
            ) : null}

            {view.type === "result" ? (
              <ResultView
                result={view.result}
                theme={theme}
                onRepair={() =>
                  setSession((current) => ({ ...current, phase: "repair" }))
                }
              />
            ) : null}

            {view.type === "repair" ? (
              <RepairStep
                session={session}
                result={view.result}
                theme={theme}
                onSuccess={(trackingCode) =>
                  setSession((current) => ({
                    ...current,
                    phase: "success",
                    trackingCode,
                  }))
                }
              />
            ) : null}

            {view.type === "success" ? (
              <SuccessView
                trackingCode={view.trackingCode}
                theme={theme}
                onRestart={() => {
                  sessionStorage.removeItem(STORAGE_KEY);
                  setSession(emptySession());
                }}
              />
            ) : null}

            {view.type === "resolved" ? (
              <div className="space-y-6 text-center">
                <div
                  className={cn(
                    "rounded-3xl border bg-white/5 p-8 backdrop-blur-xl",
                    theme.border,
                  )}
                >
                  <p className="text-2xl font-black text-white">خوشحالیم که حل شد</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">
                    اگر دوباره برگشت، می‌توانی بررسی را از نو شروع کنی یا درخواست تعمیر ثبت کنی.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem(STORAGE_KEY);
                    setSession(emptySession());
                  }}
                  className={cn("h-14 w-full rounded-2xl font-bold text-black", theme.submit)}
                >
                  شروع بررسی جدید
                </button>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={!canGoBack(session) || view.type === "success"}
            onClick={() =>
              setSession((current) => rewindSession(current, diagnosisCatalog))
            }
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-zinc-200 disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
            قبلی
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(STORAGE_KEY);
              setSession(emptySession());
            }}
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-zinc-500 hover:text-zinc-300"
          >
            <RotateCcw className="h-4 w-4" />
            از اول
          </button>
        </div>
      </div>
    </div>
  );
}
