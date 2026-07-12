import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";
import ReadyCaseDetail from "@/app/components/cases/ReadyCaseDetail";
import { getReadyCaseBySlug } from "@/lib/cases/ready.static";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getReadyCaseBySlug(slug);
  if (!product) return {};
  return createPageMetadata({
    title: product.title,
    description: product.description,
    path: `/cases/${slug}`,
  });
}

export default async function ReadyCasePage({ params }: Props) {
  const { slug } = await params;
  const product = getReadyCaseBySlug(slug);
  if (!product) notFound();

  return <ReadyCaseDetail product={product} />;
}
