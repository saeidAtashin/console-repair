"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/account");
    }
    if (!loading && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <p className="text-zinc-400">در حال بارگذاری...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-cyan-400 mb-8">پروفایل</h1>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4 max-w-lg">
        <div>
          <p className="text-sm text-zinc-400">نام</p>
          <p className="font-bold">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-zinc-400">موبایل</p>
          <p className="font-bold">{user.phone ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
