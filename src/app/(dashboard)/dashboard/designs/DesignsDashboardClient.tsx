"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getUnlockedExports,
  isExportUnlocked,
} from "@/lib/calligraphy/unlocks";
import { readSavedWorks } from "@/lib/calligraphy/storage";
import type { CalligraphyDocument } from "@/lib/calligraphy/types";
import { getExportTierLabel } from "@/lib/calligraphy/pricing";

export default function DesignsDashboardClient() {
  const [works, setWorks] = useState<CalligraphyDocument[]>([]);

  useEffect(() => {
    setWorks(readSavedWorks());
  }, []);

  return (
    <div className="px-4 pt-24 pb-16 sm:px-6">
      <h1 className="text-2xl font-black text-foreground">آثار من</h1>
      <p className="mt-2 text-muted">آثار ذخیره‌شده و خروجی‌های خریداری‌شده</p>

      {works.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-muted">هنوز اثری ذخیره نکرده‌اید</p>
          <Link href="/studio" className="mt-4 inline-block text-cyan-400">
            شروع خوشنویسی
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => {
            const unlocks = getUnlockedExports(work.id);
            return (
              <li
                key={work.id}
                className="overflow-hidden rounded-2xl border border-border bg-card/60"
              >
                {work.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={work.previewUrl}
                    alt={work.name}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-surface text-muted">
                    بدون پیش‌نمایش
                  </div>
                )}
                <div className="p-4">
                  <p className="font-bold text-foreground">{work.name}</p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(work.updatedAt).toLocaleDateString("fa-IR")}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{work.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/studio"
                      className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs text-cyan-400"
                    >
                      ویرایش در استودیو
                    </Link>
                    {(["hd-png", "pdf"] as const).map((tier) =>
                      isExportUnlocked(work.id, tier) ? (
                        <span
                          key={tier}
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400"
                        >
                          {getExportTierLabel(tier)} ✓
                        </span>
                      ) : null,
                    )}
                    {unlocks.length === 0 ? (
                      <span className="text-xs text-muted">خروجی HD خریداری نشده</span>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
