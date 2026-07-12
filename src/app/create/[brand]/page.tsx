import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";
import ModelGrid from "@/app/components/case-wizard/ModelGrid";
import WizardBreadcrumb from "@/app/components/case-wizard/WizardBreadcrumb";
import { getBrandBySlug, getModelsByBrand } from "@/lib/cases/brands.static";

type Props = { params: Promise<{ brand: string }> };

export async function generateMetadata({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  if (!brand) return {};
  return createPageMetadata({
    title: `انتخاب مدل ${brand.name}`,
    path: `/create/${brandSlug}`,
  });
}

export default async function BrandModelsPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  if (!brand) notFound();

  const models = getModelsByBrand(brandSlug);

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <WizardBreadcrumb
          crumbs={[
            { label: "برند", href: "/create" },
            { label: brand.name },
          ]}
        />
        <h1 className="mt-6 text-2xl font-black text-white sm:text-3xl">
          مدل {brand.name} خود را انتخاب کنید
        </h1>
        <p className="mt-2 text-zinc-400">مرحله ۲ از ۳ — مدل</p>
        <div className="mt-8">
          <ModelGrid brandSlug={brandSlug} models={models} />
        </div>
      </div>
    </div>
  );
}
