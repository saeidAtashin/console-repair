"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/app/context/AuthContext";
import OrderStatusBadge from "@/app/components/shop/OrderStatusBadge";
import { formatPriceToman } from "@/lib/format-price";
import { SHOP_ORDER_STATUSES, getShopOrderStatusLabel } from "@/lib/shop-order-status";

type Order = {
  orderNumber: string;
  guestName: string;
  guestPhone: string;
  status: string;
  total: number;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = statusFilter
      ? `/api/admin/shop-orders?status=${statusFilter}`
      : "/api/admin/shop-orders";
    fetch(url)
      .then(async (res) => {
        if (res.status === 401) return;
        const data = await res.json();
        setOrders(data.orders ?? []);
      })
      .finally(() => setLoading(false));
  }, [statusFilter]);

  if (!user || user.role !== "admin") {
    return <div className="text-red-400">دسترسی غیرمجاز</div>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-cyan-400">سفارشات فروش</h1>
          <p className="mt-2 text-zinc-400">مدیریت و پیگیری سفارش‌های فروشگاه</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2"
        >
          <option value="">همه وضعیت‌ها</option>
          {SHOP_ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {getShopOrderStatusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-zinc-400">در حال بارگذاری...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-zinc-400">
          سفارشی یافت نشد
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr>
                <th className="px-4 py-3 text-right">شماره</th>
                <th className="px-4 py-3 text-right">مشتری</th>
                <th className="px-4 py-3 text-right">مبلغ</th>
                <th className="px-4 py-3 text-right">وضعیت</th>
                <th className="px-4 py-3 text-right">تاریخ</th>
                <th className="px-4 py-3 text-right">جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderNumber} className="border-t border-white/10">
                  <td className="px-4 py-4 font-mono">{order.orderNumber}</td>
                  <td className="px-4 py-4">
                    <div>{order.guestName}</div>
                    <div className="text-zinc-500">{order.guestPhone}</div>
                  </td>
                  <td className="px-4 py-4">{formatPriceToman(order.total)}</td>
                  <td className="px-4 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-4 text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/orders/${order.orderNumber}`}
                      className="text-cyan-400 hover:underline"
                    >
                      مشاهده
                    </Link>
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
