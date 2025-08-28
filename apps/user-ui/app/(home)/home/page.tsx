// "use client";
// import { Badge } from "@repo/ui/components/badge";
// import { Button } from "@repo/ui/components/button";
// import { Card, CardContent } from "@repo/ui/components/card";
// import { Skeleton } from "@repo/ui/components/skeleton";
// import {
//   Award,
//   ChevronRight,
//   Clock,
//   MapPin,
//   Navigation,
//   Phone,
//   ShoppingCart,
//   Star,
//   Timer,
//   TrendingUp,
//   Truck,
//   UtensilsCrossed,
//   Zap,
// } from "lucide-react";
// import { useEffect, useState } from "react";

// const HomePage = () => {
//   const [isOrdersLoading, setIsOrdersLoading] = useState(false);
//   const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(false);
//   const [hasActiveOrder, setHasActiveOrder] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   // Update time every minute for ETA
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);

// const categories = [
//   {
//     name: "Food",
//     icon: UtensilsCrossed,
//     color: "bg-blue-50 text-blue-600 border-blue-100",
//     description: "Restaurants & Fast Food",
//   },
//   {
//     name: "Groceries",
//     icon: ShoppingCart,
//     color: "bg-primary/5 text-primary border-primary/10",
//     description: "Fresh & Daily Essentials",
//   },
//   {
//     name: "Express",
//     icon: Zap,
//     color: "bg-orange-50 text-orange-600 border-orange-100",
//     description: "15 min delivery",
//   },
// ];

//   const recentOrders = [
//     {
//       id: "#12345",
//       name: "Burger Joint",
//       items: "2 items",
//       image: "🍔",
//       status: "delivered",
//       total: "$24.99",
//       date: "2 hours ago",
//       rating: 4.5,
//     },
//     {
//       id: "#67890",
//       name: "Grocery Store",
//       items: "5 items",
//       image: "🥬",
//       status: "delivered",
//       total: "$45.67",
//       date: "Yesterday",
//       rating: 4.8,
//     },
//     {
//       id: "#98765",
//       name: "Cafe Mocha",
//       items: "3 items",
//       image: "☕",
//       status: "delivered",
//       total: "$18.50",
//       date: "3 days ago",
//       rating: 4.2,
//     },
//   ];

//   const topRestaurants = [
//     {
//       name: "The Italian Place",
//       rating: 4.8,
//       image: "🍝",
//       deliveryTime: "25-35 min",
//       category: "Italian",
//       priceRange: "$$",
//       trending: true,
//     },
//     {
//       name: "Sushi Bar",
//       rating: 4.9,
//       image: "🍣",
//       deliveryTime: "30-40 min",
//       category: "Japanese",
//       priceRange: "$$$",
//       trending: false,
//     },
//     {
//       name: "Taco House",
//       rating: 4.7,
//       image: "🌮",
//       deliveryTime: "15-25 min",
//       category: "Mexican",
//       priceRange: "$",
//       trending: true,
//     },
//     {
//       name: "Pizza Corner",
//       rating: 4.6,
//       image: "🍕",
//       deliveryTime: "20-30 min",
//       category: "Pizza",
//       priceRange: "$$",
//       trending: false,
//     },
//   ];

//   const OrdersSkeleton = () => (
//     <div className="space-y-3">
//       {[1, 2, 3].map((i) => (
//         <Card key={i} className="border-0 bg-gray-50/50">
//           <CardContent className="p-4">
//             <div className="flex items-center space-x-4">
//               <Skeleton className="w-14 h-14 rounded-xl" />
//               <div className="space-y-2 flex-1">
//                 <Skeleton className="h-3 w-20" />
//                 <Skeleton className="h-4 w-32" />
//                 <div className="flex space-x-2">
//                   <Skeleton className="h-3 w-16" />
//                   <Skeleton className="h-3 w-12" />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Skeleton className="h-4 w-16" />
//                 <Skeleton className="w-3 h-3 rounded-full ml-auto" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );

//   const RestaurantsSkeleton = () => (
//     <div className="grid grid-cols-2 gap-4">
//       {[1, 2, 3, 4].map((i) => (
//         <Card key={i} className="border-0 bg-gray-50/50">
//           <CardContent className="p-4">
//             <Skeleton className="aspect-square rounded-xl mb-3" />
//             <Skeleton className="h-4 w-full mb-2" />
//             <div className="flex justify-between">
//               <Skeleton className="h-3 w-12" />
//               <Skeleton className="h-3 w-16" />
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );

//   const EmptyOrders = () => (
//     <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100/50">
//       <CardContent className="p-8 text-center">
//         <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//           <UtensilsCrossed className="w-8 h-8 text-gray-400" />
//         </div>
//         <h3 className="font-semibold text-gray-700 mb-2">No recent orders</h3>
//         <p className="text-sm text-gray-500 mb-4">
//           Your order history will appear here
//         </p>
//         <Button size="sm" className="bg-primary hover:bg-primary/90">
//           Browse Restaurants
//         </Button>
//       </CardContent>
//     </Card>
//   );

//   const EmptyRestaurants = () => (
//     <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100/50">
//       <CardContent className="p-8 text-center">
//         <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//           <Award className="w-8 h-8 text-gray-400" />
//         </div>
//         <h3 className="font-semibold text-gray-700 mb-2">
//           No restaurants available
//         </h3>
//         <p className="text-sm text-gray-500">
//           Check back later for amazing food options
//         </p>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* Welcome Section with improved spacing */}
//       <div className="bg-white shadow-sm">
//         <div className="px-6 pt-8 pb-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Hello, Liam!</h1>
//               <p className="text-gray-500 text-sm mt-1">
//                 {currentTime.toLocaleDateString("en-US", {
//                   weekday: "long",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
//               <span className="text-2xl">👋</span>
//             </div>
//           </div>

//           {/* Enhanced Category Cards */}
//           <div className="grid grid-cols-3 gap-4">
//             {categories.map((category, index) => (
//               <Card
//                 key={index}
//                 className={`border hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer ${category.color}`}
//               >
//                 <CardContent className="p-4 text-center">
//                   <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
//                     <category.icon
//                       size={22}
//                       className={category.color.split(" ")[1]}
//                     />
//                   </div>
//                   <h3 className="font-semibold text-sm mb-1">
//                     {category.name}
//                   </h3>
//                   <p className="text-xs opacity-75 leading-tight">
//                     {category.description}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Recent Orders */}
//       <div className="px-6 py-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-primary hover:text-primary/80"
//           >
//             View All
//             <ChevronRight size={16} className="ml-1" />
//           </Button>
//         </div>

//         {isOrdersLoading ? (
//           <OrdersSkeleton />
//         ) : recentOrders.length === 0 ? (
//           <EmptyOrders />
//         ) : (
//           <div className="space-y-3">
//             {recentOrders.map((order, index) => (
//               <Card
//                 key={index}
//                 className="border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
//               >
//                 <CardContent className="p-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4 flex-1">
//                       <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
//                         {order.image}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center space-x-2 mb-1">
//                           <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
//                             {order.id}
//                           </span>
//                           <Badge
//                             variant="secondary"
//                             className="text-xs bg-green-50 text-green-700 border-green-200"
//                           >
//                             Delivered
//                           </Badge>
//                         </div>
//                         <h3 className="font-semibold text-gray-900 truncate">
//                           {order.name}
//                         </h3>
//                         <div className="flex items-center space-x-3 mt-1">
//                           <span className="text-sm text-gray-500">
//                             {order.items}
//                           </span>
//                           <span className="text-sm text-gray-400">•</span>
//                           <span className="text-sm text-gray-500">
//                             {order.date}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-semibold text-gray-900 mb-1">
//                         {order.total}
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Star
//                           size={12}
//                           className="text-yellow-400 fill-current"
//                         />
//                         <span className="text-xs text-gray-600">
//                           {order.rating}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Enhanced Top Restaurants */}
//       <div className="px-6 py-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold text-gray-900">Top Restaurants</h2>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-primary hover:text-primary/80"
//           >
//             View All
//             <ChevronRight size={16} className="ml-1" />
//           </Button>
//         </div>

//         {isRestaurantsLoading ? (
//           <RestaurantsSkeleton />
//         ) : topRestaurants.length === 0 ? (
//           <EmptyRestaurants />
//         ) : (
//           <div className="grid grid-cols-2 gap-4">
//             {topRestaurants.map((restaurant, index) => (
//               <Card
//                 key={index}
//                 className="border-0 bg-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer relative overflow-hidden"
//               >
//                 <CardContent className="p-4">
//                   {restaurant.trending && (
//                     <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 text-white text-xs">
//                       <TrendingUp size={10} className="mr-1" />
//                       Trending
//                     </Badge>
//                   )}
//                   <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-4xl mb-3 shadow-sm">
//                     {restaurant.image}
//                   </div>
//                   <h3 className="font-bold text-gray-900 mb-1 leading-tight">
//                     {restaurant.name}
//                   </h3>
//                   <p className="text-xs text-gray-500 mb-2">
//                     {restaurant.category} • {restaurant.priceRange}
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-1">
//                       <Star
//                         size={14}
//                         className="text-yellow-400 fill-current"
//                       />
//                       <span className="text-sm font-medium text-gray-700">
//                         {restaurant.rating}
//                       </span>
//                     </div>
//                     <div className="flex items-center space-x-1 text-gray-500">
//                       <Timer size={12} />
//                       <span className="text-xs">{restaurant.deliveryTime}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>

// {/* Enhanced Track Your Order */}
// {hasActiveOrder && (
//   <div className="px-6 py-6 bg-white">
//     <h2 className="text-xl font-bold text-gray-900 mb-4">
//       Track Your Order
//     </h2>

//     {/* Enhanced Map */}
//     <Card className="border-0 shadow-sm mb-4 overflow-hidden">
//       <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 h-52 relative">
//         <div className="absolute inset-0 bg-gradient-to-t from-blue-100/30 to-transparent"></div>

//         {/* Location markers with better positioning */}
//         <div className="absolute top-8 left-6 flex items-center space-x-2">
//           <div className="w-4 h-4 bg-primary rounded-full animate-pulse shadow-lg"></div>
//           <span className="text-xs font-medium text-blue-800 bg-white/90 px-2 py-1 rounded-full shadow">
//             Restaurant
//           </span>
//         </div>

//         <div className="absolute bottom-16 right-8 flex items-center space-x-2">
//           <span className="text-xs font-medium text-blue-800 bg-white/90 px-2 py-1 rounded-full shadow">
//             Your Location
//           </span>
//           <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
//         </div>

//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//           <div className="w-6 h-6 bg-blue-600 rounded-full animate-bounce shadow-lg flex items-center justify-center">
//             <Truck size={12} className="text-white" />
//           </div>
//         </div>

//         {/* Central location info */}
//         <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
//           <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
//             <div className="flex items-center space-x-2">
//               <Navigation size={16} className="text-blue-600" />
//               <span className="font-medium text-blue-800">
//                 San Francisco
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Card>

//     {/* Enhanced Delivery Status */}
//     <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-6 shadow-sm">
//       <CardContent className="p-5">
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
//               <Truck size={18} className="text-white" />
//             </div>
//             <div>
//               <h3 className="font-bold text-primary">Out for Delivery</h3>
//               <p className="text-sm text-primary/70">
//                 Driver is on the way
//               </p>
//             </div>
//           </div>
//           <Badge className="bg-primary text-white">Order #12345</Badge>
//         </div>

//         <div className="w-full bg-primary/20 rounded-full h-3 mb-3 overflow-hidden">
//           <div className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full w-4/5 animate-pulse"></div>
//         </div>

//         <div className="flex items-center justify-between text-sm">
//           <div className="flex items-center space-x-2 text-primary">
//             <Clock size={16} />
//             <span className="font-medium">ETA: 12-15 minutes</span>
//           </div>
//           <div className="text-primary/70">80% complete</div>
//         </div>
//       </CardContent>
//     </Card>

//     {/* Enhanced Action Buttons */}
//     <div className="grid grid-cols-2 gap-4">
//       <Button
//         variant="outline"
//         className="h-12 border-2 border-gray-200 hover:border-primary hover:text-primary transition-colors"
//       >
//         <MapPin size={18} className="mr-2" />
//         Update Location
//       </Button>
//       <Button className="h-12 bg-primary hover:bg-primary/90 shadow-md">
//         <Phone size={18} className="mr-2" />
//         Contact Driver
//       </Button>
//     </div>
//   </div>
// )}

//       {/* Add some bottom padding for better mobile experience */}
//       <div className="h-6"></div>
//     </div>
//   );
// };

// export default HomePage;

"use client";

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

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  ChevronRight,
  LucideIcon,
  ShoppingCart,
  Star,
  Timer,
  TrendingUp,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { topRestaurants } from "@/libs/constants";
import { OrderCard } from "@/components/order";
import { TrackYourOrder } from "@/components/track-order";
import { orders } from "@/libs/contant";
import { Skeleton } from "@repo/ui/components/skeleton";

function CategoryCard({
  href,
  title,
  Icon,
  color,
  description,
}: {
  href: string;
  title: string;
  color: string;
  Icon: LucideIcon;
  description?: string;
}) {
  return (
    <Link href={href} className="block">
      <Card
        className={`border hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer ${color}`}
      >
        <CardContent className="p-4 text-center">
          <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Icon size={22} className={color.split(" ")[1]} />
          </div>
          <h3 className="font-semibold text-sm mb-1">{title}</h3>
          <p className="text-xs opacity-75 leading-tight">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function RestaurantsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-0 bg-gray-50/50">
          <CardContent className="p-4">
            <Skeleton className="aspect-square rounded-xl mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function OrdersSkeleton() {
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

function EmptyOrders({ onBrowse }: { onBrowse?: () => void }) {
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

function EmptyRestaurants() {
  return (
    <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100/50">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-700 mb-2">
          No restaurants available
        </h3>
        <p className="text-sm text-gray-500">
          Check back later for amazing food options
        </p>
      </CardContent>
    </Card>
  );
}

function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <Link href={`/restaurants/${r.id}`} className="block">
      <Card className="border-0 bg-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer relative overflow-hidden">
        <CardContent className="p-4">
          {r.trending && (
            <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs">
              <TrendingUp size={10} className="mr-1 inline-block" />
              Trending
            </Badge>
          )}

          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-4xl mb-3 shadow-sm">
            {typeof r.image === "string" ? r.image : "🍽"}
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

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(false);
  const [hasActiveOrder] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(t);
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

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Welcome */}
      <div className="bg-white shadow-sm">
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hello, Liam!</h1>
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

          <div className="grid grid-cols-3 gap-4">
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
      <section className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
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
      <section className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Top Restaurants</h2>
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
          <div className="grid grid-cols-2 gap-4">
            {topRestaurants.map((r) => (
              <RestaurantCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </section>

      {/* Track Order */}
      {hasActiveOrder && <TrackYourOrder order={orders[1]!} />}

      <div className="h-6" />
    </div>
  );
}
