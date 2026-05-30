import type { MetadataRoute } from "next";

import { SITE_NAME, SITE_TAGLINE, absoluteUrl } from "../lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "کارگاه CNC",
    description: SITE_TAGLINE,
    start_url: absoluteUrl("/"),
    display: "standalone",
    background_color: "#000000",
    theme_color: "#f97316",
    lang: "fa",
    dir: "rtl",
    orientation: "portrait",
    categories: ["business", "utilities"],
    icons: [
      {
        src: "/images/cnc/milling.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
