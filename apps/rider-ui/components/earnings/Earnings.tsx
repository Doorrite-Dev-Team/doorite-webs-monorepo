"use client";

import { useState } from "react";
import { ArrowDownLeft } from "lucide-react";

type Withdrawal = {
  id: string;
  amount: number;
  date: string;
  time: string;
};

const withdrawals: Withdrawal[] = [
  { id: "1", amount: 150, date: "May 15, 2024", time: "10:30 AM" },
  { id: "2", amount: 200, date: "May 10, 2024", time: "2:15 PM" },
  { id: "3", amount: 180, date: "May 5, 2024", time: "4:45 PM" },
  { id: "4", amount: 120, date: "April 30, 2024", time: "11:00 AM" },
  { id: "5", amount: 150, date: "April 25, 2024", time: "3:30 PM" },
];

export default function Earnings() {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  // Summary values for each tab
  const summaries = {
    daily: { label: "Today", value: "$120.50" },
    weekly: { label: "Week", value: "$650.00" },
    monthly: { label: "Month", value: "$2,400.00" },
  };

  return (
    <div className="p-4 md:p-8">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(summaries).map(([key, summary]) => (
          <div
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`rounded-xl p-6 cursor-pointer transition ${
              activeTab === key
                ? "bg-green-100 border-2 border-green-500"
                : "bg-green-50"
            }`}
          >
            <p className="text-gray-600 text-sm">{summary.label}</p>
            <p className="text-2xl font-bold text-gray-900">{summary.value}</p>
          </div>
        ))}
      </div>

      {/* Withdrawal History */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">
          Withdrawal History
        </h3>

        <div className="space-y-4">
          {withdrawals.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ArrowDownLeft className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    ${w.amount.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-xs">{w.date}</p>
                </div>
              </div>
              <p className="text-gray-500">{w.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
