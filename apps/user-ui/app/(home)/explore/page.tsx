import { Metadata } from "next";
import ExplorePageClient from "./ExplorePageClient";

export const metadata: Metadata = {
  title: "Explore | Find Restaurants & Food",
  description:
    "Discover the best restaurants, food vendors, and cuisine near you. Browse menus, read reviews, and order your favorite meals.",
};

export default function ExplorePage() {
  return <ExplorePageClient />;
}