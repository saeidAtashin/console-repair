import { absoluteUrl, SITE_NAME } from "./site";
import type { ShopProduct } from "../shop";

export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "fa-IR",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    publisher: { "@id": `${absoluteUrl("/")}#business` },
  };
}

export function itemListJsonLd(input: {
  name: string;
  path: string;
  items: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    url: absoluteUrl(input.path),
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}

export function collectionPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "fa-IR",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function productOfferJsonLd(input: {
  product: ShopProduct;
  path: string;
}) {
  const productUrl = absoluteUrl(input.path);
  const availability = input.product.inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.product.title,
    url: productUrl,
    image: absoluteUrl(input.product.image),
    description: input.product.highlights?.join(" - "),
    category: input.product.console,
    sku: input.product.id,
    itemCondition:
      input.product.condition === "new"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      price: input.product.price,
      priceCurrency: "IRR",
      url: productUrl,
      availability,
    },
  };
}
