"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import OrderStatusBadge from "@/app/components/shop/OrderStatusBadge";
import { formatPriceToman } from "@/lib/format-price";

type Order = {
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
};

export default function AccountOrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/account/orders");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/account/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []));
  }, [user]);

  if (loading || !user) {
    return <p className="text-zinc-400">در حال بارگذاری...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-cyan-400 mb-8">سفارش‌های من</h1>
      {orders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-zinc-400">
          هنوز سفارشی ثبت نکرده‌اید
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.orderNumber}
              href={`/account/orders/${order.orderNumber}`}
              className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30"
            >
              <div>
                <p className="font-bold">{order.orderNumber}</p>
                <p className="text-sm text-zinc-400">
                  {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
              <span className="font-bold text-cyan-400">{formatPriceToman(order.total)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
