"use client";

import Benefits from "@/components/landing/Benefits";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Impact from "@/components/landing/Impact";
import Testimonials from "@/components/landing/Testimonials";
// import Header from "@/components/navigations/main-header";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <div className="max-w-7xl mx-auto">
        <Benefits />
        <Impact />
        <HowItWorks />
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
}
