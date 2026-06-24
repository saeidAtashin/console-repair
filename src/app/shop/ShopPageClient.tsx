"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ShopCatalog, {
  type ShopConsoleFilter,
} from "@/app/components/shop/ShopCatalog";
import ShopConditionFilters, {
  type ConditionFilterKey,
} from "@/app/components/shop/ShopConditionFilters";
import ShopSearch from "@/app/components/shop/ShopSearch";
import ShopServicesSection from "@/app/components/shop/ShopServicesSection";
import ShopTrustBar from "@/app/components/shop/ShopTrustBar";
import { normalizeSearchQuery } from "@/lib/shop";

type Props = {
  defaultConsole?: ShopConsoleFilter;
};

export default function ShopPageClient({ defaultConsole = "all" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [condition, setCondition] = useState<ConditionFilterKey>("all");

  const searchQuery = useMemo(
    () => normalizeSearchQuery(initialQuery),
    [initialQuery],
  );

  const isSearchMode = searchQuery.length >= 2;

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
      {!isSearchMode ? (
        <ShopConditionFilters value={condition} onChange={setCondition} />
      ) : null}
      {/* <ShopTrustBar /> */}
      <ShopCatalog
        defaultConsole={defaultConsole}
        condition={condition}
        searchQuery={isSearchMode ? searchQuery : undefined}
      />
      <ShopServicesSection />
    </>
  );
}
