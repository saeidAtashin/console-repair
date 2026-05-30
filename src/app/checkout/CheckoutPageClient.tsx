"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/app/context/AuthContext";
import { formatPriceToman } from "@/lib/format-price";
import { calculateShipping, getFreeShippingThreshold } from "@/lib/shipping";
import { PAYMENT_METHOD_LABELS } from "@/lib/shop-order-status";

type Cart = {
  subtotal: number;
  itemCount: number;
};

export default function CheckoutPageClient() {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    guestName: user?.name ?? "",
    guestPhone: user?.phone ?? "",
    paymentMethod: "online" as "online" | "cod",
    shippingName: user?.name ?? "",
    shippingPhone: user?.phone ?? "",
    shippingProvince: "تهران",
    shippingCity: "تهران",
    shippingAddress: "",
    shippingPostalCode: "",
  });

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((d) => setCart(d.cart))
      .catch(() => setCart(null));
  }, []);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        guestName: user.name,
        guestPhone: user.phone ?? prev.guestPhone,
        shippingName: user.name,
        shippingPhone: user.phone ?? prev.shippingPhone,
      }));
    }
  }, [user]);

  if (!cart) {
    return <p className="text-zinc-400">در حال بارگذاری...</p>;
  }

  if (cart.itemCount === 0) {
    return (
      <div className="text-center">
        <p className="text-zinc-400 mb-4">سبد خرید خالی است</p>
        <Link href="/shop" className="text-cyan-400 hover:underline">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const shipping = calculateShipping(cart.subtotal);
  const total = cart.subtotal + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "خطا در ثبت سفارش");
        return;
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      router.push(
        `/checkout/success?order=${encodeURIComponent(data.order.orderNumber)}`,
      );
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h2 className="font-bold text-lg">اطلاعات تماس</h2>
          <Input label="نام" value={form.guestName} onChange={(v) => setForm({ ...form, guestName: v, shippingName: v })} required />
          <Input label="موبایل" value={form.guestPhone} onChange={(v) => setForm({ ...form, guestPhone: v, shippingPhone: v })} required />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h2 className="font-bold text-lg">آدرس تحویل</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="نام گیرنده" value={form.shippingName} onChange={(v) => setForm({ ...form, shippingName: v })} required />
            <Input label="موبایل گیرنده" value={form.shippingPhone} onChange={(v) => setForm({ ...form, shippingPhone: v })} required />
            <Input label="استان" value={form.shippingProvince} onChange={(v) => setForm({ ...form, shippingProvince: v })} required />
            <Input label="شهر" value={form.shippingCity} onChange={(v) => setForm({ ...form, shippingCity: v })} required />
          </div>
          <Input label="آدرس کامل" value={form.shippingAddress} onChange={(v) => setForm({ ...form, shippingAddress: v })} required />
          <Input label="کد پستی" value={form.shippingPostalCode} onChange={(v) => setForm({ ...form, shippingPostalCode: v })} />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-bold text-lg mb-4">روش پرداخت</h2>
          <div className="space-y-3">
            {(["online", "cod"] as const).map((method) => (
              <label
                key={method}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                  form.paymentMethod === method
                    ? "border-cyan-400/50 bg-cyan-500/10"
                    : "border-white/10"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === method}
                  onChange={() => setForm({ ...form, paymentMethod: method })}
                />
                {PAYMENT_METHOD_LABELS[method]}
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 h-fit">
        <h2 className="font-bold text-lg mb-4">خلاصه</h2>
        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-zinc-400">جمع</span>
            <span>{formatPriceToman(cart.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">ارسال</span>
            <span>{shipping === 0 ? "رایگان" : formatPriceToman(shipping)}</span>
          </div>
          {cart.subtotal < getFreeShippingThreshold() && (
            <p className="text-xs text-zinc-500">
              ارسال رایگان بالای {formatPriceToman(getFreeShippingThreshold())}
            </p>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
            <span>مجموع</span>
            <span className="text-cyan-400">{formatPriceToman(total)}</span>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-cyan-500 py-4 font-bold text-black hover:bg-cyan-400 disabled:opacity-60"
        >
          {submitting ? "در حال پردازش..." : "ثبت سفارش"}
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-zinc-400">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
      />
    </label>
  );
}
