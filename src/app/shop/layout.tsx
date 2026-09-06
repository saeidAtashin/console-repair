import { redirect } from "next/navigation";

import { SHOP_ENABLED } from "@/lib/shop";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!SHOP_ENABLED) {
    redirect("/coming-soon");
  }

  return children;
}
