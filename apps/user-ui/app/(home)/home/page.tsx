import HomeClient from "@/components/home/HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Food Delivery",
  description: "Order food from your favorite restaurants",
};

export default function HomePage() {
  return <HomeClient />;
}