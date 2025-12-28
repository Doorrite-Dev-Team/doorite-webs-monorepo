import Earnings from "@/components/earnings/Earnings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earnings",
};

export default function EarningPage() {
  return <Earnings />;
}
