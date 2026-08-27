"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import type { Question } from "@/lib/diagnosis";
import type { BrandTheme } from "@/lib/brand-theme";
import { cn } from "@/lib/utils";
import { FormTextarea, ImageUploadField } from "@/app/components/ui/form";

type Props = {
  question: Question;
  theme: BrandTheme;
  onAnswer: (payload: {
    optionId?: string;
    text?: string;
    mediaNote?: string;
  }) => void;
};

export default function QuestionView({ question, theme, onAnswer }: Props) {
  const [text, setText] = useState("");
  const [mediaNote, setMediaNote] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  if (question.type === "single") {
    return (
      <div className="grid gap-3">
        {(question.options ?? []).map((option, index) => (
          <motion.button
            key={option.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25 }}
            onClick={() => onAnswer({ optionId: option.id })}
            className={cn(
              "rounded-3xl border bg-white/5 px-5 py-5 text-right text-lg font-bold text-white backdrop-blur-xl transition hover:bg-white/10",
              theme.border,
              theme.borderHover,
            )}
          >
            {option.label}
            {option.hint ? (
              <span className="mt-1 block text-sm font-medium text-zinc-400">
                {option.hint}
              </span>
            ) : null}
          </motion.button>
        ))}
      </div>
    );
  }

  if (question.type === "media") {
    return (
      <div className="space-y-6">
        <ImageUploadField
          label="عکس (اختیاری)"
          id="diagnosis-media"
          preview={preview}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setPreview(URL.createObjectURL(file));
            setMediaNote(file.name);
          }}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              onAnswer({
                mediaNote: mediaNote || "بدون فایل",
              })
            }
            className={cn(
              "h-14 flex-1 rounded-2xl font-bold text-black",
              theme.submit,
            )}
          >
            ادامه
          </button>
          {question.optional ? (
            <button
              type="button"
              onClick={() => onAnswer({ mediaNote: "رد شد" })}
              className="h-14 flex-1 rounded-2xl border border-white/15 bg-white/5 font-bold text-white"
            >
              حالا نه
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormTextarea
        label=""
        id={question.id}
        rows={5}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="همین‌جا با زبان خودت بنویس..."
        className="resize-none"
      />
      <button
        type="button"
        disabled={!question.optional && text.trim().length < 3}
        onClick={() => onAnswer({ text: text.trim() || "بدون توضیح" })}
        className={cn(
          "h-14 w-full rounded-2xl font-bold text-black disabled:opacity-40",
          theme.submit,
        )}
      >
        ادامه
      </button>
    </div>
  );
}
