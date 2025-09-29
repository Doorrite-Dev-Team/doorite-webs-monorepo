// app/(home)/explore/page.tsx

import ExplorePage from "@/components/explore/ExplorePage";
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
      <ExplorePage />
    </Suspense>
  );
}
