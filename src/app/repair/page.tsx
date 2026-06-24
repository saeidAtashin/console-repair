import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "../../lib/seo/metadata";
import { repairContentJsonLd } from "../../lib/seo/repair-content-jsonld";
import {
  repairPageJsonLd,
  repairPrefillFromPageSearchParams,
  resolveRepairSeo,
} from "../../lib/seo/repair-seo";
import RepairPageClient from "@/app/repair/RepairPageClient";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const seo = resolveRepairSeo(params);

  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.canonicalPath,
    keywords: seo.keywords,
    ogImage: seo.ogImage,
    noIndex: seo.noIndex,
  });
}

export default async function RepairPage({ searchParams }: Props) {
  const params = await searchParams;
  const seo = resolveRepairSeo(params);
  const initialPrefill = repairPrefillFromPageSearchParams(params);

  return (
    <PageShell
      currentPath={seo.canonicalPath}
      jsonLd={[...repairPageJsonLd(seo), repairContentJsonLd(seo.consoleId)]}
      className="relative min-h-screen bg-[#030510] text-white"
      containerClassName="container mx-auto max-w-4xl px-6"
      breadcrumbClassName="mb-6 pt-24"
    >
      <RepairPageClient
        initialPrefill={initialPrefill}
        initialConsoleId={seo.consoleId}
      />
    </PageShell>
  );
}
