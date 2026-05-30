"use client";

import { useMemo, useState } from "react";

import ContactCTA from "./sections/ContactCTA";
import Hero from "./sections/hero/Hero";
import Services from "./sections/Services";
import ServicesSection from "./sections/ServicesSection";
import WhyUs from "./sections/WhyUs";
import IndustrialBackground from "./ui/IndustrialBackground";
import PriceTable from "./sections/PriceTable";
import ProductsPreview from "./sections/ProductsPreview";

export default function HomePage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const spotlight = useMemo(
    () => ({
      background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(249,115,22,0.12), transparent 45%)`,
    }),
    [mouse],
  );

  return (
    <main
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
      className="relative bg-black pt-20"
    >
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-60"
        style={spotlight}
      />
      <IndustrialBackground />
      <Hero />
      <Services />
      <PriceTable />
      <ProductsPreview />
      <ContactCTA />
      <ServicesSection />
      <WhyUs />
    </main>
  );
}
