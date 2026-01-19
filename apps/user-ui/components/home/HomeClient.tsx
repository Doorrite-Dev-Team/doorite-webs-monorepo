"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@repo/ui/components/button";
import {
  ChevronRight,
  LucideIcon,
  ShoppingCart,
  UtensilsCrossed,
  Zap,
} from "lucide-react";

import CategoryCard from "@/components/home/CategoryCard";
import OrderCard from "@/components/home/OrderCard";
import VendorCard from "@/components/home/VendorCard";
import ActiveOrderTracker from "@/components/home/ActiveOrderTracker";
import { EmptyOrders } from "@/components/home/EmptyOrders";
import { EmptyVendors } from "@/components/home/EmptyVendors";
import Image from "next/image";

interface HomeClientProps {
  user: User | null;
  recentOrders: Order[];
  topVendors: Vendor[];
}

interface Category {
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  href: string;
}

export default function HomeClient({
  user,
  recentOrders,
  topVendors,
}: HomeClientProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update time every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const categories: Category[] = [
    {
      name: "Food",
      icon: UtensilsCrossed,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      description: "Restaurants & Fast Food",
      href: "/explore?category=food",
    },
    {
      name: "Groceries",
      icon: ShoppingCart,
      color: "bg-primary/5 text-primary border-primary/10",
      description: "Fresh & Daily Essentials",
      href: "/explore?category=grocery",
    },
    {
      name: "Quick Delivery",
      icon: Zap,
      color: "bg-orange-50 text-orange-600 border-orange-100",
      description: "15 min delivery",
      href: "/delivery",
    },
  ];

  // Find active order (out for delivery or preparing)
  const activeOrder = recentOrders.find(
    (order) =>
      order.status === "OUT_FOR_DELIVERY" || order.status === "PREPARING",
  );

  console.log(topVendors);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24 mx-auto">
      {/* Welcome Header */}
      <section className="bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Hello, {user?.fullName || "Guest"}! 👋
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center ring-2 ring-primary/20">
                  {user.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt={user.fullName}
                      fill
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-primary">
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  )}
                </div>
              )}
              <Link href="/order">
                <Button variant="ghost" size="sm" className="gap-2">
                  My Orders
                </Button>
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                href={category.href}
                title={category.name}
                description={category.description}
                Icon={category.icon}
                color={category.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Active Order Tracker */}
      {activeOrder && (
        <section className="container max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <ActiveOrderTracker order={activeOrder} />
        </section>
      )}

      {/* Recent Orders */}
      <section className="container max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Recent Orders
          </h2>
          <Link href="/order">
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      {/* Top Vendors */}
      <section className="container max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Top Restaurants
          </h2>
          <Link href="/vendor">
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {topVendors.length === 0 ? (
          <EmptyVendors />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
