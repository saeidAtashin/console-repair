"use client";

import { useMemo, useState } from "react";

import ContactCTA from "./sections/ContactCTA";
import Hero from "./sections/hero/Hero";
import Services from "./sections/Services";
import ServicesSection from "./sections/ServicesSection";
import Testimonials from "./sections/Testimonials";
import WhyUs from "./sections/WhyUs";
import GamingBackground from "./ui/GamingBackground";

export default function HomePage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const spotlight = useMemo(
    () => ({
      background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(56,189,248,0.15), transparent 45%)`,
    }),
    [mouse],
  );

  return (
    <main
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
      className="relative overflow-hidden bg-black pt-20"
    >
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-60"
        style={spotlight}
      />
      <GamingBackground />
      <Hero />
      <Services />
      <ContactCTA />
      <ServicesSection />
      <WhyUs />
      <Testimonials />
    </main>
  );
}
