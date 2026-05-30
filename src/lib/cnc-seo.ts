import { services } from "@/app/data/services";
import { products } from "@/app/data/products";
import {
  buildOrderCanonicalPath,
  isServiceSlug,
  isProductSlug,
  type OrderPrefill,
} from "./order-links";
import { webPageJsonLd } from "./seo/jsonld";
import { absoluteUrl, SITE_NAME } from "./seo/site";

const DEFAULT_TITLE = "ثبت سفارش CNC";
const DEFAULT_DESCRIPTION =
  "فرم ثبت سفارش CNC. فایل طراحی، جنس و ابعاد را ارسال کنید تا قیمت و زمان تحویل اعلام شود.";
const DEFAULT_KEYWORDS = [
  "ثبت سفارش cnc",
  "سفارش برش mdf",
  "سفارش لیزر",
  "قیمت cnc",
];

export type OrderSeoContext = {
  title: string;
  description: string;
  keywords: string[];
  canonicalPath: string;
  ogImage?: string;
  noIndex: boolean;
  serviceSlug?: string;
  productSlug?: string;
  breadcrumbLabel?: string;
};

type SearchParamValue = string | string[] | undefined;

function firstParam(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) return value[0]?.trim() || undefined;
  return value?.trim() || undefined;
}

export function orderPrefillFromPageSearchParams(
  searchParams: Record<string, SearchParamValue>,
): OrderPrefill {
  const service = firstParam(searchParams.service) ?? "";
  const product = firstParam(searchParams.product) ?? "";

  return {
    serviceSlug: isServiceSlug(service) ? service : undefined,
    productSlug: isProductSlug(product) ? product : undefined,
    material: firstParam(searchParams.material),
    description: firstParam(searchParams.description),
  };
}

export function resolveOrderSeo(
  searchParams: Record<string, SearchParamValue>,
): OrderSeoContext {
  const prefill = orderPrefillFromPageSearchParams(searchParams);
  const canonicalPath = buildOrderCanonicalPath(prefill);
  const hasMaterial = Boolean(prefill.material);
  const hasDescription = Boolean(prefill.description);

  if (prefill.serviceSlug) {
    const service = services.find((s) => s.slug === prefill.serviceSlug);
    const title = `ثبت سفارش ${service?.title ?? "CNC"}`;
    const description =
      service?.seoDescription ??
      service?.description ??
      "ثبت آنلاین سفارش CNC با ارسال فایل طراحی.";

    return {
      title,
      description,
      keywords: service?.keywords ?? DEFAULT_KEYWORDS,
      canonicalPath,
      ogImage: service?.cover ?? service?.image,
      noIndex: false,
      serviceSlug: prefill.serviceSlug,
      breadcrumbLabel: service?.title,
    };
  }

  if (prefill.productSlug) {
    const product = products.find((p) => p.slug === prefill.productSlug);
    const title = `سفارش ${product?.title ?? "محصول CNC"}`;
    const description =
      product?.seoDescription ??
      product?.description ??
      "ثبت سفارش محصول CNC با قیمت روز بازار.";

    return {
      title,
      description,
      keywords: product?.keywords ?? DEFAULT_KEYWORDS,
      canonicalPath,
      ogImage: product?.image,
      noIndex: false,
      productSlug: prefill.productSlug,
      breadcrumbLabel: product?.title,
    };
  }

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    canonicalPath,
    noIndex: hasMaterial || hasDescription,
  };
}

export function orderBreadcrumbItems(ctx: OrderSeoContext) {
  if (ctx.breadcrumbLabel) {
    return [
      { label: "خانه", href: "/" },
      { label: "ثبت سفارش", href: "/order" },
      { label: ctx.breadcrumbLabel },
    ];
  }

  return [{ label: "خانه", href: "/" }, { label: "ثبت سفارش" }];
}

function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      "@id": `${absoluteUrl("/")}#business`,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "تهران",
    },
  };
}

export function orderPageJsonLd(
  ctx: OrderSeoContext,
): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [
    webPageJsonLd({
      name: ctx.title,
      description: ctx.description,
      path: ctx.canonicalPath,
    }),
  ];

  if (ctx.serviceSlug) {
    const service = services.find((s) => s.slug === ctx.serviceSlug);
    if (service) {
      schemas.push(
        serviceJsonLd({
          name: service.title,
          description: service.seoDescription ?? service.description,
          path: ctx.canonicalPath,
        }),
      );
    }
  }

  return schemas;
}

export function orderSitemapPaths(): string[] {
  return [
    "/order",
    ...services.map((s) => `/order?service=${s.slug}`),
    ...products.slice(0, 6).map((p) => `/order?product=${p.slug}`),
  ];
}
