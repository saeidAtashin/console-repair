import PageShell from "@/app/components/seo/PageShell";
import CheckoutPageClient from "./CheckoutPageClient";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "تسویه حساب",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-16 text-white">
      <PageShell currentPath="/checkout" containerClassName="container mx-auto max-w-7xl px-6">
        <h1 className="text-4xl font-black mb-8">تسویه حساب</h1>
        <CheckoutPageClient />
      </PageShell>
    </main>
  );
}
