"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { verifyZarinPalPayment } from "@/lib/payments/zarinpal";
import { unlockFromCartItems } from "@/lib/calligraphy/unlocks";
import { consumePendingUnlocks } from "@/lib/shop/calligraphy-checkout";

type Props = {
  searchParams: Promise<{
    orderId?: string;
    Authority?: string;
    Status?: string;
    local?: string;
    code?: string;
  }>;
};

export default function PaymentCallbackPage({ searchParams }: Props) {
  const params = use(searchParams);
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [refId, setRefId] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      if (params.local === "1") {
        const pending = consumePendingUnlocks();
        unlockFromCartItems(pending, params.orderId);
        setStatus("success");
        return;
      }
      if (!params.orderId || !params.Authority) {
        setStatus("failed");
        return;
      }
      try {
        const result = await verifyZarinPalPayment(params.Authority, params.orderId);
        if (result.success) {
          const pending = consumePendingUnlocks();
          unlockFromCartItems(pending, params.orderId);
          setStatus("success");
          setRefId(result.refId ?? null);
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    }
    void verify();
  }, [params]);

  return (
    <div className="mx-auto max-w-lg px-4 pt-32 pb-16 text-center">
      {status === "loading" ? (
        <p className="text-muted">در حال بررسی پرداخت...</p>
      ) : status === "success" ? (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-black text-foreground">پرداخت موفق</h1>
          <p className="mt-3 text-muted">
            خروجی شما آماده دانلود است
            {params.code ? ` — کد: ${params.code}` : ""}
          </p>
          {refId ? <p className="mt-2 text-sm text-muted">شماره پیگیری: {refId}</p> : null}
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/studio"
              className="inline-block rounded-xl bg-cyan-500 px-8 py-3 text-sm font-bold text-black"
            >
              بازگشت به استودیو و دانلود
            </Link>
            <Link href="/dashboard/designs" className="text-sm text-cyan-400 hover:underline">
              مشاهده آثار من
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-3xl text-red-400">
            ✕
          </div>
          <h1 className="text-2xl font-black text-foreground">پرداخت ناموفق</h1>
          <p className="mt-3 text-muted">لطفاً دوباره تلاش کنید</p>
          <Link
            href="/checkout"
            className="mt-8 inline-block rounded-xl border border-border px-8 py-3 text-sm font-bold text-foreground"
          >
            بازگشت به تسویه
          </Link>
        </>
      )}
    </div>
  );
}
