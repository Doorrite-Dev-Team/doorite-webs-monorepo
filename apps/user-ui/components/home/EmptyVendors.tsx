import { Store } from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/card";

export function EmptyVendors() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-12 text-center">
        <Store className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No restaurants available
        </h3>
        <p className="text-gray-600">
          Check back soon for new restaurants in your area
        </p>
      </CardContent>
    </Card>
  );
}
