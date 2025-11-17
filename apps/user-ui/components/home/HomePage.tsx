"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/components/button";
import { ChevronRight, ShoppingCart, UtensilsCrossed, Zap } from "lucide-react";
import Axios from "@/libs/Axios";

import { OrderCard } from "@/components/order";
import { TrackYourOrder } from "@/components/track-order";
import { orders } from "@/libs/contant";
import { CategoryCard } from "@/components/home/CategoryCard";
import { RestaurantsSkeleton } from "@/components/home/RestaurantsSkeleton";
import { OrdersSkeleton } from "@/components/home/OrdersSkeleton";
import { EmptyOrders } from "@/components/home/EmptyOrders";
import { EmptyRestaurants } from "@/components/home/EmptyRestaurants";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { useUser } from "@/hooks/use-user";

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

const topRestaurants: Restaurant[] = [
  {
    id: "r1",
    name: "The Italian Place",
    image: "🍝",
    rating: 4.8,
    deliveryTime: "25-35 min",
    category: "Italian",
    priceRange: "$$",
    trending: true,
  },
  {
    id: "r2",
    name: "Taco House",
    image: "🌮",
    rating: 4.7,
    deliveryTime: "15-25 min",
    category: "Mexican",
    priceRange: "$",
    trending: false,
  },
];

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOrdersLoading] = useState(false);
  const [isRestaurantsLoading] = useState(false);
  const [hasActiveOrder] = useState(true);
  const [userName, setUserName] = useState("Guest");

  // ✅ Fetch current user from localStorage
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       if (typeof window === "undefined") return;

  //       const userData = localStorage.getItem("user");
  //       console.log("Fetched raw user data:", userData);

  //       if (!userData) {
  //         setUserName("Guest");
  //         return;
  //       }

  //       const parsed = JSON.parse(userData);
  //       console.log("Parsed user object:", parsed);

  //       // 👇 Extract user object correctly
  //       const user = parsed?.user || parsed;
  //       const userId = user?.id || user?._id;

  //       console.log("Extracted userId:", userId);

  //       if (!userId) {
  //         console.warn("User ID not found in localStorage.");
  //         setUserName("Guest");
  //         return;
  //       }

  //       // 🌐 Fetch updated user details
  //       const res = await Axios.get(`/user/${userId}`, {
  //         withCredentials: true,
  //       });

  //       const name =
  //         res.data?.data?.fullName ?? user?.fullName ?? user?.name ?? "Guest";

  //       console.log("Fetched name from API or local:", name);
  //       setUserName(name);
  //     } catch (err) {
  //       console.error("❌ Failed to fetch user:", err);
  //       setUserName("Guest");
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // ✅ Keep updating current time
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const S = async () => {
      const name = await useUser();
      setUserName(name);
    };
    S();
  }, []);

  const categories = [
    {
      name: "Food",
      icon: UtensilsCrossed,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      description: "Restaurants & Fast Food",
      href: "/explore?cat=food",
    },
    {
      name: "Groceries",
      icon: ShoppingCart,
      color: "bg-primary/5 text-primary border-primary/10",
      description: "Fresh & Daily Essentials",
      href: "/explore?cat=grocery",
    },
    {
      name: "Pick-Up Delivery",
      icon: Zap,
      color: "bg-orange-50 text-orange-600 border-orange-100",
      description: "15 min delivery",
      href: "/delivery",
    },
  ];

  const sortedOrders = [...orders.slice(0, 2)].sort(
    (a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Welcome */}
      <div className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 md:px-8 pt-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Hello, {userName}!
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {currentTime.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <Link href="/orders">
                <Button variant="ghost" size="sm">
                  My Orders
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((c) => (
              <CategoryCard
                key={c.name}
                href={c.href}
                title={c.name}
                description={c.description}
                Icon={c.icon}
                color={c.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <section className="px-4 sm:px-6 md:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Recent Orders</h2>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ChevronRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
        {isOrdersLoading ? (
          <OrdersSkeleton />
        ) : sortedOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-3">
            {sortedOrders.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </section>

      {/* Top Restaurants */}
      <section className="px-4 sm:px-6 md:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Top Restaurants</h2>
          <Link href="/restaurants">
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ChevronRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
        {isRestaurantsLoading ? (
          <RestaurantsSkeleton />
        ) : topRestaurants.length === 0 ? (
          <EmptyRestaurants />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {topRestaurants.map((r) => (
              <RestaurantCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </section>

      {hasActiveOrder && <TrackYourOrder order={orders[1]!} />}
      <div className="h-6" />
    </div>
  );
}
