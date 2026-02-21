import { Card, CardContent } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";

export default function OrderTrackingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="container max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="mt-3">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Estimated Delivery Skeleton */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-5 w-48 mb-4" />
              <Skeleton className="h-12 w-32" />
            </CardContent>
          </Card>

          {/* Timeline Skeleton */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-5 w-32 mb-6" />

              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items Skeleton */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-5 w-32 mb-4" />

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address Skeleton */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          {/* Support Buttons Skeleton */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-5 w-24 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
