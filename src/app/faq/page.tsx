import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

const PATH = "/faq";
const TITLE = "سوالات متداول";
const DESCRIPTION =
  "پاسخ به سوالات رایج درباره خوشنویسی آنلاین، فونت‌ها، دانلود رایگان و خروجی با کیفیت بالا.";

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: ["سوالات متداول", "خوشنویسی آنلاین", "فونت نستعلیق"],
});

const faqItems = [
  {
    question: "آیا استفاده از استودیو رایگان است؟",
    answer:
      "بله. می‌توانید متن خود را بنویسید، فونت انتخاب کنید و پیش‌نمایش با واترمارک را به‌صورت رایگان دانلود کنید.",
  },
  {
    question: "تفاوت پیش‌نمایش رایگان و خروجی HD چیست؟",
    answer:
      "پیش‌نمایش رایگان دارای واترمارک و کیفیت استاندارد است. خروجی HD بدون واترمارک و با رزولوشن ۳ برابر برای چاپ مناسب است.",
  },
  {
    question: "فونت‌های ویژه چیست؟",
    answer:
      "برخی فونت‌های تزئینی مانند کتیبه به‌عنوان فونت ویژه مشخص شده‌اند و برای دانلود HD هزینه اضافی دارند.",
  },
  {
    question: "پس از پرداخت چگونه فایل را دانلود کنم؟",
    answer:
      "پس از پرداخت موفق، به استودیو بازگردید و دکمه دانلود HD یا PDF فعال می‌شود. همچنین در بخش «آثار من» وضعیت خرید نمایش داده می‌شود.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background pt-24 text-foreground">
      <PageShell
        currentPath={PATH}
        containerClassName="container mx-auto px-6"
        className="container mx-auto px-6 pb-14"
      >
        <h1 className="text-4xl font-black md:text-5xl">{TITLE}</h1>
        <div className="mt-8 space-y-4">
          {faqItems.map((item) => (
            <article
              key={item.question}
              className="rounded-2xl border border-border bg-card/40 p-6"
            >
              <h2 className="text-lg font-bold text-foreground">{item.question}</h2>
              <p className="mt-3 leading-8 text-muted">{item.answer}</p>
            </article>
          ))}
        </div>
      </PageShell>
    </main>
  );
}
