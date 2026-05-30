"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cog, Phone, Search } from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import OrderFormClient from "@/app/order/OrderFormClient";
import { getOrderStatusLabel } from "@/lib/order-status";
import { SITE_PHONE } from "@/lib/seo/site";

type Order = {
  trackingCode: string;
  name: string;
  phone: string;
  device: string;
  issue: string;
  description: string;
  status: string;
  createdAt: string;
};

const DISPLAY_PHONE = "09107701704";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/dashboard/orders");
      if (res.status === 401) {
        setOrders([]);
        return;
      }
      const data = await res.json();
      setOrders(data.orders ?? []);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || !user || user.role !== "user") return;

    let cancelled = false;

    async function fetchOrders() {
      try {
        const res = await fetch("/api/dashboard/orders");
        if (cancelled) return;
        if (res.status === 401) {
          setOrders([]);
          return;
        }
        const data = await res.json();
        setOrders(data.orders ?? []);
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    }

    void fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">در حال بارگذاری...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl text-red-500">شما دسترسی ندارید</h1>
      </main>
    );
  }

  if (user.role === "admin") {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#030510] text-white pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <header className="mb-10">
          <p className="text-sm text-orange-400">پنل کاربری</p>
          <h1 className="mt-2 text-4xl font-black text-white">
            سلام {user.name}
          </h1>
          {user.phone && (
            <p className="mt-2 text-zinc-400" dir="ltr">
              {user.phone}
            </p>
          )}
        </header>

        <div className="mb-10 flex flex-wrap gap-3">
          <a
            href={`tel:${SITE_PHONE}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-bold text-black transition hover:from-orange-400 hover:to-amber-400"
          >
            <Phone className="h-5 w-5" />
            تماس با پشتیبانی ({DISPLAY_PHONE})
          </a>

          <Link
            href="/tracking"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white transition hover:border-orange-500/40 hover:bg-white/10"
          >
            <Search className="h-5 w-5 text-orange-400" />
            پیگیری با کد رهگیری
          </Link>

          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-6 py-3 font-bold text-orange-300 transition hover:bg-orange-500/20"
          >
            <Cog className="h-5 w-5" />
            {showForm ? "بستن فرم" : "ثبت سفارش CNC"}
          </button>
        </div>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-orange-400">
            سفارشات CNC من
          </h2>

          {ordersLoading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-zinc-400">
              در حال دریافت سفارشات...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-lg text-zinc-300">سفارشی ثبت نشده است</p>
              <p className="mt-2 text-sm text-zinc-500">
                با دکمه «ثبت سفارش CNC» اولین سفارش خود را ثبت کنید.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <article
                  key={order.trackingCode}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-zinc-500">کد رهگیری</span>
                        <p className="text-2xl font-black tracking-widest text-orange-400">
                          {order.trackingCode}
                        </p>
                      </div>

                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <span className="text-zinc-500">خدمت/محصول:</span>
                          <p className="mt-1 text-white">{order.device}</p>
                        </div>
                        <div>
                          <span className="text-zinc-500">جنس/ابعاد:</span>
                          <p className="mt-1 text-white">
                            {order.issue || "—"}
                          </p>
                        </div>
                      </div>

                      {order.description && (
                        <p className="text-sm text-zinc-400">
                          {order.description}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 text-left sm:text-right">
                      <span className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-300">
                        {getOrderStatusLabel(order.status)}
                      </span>
                      <p className="mt-3 text-xs text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {showForm && (
          <section className="rounded-3xl border border-white/10 bg-black/40">
            <OrderFormClient
              initialPrefill={{}}
              defaultPhone={user.phone ?? ""}
              onSuccess={() => {
                void loadOrders();
                setShowForm(false);
              }}
            />
          </section>
        )}
      </div>
    </main>
  );
}
