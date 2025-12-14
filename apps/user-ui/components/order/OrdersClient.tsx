"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Filter, RefreshCw } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import OrderCard from "@/components/order/OrderCard";
import OrdersPageSkeleton from "@/components/order/OrdersPageSkeleton";
import { api } from "@/libs/api";

interface OrdersClientProps {
  initialOrders: Order[];
  initialPagination: Pagination;
  initialStatus?: OrderStatus;
}

export default function OrdersClient({
  initialOrders,
  initialPagination,
  initialStatus,
}: OrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedStatus, setSelectedStatus] = React.useState<
    OrderStatus | "all"
  >(initialStatus || "all");
  const [currentPage, setCurrentPage] = React.useState(initialPagination.page);

  // Fetch orders with React Query
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders", currentPage, selectedStatus],
    queryFn: () =>
      api.fetchOrders(
        currentPage,
        selectedStatus === "all" ? undefined : selectedStatus,
      ),
    initialData: { orders: initialOrders, pagination: initialPagination },
    staleTime: 30000, // 30 seconds
  });

  const handleStatusChange = (status: string) => {
    const newStatus = status as OrderStatus | "all";
    setSelectedStatus(newStatus);
    setCurrentPage(1);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", newStatus);
    }
    params.set("page", "1");
    router.push(`/order?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/order?${params.toString()}`);
  };

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "PENDING", label: "Pending" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "PREPARING", label: "Preparing" },
    { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            My Orders
          </h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <Select
                  value={selectedStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <OrdersPageSkeleton />
        ) : data.orders.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedStatus === "all" ? "No orders yet" : "No orders found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedStatus === "all"
                  ? "Your order history will appear here"
                  : `No ${selectedStatus.toLowerCase()} orders found`}
              </p>
              <Button onClick={() => router.push("/home")}>
                Start Ordering
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {data.orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: data.pagination.pages },
                    (_, i) => i + 1,
                  )
                    .filter((page) => {
                      // Show first, last, current, and adjacent pages
                      return (
                        page === 1 ||
                        page === data.pagination.pages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, idx, arr) => {
                      // Add ellipsis
                      if (idx > 0 && page - arr[idx - 1]! > 1) {
                        return (
                          <React.Fragment key={`ellipsis-${page}`}>
                            <span className="px-2 text-gray-400">...</span>
                            <Button
                              variant={
                                page === currentPage ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              disabled={isLoading}
                            >
                              {page}
                            </Button>
                          </React.Fragment>
                        );
                      }

                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          disabled={isLoading}
                        >
                          {page}
                        </Button>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === data.pagination.pages || isLoading}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Results Count */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Showing {data.orders.length} of {data.pagination.total} orders
            </p>
          </>
        )}
      </div>
    </div>
  );
}
