import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  SITE_ADDRESS_DISPLAY,
  SITE_PHONE_DISPLAY,
  SITE_TEL_HREF,
} from "@/lib/seo/site";

const PATH = "/contact";
const TITLE = "تماس با ما";
const DESCRIPTION =
  "راه های ارتباطی کنسول ریپیر برای مشاوره، ثبت سفارش تعمیر و پیگیری درخواست.";

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: ["تماس با ما", "پشتیبانی تعمیر کنسول", "شماره تماس تعمیرات"],
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
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <p className="text-sm text-cyan-400">تلفن پشتیبانی</p>
            <p className="mt-3 text-lg text-zinc-100">
              <a href={SITE_TEL_HREF} className="hover:text-cyan-300">
                {SITE_PHONE_DISPLAY}
              </a>
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <p className="text-sm text-cyan-400">آدرس</p>
            <p className="mt-3 text-lg text-zinc-100">
              {SITE_ADDRESS_DISPLAY}
            </p>
          </div>
        </div>
      </PageShell>
    </main>
  );
}
