"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
  MessageSquareOff,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // Added date-fns

import { Card, CardContent } from "@repo/ui/components/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Progress } from "@repo/ui/components/progress";
import { Skeleton } from "@repo/ui/components/skeleton"; // Use a real skeleton if available
import { api } from "@/libs/api";

interface ReviewsData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { stars: number; count: number; percentage: number }[];
  reviews: Review[];
}

interface VendorReviewsSectionProps {
  vendorId: string;
}

export default function VendorReviewsSection({
  vendorId,
}: VendorReviewsSectionProps) {
  const { data, isLoading, error, refetch } = useQuery<ReviewsData>({
    queryKey: ["vendor-reviews", vendorId],
    queryFn: async () => {
      const response = await api.fetchReviews(vendorId);
      // FIX: Ensure we never return undefined
      if (!response) {
        throw new Error("No data received from server");
      }

      return response;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.round(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-200"
        }`}
      />
    ));
  };

  if (isLoading) return <ReviewsSkeleton />;

  if (error || !data) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-12 text-center">
          <p className="text-destructive mb-4">Unable to load reviews.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Rating Summary Stats */}
      <Card className="overflow-hidden border-none shadow-md bg-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex flex-col items-center justify-center text-center px-6 border-r-0 md:border-r border-gray-100">
              <span className="text-6xl font-black text-gray-900 leading-none">
                {data.averageRating.toFixed(1)}
              </span>
              <div className="flex my-3">
                {renderStars(data.averageRating, "w-5 h-5")}
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                {data.totalReviews.toLocaleString()} reviews
              </p>
            </div>

            <div className="flex-1 w-full space-y-3">
              {[...data.ratingDistribution].reverse().map((dist) => (
                <div key={dist.stars} className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-600 w-4">
                    {dist.stars}
                  </span>
                  <Progress
                    value={dist.percentage}
                    className="h-2 flex-1 bg-gray-100"
                  />
                  <span className="text-xs text-gray-400 w-10 text-right font-mono">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Individual Reviews List */}
      <div className="space-y-4">
        {data.reviews.length === 0 ? (
          <div className="py-16 text-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
            <MessageSquareOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              No reviews yet
            </h3>
            <p className="text-gray-500">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          data.reviews.map((review) => (
            <Card
              key={review.id}
              className="group hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 ring-2 ring-white">
                    <AvatarImage
                      src={review.userAvatar}
                      alt={review.userName}
                    />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {review.userName}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex">
                            {renderStars(review.rating, "w-3 h-3")}
                          </div>
                          <span className="text-[12px] text-gray-400 font-medium">
                            {/* date-fns Usage */}
                            {formatDistanceToNow(new Date(review.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-2 mt-5">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 rounded-full px-3 text-xs gap-2"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> {review.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-full px-3 text-xs gap-2"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-xl" />
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  );
}
