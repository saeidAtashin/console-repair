"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  cncCatalog,
  cncCategoryIds,
  type CncCategoryId,
} from "@/lib/cnc-catalog";
import { buildOrderHref } from "@/lib/order-links";

const categoryImages: Record<CncCategoryId, string> = {
  wood: "/images/cnc/mdf-cutting.svg",
  laser: "/images/cnc/laser-cutting.svg",
  milling: "/images/cnc/milling.svg",
  decor: "/images/cnc/sign-decor.svg",
};

export default function CncShowcaseScene() {
  const [active, setActive] = useState<CncCategoryId>("wood");
  const config = cncCatalog[active];

  return (
    <div className="relative flex flex-col items-center">
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {cncCategoryIds.map((id) => {
          const cat = cncCatalog[id];
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-orange-500 text-black"
                  : "border border-white/15 bg-white/5 text-zinc-300 hover:border-orange-400/40"
              }`}
            >
              {cat.icon} {cat.title}
            </button>
          );
        })}
      </div>

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-orange-400/20 bg-zinc-900/80 p-6 shadow-[0_0_60px_rgba(249,115,22,0.15)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-800">
          <Image
            src={categoryImages[active]}
            alt={config.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-6 text-center">
          <h3 className="text-xl font-black text-white">{config.title}</h3>
          <p className="mt-2 text-sm text-zinc-400">{config.description}</p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={buildOrderHref({ serviceSlug: config.serviceSlug })}
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
            >
              ثبت سفارش
            </Link>
            <Link
              href={`/services/${config.serviceSlug}`}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-orange-400/40"
            >
              جزئیات خدمت
            </Link>
            <Link
              href="/products"
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-orange-400/40"
            >
              قیمت محصولات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
