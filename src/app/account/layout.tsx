import AccountSidebar from "@/app/components/shop/AccountSidebar";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "حساب کاربری",
  path: "/account",
  noIndex: true,
});

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050816] pt-24 pb-16 text-white">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}
