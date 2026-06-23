import PageShell from "@/app/components/seo/PageShell";
import CartPageClient from "./CartPageClient";
import { createPageMetadata } from "@/lib/seo/metadata";
import { webPageJsonLd } from "@/lib/seo/jsonld";

const PATH = "/shop/cart";
const TITLE = "سبد خرید";
const DESCRIPTION = "مشاهده محصولات انتخاب شده و نهایی کردن سفارش خرید کنسول.";

export const metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  noIndex: true,
});

export default function CartPage() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <PageShell
        currentPath={PATH}
        jsonLd={webPageJsonLd({ name: TITLE, description: DESCRIPTION, path: PATH })}
        containerClassName="container mx-auto px-6"
      >
        <h1 className="text-4xl font-black md:text-5xl">سبد خرید</h1>
        <p className="mt-3 mb-10 max-w-2xl text-zinc-400">
          محصولات انتخاب شده خود را بررسی کنید و سفارش را ثبت کنید.
        </p>
        <CartPageClient />
      </PageShell>
    </main>
  );
}
