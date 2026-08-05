"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Lock, ShoppingCart } from "lucide-react";
import type Konva from "konva";

import {
  canDownloadTier,
  downloadCalligraphyExport,
  exportCalligraphyPng,
  getExportPrice,
  getExportTierDescription,
  getExportTierLabel,
  isPremiumFont,
} from "@/lib/calligraphy";
import { saveWork } from "@/lib/calligraphy/storage";
import { useCalligraphyStore } from "@/lib/calligraphy/store";
import { useShopCart } from "@/app/context/ShopCartContext";
import { formatToman } from "@/lib/shop/format";

type Props = {
  stage: Konva.Stage | null;
};

export default function ExportPanel({ stage }: Props) {
  const document = useCalligraphyStore((s) => s.document);
  const setPreviewUrl = useCalligraphyStore((s) => s.setPreviewUrl);
  const { addCalligraphyExport } = useShopCart();
  const [downloading, setDownloading] = useState<string | null>(null);

  async function capturePreview(): Promise<string> {
    if (!stage) return document.previewUrl ?? "";
    const dataUrl = await exportCalligraphyPng(stage, "free");
    setPreviewUrl(dataUrl);
    return dataUrl;
  }

  async function handleFreeDownload() {
    if (!stage) return;
    setDownloading("free");
    try {
      await downloadCalligraphyExport(
        stage,
        "free",
        document.name || "calligraphy",
        document.canvas.width,
        document.canvas.height,
      );
      const preview = await exportCalligraphyPng(stage, "free");
      saveWork({ ...document, previewUrl: preview });
    } finally {
      setDownloading(null);
    }
  }

  async function handlePaidDownload(tier: "hd-png" | "pdf") {
    if (!stage) return;

    if (canDownloadTier(document.id, tier)) {
      setDownloading(tier);
      try {
        await downloadCalligraphyExport(
          stage,
          tier,
          document.name || "calligraphy",
          document.canvas.width,
          document.canvas.height,
        );
      } finally {
        setDownloading(null);
      }
      return;
    }

    const previewUrl = await capturePreview();
    const price = getExportPrice(tier, document.fontFamily);
    const tierLabel = getExportTierLabel(tier);

    addCalligraphyExport({
      designId: document.id,
      tier,
      fontFamily: document.fontFamily,
      previewUrl,
      unitPrice: price,
      title: `${document.name} — ${tierLabel}`,
    });
    saveWork({ ...document, previewUrl });
  }

  const hdPrice = getExportPrice("hd-png", document.fontFamily);
  const pdfPrice = getExportPrice("pdf", document.fontFamily);
  const hdUnlocked = canDownloadTier(document.id, "hd-png");
  const pdfUnlocked = canDownloadTier(document.id, "pdf");
  const premiumFont = isPremiumFont(document.fontFamily);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-5">
      <h3 className="text-lg font-black text-foreground">دانلود و خرید</h3>

      {premiumFont ? (
        <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
          فونت ویژه انتخاب شده — هزینه اضافی برای خروجی HD اعمال می‌شود.
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void handleFreeDownload()}
        disabled={!stage || downloading !== null}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-bold text-foreground transition hover:border-cyan-500/50 disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        {downloading === "free" ? "در حال دانلود…" : "دانلود رایگان (واترمارک)"}
      </button>
      <p className="text-xs text-muted">{getExportTierDescription("free")}</p>

      <div className="space-y-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => void handlePaidDownload("hd-png")}
          disabled={!stage || downloading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {hdUnlocked ? (
            <Download className="h-4 w-4" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          {downloading === "hd-png"
            ? "در حال دانلود…"
            : hdUnlocked
              ? "دانلود PNG با کیفیت بالا"
              : `خرید PNG HD — ${formatToman(hdPrice)}`}
        </button>
        <p className="text-xs text-muted">{getExportTierDescription("hd-png")}</p>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => void handlePaidDownload("pdf")}
          disabled={!stage || downloading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/50 bg-cyan-500/10 py-3 text-sm font-bold text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
        >
          {pdfUnlocked ? (
            <Download className="h-4 w-4" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          {downloading === "pdf"
            ? "در حال دانلود…"
            : pdfUnlocked
              ? "دانلود PDF"
              : `خرید PDF — ${formatToman(pdfPrice)}`}
        </button>
        <p className="text-xs text-muted">{getExportTierDescription("pdf")}</p>
      </div>

      <Link
        href="/pricing"
        className="block text-center text-xs text-cyan-400 hover:underline"
      >
        مشاهده تعرفه‌ها
      </Link>
    </div>
  );
}
