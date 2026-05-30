import PageShell from "@/app/components/seo/PageShell";
import CartPageClient from "./CartPageClient";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "سبد خرید",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-16 text-white">
      <PageShell currentPath="/cart" containerClassName="container mx-auto max-w-7xl px-6">
        <h1 className="text-4xl font-black mb-8">سبد خرید</h1>
        <CartPageClient />
      </PageShell>
    </main>
  );
}
