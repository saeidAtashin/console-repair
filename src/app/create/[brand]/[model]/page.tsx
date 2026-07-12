import { notFound } from "next/navigation";
import CaseTypePageClient from "./CaseTypePageClient";
import { getBrandBySlug, getModelBySlug, CASE_TYPES } from "@/lib/cases/brands.static";

type Props = { params: Promise<{ brand: string; model: string }> };

export default async function CaseTypePage({ params }: Props) {
  const { brand: brandSlug, model: modelSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  const model = getModelBySlug(brandSlug, modelSlug);
  if (!brand || !model) notFound();

  return (
    <CaseTypePageClient
      brand={brand}
      model={model}
      caseTypes={CASE_TYPES}
    />
  );
}
