import Link from "next/link";
import { XCircle } from "lucide-react";

import PageShell from "@/app/components/seo/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "خطا در پرداخت",
  path: "/checkout/failed",
  noIndex: true,
});

export default function CheckoutFailedPage() {
  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-16 text-white">
      <PageShell currentPath="/checkout/failed" containerClassName="container mx-auto max-w-2xl px-6">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-400 mb-6" />
          <h1 className="text-3xl font-black mb-4">پرداخت ناموفق</h1>
          <p className="text-zinc-400 mb-8">
            پرداخت انجام نشد یا لغو شد. می‌توانید دوباره تلاش کنید.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/checkout"
              className="rounded-2xl bg-cyan-500 px-8 py-3 font-bold text-black hover:bg-cyan-400"
            >
              تلاش مجدد
            </Link>
            <Link
              href="/cart"
              className="rounded-2xl border border-white/10 px-8 py-3 hover:border-cyan-400/30"
            >
              بازگشت به سبد
            </Link>
          </div>
        </div>
      </PageShell>
    </main>
  );
}
