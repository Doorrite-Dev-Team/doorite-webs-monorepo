import React from "react";
import type { Metadata } from "next";
// NOTE: You will typically use a library like 'gray-matter' and
// 'next-mdx-remote' (or similar) to load and render Markdown content.
// Since we cannot read local files here, we import the content as a string.

// Mock import of the Markdown content for demonstration
import legalContent from "@/legal/privacy.md";

// Mock Markdown Renderer: In a real app, use 'react-markdown' or MDX.
// This function performs a basic conversion to HTML elements for readability.
const renderMarkdown = (markdown: string) => {
  const htmlContent = markdown
    .replace(/^#\s+(.*)$/gm, "<h1>$1</h1>")
    .replace(/^##\s+(.*)$/gm, "<h2>$1</h2>")
    .replace(/^###\s+(.*)$/gm, "<h3>$1</h3>")
    .replace(/^\*\s+(.*)$/gm, "<li>$1</li>")
    .replace(/\*{2}(.*?)\*{2}/g, "<strong>$1</strong>");

  // Wrap list items in <ul> for basic structure
  let finalHtml = htmlContent
    .replace(/<li>/g, "</li><ul><li>")
    .replace(/<\/ul><li>/g, "<ul><li>")
    .replace(/<ul><li>/g, "<ul><li>")
    .replace(/<\/li><ul>/g, "</li></ul>");

  // Simple paragraph wrapping
  finalHtml = finalHtml
    .split("\n\n")
    .map((p) => {
      if (p.startsWith("<h") || p.startsWith("<ul>")) return p;
      return `<p>${p}</p>`;
    })
    .join("");

  return { __html: finalHtml };
};

export const metadata: Metadata = {
  title: "Privacy Policy | Doorrite",
  description:
    "Official privacy policy for Doorrite food delivery services in Ilorin, Nigeria.",
};

/**
 * Renders the Doorrite Privacy Policy page.
 * Assumes the Markdown content is loaded via a static import.
 */
export default function PrivacyPolicyPage() {
  const renderedContent = renderMarkdown(legalContent);

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

        <article
          className="prose prose-blue max-w-none text-gray-700 space-y-6"
          // In a real application, replace this with a proper Markdown/MDX component
          dangerouslySetInnerHTML={renderedContent}
        />

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
