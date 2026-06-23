import PageShell from "@/app/components/seo/PageShell";
import CheckoutPageClient from "./CheckoutPageClient";
import { createPageMetadata } from "@/lib/seo/metadata";

const PATH = "/shop/checkout";

export const metadata = createPageMetadata({
  title: "تکمیل سفارش",
  description: "ثبت سفارش خرید کنسول و ثبت اطلاعات تماس برای هماهنگی تحویل.",
  path: PATH,
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <PageShell
        currentPath={PATH}
        containerClassName="container mx-auto px-6"
        className="container mx-auto px-6 pb-14"
      >
        <h1 className="text-4xl font-black md:text-5xl">تکمیل سفارش</h1>
        <p className="mt-3 mb-10 max-w-2xl text-zinc-400">
          اطلاعات تماس خود را ثبت کنید تا هماهنگی ارسال و تحویل انجام شود.
        </p>
        <CheckoutPageClient />
      </PageShell>
    </main>
  );
}
