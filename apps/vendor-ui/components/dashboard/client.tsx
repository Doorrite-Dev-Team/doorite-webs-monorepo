"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  ShoppingBag,
  DollarSign,
  Package,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CreateMenuItemForm from "../menu/CreateProduct";
import { useAtom } from "jotai";
import { vendorAtom } from "@/store/vendorAtom";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { toast } from "@repo/ui/components/sonner";
// import { getStatusColor } from "@/libs/helper";
import { formatCurrency, getStatusLabel, getStatusColor } from "@/libs/utils";
import api from "@/actions/api";

interface DashboardData {
  vendor: {
    id: string;
    businessName: string;
    email: string;
    phoneNumber: string;
    logoUrl?: string;
    rating?: number;
    openingTime?: string;
    closingTime?: string;
    address: {
      address: string;
      state?: string;
      country?: string;
    };
  };
  stats: {
    todayOrders: number;
    todayEarnings: number;
    availableItems: number;
  };
  activeOrders: Array<{
    id: string;
    orderId: string;
    customerName: string;
    customerAvatar?: string;
    status: string;
    totalAmount: number;
    itemCount: number;
    firstItemName: string;
    createdAt: string;
  }>;
}

interface DashboardClientProps {
  initialData: DashboardData;
}

// // Fetch function for dashboard data
// const fetchDashboardData = async (): Promise<DashboardData> => {
//   const response = await apiClient.get("/vendors/dashboard");
//   return response.data;
// };

const DashboardClient = ({ initialData }: DashboardClientProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [, setVendor] = useAtom(vendorAtom);
  const [showForm, setShowForm] = useState(false);

  // React Query for dashboard data
  const {
    data: dashboardData = initialData,
    // isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.fetchDashboardData,
    initialData: initialData,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
  });

  // Update vendor atom when data changes
  useEffect(() => {
    if (dashboardData?.vendor) {
      setVendor(dashboardData.vendor);
    }
  }, [dashboardData, setVendor]);

  // Manual refresh mutation
  const refreshMutation = useMutation({
    mutationFn: api.fetchDashboardData,
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard"], data);
      toast.success("Dashboard refreshed");
    },
    onError: (error) => {
      toast.error("Failed to refresh dashboard");
      console.error(error);
    },
  });

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Package className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load dashboard
            </h2>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {dashboardData.vendor.logoUrl && (
              <Image
                src={dashboardData.vendor.logoUrl}
                alt="Logo"
                width={64}
                height={64}
                className="rounded-full object-cover border-2 border-gray-200"
              />
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {dashboardData.vendor.businessName}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                {dashboardData.vendor.rating && (
                  <p className="text-sm text-gray-600">
                    ⭐ {dashboardData.vendor.rating.toFixed(1)}
                  </p>
                )}
                {dashboardData.vendor.openingTime &&
                  dashboardData.vendor.closingTime && (
                    <p className="text-sm text-gray-600">
                      🕐 {dashboardData.vendor.openingTime} -{" "}
                      {dashboardData.vendor.closingTime}
                    </p>
                  )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshMutation.isPending}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="flex items-center gap-2 p-3">
                <Bell className="w-4 h-4 text-green-700" />
                <span className="text-sm font-medium text-green-900">
                  Notifications On
                </span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Today's Orders */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Today&apos;s Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.todayOrders}
                  </p>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <ShoppingBag className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Earnings */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Today&apos;s Earnings
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.stats.todayEarnings)}
                  </p>
                </div>
                <div className="bg-blue-100 p-4 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Available */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Items Available
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.availableItems}
                  </p>
                </div>
                <div className="bg-purple-100 p-4 rounded-full">
                  <Package className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Active Orders
          </h2>

          {dashboardData.activeOrders &&
          dashboardData.activeOrders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.activeOrders.map((order) => (
                <Card
                  key={order.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      {order.customerAvatar ? (
                        <Image
                          src={order.customerAvatar}
                          alt={order.customerName}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {order.customerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          #{order.orderId}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        {order.itemCount} item{order.itemCount > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {order.firstItemName}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>

                    <Badge variant={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-10 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No active orders at the moment</p>
                <p className="text-sm text-gray-400 mt-2">
                  New orders will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <Button
            onClick={() => setShowForm(true)}
            size="lg"
            className="flex-1 bg-green-700 hover:bg-green-800"
          >
            Create New Menu Item
          </Button>

          <Button
            onClick={() => router.push("/orders")}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            View All Orders
          </Button>
        </div>
      </div>

      <CreateMenuItemForm
        open={showForm}
        onOpenChangeAction={() => setShowForm}
        onSuccessAction={() => {
          router.push("/products");
          // Invalidate dashboard query to refetch data
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }}
      />
    </div>
  );
};

export default DashboardClient;
