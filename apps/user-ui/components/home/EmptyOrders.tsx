import { Package } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import Link from "next/link";

export function EmptyOrders() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-12 text-center">
        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No orders yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start ordering from your favorite restaurants
        </p>
        <Link href="/vendor">
          <Button>Browse Restaurants</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
