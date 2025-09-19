"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Example datasets for different tabs
const dailyData = [
  { day: "6 AM", value: 50 },
  { day: "9 AM", value: 120 },
  { day: "12 PM", value: 180 },
  { day: "3 PM", value: 90 },
  { day: "6 PM", value: 150 },
  { day: "9 PM", value: 70 },
];

const weeklyData = [
  { day: "Mon", value: 200 },
  { day: "Tue", value: 350 },
  { day: "Wed", value: 300 },
  { day: "Thu", value: 400 },
  { day: "Fri", value: 250 },
  { day: "Sat", value: 380 },
  { day: "Sun", value: 420 },
];

const monthlyData = Array.from({ length: 12 }, (_, i) => ({
  day: `Week ${i + 1}`,
  value: Math.floor(Math.random() * 1000 + 200),
}));

// Transactions for each tab
const transactionsByTab = {
  daily: [
    { id: "D1001", name: "Leo Carter", amount: 12.5 },
    { id: "D1002", name: "Maya Lopez", amount: 18.75 },
  ],
  weekly: [
    { id: "12345", name: "Ava Bennett", amount: 25.5 },
    { id: "12346", name: "Ethan Carter", amount: 32.75 },
    { id: "12347", name: "Olivia Foster", amount: 18.9 },
    { id: "12348", name: "Noah Hughes", amount: 45.2 },
    { id: "12349", name: "Sophia Jenkins", amount: 22.15 },
  ],
  monthly: [
    { id: "M2001", name: "James Brown", amount: 220.0 },
    { id: "M2002", name: "Ella King", amount: 175.4 },
    { id: "M2003", name: "Daniel Green", amount: 300.25 },
  ],
};

export default function Earnings() {
  const [tab, setTab] = useState<"daily" | "weekly" | "monthly">("weekly");

  // Select chart + transactions based on active tab
  const chartData =
    tab === "daily" ? dailyData : tab === "weekly" ? weeklyData : monthlyData;
  const transactions = transactionsByTab[tab];

  // Example summaries
  const summary =
    tab === "daily"
      ? { total: "$480", info: "Today +5%" }
      : tab === "weekly"
      ? { total: "$2,345", info: "Last 7 Days +12%" }
      : { total: "$9,870", info: "This Month +8%" };

  return (
    <div className="p-4 md:p-8">
      {/* Tabs */}
      <div className="flex justify-center md:justify-start space-x-4 mb-6">
        {["daily", "weekly", "monthly"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as typeof tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
              tab === t
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Desktop Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart & Summary */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Earnings</h3>
          <p className="text-3xl font-bold text-gray-800">{summary.total}</p>
          <p className="text-green-600 text-sm mb-4">{summary.info}</p>

          <div className="h-40 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions & Payouts */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
          {/* Recent Transactions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Recent Transactions
            </h3>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <div>
                    <p className="font-medium">{tx.name}</p>
                    <p className="text-green-600">Order #{tx.id}</p>
                  </div>
                  <span className="font-semibold">
                    ${tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Payouts */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Pending Payouts
            </h3>
            <div className="flex justify-between text-sm text-gray-700">
              <div>
                <p>Payout Amount</p>
                <p className="text-green-600 text-sm">
                  {tab === "daily"
                    ? "Expected today"
                    : tab === "weekly"
                    ? "Expected on July 15"
                    : "Expected end of month"}
                </p>
              </div>
              <span className="font-semibold">
                {tab === "daily"
                  ? "$120.00"
                  : tab === "weekly"
                  ? "$500.00"
                  : "$2,000.00"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
