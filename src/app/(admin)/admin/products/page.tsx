"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import { formatPriceToman } from "@/lib/format-price";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category?: { name: string };
};

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then(async (res) => {
        if (res.status === 401) return;
        const data = await res.json();
        setProducts(data.products ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function deleteProduct(id: string) {
    if (!confirm("این محصول حذف شود؟")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-red-400">
        دسترسی غیرمجاز
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-cyan-400">محصولات</h1>
          <p className="mt-2 text-zinc-400">مدیریت کاتالوگ فروشگاه</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-black transition hover:bg-cyan-400"
        >
          <Plus className="h-4 w-4" />
          محصول جدید
        </Link>
      </div>

      {loading ? (
        <p className="text-zinc-400">در حال بارگذاری...</p>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-zinc-400">
          محصولی ثبت نشده است
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr>
                <th className="px-4 py-3 text-right">نام</th>
                <th className="px-4 py-3 text-right">دسته</th>
                <th className="px-4 py-3 text-right">قیمت</th>
                <th className="px-4 py-3 text-right">موجودی</th>
                <th className="px-4 py-3 text-right">وضعیت</th>
                <th className="px-4 py-3 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-white/10">
                  <td className="px-4 py-4 font-medium">{product.name}</td>
                  <td className="px-4 py-4 text-zinc-400">{product.category?.name ?? "—"}</td>
                  <td className="px-4 py-4">{formatPriceToman(product.price)}</td>
                  <td className="px-4 py-4">{product.stock}</td>
                  <td className="px-4 py-4">
                    <span className={product.isActive ? "text-emerald-400" : "text-red-400"}>
                      {product.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-xl border border-white/10 p-2 hover:border-cyan-400/30"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}
                        className="rounded-xl border border-white/10 p-2 text-red-400 hover:border-red-400/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
