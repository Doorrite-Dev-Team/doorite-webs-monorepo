import MenuTabs from "@/components/menu/MenuTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Your Business",
  description: "Manage your products and menu items",
};

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MenuTabs />
    </div>
  );
}
