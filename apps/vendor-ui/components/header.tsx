"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@repo/ui/components/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { dooriteLogo } from "@repo/ui/assets";

const navLinks = [
  { name: "Benefits", href: "#benefits" },
  { name: "Impact", href: "#impact" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Testimonials", href: "#testimonials" },
];

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={dooriteLogo}
                alt="Doorrite Vendor Logo"
                width={32}
                height={32}
                className=" text-green-600"
              />
              <span className="font-bold text-xl text-green-700">
                Doorrite Vendor
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/log-in">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/log-in">Log In</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-16" />
    </>
  );
}
