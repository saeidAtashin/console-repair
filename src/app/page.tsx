import HomePage from "./components/HomePage";
import JsonLd from "./components/seo/JsonLd";
import { createPageMetadata } from "../lib/seo/metadata";
import { webPageJsonLd } from "../lib/seo/jsonld";

export const metadata = createPageMetadata({
  title: "خدمات CNC و تولید محصولات | قیمت روز بازار",
  description:
    "خدمات CNC، برش لیزر، فرز CNC و تولید محصولات MDF و چوب با قیمت روز. ثبت سفارش آنلاین و پیگیری تولید.",
  path: "/",
  keywords: [
    "cnc",
    "برش mdf",
    "برش لیزر",
    "فرز cnc",
    "تابلو cnc",
    "قیمت cnc",
  ],
});

const HOME_SCHEMA = webPageJsonLd({
  name: "خدمات CNC و تولید محصولات | قیمت روز بازار",
  description:
    "خدمات CNC، برش لیزر، فرز CNC و تولید محصولات MDF و چوب با قیمت روز.",
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
