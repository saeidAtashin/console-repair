"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string;
  isDefault: boolean;
};

export default function AccountAddressesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    province: "تهران",
    city: "تهران",
    addressLine: "",
    postalCode: "",
    isDefault: false,
  });

  async function load() {
    const res = await fetch("/api/account/addresses");
    const data = await res.json();
    setAddresses(data.addresses ?? []);
  }

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/account/addresses");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) void load();
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف این آدرس؟")) return;
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    await load();
  }

  if (loading || !user) return <p className="text-zinc-400">...</p>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black text-cyan-400">آدرس‌ها</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-2xl bg-cyan-500 px-5 py-2 font-bold text-black hover:bg-cyan-400"
        >
          {showForm ? "انصراف" : "آدرس جدید"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 grid gap-4 md:grid-cols-2">
          <input placeholder="نام" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
          <input placeholder="موبایل" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
          <input placeholder="استان" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
          <input placeholder="شهر" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
          <input placeholder="آدرس" value={form.addressLine} onChange={(e) => setForm({ ...form, addressLine: e.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:col-span-2" required />
          <label className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
            آدرس پیش‌فرض
          </label>
          <button type="submit" className="md:col-span-2 rounded-2xl bg-cyan-500 py-3 font-bold text-black">ذخیره</button>
        </form>
      )}

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 flex justify-between gap-4">
            <div>
              {addr.isDefault && <span className="text-xs text-cyan-400 mb-2 block">پیش‌فرض</span>}
              <p className="font-bold">{addr.fullName} — {addr.phone}</p>
              <p className="text-sm text-zinc-400 mt-1">
                {addr.province}، {addr.city} — {addr.addressLine}
              </p>
            </div>
            <button type="button" onClick={() => handleDelete(addr.id)} className="text-red-400 text-sm">
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
