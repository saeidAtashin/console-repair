"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import ProductForm from "@/app/components/shop/ProductForm";

type Category = { id: string; name: string };

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then(async (res) => {
        const data = await res.json();
        setCategories(data.categories ?? []);
      })
      .catch(() => setCategories([]));
  }, []);

  if (!user || user.role !== "admin") {
    return <div className="text-red-400">دسترسی غیرمجاز</div>;
  }

  async function handleSubmit(values: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "خطا");
      router.push(`/admin/products/${data.product.id}/edit`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-cyan-400">محصول جدید</h1>
      <ProductForm categories={categories} onSubmit={handleSubmit} saving={saving} />
    </div>
  );
}
