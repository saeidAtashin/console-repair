"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock3, Cpu, Search, ShieldCheck } from "lucide-react";

import { ApiError } from "@/lib/api-client";
import { fetchTrackedRepair } from "@/lib/repair/api";
import { formatToman } from "@/lib/game-install-pricing";
import { getRepairStatusLabel } from "@/lib/repair-status";
import {
  formatLastUpdate,
  isCanceledStatus,
  timelineIndexForStatus,
  type TrackedRepair,
} from "@/lib/repair/tracking";
import TrackingStatusTimeline from "./TrackingStatusTimeline";

const LOOKUP_HINTS = [
  {
    icon: ShieldCheck,
    title: "کد پذیرش",
    text: "بعد از ثبت درخواست، یک کد پذیرش دریافت می‌کنید. همان را اینجا وارد کنید.",
  },
  {
    icon: Clock3,
    title: "وضعیت لحظه‌ای",
    text: "از پذیرش و عیب‌یابی تا تأیید هزینه، تعمیر، تست و آماده تحویل.",
  },
  {
    icon: Cpu,
    title: "آخرین بروزرسانی",
    text: "زمان آخرین تغییر وضعیت روی کارت سفارش نمایش داده می‌شود.",
  },
];

export default function TrackingLookup() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code")?.trim() ?? "";
  const [code, setCode] = useState(codeFromUrl.toUpperCase());
  const [order, setOrder] = useState<TrackedRepair | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup(raw: string) {
    setError("");
    setOrder(null);

    const trimmed = raw.trim();
    if (!trimmed) {
      setError("کد پذیرش را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const tracked = await fetchTrackedRepair(trimmed);
      setOrder(tracked);
    } catch (caught) {
      if (caught instanceof ApiError && (caught.status === 404 || caught.status === 403)) {
        setError("سفارشی با این کد پذیرش پیدا نشد.");
      } else if (caught instanceof ApiError) {
        setError(caught.message);
      } else if (caught instanceof Error) {
        setError(caught.message);
      } else {
        setError("خطا در دریافت اطلاعات");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!codeFromUrl) return;
    setCode(codeFromUrl.toUpperCase());
    void lookup(codeFromUrl);
    // Initial lookup from ?code= only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeFromUrl]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    void lookup(code);
  }

  const currentIndex = order ? timelineIndexForStatus(order.status) : -1;
  const canceled = order ? isCanceledStatus(order.status) : false;

  return (
    <div className="pb-24">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-cyan-400/20 bg-linear-to-b from-cyan-500/10 via-black/40 to-black/20 px-6 py-12 text-center sm:px-10 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl"
        />

        <p className="text-sm font-semibold text-cyan-300">پیگیری آنلاین تعمیر</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">پیگیری تعمیر</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
          کد پذیرش را وارد کنید تا وضعیت دستگاه را از پذیرش تا تحویل ببینید.
        </p>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 max-w-3xl rounded-3xl border border-white/10 bg-black/40 p-4 text-start backdrop-blur-xl sm:p-6"
        >
          <label htmlFor="acceptance-code" className="mb-3 block text-sm font-bold text-white">
            کد پذیرش:
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="acceptance-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="مثلاً ۱۲۴۸"
              autoComplete="off"
              inputMode="numeric"
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-black tracking-[0.35em] outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-7 py-4 font-black text-black disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              {loading ? "در حال جستجو..." : "مشاهده وضعیت"}
            </button>
          </div>
        </form>
      </div>

      {error ? (
        <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      ) : null}

      {order ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">وضعیت</p>
                <p className="mt-1 text-2xl font-black text-white">
                  {canceled ? "لغو شده" : getRepairStatusLabel(order.status)}
                </p>
              </div>
              <p className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                آخرین بروزرسانی: {formatLastUpdate(order.updatedAt || order.createdAt)}
              </p>
            </div>

            {canceled ? (
              <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">
                این درخواست لغو شده است. برای هماهنگی دوباره با پشتیبانی تماس بگیرید.
              </div>
            ) : null}

            <TrackingStatusTimeline
              currentIndex={canceled ? -1 : currentIndex}
            />
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/5 p-6">
              <p className="text-sm text-zinc-400">کد پذیرش</p>
              <p className="mt-3 text-3xl font-black tracking-[0.28em] text-cyan-300">
                {order.trackingCode}
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm">
              <dl className="grid gap-4">
                <div>
                  <dt className="text-zinc-500">دستگاه</dt>
                  <dd className="mt-1 text-white">{order.device}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">مشکل</dt>
                  <dd className="mt-1 text-white">{order.issue || "—"}</dd>
                </div>
                {order.estimatedPrice ? (
                  <div>
                    <dt className="text-zinc-500">هزینه تقریبی</dt>
                    <dd className="mt-1 text-white">
                      {formatToman(order.estimatedPrice)}
                    </dd>
                  </div>
                ) : null}
                {order.finalPrice ? (
                  <div>
                    <dt className="text-zinc-500">هزینه نهایی</dt>
                    <dd className="mt-1 text-white">{formatToman(order.finalPrice)}</dd>
                  </div>
                ) : null}
                {order.adminNote ? (
                  <div>
                    <dt className="text-zinc-500">یادداشت تعمیرگاه</dt>
                    <dd className="mt-1 leading-7 text-zinc-300">{order.adminNote}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </aside>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <section>
            <h2 className="mb-6 text-2xl font-black">وضعیت تعمیر چطور پیش می‌رود؟</h2>
            <TrackingStatusTimeline currentIndex={-1} preview />
          </section>
          <section className="space-y-4">
            {LOOKUP_HINTS.map((hint) => {
              const Icon = hint.icon;
              return (
                <div
                  key={hint.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">{hint.title}</h3>
                  <p className="mt-2 leading-7 text-zinc-400">{hint.text}</p>
                </div>
              );
            })}
            <Link
              href="/repair"
              className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-white/10 font-bold text-white transition hover:bg-white/15"
            >
              هنوز درخواست ثبت نکرده‌اید؟ ثبت تعمیر
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}
