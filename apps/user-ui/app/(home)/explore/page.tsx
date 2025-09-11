// app/(home)/explore/page.tsx
import ExploreClient from "@/components/explore";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata:Metadata = {
  title: "Explore",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading
        </div>
      }
    >
      <ExploreClient />
    </Suspense>
  );
}
