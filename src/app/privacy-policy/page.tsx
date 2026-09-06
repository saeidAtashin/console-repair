import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

const PATH = "/privacy-policy";
const TITLE = "حریم خصوصی";
const DESCRIPTION =
  "نحوه جمع آوری، استفاده و نگهداری اطلاعات کاربران در کنسول ریپیر.";

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: ["حریم خصوصی", "حفاظت اطلاعات کاربران", "Privacy Policy"],
});

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <PageShell
        currentPath={PATH}
        containerClassName="container mx-auto px-6"
        className="container mx-auto px-6 pb-14"
      >
        <h1 className="text-4xl font-black md:text-5xl">{TITLE}</h1>
        <p className="mt-6 max-w-4xl leading-8 text-zinc-300">
          اطلاعات مورد نیاز برای ارائه خدمات، ثبت سفارش و ارتباط با مشتریان
          دریافت می شود و برای انجام فرآیند تعمیرات و بهبود تجربه کاربری استفاده
          خواهد شد.
        </p>
        <p className="mt-4 max-w-4xl leading-8 text-zinc-300">
          برای تحلیل ترافیک سایت از Google Analytics (GA4) استفاده می شود. این
          سرویس داده های ناشناس استفاده از صفحات (مانند مسیر بازدید و نوع
          دستگاه) را از طریق کوکی های گوگل جمع آوری می کند. اطلاعات هویتی
          مشتریان مانند شماره تماس و آدرس به گوگل ارسال نمی شود و بدون مجوز به
          شخص ثالث دیگری منتقل نخواهد شد.
        </p>
      </PageShell>
    </main>
  );
}
