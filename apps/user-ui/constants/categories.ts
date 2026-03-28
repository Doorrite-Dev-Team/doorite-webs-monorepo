import { LucideIcon, UtensilsCrossed, ShoppingCart, Zap } from "lucide-react";
import { Route } from "next";

/**
 * Category definition for the home page
 * Links to explore page with appropriate filters
 */
export interface HomeCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  href: string;
}

/**
 * Main categories displayed on the home page
 * Maps to cuisine types from explore page
 */
export const HOME_CATEGORIES: HomeCategory[] = [
  {
    id: "food",
    name: "Food",
    icon: UtensilsCrossed,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    description: "Restaurants & Fast Food",
    href: "/explore?cuisine=all",
  },
  {
    id: "groceries",
    name: "Groceries",
    icon: ShoppingCart,
    color: "bg-primary/5 text-primary border-primary/10",
    description: "Fresh & Daily Essentials",
    href: "/explore",
  },
  {
    id: "quick-delivery",
    name: "Quick Delivery",
    icon: Zap,
    color: "bg-orange-50 text-orange-600 border-orange-100",
    description: "15 min delivery",
    href: "/delivery",
  },
] as const;

/**
 * Quick-access cuisine category pills for the home page
 * Maps to cuisine filters in the explore page
 */
export interface CuisineCategory {
  label: string;
  href: Route;
}

/**
 * Cuisine categories displayed as horizontal scrolling pills
 * These match the cuisine types available in the explore page
 */
export const CUISINE_CATEGORIES: CuisineCategory[] = [
  { label: "🍛 Nigerian", href: "/explore?cuisine=Nigerian+%2F+Local" },
  { label: "🍔 Fast Food", href: "/explore?cuisine=Fast+Food+%2F+Snacks" },
  { label: "🥗 Healthy", href: "/explore?cuisine=Healthy+%2F+Fit+Fam" },
  { label: "🍰 Bakery", href: "/explore?cuisine=Bakery+%2F+Pastries" },
  { label: "🌍 African", href: "/explore?cuisine=African+%28non-Nigerian%29" },
  { label: "🥤 Drinks", href: "/explore?cuisine=Drinks+%2F+Beverages" },
  { label: "🦐 Seafood", href: "/explore?cuisine=Seafood" },
] as const;

/**
 * Check if a category ID is valid
 */
export function isValidCategoryId(id: string): boolean {
  return HOME_CATEGORIES.some((cat) => cat.id === id);
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): HomeCategory | undefined {
  return HOME_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Get cuisine category by label
 */
export function getCuisineByLabel(label: string): CuisineCategory | undefined {
  return CUISINE_CATEGORIES.find((cat) => cat.label === label);
}
