import FaqSection from "@/app/components/seo/FaqSection";
import PageShell from "@/app/components/seo/PageShell";
import { getGameInstallContent } from "@/lib/game-install-content";
import { createPageMetadata } from "@/lib/seo/metadata";

const PATH = "/faq";
const TITLE = "سوالات متداول";
const DESCRIPTION =
  "پاسخ به سوالات رایج درباره تعمیر کنسول، نصب بازی، زمان انجام کار، گارانتی و پیگیری سفارش.";

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "سوالات متداول",
    "FAQ تعمیر کنسول",
    "نصب بازی",
    "گارانتی تعمیرات",
  ],
});

const repairFaqs = [
  {
    question: "زمان تقریبی تعمیر چقدر است؟",
    answer:
      "بسته به نوع خرابی، زمان تعمیر می‌تواند از چند ساعت تا چند روز متغیر باشد. زمان دقیق پس از عیب‌یابی اعلام می‌شود.",
  },
  {
    question: "آیا خدمات شامل گارانتی است؟",
    answer:
      "بله، خدمات تعمیرات با ضمانت تست ارائه می‌شود و شرایط هر خدمت هنگام ثبت سفارش اعلام خواهد شد.",
  },
  {
    question: "چطور وضعیت سفارش تعمیر را پیگیری کنم؟",
    answer:
      "از طریق صفحه پیگیری تعمیر و کد سفارش می‌توانید آخرین وضعیت دستگاه را ببینید.",
  },
];

export default function FaqPage() {
  const installFaqs = getGameInstallContent("ps5")?.faqs ?? [];

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <PageShell
        currentPath={PATH}
        containerClassName="container mx-auto px-6"
        className="container mx-auto px-6 pb-14"
      >
        <h1 className="text-4xl font-black md:text-5xl">{TITLE}</h1>
        <p className="mt-4 max-w-2xl text-zinc-400">{DESCRIPTION}</p>

        <FaqSection
          title="تعمیر کنسول"
          items={repairFaqs}
          className="border-t-0 py-12"
        />
        <FaqSection
          title="نصب بازی"
          items={installFaqs}
          className="border-t-0 py-8"
        />
      </PageShell>
    </main>
  );
}
