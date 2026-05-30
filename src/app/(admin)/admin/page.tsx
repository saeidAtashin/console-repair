"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, ShoppingBag, AlertTriangle } from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import { formatPriceToman } from "@/lib/format-price";

type Stats = {
  todayOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockProducts: { id: string; name: string; stock: number }[];
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/shop-orders/stats")
      .then(async (res) => {
        if (res.status === 401) return;
        const data = await res.json();
        setStats(data.stats);
      })
      .catch(() => setStats(null));
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-red-400">
        دسترسی غیرمجاز
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-cyan-400">داشبورد فروشگاه</h1>
        <p className="mt-2 text-zinc-400">خلاصه وضعیت فروش و موجودی</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard
          icon={ShoppingBag}
          label="سفارشات امروز"
          value={String(stats?.todayOrders ?? 0)}
        />
        <StatCard
          icon={Package}
          label="در انتظار پردازش"
          value={String(stats?.pendingOrders ?? 0)}
        />
        <StatCard
          icon={ShoppingBag}
          label="درآمد پرداخت‌شده"
          value={formatPriceToman(stats?.totalRevenue ?? 0)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/orders"
          className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/30"
        >
          <h2 className="font-bold text-lg mb-2">مدیریت سفارشات</h2>
          <p className="text-sm text-zinc-400">بررسی و تغییر وضعیت سفارش‌های فروش</p>
        </Link>
        <Link
          href="/admin/products"
          className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/30"
        >
          <h2 className="font-bold text-lg mb-2">مدیریت محصولات</h2>
          <p className="text-sm text-zinc-400">افزودن، ویرایش و مدیریت موجودی</p>
        </Link>
      </div>

      {stats && stats.lowStockProducts.length > 0 && (
        <div className="mt-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6">
          <div className="flex items-center gap-2 mb-4 text-amber-300">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-bold">موجودی کم</h2>
          </div>
          <ul className="space-y-2 text-sm">
            {stats.lowStockProducts.map((p) => (
              <li key={p.id} className="flex justify-between text-zinc-300">
                <span>{p.name}</span>
                <span>{p.stock} عدد</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-3 flex items-center gap-2 text-cyan-400">
        <Icon className="h-5 w-5" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}
