import {
  UtensilsCrossed,
  ShoppingCart,
  Cross,
  Search,
} from "lucide-react";

export const CATEGORIES = [
  {
    id: "all",
    name: "All",
    icon: Search,
    color: "bg-gray-50 text-gray-600 border-gray-200",
  },
  {
    id: "food",
    name: "Food & Dining",
    icon: UtensilsCrossed,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    id: "grocery",
    name: "Groceries",
    icon: ShoppingCart,
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: Cross,
    color: "bg-red-50 text-red-600 border-red-200",
  },
];

export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "distance", label: "Nearest First" },
  { value: "rating", label: "Highest Rated" },
  { value: "fastest", label: "Fastest Delivery" },
];

export const PRICE_FILTERS = [
  { value: "all", label: "Any Price" },
  { value: "$", label: "Budget ($)" },
  { value: "$$", label: "Moderate ($$)" },
  { value: "$$$", label: "Premium ($$$)" },
];
