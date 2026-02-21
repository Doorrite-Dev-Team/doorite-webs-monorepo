import { Notification } from "@/types/notification";
import { imageCustomer, imageRider, imageVendor } from "@repo/ui/assets";
import { LucideProps } from "lucide-react";
import { Route } from "next";
import { StaticImageData } from "next/image";
import { ForwardRefExoticComponent, RefAttributes } from "react";
// import { status } from "./helper";

// constants.ts
export type Review = {
  name: string;
  review: string;
};

export type vendor = {
  id: number;
  name: string;
  image: StaticImageData | string;
  logoUrl?: string | null;
  avrgPreparationTime: string;
  description: string;
  category: string;
  subcategory: string;
  rating: number;
  distance: number;
  isOpen: boolean;
  priceRange: string;
  tags: string[];
};

// export type order = {
//   id: string;
//   status: status;
//   items: string[];
//   total: number;
//   orderTime: string;
//   estimatedDelivery: string;
//   deliveryAddress: string;
//   tracking: {
//     step: string;
//     time: string;
//     completed: boolean;
//   }[];
//   orderDetails: {
//     name: string;
//     quantity: number;
//     price: number;
//   }[];
// };

type Service = "Customer" | "Vendor" | "Rider";
export type ServiceInfo = {
  name: Service;
  url: Route<string>;
  description: string;
  imgSrc: StaticImageData;
};

export type Category = {
  name: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
  description: string;
  href: Route<string>;
};
export const REVIEWS: Review[] = [
  {
    name: "Sarah M.",
    review:
      "Doorrite has made my life so much easier! I can get groceries delivered in minutes.",
  },
  {
    name: "David L.",
    review:
      "As a restaurant owner, Doorrite has helped me reach new customers and increase sales.",
  },
  {
    name: "Emily R.",
    review:
      "I love the flexibility of being a Doorrite rider. I can work when I want and earn good money.",
  },
  {
    name: "Emily R.",
    review:
      "Doorrite has made my life so much easier! I can get essentials delivered in no time.",
  },
  {
    name: "Sarah M.",
    review:
      "As a restaurant owner, I’ve seen more orders and happier customers thanks to Doorrite.",
  },
  {
    name: "David L.",
    review:
      "Being a Doorrite rider lets me choose my hours and still earn great money.",
  },
  {
    name: "Sarah M.",
    review:
      "I can get groceries, snacks, and even coffee delivered in under 30 minutes. Love it!",
  },
  {
    name: "Emily R.",
    review:
      "Doorrite has been a game changer for my restaurant. More orders and less downtime.",
  },
  {
    name: "David L.",
    review:
      "The rider flexibility is unmatched. I can plan my week and still hit my earnings goals.",
  },
  {
    name: "Emily R.",
    review:
      "Doorrite makes everyday errands stress-free with fast and reliable delivery.",
  },
  {
    name: "Sarah M.",
    review:
      "My business has grown since partnering with Doorrite — they handle delivery so well.",
  },
  {
    name: "David L.",
    review:
      "The best part of riding with Doorrite is being in control of my schedule.",
  },
  {
    name: "Emily R.",
    review:
      "I never have to worry about last-minute grocery runs — Doorrite has me covered.",
  },
  {
    name: "Sarah M.",
    review:
      "Doorrite delivery is always quick, friendly, and reliable. Highly recommend!",
  },
  {
    name: "David L.",
    review:
      "Partnering with Doorrite means I can focus on cooking while they handle logistics.",
  },
  {
    name: "Emily R.",
    review:
      "I can earn good money riding for Doorrite without sacrificing my personal time.",
  },
  {
    name: "Sarah M.",
    review:
      "The app is super easy to use and deliveries are faster than I expected.",
  },
  {
    name: "David L.",
    review:
      "Doorrite has connected my business to customers I could never reach before.",
  },
  {
    name: "Emily R.",
    review:
      "Being a rider is perfect for me — I stay active and meet new people every day.",
  },
  {
    name: "Sarah M.",
    review: "Doorrite is simply the most reliable delivery service I’ve used.",
  },
];

export const foodTags = [
  "authentic",
  "breakfast",
  "bulk",
  "cheap-eats",
  "comfort",
  "drink",
  "family",
  "fast-food",
  "grill",
  "healthy",
  "handheld",
  "halal",
  "hearty",
  "low-cal",
  "morning",
  "noodles",
  "party",
  "premium",
  "popular",
  "protein",
  "regional",
  "refreshing",
  "soup",
  "spicy",
  "street-food",
  "staple",
  "sweet",
  "takeaway",
  "treats",
  "snack",
];

export const ServicesInfo = [
  {
    name: "Customer",
    url: "/sign-up",
    description: "Order food and groceries.",
    imgSrc: imageCustomer,
  },
  {
    name: "Vendor",
    url: "https://doorrite-vendor-ui.netlify.app/signup",
    description: "Order food and groceries.",
    imgSrc: imageVendor,
  },
  {
    name: "Rider",
    url: "https://doorrite-rider-ui.netlify.app/signup",
    description: "Order food and groceries.",
    imgSrc: imageRider,
  },
] as ServiceInfo[];

export const defaultNotifications: Notification[] = [
  // ---- SYSTEM / USER ----
  {
    id: "welcome-first-time",
    type: "SYSTEM",
    title: "Welcome to Doorrite!",
    message:
      "Your meals, delivered faster and fresher. Thanks for joining us—let’s get you started!",
    priority: "low",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
    metadata: {},
  },
  {
    id: "welcome-back",
    type: "SYSTEM",
    title: "Welcome back!",
    message: "Great to see you again. Hungry? Amazing options are waiting.",
    priority: "low",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
    metadata: {},
  },
  {
    id: "relaunch",
    type: "SYSTEM",
    title: "Good to have you here again!",
    message:
      "Browse your favorite restaurants or discover new flavors near you.",
    priority: "low",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
    metadata: {},
  },
  {
    id: "account-verified",
    type: "SYSTEM",
    title: "Your account is verified",
    message: "You’re all set! Enjoy secure and seamless ordering on Doorrite.",
    priority: "normal",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
    metadata: {},
  },
  {
    id: "profile-incomplete",
    type: "SYSTEM",
    title: "Complete your profile",
    message:
      "Add a few details to unlock smoother checkout and personalized recommendations.",
    priority: "normal",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
    metadata: {},
  },

  // ---- ORDER EVENTS ----
  {
    id: "order-placed",
    type: "ORDER_PLACED",
    title: "Order received!",
    message: "Your meal is now being prepared. We’ll keep you updated.",
    priority: "high",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
    metadata: { stage: "placed" },
  },
  {
    id: "order-accepted",
    type: "ORDER_ACCEPTED",
    title: "Restaurant accepted your order",
    message: "Your food is cooking. Sit tight!",
    priority: "high",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
    metadata: { stage: "accepted" },
  },
  {
    id: "rider-assigned",
    type: "ORDER_DELIVERED",
    title: "A rider is on the way",
    message: "Your rider is heading to the restaurant.",
    priority: "high",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
    metadata: { stage: "rider_assigned" },
  },
  {
    id: "order-out-for-delivery",
    type: "ORDER_OUT_FOR_DELIVERY",
    title: "Your order is on the road!",
    message: "Track your rider in real-time. Get ready!",
    priority: "high",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
    metadata: { stage: "out_for_delivery" },
  },
  {
    id: "order-delivered",
    type: "ORDER_DELIVERED",
    title: "Order delivered",
    message: "Enjoy your meal! Want to rate your experience?",
    priority: "normal",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
    metadata: { stage: "delivered" },
  },

  // ---- LOYALTY / ENGAGEMENT ----
  {
    id: "new-user-discount",
    type: "PROMOTION",
    title: "Special welcome offer!",
    message: "Enjoy a discount on your first Doorrite order. Don’t miss it.",
    priority: "normal",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: "loyalty-reward",
    type: "PROMOTION",
    title: "You’ve earned a reward!",
    message: "Thanks for ordering with Doorrite. Enjoy a special treat on us.",
    priority: "normal",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: "streak-encouragement",
    type: "PROMOTION",
    title: "You’re on a roll!",
    message: "Another great order this week! Keep the streak going.",
    priority: "low",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
  },

  // ---- MARKETING ----
  {
    id: "nearby-discount",
    type: "PROMOTION",
    title: "Hot deals around you!",
    message:
      "Restaurants near your location just dropped new discounts. Grab them now.",
    priority: "low",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: "free-delivery-event",
    type: "PROMOTION",
    title: "Free delivery today!",
    message: "Your favorite spots now deliver free for a limited time.",
    priority: "normal",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: "restaurant-launch",
    type: "PROMOTION",
    title: "New flavors just arrived!",
    message: "A new restaurant is now available on Doorrite. Check it out.",
    priority: "low",
    read: false,
    archived: false,
    timestamp: new Date().toISOString(),
  },
];
