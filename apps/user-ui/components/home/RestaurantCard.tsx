"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Star, Timer, TrendingUp } from "lucide-react";
import Link from "next/link";

type Restaurant = {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  category: string;
  priceRange: string;
  trending: boolean;
};

export function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <Link href={`/vendor/${r.id}`} className="block">
      <Card className="border-0 bg-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer relative overflow-hidden">
        <CardContent className="p-4">
          {r.trending && (
            <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs">
              <TrendingUp size={10} className="mr-1 inline-block" />
              Trending
            </Badge>
          )}
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-4xl mb-3 shadow-sm">
            {r.image}
          </div>
          <h3 className="font-bold text-gray-900 mb-1 leading-tight">
            {r.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            {r.category} • {r.priceRange}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {r.rating}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Timer size={12} />
              <span className="text-xs">{r.deliveryTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
