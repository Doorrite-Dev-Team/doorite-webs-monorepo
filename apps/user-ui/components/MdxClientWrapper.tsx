// src/components/MdxClientWrapper.tsx
"use client";

import React from "react";

// Define the type for the MDX Component you will pass
interface MdxClientWrapperProps {
  content: React.ComponentType<any>;
}

export function MdxClientWrapper({ content: Content }: MdxClientWrapperProps) {
  // This component acts as the Client boundary.
  return <Content />;
}
