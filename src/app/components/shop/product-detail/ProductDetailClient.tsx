"use client";

import ShopServicesSection from "@/app/components/shop/ShopServicesSection";
import { SHOP_CONSOLE_META, type ShopProduct, type ShopProductDetail } from "@/lib/shop";

import ProductDetailHero from "./ProductDetailHero";
import ProductDetailRelated from "./ProductDetailRelated";
import ProductDetailTabs from "./ProductDetailTabs";
import ProductDetailTrustStrip from "./ProductDetailTrustStrip";

type Props = {
  product: ShopProduct;
  detail: ShopProductDetail;
  related: ShopProduct[];
};

export default function ProductDetailClient({ product, detail, related }: Props) {
  const brand = SHOP_CONSOLE_META[product.console].brand;

  return (
    <>
      <ProductDetailHero product={product} detail={detail} brand={brand} />
      <ProductDetailTrustStrip />
      <ProductDetailTabs detail={detail} brand={brand} />
      <ProductDetailRelated products={related} />
      <div className="mt-16">
        <ShopServicesSection />
      </div>
    </>
  );
}
