"use client";

import { useState } from "react";
import CaseTypePicker from "@/app/components/case-wizard/CaseTypePicker";
import WizardBreadcrumb from "@/app/components/case-wizard/WizardBreadcrumb";
import type { CaseType, PhoneBrand, PhoneModel } from "@/lib/cases/types";

type Props = {
  brand: PhoneBrand;
  model: PhoneModel;
  caseTypes: CaseType[];
};

export default function CaseTypePageClient({ brand, model, caseTypes }: Props) {
  const [selectedCase, setSelectedCase] = useState(caseTypes[0]?.slug ?? "matte");

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <WizardBreadcrumb
          crumbs={[
            { label: "برند", href: "/create" },
            { label: brand.name, href: `/create/${brand.slug}` },
            { label: model.name },
          ]}
        />
        <h1 className="mt-6 text-2xl font-black text-foreground sm:text-3xl">نوع قاب را انتخاب کنید</h1>
        <p className="mt-2 text-muted">مرحله ۳ از ۳ — {model.name}</p>
        <div className="mt-8">
          <CaseTypePicker
            brandSlug={brand.slug}
            modelSlug={model.slug}
            caseTypes={caseTypes}
            selectedSlug={selectedCase}
            onSelect={setSelectedCase}
          />
        </div>
      </div>
    </div>
  );
}
