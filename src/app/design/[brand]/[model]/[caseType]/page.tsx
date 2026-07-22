import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";
import EditorPageClient from "@/app/components/case-editor/EditorPageClient";
import {
  getBrandBySlug,
  getCaseTypeBySlug,
  getModelBySlug,
} from "@/lib/cases/brands.static";

type Props = {
  params: Promise<{ brand: string; model: string; caseType: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { brand, model, caseType } = await params;
  const phoneModel = getModelBySlug(brand, model);
  const caseTypeInfo = getCaseTypeBySlug(caseType);

  return createPageMetadata({
    title: phoneModel
      ? `طراحی قاب ${phoneModel.name}${caseTypeInfo ? ` — ${caseTypeInfo.name}` : ""}`
      : "طراحی قاب",
    path: `/design/${brand}/${model}/${caseType}`,
    noIndex: true,
  });
}

export default async function DesignEditorPage({ params }: Props) {
  const { brand, model, caseType } = await params;

  if (
    !getBrandBySlug(brand) ||
    !getModelBySlug(brand, model) ||
    !getCaseTypeBySlug(caseType)
  ) {
    notFound();
  }

  return (
    <EditorPageClient
      brandSlug={brand}
      modelSlug={model}
      caseTypeSlug={caseType}
    />
  );
}
