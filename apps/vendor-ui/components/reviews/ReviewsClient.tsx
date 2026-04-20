"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Star, ChevronLeft, ChevronRight, User } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import api from "@/actions/api";
import { format } from "date-fns";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

interface ReviewsData {
  reviewsData: {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
    ratingDistribution: RatingDistribution[];
  };
}

interface ReviewsClientProps {
  initialData: ReviewsData | null;
  vendorId: string;
  currentPage?: number;
}

export default function ReviewsClient({
  initialData,
  vendorId,
  currentPage = 1,
}: ReviewsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam) : currentPage;
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor-reviews", vendorId, page],
    queryFn: () => api.fetchVendorReviews(vendorId, page, limit),
    initialData: initialData,
    enabled: !!vendorId,
    staleTime: 2 * 60 * 1000,
  });

   const handlePageChange = (newPage: number) => {
     const params = new URLSearchParams(searchParams.toString());
     params.set("page", newPage.toString());
     const queryString = params.toString();
     const url = queryString ? `${pathname}?${queryString}` : pathname;
     // @ts-ignore - Next.js router.push accepts string URLs
     router.push(url);
   };

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  if (isError || !data?.reviewsData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Failed to load reviews</p>
      </div>
    );
  }

  const { reviews, averageRating, totalReviews, ratingDistribution } =
    data.reviewsData;
  const totalPages = Math.ceil(totalReviews / limit);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Customer Reviews
      </h1>

      {/* Rating Overview */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Average Rating */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-6xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </p>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">{totalReviews} reviews</p>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{dist.stars} ⭐</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No reviews yet</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {review.userAvatar ? (
                    <Image
                      src={review.userAvatar}
                      alt={review.userName}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.userName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(review.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
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
