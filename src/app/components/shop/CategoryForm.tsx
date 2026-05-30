"use client";

"use client";

import { useState } from "react";

type Category = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

type Props = {
  initial?: Category & { id?: string };
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onCancel?: () => void;
};

export default function CategoryForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    sortOrder: initial?.sortOrder ?? 0,
    isActive: initial?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ ...form, sortOrder: Number(form.sortOrder) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="space-y-2">
        <span className="text-sm text-zinc-400">نام</span>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          required
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm text-zinc-400">Slug</span>
        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        />
      </label>
      <label className="space-y-2 md:col-span-2">
        <span className="text-sm text-zinc-400">توضیحات</span>
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm text-zinc-400">ترتیب</span>
        <input
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        />
      </label>
      <label className="flex items-center gap-2 self-end pb-3">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
        />
        فعال
      </label>
      <div className="md:col-span-2 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-black hover:bg-cyan-400 disabled:opacity-60"
        >
          {saving ? "..." : "ذخیره"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-white/10 px-6 py-3"
          >
            انصراف
          </button>
        )}
      </div>
    </form>
  );
}
