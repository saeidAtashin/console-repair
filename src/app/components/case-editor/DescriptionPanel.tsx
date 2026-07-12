"use client";

import { useEditorStore } from "@/lib/design/editor-store";

export default function DescriptionPanel() {
  const { document, setDescription, setName } = useEditorStore();

  return (
    <div className="space-y-4">
      <label className="block space-y-1">
        <span className="text-xs text-zinc-400">نام طراحی</span>
        <input
          type="text"
          value={document.name ?? ""}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثلاً: قاب تولدم"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs text-zinc-400">توضیحات (برای سفارش)</span>
        <textarea
          value={document.description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="توضیحات اضافی برای چاپ یا ارسال..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
    </div>
  );
}
