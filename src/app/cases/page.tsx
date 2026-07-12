import { createPageMetadata } from "@/lib/seo/metadata";
import ReadyCaseCard from "@/app/components/cases/ReadyCaseCard";
import { getReadyCases } from "@/lib/cases/ready.static";

export const metadata = createPageMetadata({
  title: "قاب‌های آماده",
  description: "مجموعه قاب‌های طراحی‌شده آماده خرید",
  path: "/cases",
});

export default function CasesCatalogPage() {
  const products = getReadyCases();

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-black text-white sm:text-3xl">قاب‌های آماده</h1>
        <p className="mt-2 text-zinc-400">طراحی‌های از پیش ساخته‌شده — آماده ارسال</p>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {products.map((product) => (
            <ReadyCaseCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
