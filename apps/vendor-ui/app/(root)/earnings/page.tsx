import Earnings from "@/components/earnings/Earnings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earnings | Your Business",
  description: "Track your revenue and transactions",
};

export default function EarningsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Earnings />
    </div>
  );
}
