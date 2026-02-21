"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  User,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import api from "@/actions/api";
import { useQuery } from "@tanstack/react-query";

const PERIOD_TABS: { value: Period; label: string }[] = [
  { value: "daily", label: "Today" },
  { value: "weekly", label: "Week" },
  { value: "monthly", label: "Month" },
];

export default function Earnings() {
  const [period, setPeriod] = useState<Period>("weekly");
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["vendor-earnings", period],
    queryFn: () => api.fetchEarnings(period),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="p-4 md:p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load earnings
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6 max-w-sm">
              {error?.message || "Something went wrong. Please try again."}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return redirect("/dashboard");
  }

  const { summary, wallet, chartData, recentTransactions, pendingPayout } =
    data;
  const isPositiveChange = summary.percentageChange >= 0;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Earnings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track your revenue and transactions
          </p>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setPeriod(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                period === tab.value
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Earnings</CardDescription>
            <CardTitle className="text-3xl font-bold">
              ₦{summary.totalEarnings.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {isPositiveChange ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositiveChange ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositiveChange ? "+" : ""}
                {summary.percentageChange.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">vs last {period}</span>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Balance */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Available Balance
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              ₦{wallet.balance.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              Total earned: ₦{wallet.totalEarned.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Pending Payout */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Payout
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              ₦{pendingPayout.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-xs">
              {period === "daily"
                ? "Expected today"
                : period === "weekly"
                  ? "Expected this week"
                  : "Expected this month"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Transactions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              {period === "daily"
                ? "Hourly earnings for today"
                : period === "weekly"
                  ? "Daily earnings for the past 7 days"
                  : "Weekly earnings for this month"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="label"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₦${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      `₦${value.toLocaleString()}`,
                      "Earnings",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{
                      fill: "#16a34a",
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#16a34a",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest orders from the {period} period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Wallet className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={transaction.customerAvatar || undefined}
                        />
                        <AvatarFallback className="bg-green-100 text-green-700">
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {transaction.customerName}
                        </p>
                        <p className="text-xs text-green-600">
                          Order #{transaction.orderId}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ₦{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(transaction.date), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
