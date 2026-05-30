"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/app/context/AuthContext";
import CategoryForm from "@/app/components/shop/CategoryForm";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
};

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  if (!user || user.role !== "admin") {
    return <div className="text-red-400">دسترسی غیرمجاز</div>;
  }

  async function handleCreate(values: Record<string, unknown>) {
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setEditing(null);
      await load();
    }
  }

  async function handleUpdate(values: Record<string, unknown>) {
    if (!editing) return;
    const res = await fetch(`/api/admin/categories/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setEditing(null);
      await load();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("این دسته حذف شود؟")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-cyan-400">دسته‌بندی‌ها</h1>

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 font-bold">{editing ? "ویرایش دسته" : "دسته جدید"}</h2>
        <CategoryForm
          key={editing?.id ?? "new"}
          initial={editing ?? undefined}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => setEditing(null)}
        />
      </div>

      {loading ? (
        <p className="text-zinc-400">در حال بارگذاری...</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
            >
              <div>
                <p className="font-bold">{cat.name}</p>
                <p className="text-sm text-zinc-400">
                  /shop/{cat.slug} · {cat.productCount ?? 0} محصول
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(cat)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:border-cyan-400/30"
                >
                  ویرایش
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-red-400 hover:border-red-400/30"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
