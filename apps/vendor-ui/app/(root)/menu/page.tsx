import MenuList from "@/components/menu/MenuList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
};

export default function MenuPage() {
  return <MenuList />;
}
