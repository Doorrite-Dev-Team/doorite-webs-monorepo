// app/(home)/terms/page.tsx (or wherever this lives)

import Terms from "@/legal/Terms";
import type { Metadata } from "next";
import React from "react";

// 1. IMPORT THE MDX FILE AS A COMPONENT (default export)
// import TermsContent from "@/legal/term.mdx";

export const metadata: Metadata = {
  title: "Terms of Service | Doorrite",
  description:
    "Official terms and conditions for Doorrite food delivery services in Ilorin, Nigeria.",
};

export default function TermsAndConditionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Doorrite Terms and Conditions
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last Updated: January 1, 2026
          </p>
        </header>

        <article className="prose prose-blue max-w-none text-gray-700 space-y-6">
          {/* 3. RENDER THE MDX COMPONENT DIRECTLY */}
          {/*<TermsContent />*/}
          <Terms />
        </article>

        <footer className="mt-12 pt-6 border-t text-sm text-gray-500">
          <p>
            For any questions regarding these policies, please contact us at
            support@doorrite.com.
          </p>
        </footer>
      </div>
    </div>
  );
}
