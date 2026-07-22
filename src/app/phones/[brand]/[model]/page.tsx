import { notFound } from "next/navigation";
import JsonLd from "@/app/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  modelPageJsonLd,
  resolveModelSeo,
} from "@/lib/seo/case-model-seo";
import {
  CASE_TYPES,
  getBrandBySlug,
  getModelBySlug,
  PHONE_MODELS,
} from "@/lib/cases/brands.static";
import { getReadyCasesByModel } from "@/lib/cases/ready.static";
import ModelCaseHubClient from "./ModelCaseHubClient";

type Props = { params: Promise<{ brand: string; model: string }> };

export async function generateStaticParams() {
  return PHONE_MODELS.filter((m) => m.brandSlug !== "other").map((m) => ({
    brand: m.brandSlug,
    model: m.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { brand, model } = await params;
  const ctx = resolveModelSeo(brand, model);
  if (!ctx) return {};

  return createPageMetadata({
    title: ctx.title,
    description: ctx.description,
    path: ctx.canonicalPath,
    keywords: ctx.keywords,
    ogImage: ctx.ogImage,
  });
}

export default async function ModelCaseHubPage({ params }: Props) {
  const { brand: brandSlug, model: modelSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  const model = getModelBySlug(brandSlug, modelSlug);
  if (!brand || !model) notFound();

  const seo = resolveModelSeo(brandSlug, modelSlug)!;
  const readyCases = getReadyCasesByModel(brandSlug, modelSlug);

  return (
    <>
      <JsonLd data={modelPageJsonLd(seo, readyCases)} />
      <ModelCaseHubClient
        brand={brand}
        model={model}
        caseTypes={CASE_TYPES}
        readyCases={readyCases}
      />
    </>
  );
}
