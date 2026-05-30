import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "192.168.1.101",
    "192.168.176.1",
    "localhost",
    "127.0.0.1",
  ],
  serverExternalPackages: ["better-sqlite3"],
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: "/repair",
        destination: "/order",
        permanent: true,
      },
      {
        source: "/repair/:path*",
        destination: "/order",
        permanent: true,
      },
      {
        source: "/services/game-install/:path*",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/consoles/:path*",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/issues/:path*",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/shop/:path*",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
