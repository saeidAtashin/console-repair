"use client";

import { useEffect, useState } from "react";

import {
  createUserProfile,
  fetchUserProfile,
  updateUserProfile,
  type UserProfile,
} from "@/lib/user/api";
import { ApiError } from "@/lib/api-client";

export default function ProfileForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUserProfile();
        if (cancelled) return;
        setProfile(data);
        setFirstName(data.first_name ?? "");
        setLastName(data.last_name ?? "");
        setIsNew(!data.first_name && !data.last_name);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setIsNew(true);
          setProfile(null);
        } else {
          setError(
            err instanceof Error ? err.message : "خطا در دریافت پروفایل",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      };
      const saved =
        isNew || !profile
          ? await createUserProfile(payload)
          : await updateUserProfile(payload);
      setProfile(saved);
      setFirstName(saved.first_name ?? "");
      setLastName(saved.last_name ?? "");
      setIsNew(false);
      setSuccess("اطلاعات پروفایل ذخیره شد.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره پروفایل ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-zinc-400">
        در حال بارگذاری پروفایل...
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-2xl font-bold text-cyan-400">اطلاعات پروفایل</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">شماره موبایل</label>
          <input
            type="text"
            dir="ltr"
            readOnly
            value={profile?.phone_number ?? ""}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-zinc-300"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">نام</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white focus:border-cyan-400/40 focus:outline-none"
              placeholder="نام"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-zinc-400">نام خانوادگی</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white focus:border-cyan-400/40 focus:outline-none"
              placeholder="نام خانوادگی"
            />
          </div>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="h-12 rounded-2xl bg-cyan-500 px-8 font-bold text-black transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {saving ? "در حال ذخیره..." : "ذخیره پروفایل"}
        </button>
      </form>
    </section>
  );
}
