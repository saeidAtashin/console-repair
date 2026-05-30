"use client";

import { useState } from "react";

type Category = { id: string; name: string };

type Product = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isGiftReady: boolean;
  giftNote: string;
  categoryId: string;
  images?: { id: string; url: string; alt: string }[];
};

type Props = {
  categories: Category[];
  initial?: Product;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  saving?: boolean;
  onImageUpload?: (file: File) => Promise<void>;
  onImageDelete?: (imageId: string) => Promise<void>;
};

export default function ProductForm({
  categories,
  initial,
  onSubmit,
  saving,
  onImageUpload,
  onImageDelete,
}: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    shortDescription: initial?.shortDescription ?? "",
    price: initial?.price ?? 0,
    compareAtPrice: initial?.compareAtPrice ?? "",
    stock: initial?.stock ?? 0,
    isActive: initial?.isActive ?? true,
    isFeatured: initial?.isFeatured ?? false,
    isGiftReady: initial?.isGiftReady ?? true,
    giftNote: initial?.giftNote ?? "",
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
  });

  function updateField(key: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      ...form,
      compareAtPrice: form.compareAtPrice === "" ? null : Number(form.compareAtPrice),
      price: Number(form.price),
      stock: Number(form.stock),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="نام محصول">
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="input"
            required
          />
        </Field>
        <Field label="Slug">
          <input
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            className="input"
            placeholder="خودکار از نام"
          />
        </Field>
        <Field label="دسته‌بندی">
          <select
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            className="input"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="قیمت (تومان)">
          <input
            type="number"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            className="input"
            required
          />
        </Field>
        <Field label="قیمت قبل از تخفیف">
          <input
            type="number"
            value={form.compareAtPrice}
            onChange={(e) => updateField("compareAtPrice", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="موجودی">
          <input
            type="number"
            value={form.stock}
            onChange={(e) => updateField("stock", e.target.value)}
            className="input"
            required
          />
        </Field>
      </div>

      <Field label="توضیح کوتاه">
        <input
          value={form.shortDescription}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          className="input"
        />
      </Field>

      <Field label="توضیحات کامل">
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="input min-h-32"
        />
      </Field>

      <Field label="یادداشت هدیه">
        <input
          value={form.giftNote}
          onChange={(e) => updateField("giftNote", e.target.value)}
          className="input"
        />
      </Field>

      <div className="flex flex-wrap gap-6">
        <Toggle label="فعال" checked={form.isActive} onChange={(v) => updateField("isActive", v)} />
        <Toggle label="ویژه" checked={form.isFeatured} onChange={(v) => updateField("isFeatured", v)} />
        <Toggle label="مناسب هدیه" checked={form.isGiftReady} onChange={(v) => updateField("isGiftReady", v)} />
      </div>

      {initial?.images && initial.images.length > 0 && (
        <div>
          <p className="mb-3 text-sm text-zinc-400">تصاویر</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {initial.images.map((img) => (
              <div key={img.id} className="relative rounded-2xl overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt} className="aspect-square object-cover w-full" />
                {onImageDelete && (
                  <button
                    type="button"
                    onClick={() => onImageDelete(img.id)}
                    className="absolute top-2 left-2 rounded-lg bg-black/70 px-2 py-1 text-xs text-red-300"
                  >
                    حذف
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {onImageUpload && (
        <Field label="افزودن تصویر">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await onImageUpload(file);
              e.target.value = "";
            }}
            className="input"
          />
        </Field>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-2xl bg-cyan-500 px-8 py-3 font-bold text-black transition hover:bg-cyan-400 disabled:opacity-60"
      >
        {saving ? "در حال ذخیره..." : "ذخیره محصول"}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.75rem 1rem;
          color: white;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-zinc-400">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
