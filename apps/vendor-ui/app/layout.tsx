import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plus_Jakarta_Sans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doorite Vendor UI",
  description: "Vendor interface for Doorite",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plus_Jakarta_Sans.variable} ${geistMono.variable} max-w-4xl mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
