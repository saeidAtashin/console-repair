import HomePage from "./components/HomePage";
import JsonLd from "./components/seo/JsonLd";
import { createPageMetadata } from "../lib/seo/metadata";
import { webPageJsonLd } from "../lib/seo/jsonld";

export const metadata = createPageMetadata({
  title: "تعمیر تخصصی کنسول بازی | PS5، PS4 و Xbox",
  description:
    "تعمیر تخصصی پلی‌استیشن 5، PS4، Xbox و دسته بازی با گارانتی، عیب‌یابی دقیق و تحویل سریع. ثبت سفارش آنلاین و پیگیری وضعیت تعمیر.",
  path: "/",
  keywords: [
    "تعمیر کنسول",
    "تعمیر ps5",
    "تعمیر ps4",
    "تعمیر xbox",
    "تعمیر hdmi کنسول",
    "تعمیر دسته ps5",
  ],
});

const HOME_SCHEMA = webPageJsonLd({
  name: "تعمیر تخصصی کنسول بازی | PS5، PS4 و Xbox",
  description:
    "تعمیر تخصصی پلی‌استیشن 5، PS4، Xbox و دسته بازی با گارانتی، عیب‌یابی دقیق و تحویل سریع. ثبت سفارش آنلاین و پیگیری وضعیت تعمیر.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={HOME_SCHEMA} />
      <HomePage />
    </>
  );
}
