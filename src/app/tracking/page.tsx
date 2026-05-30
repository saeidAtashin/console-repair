"use client";

import { useState } from "react";
import { CheckCircle2, Cog, FileSearch, Package, Search } from "lucide-react";
import type { RepairStatus } from "@/lib/db";
import { ORDER_TRACKING_STEPS } from "@/lib/order-status";

type Order = {
  trackingCode: string;
  name: string;
  phone: string;
  device: string;
  issue: string;
  status: RepairStatus;
  createdAt: string;
};

const STEP_ICONS = {
  pending: CheckCircle2,
  checking: FileSearch,
  repairing: Cog,
  completed: Package,
};

const STATUS_ORDER: RepairStatus[] = [
  "pending",
  "checking",
  "repairing",
  "completed",
];

function getStepState(
  step: RepairStatus,
  current: RepairStatus,
): "done" | "active" | "upcoming" {
  const stepIndex = STATUS_ORDER.indexOf(step);
  const currentIndex = STATUS_ORDER.indexOf(current);
  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "active";
  return "upcoming";
}

export default function TrackingPage() {
  const [code, setCode] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrder(null);

    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("کد پیگیری را وارد کنید");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/repair/orders/${trimmed}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "سفارش پیدا نشد");
        return;
      }

      setOrder(data.order);
    } catch {
      setError("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 py-8 min-h-screen pt-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-orange-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">پیگیری سفارش</h1>
          <p className="text-zinc-400 leading-8">
            کد پیگیری خود را وارد کنید تا وضعیت تولید را ببینید.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="کد پیگیری"
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-orange-500 tracking-widest"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-black disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
            {loading ? "در حال جستجو..." : "جستجو"}
          </button>
        </form>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {order && (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <div className="mb-8">
              <span className="text-zinc-400 text-sm">کد پیگیری</span>
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
                <span className="text-2xl font-black tracking-widest text-orange-400">
                  {order.trackingCode}
                </span>
                <CheckCircle2 className="w-6 h-6 text-orange-400" />
              </div>
            </div>

            <div className="mb-8 grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-500">خدمت/محصول:</span>
                <p className="mt-1">{order.device}</p>
              </div>
              <div>
                <span className="text-zinc-500">جنس/ابعاد:</span>
                <p className="mt-1">{order.issue || "—"}</p>
              </div>
            </div>

            <div className="space-y-6">
              {ORDER_TRACKING_STEPS.map((step) => {
                const state = getStepState(step.status, order.status);
                const Icon = STEP_ICONS[step.status];
                const isUpcoming = state === "upcoming";

                return (
                  <div
                    key={step.status}
                    className={`flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 ${isUpcoming ? "opacity-50" : ""}`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{step.label}</h3>
                      <p className="text-zinc-400 text-sm leading-7">
                        {state === "active"
                          ? step.description
                          : state === "done"
                            ? "این مرحله تکمیل شده است."
                            : "هنوز به این مرحله نرسیده‌اید."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
