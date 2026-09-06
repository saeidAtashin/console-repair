import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import { webPageJsonLd } from "@/lib/seo/jsonld";
import DiagnosisFlowClient from "./DiagnosisFlowClient";

const TITLE = "عیب‌یابی کنسول | تشخیص مشکل PS5، PS4، Xbox و دسته";
const DESCRIPTION =
  "عیب‌یابی مرحله‌به‌مرحله کنسول و دسته بازی. مدل را انتخاب کن، علائم را بگو، نتیجه اولیه و مسیر تعمیر را ببین.";

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/diagnosis",
  keywords: [
    "عیب‌یابی کنسول",
    "تشخیص مشکل ps5",
    "روشن نشدن ps5",
    "تعمیر hdmi",
    "دریفت دسته",
  ],
});

export default function DiagnosisPage() {
  return (
    <PageShell
      currentPath="/diagnosis"
      jsonLd={webPageJsonLd({
        name: TITLE,
        description: DESCRIPTION,
        path: "/diagnosis",
      })}
      className="relative min-h-screen bg-[#030510] text-white"
      containerClassName="container mx-auto max-w-4xl px-6"
      breadcrumbClassName="mb-0 pt-24 relative z-20"
    >
      <DiagnosisFlowClient />
    </PageShell>
  );
}
