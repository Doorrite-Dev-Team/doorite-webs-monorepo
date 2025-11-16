"use client";
import React from "react";
import { Provider } from "jotai";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return <Provider>{children}</Provider>;
};

export default Providers;
