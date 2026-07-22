"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import AddressMapField from "@/app/components/dashboard/AddressMapField";
import { ApiError } from "@/lib/api-client";
import { fetchCities, fetchProvinces, type LocationItem } from "@/lib/locations/api";
import {
  createUserAddress,
  deleteUserAddress,
  fetchUserAddresses,
  updateUserAddress,
  type UserAddress,
  type UserAddressPayload,
} from "@/lib/user/api";

function cityIdOf(address: UserAddress): number | null {
  if (typeof address.city === "number") return address.city;
  if (address.city && typeof address.city === "object") return address.city.id;
  return null;
}

function cityNameOf(address: UserAddress): string {
  if (address.city && typeof address.city === "object") return address.city.name;
  return String(address.city ?? "");
}

const emptyForm = {
  title: "",
  provinceId: "" as number | "",
  cityId: "" as number | "",
  address_detail: "",
  postal_code: "",
  latitude: "",
  longitude: "",
};

export default function AddressManager() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadAddresses = useCallback(async () => {
    const list = await fetchUserAddresses();
    setAddresses(list);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const [prov, addr] = await Promise.all([
          fetchProvinces(),
          fetchUserAddresses(),
        ]);
        if (cancelled) return;
        setProvinces(prov);
        setAddresses(addr);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "خطا در دریافت آدرس‌ها",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (form.provinceId === "") {
      setCities([]);
      return;
    }
    let cancelled = false;
    async function loadCities() {
      try {
        const list = await fetchCities(form.provinceId as number);
        if (!cancelled) setCities(list);
      } catch {
        if (!cancelled) setCities([]);
      }
    }
    void loadCities();
    return () => {
      cancelled = true;
    };
  }, [form.provinceId]);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError(null);
  }

  function startEdit(address: UserAddress) {
    const cityId = cityIdOf(address);
    setEditingId(address.id);
    setForm({
      title: address.title ?? "",
      provinceId: "",
      cityId: cityId ?? "",
      address_detail: address.address_detail ?? "",
      postal_code: address.postal_code ?? "",
      latitude: address.latitude ?? "",
      longitude: address.longitude ?? "",
    });
    setShowForm(true);
    setError(null);

    // Try to infer province from city object if present
    const cityObj =
      address.city && typeof address.city === "object" ? address.city : null;
    const province =
      cityObj &&
      cityObj.province &&
      typeof cityObj.province === "object"
        ? cityObj.province.id
        : typeof cityObj?.province === "number"
          ? cityObj.province
          : null;
    if (province != null) {
      setForm((prev) => ({ ...prev, provinceId: province }));
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("این آدرس حذف شود؟")) return;
    setError(null);
    try {
      await deleteUserAddress(id);
      await loadAddresses();
      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "حذف آدرس ناموفق بود.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.cityId === "" || !form.title.trim() || !form.address_detail.trim()) {
      setError("عنوان، شهر و جزئیات آدرس الزامی است.");
      return;
    }
    if (!form.latitude || !form.longitude) {
      setError("موقعیت را از روی نقشه انتخاب کنید.");
      return;
    }

    const payload: UserAddressPayload = {
      title: form.title.trim(),
      city: form.cityId as number,
      address_detail: form.address_detail.trim(),
      postal_code: form.postal_code.trim(),
      latitude: form.latitude,
      longitude: form.longitude,
    };

    setSaving(true);
    try {
      if (editingId != null) {
        await updateUserAddress(editingId, payload);
      } else {
        await createUserAddress(payload);
      }
      await loadAddresses();
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "ذخیره آدرس ناموفق بود.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-zinc-400">
        در حال بارگذاری آدرس‌ها...
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-cyan-400">آدرس‌های من</h2>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          آدرس جدید
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="mb-6 rounded-xl border border-dashed border-white/15 bg-black/30 px-4 py-8 text-center text-sm text-zinc-400">
          هنوز آدرسی ثبت نشده است.
        </p>
      ) : (
        <ul className="mb-6 space-y-3">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p className="font-bold text-white">{address.title}</p>
                <p className="mt-1 text-sm text-zinc-400">
                  {cityNameOf(address)} — {address.address_detail}
                </p>
                {address.postal_code ? (
                  <p className="mt-1 text-xs text-zinc-500" dir="ltr">
                    کد پستی: {address.postal_code}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(address)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-cyan-300 transition hover:bg-white/10"
                  aria-label="ویرایش"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(address.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 text-red-300 transition hover:bg-red-500/10"
                  aria-label="حذف"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 sm:p-5"
        >
          <h3 className="text-lg font-bold text-white">
            {editingId != null ? "ویرایش آدرس" : "ثبت آدرس جدید"}
          </h3>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">عنوان</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white focus:border-cyan-400/40 focus:outline-none"
              placeholder="منزل / محل کار"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">استان</label>
              <select
                value={form.provinceId === "" ? "" : String(form.provinceId)}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    provinceId: e.target.value
                      ? Number.parseInt(e.target.value, 10)
                      : "",
                    cityId: "",
                  }))
                }
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white focus:border-cyan-400/40 focus:outline-none"
              >
                <option value="">انتخاب استان</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-400">شهر</label>
              <select
                value={form.cityId === "" ? "" : String(form.cityId)}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    cityId: e.target.value
                      ? Number.parseInt(e.target.value, 10)
                      : "",
                  }))
                }
                disabled={form.provinceId === ""}
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white focus:border-cyan-400/40 focus:outline-none disabled:opacity-40"
              >
                <option value="">انتخاب شهر</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">جزئیات آدرس</label>
            <textarea
              value={form.address_detail}
              onChange={(e) =>
                setForm((p) => ({ ...p, address_detail: e.target.value }))
              }
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
              placeholder="خیابان، کوچه، پلاک، واحد"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">کد پستی</label>
            <input
              type="text"
              dir="ltr"
              value={form.postal_code}
              onChange={(e) =>
                setForm((p) => ({ ...p, postal_code: e.target.value }))
              }
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white focus:border-cyan-400/40 focus:outline-none"
              placeholder="1234567890"
            />
          </div>

          <AddressMapField
            latitude={form.latitude}
            longitude={form.longitude}
            onChange={(lat, lng) =>
              setForm((p) => ({ ...p, latitude: lat, longitude: lng }))
            }
          />

          {error ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="h-12 rounded-2xl bg-cyan-500 px-8 font-bold text-black transition hover:bg-cyan-400 disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "ذخیره آدرس"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="h-12 rounded-2xl border border-white/10 px-6 font-bold text-zinc-300 transition hover:bg-white/5"
            >
              انصراف
            </button>
          </div>
        </form>
      ) : null}

      {error && !showForm ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </section>
  );
}
