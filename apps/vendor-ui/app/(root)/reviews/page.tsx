// app/(root)/reviews/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import ReviewsClient from "@/components/reviews/ReviewsClient";
import { getCookieHeader, API_CONFIG } from "@/configs/api";
import { Skeleton } from "@repo/ui/components/skeleton";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Reviews | Doorrite Vendor",
    description: "View customer reviews and ratings",
  };
}

export const dynamic = "force-dynamic";

interface ReviewsPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

async function fetchVendorData(accessToken: string | null) {
  const response = await fetch(`${API_CONFIG.baseUrl}/vendors/me`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
  });

  if (!response.ok) return null;
  return response.json();
}

async function fetchReviews(
  vendorId: string,
  page: string,
  limit: string,
  accessToken: string | null,
) {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/vendors/${vendorId}/reviews?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: "include",
    },
  );

  if (!response.ok) return null;
  return response.json();
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const { page = "1", limit = "10" } = await searchParams;

  const accessToken = await getCookieHeader(true);

  // First get vendor data to get vendorId
  const vendorData = await fetchVendorData(accessToken);
  const vendorId = vendorData?.vendor?.id;

  // Then fetch reviews with the actual vendorId
  let finalReviewsData = null;
  if (vendorId && accessToken) {
    try {
      finalReviewsData = await fetchReviews(vendorId, page, limit, accessToken);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }

  return (
    <Suspense fallback={<ReviewsSkeleton />}>
      <ReviewsClient
        initialData={finalReviewsData}
        vendorId={vendorId}
        currentPage={parseInt(page)}
      />
    </Suspense>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
