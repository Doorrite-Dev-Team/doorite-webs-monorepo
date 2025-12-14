// "use client";
// app/(meta)/privacy/page.tsx

import Privacy from "@/legal/privacy";
import type { Metadata } from "next";

import React from "react";

// NOTE: You no longer need the 'renderMarkdown' mock function.

export const metadata: Metadata = {
  title: "Privacy Policy | Doorrite",
  description:
    "Official privacy policy for Doorrite food delivery services in Ilorin, Nigeria.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Doorrite Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last Updated: January 1, 2026
          </p>
        </header>

        <article className="prose prose-blue max-w-none text-gray-700 space-y-6">
          {/* Render the MDX content as a React component */}
          {/*<PrivacyContent />*/}
          {/*<MdxClientWrapper content={PrivacyContent} />*/}
          <Privacy />
        </article>

        <footer className="mt-12 pt-6 border-t text-sm text-gray-500">
          <p>
            For any questions regarding these policies, please contact us at
            doorrite.info@gmail.com.
          </p>
        </footer>
      </div>
    </div>
  );
}
