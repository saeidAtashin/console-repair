import type Konva from "konva";
import { jsPDF } from "jspdf";

import { exportStageToPng, downloadDataUrl } from "@/lib/design/export";
import type { ExportTier } from "./types";

const WATERMARK_TEXT = "خوشنویسی آنلاین";

export async function applyWatermark(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.drawImage(img, 0, 0);

      const fontSize = Math.max(16, Math.round(img.width / 18));
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#888888";
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      const step = fontSize * 4;
      for (let y = -canvas.height; y < canvas.height * 2; y += step) {
        for (let x = -canvas.width; x < canvas.width * 2; x += step * 2) {
          ctx.fillText(WATERMARK_TEXT, x, y);
        }
      }
      ctx.restore();

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load image for watermark"));
    img.src = dataUrl;
  });
}

export async function exportCalligraphyPng(
  stage: Konva.Stage,
  tier: ExportTier,
): Promise<string> {
  const pixelRatio = tier === "free" ? 1 : 3;
  const dataUrl = await exportStageToPng(stage, pixelRatio);
  if (tier === "free") {
    return applyWatermark(dataUrl);
  }
  return dataUrl;
}

export async function exportCalligraphyPdf(
  stage: Konva.Stage,
  canvasWidth: number,
  canvasHeight: number,
): Promise<Blob> {
  const dataUrl = await exportCalligraphyPng(stage, "hd-png");
  const orientation = canvasWidth >= canvasHeight ? "landscape" : "portrait";
  const pdfWidth = canvasWidth * 0.264583;
  const pdfHeight = canvasHeight * 0.264583;

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: [pdfWidth, pdfHeight],
  });

  pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
  return pdf.output("blob");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadCalligraphyExport(
  stage: Konva.Stage,
  tier: ExportTier,
  filename: string,
  canvasWidth: number,
  canvasHeight: number,
) {
  if (tier === "pdf") {
    const blob = await exportCalligraphyPdf(stage, canvasWidth, canvasHeight);
    downloadBlob(blob, filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
    return;
  }

  const dataUrl = await exportCalligraphyPng(stage, tier);
  const ext = tier === "free" ? "preview" : "hd";
  downloadDataUrl(
    dataUrl,
    filename.endsWith(".png") ? filename : `${filename}-${ext}.png`,
  );
}
