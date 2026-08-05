import type { NextConfig } from "next";

import { getDesignedCdnHostname } from "./src/lib/designed-assets";

const designedCdnHost = getDesignedCdnHostname();

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/shop", destination: "/studio", permanent: true },
      { source: "/shop/:path*", destination: "/studio", permanent: true },
      { source: "/repair", destination: "/studio", permanent: true },
      { source: "/services/:path*", destination: "/studio", permanent: true },
      { source: "/blog/:path*", destination: "/", permanent: true },
      { source: "/create", destination: "/studio", permanent: true },
      { source: "/create/:path*", destination: "/studio", permanent: true },
      { source: "/design/:path*", destination: "/studio", permanent: true },
      { source: "/cases", destination: "/studio", permanent: true },
      { source: "/cases/:path*", destination: "/studio", permanent: true },
      { source: "/phones/:path*", destination: "/studio", permanent: true },
      { source: "/designs", destination: "/studio", permanent: true },
      { source: "/designs/:path*", destination: "/studio", permanent: true },
    ];
  },
  // Allow LAN phone access during `next dev` (Next.js 16 blocks cross-origin /_next by default)
  allowedDevOrigins: [
    "192.168.1.101",
    "192.168.176.1",
    "localhost",
    "127.0.0.1",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 192, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rawg.io",
        pathname: "/media/**",
      },
      ...(designedCdnHost
        ? [
            {
              protocol: "https" as const,
              hostname: designedCdnHost,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
