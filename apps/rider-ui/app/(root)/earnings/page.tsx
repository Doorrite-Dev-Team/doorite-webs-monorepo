"use client";

import { useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Clock,
  Package,
  Star,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Loader2,
} from "lucide-react";
import {
  earningsSummaryAtom,
  metricsAtom,
  payoutInfoAtom,
  transactionsAtom,
  earningsLoadingAtom,
  fetchAllEarningsDataAtom,
} from "@/store/earningsAtom";
import { WithdrawalModal } from "@/components/earnings";

type TransactionType = "EARNING" | "PAYOUT" | "BONUS" | "ADJUSTMENT" | "ALL";

export default function EarningsPage() {
  const [summary] = useAtom(earningsSummaryAtom);
  const [metrics] = useAtom(metricsAtom);
  const [payoutInfo] = useAtom(payoutInfoAtom);
  const [transactions, setTransactions] = useAtom(transactionsAtom);
  const isLoading = useAtomValue(earningsLoadingAtom);
  const fetchAllData = useSetAtom(fetchAllEarningsDataAtom);

  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [transactionFilter, setTransactionFilter] =
    useState<TransactionType>("ALL");

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleFilterChange = (filter: TransactionType) => {
    setTransactionFilter(filter);
  };

  const filteredTransactions =
    transactionFilter === "ALL"
      ? transactions.transactions
      : transactions.transactions.filter((t) => t.type === transactionFilter);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "EARNING":
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case "PAYOUT":
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
      case "BONUS":
        return <Star className="w-4 h-4 text-yellow-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "EARNING":
        return "text-green-600";
      case "PAYOUT":
        return "text-blue-600";
      case "BONUS":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Earnings Overview Cards */}
      {isLoading && !summary.data.totalEarned ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(summary.data.today)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {summary.data.todayDeliveries} deliveries
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(summary.data.thisWeek)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {summary.data.thisWeekDeliveries} deliveries
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(summary.data.thisMonth)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {summary.data.thisMonthDeliveries} deliveries
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">All Time</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(summary.data.totalEarned)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Your delivery statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                      {metrics.data.totalDeliveries}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Total Deliveries
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                      {metrics.data.avgDeliveryTimeMinutes} min
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Avg. Delivery Time
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                      {metrics.data.rating.toFixed(1)}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Average Rating
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest earnings and payouts
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={transactionFilter}
                    onChange={(e) =>
                      handleFilterChange(e.target.value as TransactionType)
                    }
                    className="text-sm border rounded-lg px-2 py-1 bg-white"
                  >
                    <option value="ALL">All</option>
                    <option value="EARNING">Earnings</option>
                    <option value="PAYOUT">Payouts</option>
                    <option value="BONUS">Bonuses</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No transactions yet
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${getTransactionColor(transaction.type)}`}
                        >
                          {transaction.type === "EARNING" ||
                          transaction.type === "BONUS"
                            ? "+"
                            : "-"}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            transaction.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payout Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payout Information</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-blue-50 rounded-lg gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Next Payout</p>
                    <p className="text-sm text-gray-600">
                      {payoutInfo.data.nextPayoutDate
                        ? new Date(
                            payoutInfo.data.nextPayoutDate,
                          ).toLocaleDateString("en-NG", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })
                        : "No scheduled payout"}
                    </p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(payoutInfo.data.walletBalance)}
                  </p>
                  <p className="text-xs text-gray-600">Available Balance</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  className="flex-1"
                  onClick={() => setWithdrawalModalOpen(true)}
                  disabled={
                    payoutInfo.data.walletBalance <
                    payoutInfo.data.minimumBalance
                  }
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Request Withdrawal
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <WithdrawalModal
        isOpen={withdrawalModalOpen}
        onClose={() => setWithdrawalModalOpen(false)}
      />
    </div>
  );
}
