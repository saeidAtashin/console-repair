"use client";

import { useRef, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/cases/api";
import { useEditorStore } from "@/lib/design/editor-store";
import type { ImageLayer } from "@/lib/design/types";

export default function UploadPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addImageLayer, getSelectedLayer, removeLayer } = useEditorStore();
  const selected = getSelectedLayer();
  const imageLayer = selected?.type === "image" && !selected.isSticker ? selected as ImageLayer : null;

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("فقط فایل تصویری مجاز است.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("حداکثر حجم ۵ مگابایت.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      const img = new window.Image();
      img.src = url;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });
      const maxW = 200;
      const ratio = img.width / img.height;
      const w = Math.min(img.width, maxW);
      const h = w / ratio;
      addImageLayer(url, w, h, false);
    } catch {
      setError("خطا در آپلود تصویر.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-600 py-6 text-sm text-muted transition hover:border-cyan-500/50 hover:text-cyan-400 disabled:opacity-50"
      >
        <Upload size={18} />
        {uploading ? "در حال آپلود..." : "انتخاب تصویر"}
      </button>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <p className="text-xs text-muted">JPG, PNG, WebP — حداکثر ۵MB</p>

      {imageLayer ? (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card/60 p-3">
          <span className="text-xs text-muted">تصویر انتخاب‌شده</span>
          <button
            type="button"
            onClick={() => removeLayer(imageLayer.id)}
            className="text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
