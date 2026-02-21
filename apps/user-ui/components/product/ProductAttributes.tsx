// components/product/ProductAttributes.tsx
"use client";

import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { Package, Tag } from "lucide-react";

interface ProductAttributesProps {
  attributes: Record<string, string>;
}

export default function ProductAttributes({
  attributes,
}: ProductAttributesProps) {
  const attributeEntries = Object.entries(attributes).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );

  if (attributeEntries.length === 0) return null;

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Product Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {attributeEntries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <Tag className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 capitalize mb-1">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                {typeof value === "boolean" ? (
                  <Badge
                    variant={value ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {value ? "Yes" : "No"}
                  </Badge>
                ) : Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-1">
                    {value.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {String(item)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="font-medium text-gray-900 truncate">
                    {String(value)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
