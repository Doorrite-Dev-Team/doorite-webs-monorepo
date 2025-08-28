import {
  imageCampusEatery,
  imageCustomer,
  imageLibrary,
  imageQuadDrill,
  imageRider,
  imageStudentDiner,
  imageStudyCafe,
  imageVendor,
} from "@repo/ui/assets";
import { StaticImageData } from "next/image";
import { status } from "./helper";

// constants.ts
export type Review = {
  name: string;
  review: string;
};

export type vendor = {
  id: number;
  name: string;
  image: StaticImageData | string;
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

export type order = {
  id: string;
  status: status;
  items: string[];
  total: number;
  orderTime: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  tracking: {
    step: string;
    time: string;
    completed: boolean;
  }[];
  orderDetails: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

type Service = "Customer" | "Vendor" | "Rider";
export type ServiceInfo = {
  name: Service;
  url: string;
  description: string;
  imgSrc: StaticImageData;
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

export const VENDORS: vendor[] = [
  {
    id: 1,
    name: "The Campus Eatery",
    image: imageCampusEatery,
    avrgPreparationTime: "15-20 mins",
    description:
      "A vibrant spot offering a variety of meals and snacks for students.",
    category: "food",
    subcategory: "restaurant",
    rating: 4.5,
    distance: 0.3,
    isOpen: true,
    priceRange: "$$",
    tags: ["popular", "student-favorite", "variety"],
  },
  {
    id: 2,
    name: "The Study Cafe",
    image: imageStudyCafe,
    avrgPreparationTime: "10-15 mins",
    description:
      "A cozy cafe perfect for studying, serving coffee and light bites.",
    category: "food",
    subcategory: "cafe",
    rating: 4.7,
    distance: 0.1,
    isOpen: true,
    priceRange: "$",
    tags: ["quiet", "coffee", "study-friendly"],
  },
  {
    id: 3,
    name: "The Student Diner",
    image: imageStudentDiner,
    avrgPreparationTime: "20-25 mins",
    description:
      "A classic diner with a diverse menu, ideal for students on the go.",
    category: "food",
    subcategory: "diner",
    rating: 4.3,
    distance: 0.5,
    isOpen: true,
    priceRange: "$$",
    tags: ["classic", "diverse-menu", "comfort-food"],
  },
  {
    id: 4,
    name: "The Library Cafe",
    image: imageLibrary,
    avrgPreparationTime: "5-10 mins",
    description:
      "A quiet cafe located in the library, offering quick snacks and drinks.",
    category: "food",
    subcategory: "cafe",
    rating: 4.1,
    distance: 0.2,
    isOpen: true,
    priceRange: "$",
    tags: ["quick", "library", "snacks"],
  },
  {
    id: 5,
    name: "The Quad Grill",
    image: imageQuadDrill,
    avrgPreparationTime: "15-20 mins",
    description:
      "An outdoor grill serving fresh, grilled meals in a relaxed setting.",
    category: "food",
    subcategory: "grill",
    rating: 4.6,
    distance: 0.4,
    isOpen: false, // Closed for variety
    priceRange: "$$",
    tags: ["outdoor", "grilled", "fresh"],
  },
  {
    id: 6,
    name: "Campus Grocery",
    image: "🛒",
    avrgPreparationTime: "5 mins",
    description: "Essential groceries and daily items for campus life.",
    category: "grocery",
    subcategory: "convenience",
    rating: 4.2,
    distance: 0.3,
    isOpen: true,
    priceRange: "$",
    tags: ["essentials", "convenient", "daily-needs"],
  },
  {
    id: 7,
    name: "Fresh Market",
    image: "🥬",
    avrgPreparationTime: "10 mins",
    description: "Fresh produce and healthy options for conscious students.",
    category: "grocery",
    subcategory: "fresh-produce",
    rating: 4.4,
    distance: 0.6,
    isOpen: true,
    priceRange: "$$",
    tags: ["fresh", "healthy", "organic"],
  },
  {
    id: 8,
    name: "Campus Pharmacy",
    image: "💊",
    avrgPreparationTime: "2-5 mins",
    description: "Health essentials, medications, and wellness products.",
    category: "pharmacy",
    subcategory: "health",
    rating: 4.8,
    distance: 0.2,
    isOpen: true,
    priceRange: "$$",
    tags: ["health", "medications", "wellness"],
  },
];

export const orders: order[] = [
  {
    id: "ORD-001",
    status: "delivered",
    items: ["Spicy Chicken Sandwich", "Fries", "Coke"],
    total: 19.01,
    orderTime: "2025-08-11T09:30:00",
    estimatedDelivery: "2025-08-11T10:45:00",
    deliveryAddress: "123 University Ave, Apt 4B, Campus Town, CA 90210",
    tracking: [
      { step: "Order Placed", time: "9:30 AM", completed: true },
      { step: "Preparing", time: "9:45 AM", completed: true },
      { step: "Out for Delivery", time: "10:15 AM", completed: true },
      { step: "Delivered", time: "10:30 AM", completed: true },
    ],
    orderDetails: [
      { name: "Chicken Sandwich", quantity: 1, price: 8.99 },
      { name: "Fries", quantity: 2, price: 3.98 },
      { name: "Coke", quantity: 1, price: 2.49 },
    ],
  },
  {
    id: "ORD-002",
    status: "out-for-delivery",
    items: ["Breakfast Bagel", "Coffee"],
    total: 8.49,
    orderTime: "2025-08-11T08:15:00",
    estimatedDelivery: "2025-08-11T09:00:00",
    deliveryAddress: "Dormitory B, Room 305, Campus Town, CA 90210",
    tracking: [
      { step: "Order Placed", time: "8:15 AM", completed: true },
      { step: "Preparing", time: "8:25 AM", completed: true },
      { step: "Out for Delivery", time: "8:45 AM", completed: true },
      { step: "Delivered", time: "9:00 AM", completed: false },
    ],
    orderDetails: [
      { name: "Breakfast Bagel", quantity: 1, price: 5.49 },
      { name: "Coffee", quantity: 1, price: 3.0 },
    ],
  },
  {
    id: "ORD-003",
    status: "preparing",
    items: ["Veggie Wrap", "Smoothie"],
    total: 11.99,
    orderTime: "2025-08-11T11:30:00",
    estimatedDelivery: "2025-08-11T12:15:00",
    deliveryAddress: "456 College St, Apt 2A, Campus Town, CA 90210",
    tracking: [
      { step: "Order Placed", time: "11:30 AM", completed: true },
      { step: "Preparing", time: "11:35 AM", completed: true },
      { step: "Out for Delivery", time: "Pending", completed: false },
      { step: "Delivered", time: "Pending", completed: false },
    ],
    orderDetails: [
      { name: "Veggie Wrap", quantity: 1, price: 8.49 },
      { name: "Smoothie", quantity: 1, price: 3.5 },
    ],
  },
  {
    id: "ORD-004",
    status: "cancelled",
    items: ["Pizza", "Soda"],
    total: 15.99,
    orderTime: "2025-08-10T19:20:00",
    estimatedDelivery: "2025-08-10T20:30:00",
    deliveryAddress: "789 Student Ave, Room 101, Campus Town, CA 90210",
    tracking: [
      { step: "Order Placed", time: "7:20 PM", completed: true },
      { step: "Cancelled", time: "7:25 PM", completed: true },
    ],
    orderDetails: [
      { name: "Pizza", quantity: 1, price: 12.99 },
      { name: "Soda", quantity: 1, price: 3.0 },
    ],
  },
  {
    id: "ORD-005",
    status: "incoming",
    items: ["Burger", "Fries", "Shake"],
    total: 16.47,
    orderTime: "2025-08-11T12:00:00",
    estimatedDelivery: "2025-08-11T12:45:00",
    deliveryAddress: "321 Academic Blvd, Suite 5C, Campus Town, CA 90210",
    tracking: [
      { step: "Order Placed", time: "12:00 PM", completed: true },
      { step: "Preparing", time: "Pending", completed: false },
      { step: "Out for Delivery", time: "Pending", completed: false },
      { step: "Delivered", time: "Pending", completed: false },
    ],
    orderDetails: [
      { name: "Burger", quantity: 1, price: 9.99 },
      { name: "Fries", quantity: 1, price: 3.99 },
      { name: "Shake", quantity: 1, price: 2.49 },
    ],
  },
];

export const ServicesInfo: ServiceInfo[] = [
  {
    name: "Customer",
    url: "/sign-up",
    description: "Order food and groceries.",
    imgSrc: imageCustomer,
  },
  {
    name: "Vendor",
    url: "vendor.doorrite.app/sign-up",
    description: "Order food and groceries.",
    imgSrc: imageVendor,
  },
  {
    name: "Rider",
    url: "rider.doorrite.app/sign-up",
    description: "Order food and groceries.",
    imgSrc: imageRider,
  },
];