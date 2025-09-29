"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export function EmptyOrders() {
  return (
    <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100/50">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <UtensilsCrossed className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-700 mb-2">No recent orders</h3>
        <p className="text-sm text-gray-500 mb-4">
          Your order history will appear here
        </p>
        <div className="flex justify-center">
          <Link href="/restaurants">
            <Button size="sm">Browse Restaurants</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
