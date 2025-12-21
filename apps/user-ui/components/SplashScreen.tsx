"use client";

import { useEffect, useState } from "react";
import { logoFull } from "@repo/ui/assets";
import Image from "next/image";

interface SplashScreenProps {
  children: React.ReactNode;
  duration?: number; // milliseconds
}

export default function SplashScreen({
  children,
  duration = 2000,
}: SplashScreenProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem("splashShown");

    if (splashShown) {
      setShowSplash(false);
      return;
    }

    // Start fade out animation before hiding
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 500);

    // Hide splash screen after duration
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("splashShown", "true");
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  if (!showSplash) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {/* Logo with animation */}
          <div className="animate-bounce-slow">
            <Image
              src={logoFull}
              alt="Doorrite Logo"
              width={200}
              height={200}
              priority
              className="drop-shadow-2xl"
            />
          </div>

          {/* App name */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#1a7a3e] mb-2">Doorrite</h1>
            <p className="text-gray-600 text-lg">Fast Food Delivery</p>
          </div>

          {/* Loading indicator */}
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-[#1a7a3e] rounded-full animate-pulse-delay-0"></div>
            <div className="w-2 h-2 bg-[#1a7a3e] rounded-full animate-pulse-delay-1"></div>
            <div className="w-2 h-2 bg-[#1a7a3e] rounded-full animate-pulse-delay-2"></div>
          </div>
        </div>
      </div>

      {/* Hidden children during splash */}
      <div className={showSplash ? "hidden" : ""}>{children}</div>
    </>
  );
}
