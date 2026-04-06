"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    fullName: string;
    profileImageUrl?: string;
  };
}

interface ReviewsDisplayProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution?: Record<number, number>;
  isLoading?: boolean;
}

export function ReviewsDisplay({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
  isLoading,
}: ReviewsDisplayProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const safeReviews = reviews ?? [];
  const totalPages = Math.ceil(safeReviews.length / reviewsPerPage);

  const paginatedReviews = safeReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage,
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!safeReviews || safeReviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground">
            {(averageRating ?? 0).toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 my-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-4 h-4",
                  star <= Math.round(averageRating ?? 0)
                    ? "fill-secondary text-secondary"
                    : "fill-muted text-muted-foreground/30",
                )}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {totalReviews ?? 0} reviews
          </p>
        </div>

        {ratingDistribution && (
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star] || 0;
              const percentage =
                (totalReviews ?? 0) > 0
                  ? (count / (totalReviews ?? 0)) * 100
                  : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-3">
                    {star}
                  </span>
                  <Star className="w-3 h-3 fill-muted text-muted-foreground/30" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {paginatedReviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={review.user.profileImageUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {getInitials(review.user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {review.user.fullName}
                    </p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-3 h-3",
                            star <= review.rating
                              ? "fill-secondary text-secondary"
                              : "fill-muted text-muted-foreground/30",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
