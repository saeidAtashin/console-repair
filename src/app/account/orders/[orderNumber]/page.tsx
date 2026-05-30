"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import OrderStatusBadge from "@/app/components/shop/OrderStatusBadge";
import { formatPriceToman } from "@/lib/format-price";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  type PaymentMethod,
  type PaymentStatus,
} from "@/lib/shop-order-status";

type Order = {
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingProvince: string;
  shippingCity: string;
  shippingAddress: string;
  items: { productName: string; unitPrice: number; quantity: number }[];
  createdAt: string;
};

export default function AccountOrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/account/orders")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.orders ?? []).find(
          (o: Order) => o.orderNumber === params.orderNumber,
        );
        setOrder(found ?? null);
      });
  }, [user, params.orderNumber]);

  if (loading || !user) return <p className="text-zinc-400">...</p>;
  if (!order) return <p className="text-zinc-400">سفارش یافت نشد</p>;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className="text-3xl font-black text-cyan-400">{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-bold mb-4">اقلام سفارش</h2>
          <ul className="space-y-3">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatPriceToman(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-white/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">جمع</span>
              <span>{formatPriceToman(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">ارسال</span>
              <span>{formatPriceToman(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>مجموع</span>
              <span className="text-cyan-400">{formatPriceToman(order.total)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3 text-sm">
          <h2 className="font-bold mb-4">اطلاعات تحویل</h2>
          <p>{order.shippingName} — {order.shippingPhone}</p>
          <p>{order.shippingProvince}، {order.shippingCity}</p>
          <p>{order.shippingAddress}</p>
          <div className="pt-4 border-t border-white/10">
            <p>
              پرداخت:{" "}
              {PAYMENT_METHOD_LABELS[order.paymentMethod as PaymentMethod]}
            </p>
            <p>
              وضعیت پرداخت:{" "}
              {PAYMENT_STATUS_LABELS[order.paymentStatus as PaymentStatus]}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
