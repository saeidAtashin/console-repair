"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import CaseTypePicker from "@/app/components/case-wizard/CaseTypePicker";
import WizardBreadcrumb from "@/app/components/case-wizard/WizardBreadcrumb";
import DesignSamplePreview from "@/app/components/designs/DesignSamplePreview";
import {
  CASE_TYPES,
  getBrandBySlug,
  getModelBySlug,
  getModelsByBrand,
  PHONE_BRANDS,
} from "@/lib/cases/brands.static";
import type { CaseTemplate } from "@/lib/design/types";

type Step = "brand" | "model" | "caseType";

type Props = {
  template: CaseTemplate;
  open: boolean;
  onClose: () => void;
  initialBrandSlug?: string;
  initialModelSlug?: string;
};

export default function ApplyTemplateWizard({
  template,
  open,
  onClose,
  initialBrandSlug,
  initialModelSlug,
}: Props) {
  const router = useRouter();
  const [brandSlug, setBrandSlug] = useState(initialBrandSlug ?? "");
  const [modelSlug, setModelSlug] = useState(initialModelSlug ?? "");
  const [caseTypeSlug, setCaseTypeSlug] = useState(CASE_TYPES[0]?.slug ?? "matte");

  const initialStep: Step = initialModelSlug && initialBrandSlug
    ? "caseType"
    : initialBrandSlug
      ? "model"
      : "brand";
  const [step, setStep] = useState<Step>(initialStep);

  useEffect(() => {
    if (!open) return;
    setBrandSlug(initialBrandSlug ?? "");
    setModelSlug(initialModelSlug ?? "");
    setCaseTypeSlug(CASE_TYPES[0]?.slug ?? "matte");
    setStep(initialStep);
  }, [open, initialBrandSlug, initialModelSlug, initialStep]);

  const brand = getBrandBySlug(brandSlug);
  const model = brandSlug && modelSlug ? getModelBySlug(brandSlug, modelSlug) : undefined;
  const models = useMemo(
    () => (brandSlug ? getModelsByBrand(brandSlug) : []),
    [brandSlug],
  );

  if (!open) return null;

  function handleClose() {
    onClose();
  }

  function handleContinue() {
    if (!brandSlug || !modelSlug) return;
    router.push(`/design/${brandSlug}/${modelSlug}/${caseTypeSlug}?template=${template.slug}`);
    handleClose();
  }

  const crumbs = [
    { label: "طراحی", href: "/designs" },
    { label: template.title },
    ...(brand ? [{ label: brand.name }] : []),
    ...(model ? [{ label: model.name }] : []),
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-border bg-card sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="min-w-0">
            <WizardBreadcrumb crumbs={crumbs} />
            <h2 className="mt-3 text-lg font-black text-foreground">
              انتخاب گوشی برای «{template.title}»
            </h2>
            <p className="mt-1 text-sm text-muted">
              طراحی روی قاب به‌صورت تمام‌صفحه اعمال می‌شود و سپس می‌توانید ویرایش کنید.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-surface hover:text-foreground"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto p-5 sm:flex-row">
          <div className="flex shrink-0 items-center justify-center rounded-2xl border border-border bg-background/50 p-4 sm:w-44">
            <DesignSamplePreview template={template} maxHeight={200} />
          </div>

          <div className="min-w-0 flex-1">
            {step === "brand" ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground">۱. برند گوشی</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {PHONE_BRANDS.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => {
                        setBrandSlug(item.slug);
                        setModelSlug("");
                        setStep("model");
                      }}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/60 p-4 transition hover:border-cyan-500/50"
                    >
                      <Image
                        src={item.logo}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                      />
                      <span className="text-xs font-bold text-foreground">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === "model" && brandSlug ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">۲. مدل گوشی</p>
                  {!initialBrandSlug ? (
                    <button
                      type="button"
                      onClick={() => setStep("brand")}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      تغییر برند
                    </button>
                  ) : null}
                </div>
                <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
                  {models.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => {
                        setModelSlug(item.slug);
                        setStep("caseType");
                      }}
                      className="rounded-xl border border-border bg-card/60 px-3 py-3 text-right transition hover:border-cyan-500/50"
                    >
                      <p className="text-xs font-bold text-foreground">{item.name}</p>
                      <p className="text-[10px] text-muted">{item.nameEn}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === "caseType" && brandSlug && modelSlug ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">۳. نوع قاب</p>
                  {!initialModelSlug ? (
                    <button
                      type="button"
                      onClick={() => setStep("model")}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      تغییر مدل
                    </button>
                  ) : null}
                </div>
                <CaseTypePicker
                  brandSlug={brandSlug}
                  modelSlug={modelSlug}
                  caseTypes={CASE_TYPES}
                  selectedSlug={caseTypeSlug}
                  onSelect={setCaseTypeSlug}
                  showDesignLink={false}
                />
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full rounded-xl bg-cyan-500 py-3.5 text-sm font-bold text-black transition hover:bg-cyan-400"
                >
                  اعمال طراحی و ورود به ادیتور
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
