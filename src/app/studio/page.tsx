import StudioPageClient from "@/app/components/calligraphy/StudioPageClient";
import JsonLd from "@/app/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { webPageJsonLd } from "@/lib/seo/jsonld";

const TITLE = "استودیو خوشنویسی آنلاین";
const DESCRIPTION =
  "متن فارسی خود را با فونت‌های نستعلیق، نسخ و خطاطی تبدیل به خوشنویسی کنید. پیش‌نمایش رایگان و دانلود با کیفیت بالا.";

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/studio",
  keywords: ["خوشنویسی", "خطاطی", "فونت نستعلیق", "خوشنویسی آنلاین", "فارسی"],
});

export default function StudioPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/studio",
        })}
      />
      <StudioPageClient />
    </>
  );
}
