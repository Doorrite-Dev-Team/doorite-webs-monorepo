// components/explore/LoadingSkeleton.tsx

import { cn } from "@repo/ui/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        {/* Image skeleton */}
        <div className="h-48 bg-gray-200" />

        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="flex items-center justify-between pt-2">
            <div className="h-5 bg-gray-200 rounded w-20" />
            <div className="h-8 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
