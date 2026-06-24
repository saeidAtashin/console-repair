"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ShopSearch from "@/app/components/shop/ShopSearch";
import {
  buildShopPageUrl,
  normalizeSearchQuery,
  parseConditionParam,
} from "@/lib/shop";

type Props = {
  initialQuery: string;
  basePath: string;
};

export default function ShopPageSearch({ initialQuery, basePath }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const handleQueryChange = useCallback(
    (nextQuery: string) => {
      const normalized = normalizeSearchQuery(nextQuery);
      const condition = parseConditionParam(
        new URLSearchParams(searchParamsKey).get("condition") ?? undefined,
      );
      const nextUrl = buildShopPageUrl(basePath, {
        q: normalized || undefined,
        condition,
      });
      const currentUrl = searchParamsKey
        ? `${basePath}?${searchParamsKey}`
        : basePath;

      if (nextUrl === currentUrl) return;

      router.replace(nextUrl, { scroll: false });
    },
    [basePath, router, searchParamsKey],
  );

  return (
    <ShopSearch
      variant="page"
      initialQuery={initialQuery}
      onQueryChange={handleQueryChange}
      syncUrl
      basePath={basePath}
    />
  );
}
