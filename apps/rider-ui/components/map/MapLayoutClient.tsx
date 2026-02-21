"use client";

import React from "react";

interface MapLayoutClientProps {
  children: React.ReactNode;
}

export default function MapLayoutClient({ children }: MapLayoutClientProps) {
  return (
    <div className="h-screen w-full flex flex-col">
      {/* Map occupies full viewport */}
      <div className="flex-1 relative">
        {children}
      </div>
    </div>
  );
}
