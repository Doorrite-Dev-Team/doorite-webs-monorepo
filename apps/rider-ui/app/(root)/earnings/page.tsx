"use client";

import { useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Card, CardContent } from "@repo/ui/components/card";
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
import { toast } from "@repo/ui/components/sonner";

type TransactionType = "EARNING" | "PAYOUT" | "BONUS" | "ADJUSTMENT" | "ALL";

export default function EarningsPage() {
  const [summary] = useAtom(earningsSummaryAtom);
  const [metrics] = useAtom(metricsAtom);
  const [payoutInfo] = useAtom(payoutInfoAtom);
  const [transactions] = useAtom(transactionsAtom);
  const isLoading = useAtomValue(earningsLoadingAtom);
  const fetchAllData = useSetAtom(fetchAllEarningsDataAtom);

  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [transactionFilter, setTransactionFilter] =
    useState<TransactionType>("ALL");

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredTransactions =
    transactionFilter === "ALL"
      ? transactions.transactions
      : transactions.transactions.filter((t) => t.type === transactionFilter);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
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
        return <Star className="w-4 h-4 text-amber-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "EARNING":
        return "text-green-600";
      case "PAYOUT":
        return "text-blue-600";
      case "BONUS":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  const handleExport = () => {
    // Generate CSV from transactions
    const csvRows = [
      ["Date", "Type", "Description", "Amount", "Status"],
      ...transactions.transactions.map((t) => [
        new Date(t.createdAt).toISOString(),
        t.type,
        t.description,
        t.amount.toString(),
        t.status,
      ]),
    ];
    const csv = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `doorrite-earnings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Earnings exported successfully");
  };

  const summaryCards = [
    {
      label: "Today",
      value: summary.data.today,
      sub: `${summary.data.todayDeliveries} deliveries`,
      icon: Calendar,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "This Week",
      value: summary.data.thisWeek,
      sub: `${summary.data.thisWeekDeliveries} deliveries`,
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "This Month",
      value: summary.data.thisMonth,
      sub: `${summary.data.thisMonthDeliveries} deliveries`,
      icon: DollarSign,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "All Time",
      value: summary.data.totalEarned,
      sub: null,
      icon: Star,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const filterOptions: { label: string; value: TransactionType }[] = [
    { label: "All", value: "ALL" },
    { label: "Earnings", value: "EARNING" },
    { label: "Payouts", value: "PAYOUT" },
    { label: "Bonuses", value: "BONUS" },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track your income and payouts
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={transactions.transactions.length === 0}
        >
          <Download className="w-4 h-4 mr-1.5" />
          Export
        </Button>
      </div>

      {isLoading && !summary.data.totalEarned ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {summaryCards.map((card) => (
              <Card key={card.label} className="border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {card.label}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}
                    >
                      <card.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(card.value)}
                  </p>
                  {card.sub && (
                    <p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Metrics */}
          <Card className="border-gray-100">
            <CardContent className="p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Performance
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {metrics.data.totalDeliveries}
                  </p>
                  <p className="text-xs text-gray-500">Deliveries</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {metrics.data.avgDeliveryTimeMinutes}
                    <span className="text-sm font-normal text-gray-500">
                      min
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">Avg Time</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {metrics.data.rating.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payout Card */}
          <Card className="border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Available Balance</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(payoutInfo.data.walletBalance)}
                    </p>
                  </div>
                </div>
              </div>
              {payoutInfo.data.nextPayoutDate && (
                <p className="text-xs text-blue-200 mt-3">
                  Next payout:{" "}
                  {new Date(payoutInfo.data.nextPayoutDate).toLocaleDateString(
                    "en-NG",
                    { weekday: "long", month: "short", day: "numeric" },
                  )}
                </p>
              )}
            </div>
            <CardContent className="p-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setWithdrawalModalOpen(true)}
                disabled={
                  payoutInfo.data.walletBalance <
                  payoutInfo.data.minimumBalance
                }
              >
                <Wallet className="w-4 h-4 mr-2" />
                Request Withdrawal
              </Button>
              {payoutInfo.data.walletBalance <
                payoutInfo.data.minimumBalance && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Minimum balance of ₦
                  {payoutInfo.data.minimumBalance.toLocaleString()} required
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">
                Recent Transactions
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTransactionFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    transactionFilter === opt.value
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {filteredTransactions.length === 0 ? (
              <Card className="border-dashed border-gray-200">
                <CardContent className="py-12 text-center">
                  <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No transactions yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredTransactions.map((transaction) => (
                  <Card
                    key={transaction.id}
                    className="border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p
                            className={`font-semibold text-sm ${getTransactionColor(transaction.type)}`}
                          >
                            {transaction.type === "EARNING" ||
                            transaction.type === "BONUS"
                              ? "+"
                              : "-"}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${
                              transaction.status === "COMPLETED"
                                ? "bg-green-50 text-green-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <WithdrawalModal
        isOpen={withdrawalModalOpen}
        onClose={() => setWithdrawalModalOpen(false)}
      />
    </div>
  );
}
