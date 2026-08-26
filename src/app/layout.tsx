import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";

import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LocalBusinessSchema from "./components/seo/LocalBusinessSchema";
import RouteLoadingOverlay from "./components/ui/RouteLoadingOverlay";
import { AuthProvider } from "./context/AuthContext";
import { GameInstallListProvider } from "./context/GameInstallListContext";
import { ShopCartProvider } from "./context/ShopCartContext";
import { rootMetadata } from "../lib/seo/metadata";

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: "#06b6d4",
  width: "device-width",
  initialScale: 1,
};

const samim = localFont({
  src: [
    {
      path: "./fonts/samim/Samim.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/samim/Samim-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/samim/Samim-Medium.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/samim/Samim-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/samim/Samim-Bold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/samim/Samim-Bold.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-samim",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${samim.variable} ${samim.className}`}>
      <body className="font-sans">
        <AuthProvider>
          <ShopCartProvider>
            <GameInstallListProvider>
              <LocalBusinessSchema />
              <Suspense fallback={null}>
                <RouteLoadingOverlay />
              </Suspense>
              <Navbar />
              {children}
              <Footer />
            </GameInstallListProvider>
          </ShopCartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
