"use client";
import React from "react";
import { Provider } from "jotai";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { useReviewTrigger } from "@/hooks/use-review-trigger";
import { ReviewModal } from "@/components/reviews/ReviewModal";

function ReviewTrigger() {
  const {
    modalOpen,
    currentOrder,
    pendingOrders,
    handleOpenChange,
    handleSuccess,
  } = useReviewTrigger();

  return (
    <ReviewModal
      open={modalOpen}
      onOpenChange={handleOpenChange}
      order={currentOrder}
      onSuccess={handleSuccess}
    />
  );
}

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
  return (
    <SidebarProvider>
      <Provider>
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            {children}
            <ReviewTrigger />
            <ReactQueryDevtools initialIsOpen={false} />
          </NuqsAdapter>
        </QueryClientProvider>
      </Provider>
    </SidebarProvider>
  );
};

export default Providers;
