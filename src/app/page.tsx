import HomeCalligraphyPage from "./components/HomeCalligraphyPage";
import JsonLd from "./components/seo/JsonLd";
import { createPageMetadata } from "../lib/seo/metadata";
import { webPageJsonLd } from "../lib/seo/jsonld";

const HOME_TITLE = "خوشنویسی آنلاین فارسی";
const HOME_DESCRIPTION =
  "متن فارسی خود را با فونت‌های نستعلیق، نسخ و خطاطی به خوشنویسی تبدیل کنید. پیش‌نمایش رایگان و دانلود با کیفیت بالا.";

export const metadata = createPageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  keywords: ["خوشنویسی", "خطاطی", "فونت نستعلیق", "خوشنویسی آنلاین", "فارسی"],
});

export default function Home() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: HOME_TITLE,
          description: HOME_DESCRIPTION,
          path: "/",
        })}
      />
      <HomeCalligraphyPage />
    </>
  );
}
