"use client";

// import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/libs/utils";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { useState } from "react";
import api from "@/actions/api";

// interface Order {
//   id: string;
//   status: string;
//   totalAmount: number;
//   createdAt: string;
//   customer: {
//     id: string;
//     fullName: string;
//     profileImageUrl?: string;
//   };
//   items: Array<{
//     id: string;
//     quantity: number;
//     price: number;
//     product: {
//       name: string;
//       imageUrl?: string;
//     };
//   }>;
// }

interface StatsData {
  active: number;
  completed: number;
  pending: number;
  cancelled: number;
}

// const fetchOrders = async (
//   page: number = 1,
//   limit: number = 10,
// ): Promise<OrdersResponse> => {
//   const response = await apiClient.get(
//     `/vendors/orders?page=${page}&limit=${limit}`,
//   );
//   return response.data;
// };

const calculateStats = (orders: Order[]): StatsData => {
  return {
    active: orders.filter((o) =>
      ["ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"].includes(o.status),
    ).length,
    completed: orders.filter((o) => o.status === "DELIVERED").length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };
};

export default function OrdersClient() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor-orders", currentPage],
    queryFn: () => api.fetchOrders(currentPage, 20),
    staleTime: 30 * 1000,
  });

  const stats = data
    ? calculateStats(data.orders)
    : { active: 0, completed: 0, pending: 0, cancelled: 0 };

  const filterOrders = (orders: Order[]) => {
    if (activeTab === "all") return orders;
    if (activeTab === "active")
      return orders.filter((o) =>
        ["ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"].includes(o.status),
      );
    if (activeTab === "pending")
      return orders.filter((o) => o.status === "PENDING");
    if (activeTab === "completed")
      return orders.filter((o) => o.status === "DELIVERED");
    return orders;
  };

  const filteredOrders = data ? filterOrders(data.orders) : [];

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load orders
            </h2>
            <p className="text-gray-600 mb-4">Please try again later</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track all your orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.active}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="w-5 h-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completed}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Package className="w-5 h-5 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.cancelled}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <XCircle className="w-5 h-5 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Orders List */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Customer Avatar */}
                          {order.customer.profileImageUrl ? (
                            <Image
                              src={order.customer.profileImageUrl}
                              alt={order.customer.fullName}
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {getInitial(order.customer.fullName)}
                              </span>
                            </div>
                          )}

                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900">
                                {order.customer.fullName}
                              </p>
                              <Badge variant={getStatusColor(order.status)}>
                                {getStatusLabel(order.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {order.items.length} item
                              {order.items.length > 1 ? "s" : ""} •{" "}
                              {new Date(order.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                            {order.items[0] && (
                              <p className="text-xs text-gray-500 truncate max-w-xs">
                                {order.items[0].product.name}
                                {order.items.length > 1 &&
                                  ` +${order.items.length - 1} more`}
                              </p>
                            )}
                          </div>

                          {/* Amount */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(order.totalAmount)}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === data.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
