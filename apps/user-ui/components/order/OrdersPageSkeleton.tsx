import { Card, CardContent } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";

export default function OrdersPageSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters Skeleton */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="w-[200px] h-10" />
            </div>
            <Skeleton className="w-24 h-9" />
          </div>
        </CardContent>
      </Card>

      {/* Order Cards Skeleton */}
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-0 shadow-md">
          <CardContent className="p-0">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
            <div className="p-4 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
