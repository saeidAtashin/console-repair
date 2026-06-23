"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FileText,
  HelpCircle,
  List,
  Package,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { ShopProductDetail } from "@/lib/shop";
import type { Brand } from "@/lib/brand-theme";
import { brandThemes } from "@/lib/brand-theme";

import ProductDetailFaq from "./ProductDetailFaq";
import ProductDetailOverview from "./ProductDetailOverview";
import ProductDetailSpecs from "./ProductDetailSpecs";
import ProductDetailWarranty from "./ProductDetailWarranty";
import ProductDetailWhatsInBox from "./ProductDetailWhatsInBox";

type TabId = "overview" | "specs" | "box" | "warranty" | "faq";

type TabDef = {
  id: TabId;
  label: string;
  icon: typeof FileText;
};

type Props = {
  detail: ShopProductDetail;
  brand: Brand;
};

export default function ProductDetailTabs({ detail, brand }: Props) {
  const theme = brandThemes[brand];
  const prefersReducedMotion = useReducedMotion();

  const tabs = useMemo(() => {
    const items: TabDef[] = [
      { id: "overview", label: "معرفی", icon: FileText },
      { id: "specs", label: "مشخصات", icon: List },
    ];
    if (detail.whatsInBox && detail.whatsInBox.length > 0) {
      items.push({ id: "box", label: "محتویات", icon: Package });
    }
    items.push(
      { id: "warranty", label: "گارانتی", icon: ShieldCheck },
      { id: "faq", label: "سوالات", icon: HelpCircle },
    );
    return items;
  }, [detail.whatsInBox]);

  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <section className="mt-12">
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/40 p-2">
        <div className="flex min-w-max gap-1 sm:min-w-0 sm:flex-wrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? `${theme.bg} ${theme.primary} border ${theme.border}`
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-900/30 p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" ? (
              <ProductDetailOverview
                overview={detail.overview}
                features={detail.features}
                brand={brand}
              />
            ) : null}
            {activeTab === "specs" ? (
              <ProductDetailSpecs
                specifications={detail.specifications}
                compatibility={detail.compatibility}
              />
            ) : null}
            {activeTab === "box" && detail.whatsInBox ? (
              <ProductDetailWhatsInBox items={detail.whatsInBox} />
            ) : null}
            {activeTab === "warranty" ? (
              <ProductDetailWarranty
                warranty={detail.warranty}
                delivery={detail.delivery}
              />
            ) : null}
            {activeTab === "faq" ? <ProductDetailFaq faqs={detail.faqs} /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
