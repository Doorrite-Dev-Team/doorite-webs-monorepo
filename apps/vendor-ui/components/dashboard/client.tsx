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
import { Switch } from "@repo/ui/components/switch";
import { toast } from "@repo/ui/components/sonner";
import {
  useVendorProfile,
  useUpdateStoreStatus,
} from "@/components/account/hooks";
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
  statsData?: VendorStats | null;
}

interface VendorStats {
  stats: {
    rating: number;
    totalOrders: number;
    totalProducts: number;
    activeProducts: number;
    memberSince: string;
  };
}

const DashboardClient = ({ initialData, statsData }: DashboardClientProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [, setVendor] = useAtom(vendorAtom);
  const [showForm, setShowForm] = useState(false);
  const { data: profile } = useVendorProfile();
  const updateStatusMutation = useUpdateStoreStatus();

  const {
    data: dashboardData = initialData,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.fetchDashboardData,
    initialData: initialData,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  useEffect(() => {
    if (dashboardData?.vendor) {
      setVendor(dashboardData.vendor);
    }
  }, [dashboardData, setVendor]);

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
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
              />
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {dashboardData.vendor.businessName}
              </h1>
              <div className="flex items-center flex-wrap gap-2 mt-1 text-sm text-gray-600">
                {dashboardData.vendor.rating && (
                  <span className="font-medium text-gray-800">
                    ⭐ {dashboardData.vendor.rating.toFixed(1)}
                  </span>
                )}
                {dashboardData.vendor.openingTime &&
                  dashboardData.vendor.closingTime && (
                    <span className="flex items-center gap-2">
                      <span className="text-gray-300">•</span>
                      <span>
                        🕐 {dashboardData.vendor.openingTime} –{" "}
                        {dashboardData.vendor.closingTime}
                      </span>
                    </span>
                  )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 h-9 rounded-md bg-white border border-gray-200 text-gray-700 text-sm font-medium">
              <span className="hidden sm:inline">Store Open</span>
              <Switch
                checked={profile?.isActive ?? true}
                onCheckedChange={(val) => updateStatusMutation.mutate(val)}
                disabled={updateStatusMutation.isPending}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshMutation.isPending}
              className="flex-1 sm:flex-none h-9"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <div className="inline-flex items-center gap-2 px-3 h-9 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">On</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

        {/* Extended Stats Section */}
        {statsData?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.stats.totalOrders}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.stats.totalProducts}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.stats.rating.toFixed(1)} ⭐
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(statsData.stats.memberSince).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

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
        <div className="w-full flex gap-4 max-sm:flex-col mb-20">
          <Button
            onClick={() => setShowForm(true)}
            className="flex-1 bg-green-700 hover:bg-green-800"
          >
            Create New Menu Item
          </Button>
          <Button
            onClick={() => router.push("/orders")}
            variant="outline"
            className="flex-1"
          >
            View All Orders
          </Button>
        </div>

        <CreateMenuItemForm
          open={showForm}
          onOpenChangeAction={setShowForm}
          onSuccessAction={() => {
            router.push("/products");
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          }}
        />
      </div>
    </div>
  );
};

export default DashboardClient;
