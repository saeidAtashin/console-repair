import PageShell from "@/app/components/seo/PageShell";
import { RepairCtaLink } from "@/app/components/ui/cta";
import TrackedPhoneLink from "@/app/components/tracking/TrackedPhoneLink";
import TrackedWhatsAppLink from "@/app/components/tracking/TrackedWhatsAppLink";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  SITE_ADDRESS_DISPLAY,
  SITE_BRAND,
  SITE_PHONE_DISPLAY,
} from "@/lib/seo/site";

const PATH = "/contact";
const TITLE = "تماس با ما";
const DESCRIPTION =
  `راه‌های ارتباطی ${SITE_BRAND} برای مشاوره، ثبت سفارش تعمیر و پیگیری درخواست.`;

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: ["تماس با ما", "پشتیبانی تعمیر کنسول", "شماره تماس تعمیرات", SITE_BRAND],
});

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <PageShell
        currentPath={PATH}
        containerClassName="container mx-auto px-6"
        className="container mx-auto px-6 pb-14"
      >
        <h1 className="text-4xl font-black md:text-5xl">{TITLE}</h1>
        <p className="mt-4 max-w-2xl text-zinc-400">
          مرکز {SITE_BRAND} در توپخانه آماده مشاوره و پذیرش تعمیر PS5، PS4، Xbox
          و دسته بازی است. برای ثبت کار، فرم تعمیر سریع‌تر از پیام است.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <p className="text-sm text-cyan-400">تلفن پشتیبانی</p>
            <p className="mt-3 text-lg text-zinc-100">
              <TrackedPhoneLink className="hover:text-cyan-300">
                {SITE_PHONE_DISPLAY}
              </TrackedPhoneLink>
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <p className="text-sm text-cyan-400">واتساپ</p>
            <p className="mt-3 text-lg text-zinc-100">
              <TrackedWhatsAppLink
                repairHref="/repair"
                className="hover:text-cyan-300"
              >
                ارسال پیام و لینک ثبت تعمیر
              </TrackedWhatsAppLink>
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <p className="text-sm text-cyan-400">آدرس</p>
            <p className="mt-3 text-lg text-zinc-100">{SITE_ADDRESS_DISPLAY}</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-6">
            <p className="text-sm text-cyan-300">ثبت سرویس</p>
            <div className="mt-4">
              <RepairCtaLink href="/repair" label="ثبت درخواست تعمیر" />
            </div>
          </div>
        </div>
      </PageShell>
    </main>
  );
}
