"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";

export function OrdersSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-0 bg-gray-50/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-14 h-14 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32" />
                <div className="flex space-x-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="w-3 h-3 rounded-full ml-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
