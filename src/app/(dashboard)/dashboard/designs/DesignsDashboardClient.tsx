"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listUserDesigns } from "@/lib/design/api";
import type { SavedDesign } from "@/lib/design/types";

export default function DesignsDashboardClient() {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listUserDesigns().then((data) => {
      setDesigns(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="px-4 pt-24 pb-16 sm:px-6">
      <h1 className="text-2xl font-black text-white">طراحی‌های من</h1>
      <p className="mt-2 text-zinc-400">طراحی‌های ذخیره‌شده شما</p>

      {loading ? (
        <p className="mt-8 text-zinc-500">در حال بارگذاری...</p>
      ) : designs.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-zinc-500">هنوز طراحی ذخیره نکرده‌اید</p>
          <Link href="/create" className="mt-4 inline-block text-cyan-400">
            شروع طراحی
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <li
              key={design.id}
              className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4"
            >
              <p className="font-bold text-white">{design.name}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {new Date(design.updatedAt).toLocaleDateString("fa-IR")}
              </p>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/share/${design.shareToken}`}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-white"
                >
                  مشاهده
                </Link>
                <Link
                  href={`/design/${design.brandSlug}/${design.modelSlug}/${design.caseTypeSlug}`}
                  className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs text-cyan-400"
                >
                  ویرایش
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
