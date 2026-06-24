"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import ShopSearchSuggestions from "./ShopSearchSuggestions";
import { normalizeSearchQuery, searchShopProducts } from "@/lib/shop";

type Props = {
  variant: "page" | "header";
  initialQuery?: string;
  onQueryChange?: (query: string) => void;
  syncUrl?: boolean;
  onNavigate?: () => void;
};

const DEBOUNCE_MS = 200;

export default function ShopSearch({
  variant,
  initialQuery = "",
  onQueryChange,
  syncUrl = false,
  onNavigate,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setQuery(initialQuery);
    setDebouncedQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
      onQueryChange?.(query);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query, onQueryChange]);

  const results = useMemo(
    () => searchShopProducts(debouncedQuery, { limit: 8 }),
    [debouncedQuery],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery, results.length]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const navigateToProduct = useCallback(
    (consoleSlug: string, slug: string) => {
      setOpen(false);
      onNavigate?.();
      router.push(`/shop/${consoleSlug}/${slug}`);
    },
    [onNavigate, router],
  );

  const submitSearch = useCallback(
    (value: string) => {
      const normalized = normalizeSearchQuery(value);
      setOpen(false);
      onNavigate?.();

      if (syncUrl || pathname === "/shop") {
        const next = normalized ? `/shop?q=${encodeURIComponent(normalized)}` : "/shop";
        router.push(next);
        return;
      }

      router.push(
        normalized ? `/shop?q=${encodeURIComponent(normalized)}` : "/shop",
      );
    },
    [onNavigate, pathname, router, syncUrl],
  );

  const handleSelect = useCallback(
    (index: number) => {
      const result = results[index];
      if (!result) return;
      navigateToProduct(result.product.console, result.product.slug);
    },
    [navigateToProduct, results],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => (prev + 1) % Math.max(results.length, 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((prev) =>
        prev <= 0 ? Math.max(results.length - 1, 0) : prev - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (open && results[activeIndex]) {
        handleSelect(activeIndex);
        return;
      }
      submitSearch(query);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const isPage = variant === "page";
  const showPopularLabel = !normalizeSearchQuery(debouncedQuery);

  return (
    <div
      ref={rootRef}
      className={`relative ${isPage ? "mt-4 w-full" : "w-full max-w-xs lg:max-w-sm"}`}
    >
      <div
        className={`flex items-center gap-2 rounded-2xl border bg-zinc-900/70 backdrop-blur-xl transition focus-within:border-cyan-400/40 ${
          isPage
            ? "border-white/10 px-5 py-3.5"
            : "border-zinc-800 px-3 py-2"
        }`}
      >
        <Search
          className={`shrink-0 text-cyan-400 ${isPage ? "h-5 w-5" : "h-4 w-4"}`}
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            isPage
              ? "جستجوی کنسول، دسته، HDMI، هدست... (فارسی یا English)"
              : "جستجو در فروشگاه..."
          }
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && results[activeIndex]
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          aria-autocomplete="list"
          role="combobox"
          className={`w-full bg-transparent text-white outline-none placeholder:text-zinc-500 ${
            isPage ? "text-base md:text-lg" : "text-sm"
          }`}
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
              onQueryChange?.("");
              if (syncUrl && pathname === "/shop") {
                router.push("/shop");
              }
              inputRef.current?.focus();
            }}
            className="rounded-lg p-1 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            aria-label="پاک کردن جستجو"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {open ? (
        <div
          className={`absolute start-0 top-[calc(100%+0.5rem)] z-[110] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl ${
            isPage ? "" : "min-w-[280px]"
          }`}
        >
          <ShopSearchSuggestions
            listboxId={listboxId}
            results={results}
            activeIndex={activeIndex}
            query={debouncedQuery}
            showPopularLabel={showPopularLabel}
            onHover={setActiveIndex}
            onSelect={(result) =>
              navigateToProduct(result.product.console, result.product.slug)
            }
          />
        </div>
      ) : null}
    </div>
  );
}
