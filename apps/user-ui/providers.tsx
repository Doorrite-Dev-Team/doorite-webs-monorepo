"use client";
import React from "react";
import { Provider } from "jotai";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Default query options
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </NuqsAdapter>
        {/* The rest of your application */}
      </QueryClientProvider>
    </Provider>
  );
};

export default Providers;
