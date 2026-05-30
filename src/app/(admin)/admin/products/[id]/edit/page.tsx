"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import ProductForm from "@/app/components/shop/ProductForm";

type Category = { id: string; name: string };

type Product = {
  id: string;
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
  images: { id: string; url: string; alt: string }[];
};

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch(`/api/admin/products/${params.id}`).then((r) => r.json()),
    ]).then(([catData, prodData]) => {
      setCategories(catData.categories ?? []);
      setProduct(prodData.product ?? null);
    });
  }, [params.id]);

  if (!user || user.role !== "admin") {
    return <div className="text-red-400">دسترسی غیرمجاز</div>;
  }

  if (!product) {
    return <p className="text-zinc-400">در حال بارگذاری...</p>;
  }

  async function handleSubmit(values: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${product!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProduct(data.product);
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`/api/admin/products/${product!.id}/images`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) setProduct(data.product);
  }

  async function handleImageDelete(imageId: string) {
    const res = await fetch(
      `/api/admin/products/${product!.id}/images?imageId=${imageId}`,
      { method: "DELETE" },
    );
    const data = await res.json();
    if (res.ok) setProduct(data.product);
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-cyan-400">ویرایش محصول</h1>
      <ProductForm
        categories={categories}
        initial={product}
        onSubmit={handleSubmit}
        saving={saving}
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
      />
    </div>
  );
}
