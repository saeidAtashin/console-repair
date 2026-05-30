import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "../../lib/seo/metadata";
import {
  orderBreadcrumbItems,
  orderPageJsonLd,
  orderPrefillFromPageSearchParams,
  resolveOrderSeo,
} from "../../lib/cnc-seo";
import OrderFormClient from "@/app/order/OrderFormClient";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const seo = resolveOrderSeo(params);

  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.canonicalPath,
    keywords: seo.keywords,
    ogImage: seo.ogImage,
    noIndex: seo.noIndex,
  });
}

export default async function OrderPage({ searchParams }: Props) {
  const params = await searchParams;
  const seo = resolveOrderSeo(params);
  const initialPrefill = orderPrefillFromPageSearchParams(params);

  return (
    <PageShell
      currentPath={seo.canonicalPath}
      breadcrumbs={orderBreadcrumbItems(seo)}
      jsonLd={orderPageJsonLd(seo)}
      className="min-h-screen bg-[#0a0a0a] text-white"
      containerClassName="container mx-auto max-w-3xl px-6"
      breadcrumbClassName="mb-6 pt-24"
    >
      <OrderFormClient initialPrefill={initialPrefill} />
    </PageShell>
  );
}
