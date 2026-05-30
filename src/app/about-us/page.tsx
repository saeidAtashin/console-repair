import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

const PATH = "/about-us";
const TITLE = "درباره ما";
const DESCRIPTION =
  "آشنایی با کارگاه CNC، تیم فنی، رویکرد تولید و تعهد ما به کیفیت و قیمت شفاف.";

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: ["درباره ما", "کارگاه cnc", "خدمات cnc"],
});

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <PageShell
        currentPath={PATH}
        containerClassName="container mx-auto px-6"
        className="container mx-auto px-6 pb-14"
      >
        <h1 className="text-4xl font-black md:text-5xl">{TITLE}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-9 text-zinc-300">
          کارگاه CNC با تمرکز بر دقت برش، قیمت‌گذاری شفاف و تحویل به‌موقع،
          خدمات برش MDF، لیزر، فرز CNC و تولید محصولات دکور را ارائه می‌دهد.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-400">
          هدف ما ایجاد تجربه‌ای ساده و قابل اعتماد است؛ از ثبت سفارش و ارسال
          فایل طراحی تا استعلام قیمت و پیگیری وضعیت تولید.
        </p>
      </PageShell>
    </main>
  );
}
