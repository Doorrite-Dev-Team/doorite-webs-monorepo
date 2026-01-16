// src/libs/explore-config.ts

export const CATEGORIES = [
  { value: "food", label: "🍔 Food" },
  { value: "drinks", label: "🥤 Drinks" },
  { value: "snacks", label: "🍿 Snacks" },
  { value: "groceries", label: "🛒 Groceries" },
  { value: "electronics", label: "📱 Electronics" },
  { value: "fashion", label: "👕 Fashion" },
  { value: "home", label: "🏠 Home & Kitchen" },
  { value: "health", label: "💊 Health & Beauty" },
  { value: "sports", label: "⚽ Sports" },
  { value: "books", label: "📚 Books" },
];

export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "distance", label: "Nearest to Me" },
];

export const PRICE_FILTERS = [
  { value: "all", label: "All Prices" },
  { value: "0-1000", label: "Under ₦1,000" },
  { value: "1000-5000", label: "₦1,000 - ₦5,000" },
  { value: "5000-10000", label: "₦5,000 - ₦10,000" },
  { value: "10000-20000", label: "₦10,000 - ₦20,000" },
  { value: "20000-50000", label: "₦20,000 - ₦50,000" },
  { value: "50000", label: "Over ₦50,000" },
];

// Nigerian-specific time helpers
export const BUSINESS_HOURS = {
  start: 8, // 8 AM
  end: 22, // 10 PM
};

export const DELIVERY_TIME_SLOTS = [
  { value: "asap", label: "ASAP (30-45 mins)" },
  { value: "1hour", label: "Within 1 hour" },
  { value: "2hours", label: "Within 2 hours" },
  { value: "scheduled", label: "Schedule for later" },
];

export const PAYMENT_METHODS = [
  { value: "card", label: "Debit/Credit Card", icon: "💳" },
  { value: "transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "ussd", label: "USSD", icon: "📱" },
  { value: "cash", label: "Cash on Delivery", icon: "💵" },
];

// Search suggestions for common Nigerian queries
export const SEARCH_SUGGESTIONS = [
  "Jollof rice",
  "Suya",
  "Shawarma",
  "Pizza",
  "Chicken",
  "Fried rice",
  "Amala",
  "Pounded yam",
  "Small chops",
  "Ice cream",
];

// Quick filter presets
export const QUICK_FILTERS = [
  { label: "Fast Delivery", filter: { sort: "distance", open: true } },
  { label: "Budget Friendly", filter: { price: "0-5000", sort: "price-low" } },
  { label: "Top Rated", filter: { sort: "rating", minRating: "4" } },
  { label: "New Arrivals", filter: { sort: "newest" } },
];

// Helper function to get category label
export const getCategoryLabel = (value: string): string => {
  const category = CATEGORIES.find((cat) => cat.value === value);
  return category?.label || value;
};

// Helper function to format price
export const formatPrice = (price: number): string => {
  return `₦${price.toLocaleString("en-NG")}`;
};

// Helper function to check if within delivery hours
export const isWithinDeliveryHours = (date: Date = new Date()): boolean => {
  const hour = date.getHours();
  return hour >= BUSINESS_HOURS.start && hour < BUSINESS_HOURS.end;
};

// Helper to calculate estimated delivery time
export const getEstimatedDeliveryTime = (
  preparationTime: number = 30,
  distance: number = 5,
): string => {
  const travelTime = Math.ceil(distance * 5); // ~5 mins per km in Lagos traffic
  const totalMinutes = preparationTime + travelTime;

  if (totalMinutes < 60) {
    return `${totalMinutes} mins`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};
