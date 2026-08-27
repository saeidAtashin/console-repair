import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "../../lib/seo/metadata";
import { webPageJsonLd } from "../../lib/seo/jsonld";

const PATH = "/tracking";
const TITLE = "پیگیری تعمیر";
const DESCRIPTION =
  "با کد پذیرش، وضعیت لحظه‌ای تعمیر کنسول را ببینید: پذیرش، عیب‌یابی، تأیید مشتری، تعمیر، تست نهایی و آماده تحویل.";

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "پیگیری تعمیر کنسول",
    "کد پذیرش تعمیر",
    "وضعیت تعمیر PS5",
    "پیگیری آنلاین تعمیر",
  ],
});

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell
      currentPath={PATH}
      jsonLd={webPageJsonLd({
        name: TITLE,
        description: DESCRIPTION,
        path: PATH,
      })}
      className="min-h-screen bg-[#050816] text-white"
      containerClassName="container mx-auto max-w-6xl px-6"
      breadcrumbClassName="mb-6 pt-24"
    >
      {children}
    </PageShell>
  );
}
