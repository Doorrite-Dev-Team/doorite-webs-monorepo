"use client";

import Link from "next/link";
import Image from "next/image";
import { iconTwitter, iconFacebook, iconInstagram } from "@repo/ui/assets";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 md:px-16 py-12">
      <div className="grid gap-6 md:grid-cols-3 text-left">
        {/* Company Section */}
        <div>
          <h3 className="font-semibold text-white mb-3">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/careers"
                className="hover:text-white transition-colors"
              >
                Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h3 className="font-semibold text-white mb-3">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="font-semibold text-white mb-3">Contact</h3>
          <div className="flex space-x-4">
            <Link href="https://twitter.com/doorrite" target="_blank">
              <Image
                src={iconTwitter}
                alt="Twitter"
                width={24}
                height={24}
                className="hover:opacity-100 opacity-80 transition-opacity"
              />
            </Link>
            <Link href="https://facebook.com/doorrite" target="_blank">
              <Image
                src={iconFacebook}
                alt="Facebook"
                width={24}
                height={24}
                className="hover:opacity-100 opacity-80 transition-opacity"
              />
            </Link>
            <Link href="https://instagram.com/doorrite" target="_blank">
              <Image
                src={iconInstagram}
                alt="Instagram"
                width={24}
                height={24}
                className="hover:opacity-100 opacity-80 transition-opacity"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-gray-400 mt-10 text-sm">
        © {new Date().getFullYear()} Doorrite. All rights reserved.
      </p>
    </footer>
  );
}
