"use client";
import EarningLayoutClient from "@/components/earnings/EarningLayoutClient";
import Earnings from "@/components/earnings/Earnings";

 // optional if this whole page should be client-side



export default function EarningPage() {
  return (
    <EarningLayoutClient>
      <Earnings />
    </EarningLayoutClient>
  );
}
