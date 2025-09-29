"use client";

import { Twitter, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 md:px-16 py-12">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-semibold text-white mb-3">Company</h3>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Careers</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Legal</h3>
          <ul className="space-y-2">
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Contact</h3>
          <div className="flex space-x-4 text-lg">
            <Twitter className="w-6 h-6 hover:text-white cursor-pointer" />
            <Facebook className="w-6 h-6 hover:text-white cursor-pointer" />
            <Instagram className="w-6 h-6 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      <p className="text-center text-gray-400 mt-10">
        © 2025 Doorrite. All rights reserved.
      </p>
    </footer>
  );
}
