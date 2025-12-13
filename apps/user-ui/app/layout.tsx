import { Toaster } from "@repo/ui/components/sonner";
import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
// import { Provider } from "jotai";
import Providers from "@/providers";
import SplashScreen from "@/components/SplashScreen";

const plus_Jakarta_Sans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doorite User UI",
  description: "User interface for Doorite",
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
        className={`${plus_Jakarta_Sans.variable} ${geistMono.variable} max-w-full mx-auto`}
      >
        <Providers>
          <SplashScreen duration={2500}>{children}</SplashScreen>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
