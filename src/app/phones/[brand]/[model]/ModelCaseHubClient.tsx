"use client";

import { useState } from "react";
import Link from "next/link";
import CaseTypePicker from "@/app/components/case-wizard/CaseTypePicker";
import WizardBreadcrumb from "@/app/components/case-wizard/WizardBreadcrumb";
import ReadyCaseCard from "@/app/components/cases/ReadyCaseCard";
import type { CaseType, PhoneBrand, PhoneModel, ReadyCase } from "@/lib/cases/types";

type Props = {
  brand: PhoneBrand;
  model: PhoneModel;
  caseTypes: CaseType[];
  readyCases: ReadyCase[];
};

export default function ModelCaseHubClient({
  brand,
  model,
  caseTypes,
  readyCases,
}: Props) {
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

        <header className="mt-6">
          <h1 className="text-2xl font-black text-foreground sm:text-3xl">
            قاب {model.name}
          </h1>
          <p className="mt-2 text-muted">
            {brand.name} — قاب‌های آماده یا طراحی اختصاصی با چاپ با کیفیت
          </p>
        </header>

        <section className="mt-12" aria-labelledby="ready-cases-heading">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2
                id="ready-cases-heading"
                className="text-xl font-black text-foreground"
              >
                قاب‌های آماده
              </h2>
              <p className="mt-1 text-sm text-muted">
                طراحی‌های از پیش ساخته‌شده برای {model.name}
              </p>
            </div>
            {readyCases.length > 0 ? (
              <Link
                href="/cases"
                className="shrink-0 text-sm text-cyan-400 transition hover:text-cyan-300"
              >
                همه قاب‌های آماده
              </Link>
            ) : null}
          </div>

          {readyCases.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {readyCases.map((product) => (
                <ReadyCaseCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-10 text-center">
              <p className="text-muted">
                هنوز قاب آماده‌ای برای {model.name} نداریم — می‌توانید قاب
                اختصاصی خود را طراحی کنید.
              </p>
            </div>
          )}
        </section>

        <section className="mt-16" aria-labelledby="custom-design-heading">
          <div className="mb-8">
            <h2
              id="custom-design-heading"
              className="text-xl font-black text-foreground"
            >
              طراحی اختصاصی
            </h2>
            <p className="mt-1 text-sm text-muted">
              نوع قاب را انتخاب کنید و طراحی را شروع کنید
            </p>
          </div>
          <CaseTypePicker
            brandSlug={brand.slug}
            modelSlug={model.slug}
            caseTypes={caseTypes}
            selectedSlug={selectedCase}
            onSelect={setSelectedCase}
          />

          <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
            <h3 className="text-lg font-bold text-foreground">طراحی قاب برای شما</h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              تصویر و توضیحات خود را بفرستید — ما قاب را طراحی می‌کنیم و برای
              تأیید به شما ارسال می‌کنیم.
            </p>
            <Link
              href={`/design/${brand.slug}/${model.slug}/${selectedCase}?tab=design-for-you`}
              className="mt-4 inline-flex rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-400"
            >
              ارسال درخواست طراحی
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
