import JsonLd from "@/app/components/seo/JsonLd";
import {
  SITE_AREAS_SERVED,
  SITE_NAME,
  absoluteUrl,
} from "../../../lib/seo/site";

interface Props {
  title: string;
  description: string;
  url: string;
}

export default function ServiceSchema({ title, description, url }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    serviceType: title,
    description,
    url: absoluteUrl(url),
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      "@id": `${absoluteUrl("/")}#business`,
    },
    areaServed: SITE_AREAS_SERVED,
  };

  return <JsonLd data={schema} />;
}
