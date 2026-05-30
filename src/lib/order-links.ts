import { services } from "@/app/data/services";
import { products } from "@/app/data/products";
import { getServiceBySlug } from "./cnc-catalog";

export type OrderPrefill = {
  serviceSlug?: string;
  productSlug?: string;
  material?: string;
  description?: string;
};

export function isServiceSlug(value: string): boolean {
  return services.some((s) => s.slug === value);
}

export function isProductSlug(value: string): boolean {
  return products.some((p) => p.slug === value);
}

export function buildOrderCanonicalPath(prefill?: OrderPrefill): string {
  if (prefill?.serviceSlug) {
    return `/order?service=${prefill.serviceSlug}`;
  }
  if (prefill?.productSlug) {
    return `/order?product=${prefill.productSlug}`;
  }
  return "/order";
}

export function buildOrderHref(prefill?: OrderPrefill): string {
  if (
    !prefill?.serviceSlug &&
    !prefill?.productSlug &&
    !prefill?.material &&
    !prefill?.description
  ) {
    return "/order";
  }

  const params = new URLSearchParams();
  if (prefill.serviceSlug) params.set("service", prefill.serviceSlug);
  if (prefill.productSlug) params.set("product", prefill.productSlug);
  if (prefill.material) params.set("material", prefill.material);
  if (prefill.description) params.set("description", prefill.description);

  return `/order?${params.toString()}`;
}

export function parseOrderSearchParams(
  searchParams: URLSearchParams,
): OrderPrefill {
  const service = searchParams.get("service")?.trim() ?? "";
  const product = searchParams.get("product")?.trim() ?? "";

  return {
    serviceSlug: isServiceSlug(service) ? service : undefined,
    productSlug: isProductSlug(product) ? product : undefined,
    material: searchParams.get("material")?.trim() || undefined,
    description: searchParams.get("description")?.trim() || undefined,
  };
}

export function getOrderDeviceLabel(prefill: OrderPrefill): string {
  if (prefill.productSlug) {
    const product = products.find((p) => p.slug === prefill.productSlug);
    return product?.title ?? "محصول CNC";
  }
  if (prefill.serviceSlug) {
    const service = getServiceBySlug(prefill.serviceSlug);
    return service?.title ?? "خدمت CNC";
  }
  return "سفارش CNC";
}

export const MATERIAL_OPTIONS = [
  "MDF 3mm",
  "MDF 8mm",
  "MDF 16mm",
  "HDF",
  "چوب روسی",
  "اکریلیک",
  "PVC",
  "آلومینیوم",
  "سایر",
];
