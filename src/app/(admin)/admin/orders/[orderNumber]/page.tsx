"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import OrderStatusBadge from "@/app/components/shop/OrderStatusBadge";
import { formatPriceToman } from "@/lib/format-price";
import {
  SHOP_ORDER_STATUSES,
  getShopOrderStatusLabel,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  type PaymentMethod,
  type PaymentStatus,
} from "@/lib/shop-order-status";

type Order = {
  orderNumber: string;
  guestName: string;
  guestPhone: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentRef: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingProvince: string;
  shippingCity: string;
  shippingAddress: string;
  adminNote: string;
  items: { productName: string; unitPrice: number; quantity: number }[];
  createdAt: string;
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/shop-orders/${params.orderNumber}`)
      .then((r) => r.json())
      .then((d) => {
        setOrder(d.order ?? null);
        if (d.order) {
          setStatus(d.order.status);
          setAdminNote(d.order.adminNote ?? "");
        }
      });
  }, [params.orderNumber]);

  if (!user || user.role !== "admin") {
    return <div className="text-red-400">دسترسی غیرمجاز</div>;
  }

  if (!order) return <p className="text-zinc-400">در حال بارگذاری...</p>;

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/shop-orders/${params.orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote }),
      });
      const data = await res.json();
      if (res.ok) setOrder(data.order);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className="text-3xl font-black text-cyan-400">{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-bold mb-4">اقلام</h2>
          <ul className="space-y-2 text-sm">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item.productName} × {item.quantity}</span>
                <span>{formatPriceToman(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-bold text-cyan-400">{formatPriceToman(order.total)}</p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm space-y-2">
          <p><strong>مشتری:</strong> {order.guestName} — {order.guestPhone}</p>
          <p><strong>تحویل:</strong> {order.shippingName} — {order.shippingPhone}</p>
          <p>{order.shippingProvince}، {order.shippingCity}</p>
          <p>{order.shippingAddress}</p>
          <p className="pt-2 border-t border-white/10">
            {PAYMENT_METHOD_LABELS[order.paymentMethod as PaymentMethod]} —{" "}
            {PAYMENT_STATUS_LABELS[order.paymentStatus as PaymentStatus]}
          </p>
          {order.paymentRef && <p>Ref: {order.paymentRef}</p>}
        </section>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 max-w-xl space-y-4">
        <h2 className="font-bold">به‌روزرسانی وضعیت</h2>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          {SHOP_ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {getShopOrderStatusLabel(s)}
            </option>
          ))}
        </select>
        <textarea
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          placeholder="یادداشت داخلی"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 min-h-24"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-black hover:bg-cyan-400 disabled:opacity-60"
        >
          {saving ? "..." : "ذخیره"}
        </button>
      </section>
    </div>
  );
}
