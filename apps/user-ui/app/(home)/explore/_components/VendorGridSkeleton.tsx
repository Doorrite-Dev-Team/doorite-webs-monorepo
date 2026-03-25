// app/(home)/explore/_components/VendorGridSkeleton.tsx

import { Card } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";

export default function VendorGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          {/* Image skeleton */}
          <Skeleton className="aspect-[4/3] w-full" />

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-4 w-20" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
