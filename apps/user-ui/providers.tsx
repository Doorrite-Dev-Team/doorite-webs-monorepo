"use client";
import React from "react";
import { Provider } from "jotai";
import { NuqsAdapter } from "nuqs/adapters/next/app";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider>
      <NuqsAdapter>{children}</NuqsAdapter>
    </Provider>
  );
};

export default Providers;
