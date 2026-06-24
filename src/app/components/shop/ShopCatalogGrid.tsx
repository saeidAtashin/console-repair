import ProductCard from "@/app/components/shop/ProductCard";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORY_ORDER,
  SHOP_CONSOLE_META,
  type ProductCategory,
  type ShopConsole,
  type ShopProduct,
} from "@/lib/shop";

function ProductSection({
  title,
  products,
  emptyMessage,
}: {
  title: string;
  products: ShopProduct[];
  emptyMessage?: string;
}) {
  if (products.length === 0 && !emptyMessage) return null;

  return (
    <section className="mt-12 first:mt-8">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-2xl font-black text-white md:text-3xl">{title}</h2>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
          {products.length} مورد
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-transparent" />
      </div>

      {products.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 text-zinc-300">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

type BrowseProps = {
  mode: "browse";
  grouped: Record<ProductCategory, ShopProduct[]>;
  activeConsole: ShopConsole | "all";
  condition: "all" | "new" | "used";
};

type SearchProps = {
  mode: "search";
  searchQuery: string;
  searchResults: ShopProduct[];
};

type Props = BrowseProps | SearchProps;

export default function ShopCatalogGrid(props: Props) {
  if (props.mode === "search") {
    const { searchQuery, searchResults } = props;

    return (
      <section className="mt-10">
        <p className="text-sm text-zinc-400">
          {searchResults.length} نتیجه برای «{searchQuery}»
        </p>
        {searchResults.length > 0 ? (
          <ProductSection title="نتایج جستجو" products={searchResults} />
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 text-zinc-300">
            نتیجه‌ای برای «{searchQuery}» پیدا نشد.
          </div>
        )}
      </section>
    );
  }

  const { grouped, activeConsole } = props;
  const isAllConsoles = activeConsole === "all";
  const consoleLabel = isAllConsoles
    ? "همه کنسول‌ها"
    : SHOP_CONSOLE_META[activeConsole].label;

  const totalCount = PRODUCT_CATEGORY_ORDER.reduce(
    (sum, category) => sum + grouped[category].length,
    0,
  );

  return (
    <section className="mt-6">
      <p className="text-sm text-zinc-400">
        {isAllConsoles
          ? `${totalCount} محصول`
          : `${totalCount} محصول برای ${consoleLabel}`}
      </p>

      {totalCount === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 text-zinc-300">
          {isAllConsoles
            ? "محصولی با این فیلتر پیدا نشد."
            : `محصولی با این فیلتر برای ${consoleLabel} پیدا نشد.`}
        </div>
      ) : (
        <>
          <ProductSection
            title={PRODUCT_CATEGORY_LABELS.console}
            products={grouped.console}
            emptyMessage={
              isAllConsoles
                ? "کنسولی با این فیلتر موجود نیست."
                : `کنسولی با این فیلتر برای ${consoleLabel} موجود نیست.`
            }
          />
          <ProductSection
            title={PRODUCT_CATEGORY_LABELS.tools}
            products={grouped.tools}
          />
          <ProductSection
            title={PRODUCT_CATEGORY_LABELS.accessories}
            products={grouped.accessories}
          />
        </>
      )}
    </section>
  );
}
