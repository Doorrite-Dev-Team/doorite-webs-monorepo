/**
 * About Page — Doorrite
 * Full replacement of the stub.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Users,
  ShoppingBag,
  Bike,
  Heart,
  Mail,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Doorrite",
  description:
    "Learn about Doorrite, Ilorin's fastest growing food and grocery delivery platform.",
};

const STATS = [
  { label: "Orders Delivered", value: "10,000+" },
  { label: "Restaurant Partners", value: "500+" },
  { label: "Active Riders", value: "200+" },
  { label: "Cities Served", value: "Ilorin" },
];

const TEAM_VALUES = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Every decision we make starts with one question: does this make life easier for our customers?",
  },
  {
    icon: Bike,
    title: "Rider Welfare",
    description:
      "Our riders are not just contractors — they are partners. We invest in their safety, earnings, and growth.",
  },
  {
    icon: ShoppingBag,
    title: "Vendor Success",
    description:
      "We grow when our vendors grow. We provide the tools and reach for local businesses to thrive.",
  },
  {
    icon: Users,
    title: "Community Impact",
    description:
      "We are rooted in Ilorin, Kwara State. We create jobs, support local businesses, and give back.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="bg-[#0D1F16] text-white px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-widest uppercase">
            <MapPin className="w-4 h-4" />
            Ilorin, Kwara State, Nigeria
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Delivering Happiness,{" "}
            <span className="text-amber-400">One Door at a Time</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Doorrite is Ilorin&apos;s fastest-growing food and grocery delivery
            platform — connecting customers with the restaurants, shops, and
            riders that power their daily lives.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-5">
        <h2 className="text-2xl font-bold text-foreground">Our Story</h2>
        <p className="text-muted-foreground leading-relaxed">
          Doorrite was founded in Ilorin with a simple idea: people deserve
          fast, reliable delivery from the businesses they love — without the
          frustration that usually comes with it.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We started by partnering with a handful of local restaurants in 2024
          and have since grown to serve thousands of customers across the city,
          working with hundreds of vendors and a dedicated network of riders who
          make it all happen every day.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We are building more than a delivery app — we are building
          infrastructure for local commerce in Nigeria, starting right here in
          Kwara State.
        </p>
      </section>

      {/* Values */}
      <section className="bg-muted/40 border-y border-border py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {TEAM_VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-border p-6 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
        <p className="text-muted-foreground">
          Have questions, feedback, or want to partner with us? We&apos;d love
          to hear from you.
        </p>

        <a
          href="mailto:doorrite.info@gmail.com"
          className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
        >
          <Mail className="w-4 h-4" />
          doorrite.info@gmail.com
        </a>

        <div className="flex items-center gap-4 pt-2">
          <a
            href="https://twitter.com/doorrite"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="https://facebook.com/doorrite"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com/doorrite"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[#0D1F16] text-white text-center px-6 py-14">
        <h2 className="text-2xl font-bold mb-3">Ready to order?</h2>
        <p className="text-white/60 mb-6">
          Join thousands of customers enjoying fast, reliable delivery in
          Ilorin.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 bg-amber-400 text-[#0D1F16] font-bold px-8 py-3 rounded-full hover:bg-amber-300 transition-colors"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
