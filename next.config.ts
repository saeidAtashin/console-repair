import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  skipTrailingSlashRedirect: true,
  // Allow LAN phone access during `next dev` (Next.js 16 blocks cross-origin /_next by default)
  allowedDevOrigins: [
    "192.168.1.101",
    "192.168.176.1",
    "localhost",
    "127.0.0.1",
  ],
  serverExternalPackages: ["better-sqlite3"],
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
      {
        protocol: "https",
        hostname: "k3isonfire.ir",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "api.k3isonfire.ir",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
