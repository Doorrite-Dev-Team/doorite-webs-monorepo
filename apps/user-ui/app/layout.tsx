import { Toaster } from "@repo/ui/components/sonner";
import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
// import { Provider } from "jotai";
import Providers from "@/providers";
import SplashScreen from "@/components/global/SplashScreen";

const plus_Jakarta_Sans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doorrite - Food Delivery Made Easy",
  description: "Order food from your favorite restaurants",
  icons: {
    icon: "/icon.ico",
  },
  // viewport: {
  //   width: "device-width",
  //   initialScale: 1,
  //   maximumScale: 1,
  //   userScalable: false,
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plus_Jakarta_Sans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Providers>
          <SplashScreen duration={2500}>{children}</SplashScreen>
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
