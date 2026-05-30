import Link from "next/link";
import { CheckCircle } from "lucide-react";

import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "سفارش ثبت شد",
  path: "/checkout/success",
  noIndex: true,
});

type Props = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-16 text-white">
      <PageShell currentPath="/checkout/success" containerClassName="container mx-auto max-w-2xl px-6">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-400 mb-6" />
          <h1 className="text-3xl font-black mb-4">سفارش شما ثبت شد</h1>
          {order && (
            <p className="text-zinc-400 mb-2">
              شماره سفارش: <span className="font-mono text-cyan-400">{order}</span>
            </p>
          )}
          <p className="text-zinc-400 mb-8">
            از خرید شما متشکریم. وضعیت سفارش را می‌توانید در حساب کاربری پیگیری کنید.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/account/orders"
              className="rounded-2xl bg-cyan-500 px-8 py-3 font-bold text-black hover:bg-cyan-400"
            >
              سفارش‌های من
            </Link>
            <Link
              href="/shop"
              className="rounded-2xl border border-white/10 px-8 py-3 hover:border-cyan-400/30"
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </PageShell>
    </main>
  );
}
