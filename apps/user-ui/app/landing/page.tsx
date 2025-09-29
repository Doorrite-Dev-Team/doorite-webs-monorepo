"use client";

import Benefits from "@/components/landing/Benefits";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Impact from "@/components/landing/Impact";
import Testimonials from "@/components/landing/Testimonials";
import Header from "@/components/tab-header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen w-full flex flex-col bg-white">
        <Hero />
        <Benefits />
        <Impact />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
