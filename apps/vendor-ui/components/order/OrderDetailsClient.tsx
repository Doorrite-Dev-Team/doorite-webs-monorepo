// components/order/OrderDetailsClient.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Package,
  Loader2,
  XCircle,
  User,
  Bike,
} from "lucide-react";
import apiClient from "@/libs/api/client";
import {
  formatCurrency,
  getStatusColor,
  getStatusLabel,
  formatDateTime,
  getStatusActions,
  getInitial,
} from "@/libs/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { useState } from "react";
import { deriveError } from "@/libs/utils/errorHandler";

const fetchOrderDetails = async (orderId: string): Promise<OrderDetails> => {
  const response = await apiClient.get(`/vendors/orders/${orderId}`);
  return response.data.order;
};

const updateOrderStatus = async ({
  orderId,
  status,
  note,
}: {
  orderId: string;
  status: string;
  note?: string;
}) => {
  const response = await apiClient.patch(`/vendors/orders/${orderId}/status`, {
    status,
    note,
  });
  return response.data;
};

export default function OrderDetailsClient() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const orderId = id as string;

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => fetchOrderDetails(orderId),
    enabled: !!orderId,
    staleTime: 30 * 1000,
  });

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order-details", orderId] });
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(`Order status updated to ${data.order.status}`);
      setShowCancelDialog(false);
    },
    onError: (error) => {
      const message = deriveError(error);
      toast.error(message || "Failed to update order status");
      console.log(message);
    },
  });

  const handleStatusUpdate = (status: string, note?: string) => {
    if (orderId) {
      statusMutation.mutate({ orderId, status, note });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Order not found
            </h2>
            <p className="text-gray-600 mb-4">
              The order you&pos;re looking for doesn&pos;t exist or you
              don&pos;t have access to it.
            </p>
            <Button onClick={() => router.push("/orders")} variant="outline">
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const actions = getStatusActions(order.status);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-sm text-gray-600">
              Order ID: #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <Badge variant={getStatusColor(order.status)} className="text-sm">
            {getStatusLabel(order.status)}
          </Badge>
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Date</span>
              <span className="font-medium">
                {formatDateTime(order.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-bold text-lg">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  {formatCurrency(order.deliveryFee)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {order.customer.profileImageUrl ? (
                <Image
                  src={order.customer.profileImageUrl}
                  width={60}
                  height={60}
                  alt={order.customer.fullName}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">
                    {getInitial(order.customer.fullName)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {order.customer.fullName}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Phone className="w-4 h-4" />
                  <span>{order.customer.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">
                    {order.deliveryAddress.address}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items ({order.items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  {item.product.imageUrl ? (
                    <Image
                      src={item.product.imageUrl}
                      width={70}
                      height={70}
                      alt={item.product.name}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    {item.variant && (
                      <p className="text-sm text-gray-600">
                        Variant: {item.variant.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rider Details */}
        {order.rider && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bike className="w-5 h-5" />
                Assigned Rider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {order.rider.profileImageUrl ? (
                  <Image
                    src={order.rider.profileImageUrl}
                    width={55}
                    height={55}
                    alt={order.rider.fullName}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">
                      {getInitial(order.rider.fullName)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {order.rider.fullName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Phone className="w-4 h-4" />
                    <span>{order.rider.phoneNumber}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {actions.length > 0 && (
          <div className="space-y-3 mb-8">
            {actions.map((action) => (
              <Button
                key={action.status}
                className="w-full"
                variant={action.variant}
                size="lg"
                onClick={() => {
                  if (action.status === "CANCELLED") {
                    setShowCancelDialog(true);
                  } else {
                    handleStatusUpdate(action.status);
                  }
                }}
                disabled={statusMutation.isPending}
              >
                {statusMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, Keep Order</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  handleStatusUpdate("CANCELLED", "Order cancelled by vendor")
                }
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Cancel Order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
