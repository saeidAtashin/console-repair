"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ShopCatalog from "@/app/components/shop/ShopCatalog";
import ShopSearch from "@/app/components/shop/ShopSearch";
import ShopServicesSection from "@/app/components/shop/ShopServicesSection";
import ShopTrustBar from "@/app/components/shop/ShopTrustBar";
import { normalizeSearchQuery } from "@/lib/shop";

export default function ShopPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const searchQuery = useMemo(
    () => normalizeSearchQuery(initialQuery),
    [initialQuery],
  );

  const handleQueryChange = useCallback(
    (nextQuery: string) => {
      const normalized = normalizeSearchQuery(nextQuery);
      const params = new URLSearchParams(searchParams.toString());

      if (normalized) {
        params.set("q", normalized);
      } else {
        params.delete("q");
      }

      const search = params.toString();
      router.replace(search ? `/shop?${search}` : "/shop", { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <>
      <ShopSearch
        variant="page"
        initialQuery={initialQuery}
        onQueryChange={handleQueryChange}
        syncUrl
      />
      <ShopTrustBar />
      <ShopCatalog
        searchQuery={searchQuery.length >= 2 ? searchQuery : undefined}
      />
      <ShopServicesSection />
    </>
  );
}
