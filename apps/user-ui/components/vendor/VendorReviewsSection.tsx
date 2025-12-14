"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, ThumbsUp, ThumbsDown, User } from "lucide-react";

import { Card, CardContent } from "@repo/ui/components/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Progress } from "@repo/ui/components/progress";
import { api } from "@/libs/api";

interface VendorReviewsSectionProps {
  vendorId: string;
}

// async function fetchReviews(vendorId: string): Promise<ReviewsData> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}/reviews`,
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch reviews");
//   }

//   const data = await res.json();
//   return data.data;
// }

export default function VendorReviewsSection({
  vendorId,
}: VendorReviewsSectionProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-reviews", vendorId],
    queryFn: () => api.fetchReviews(vendorId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">
            Unable to load reviews. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Left: Average Rating */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {data.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {renderStars(Math.round(data.averageRating))}
              </div>
              <p className="text-gray-600 text-sm">
                Based on {data.totalReviews} review
                {data.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Right: Rating Distribution */}
            <div className="space-y-2">
              {data.ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-gray-700 font-medium">
                      {dist.stars}
                    </span>
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <Progress value={dist.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {data.reviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">
                No reviews yet. Be the first to review!
              </p>
            </CardContent>
          </Card>
        ) : (
          data.reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage
                      src={review.userAvatar}
                      alt={review.userName}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {review.userName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">
                      {review.comment}
                    </p>

                    {/* Helpful Actions */}
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-primary gap-1.5"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{review.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900 gap-1.5"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm">{review.dislikes}</span>
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
